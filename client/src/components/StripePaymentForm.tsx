import { useState, useEffect } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
  AddressElement,
  Elements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Shield, CreditCard, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { useStripeContext } from "./StripeProvider";
import { useCheckout } from "@/hooks/useCheckout";
import { useCart } from "@/hooks/useCart";

interface StripePaymentFormProps {
  amount: number;
  onSuccess: (orderId: number, orderNumber: string) => void;
  onBack: () => void;
  customerData?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address?: string;
    postalCode?: string;
    city?: string;
    country?: string;
    relayPoint?: any;
  };
  orderItems?: Array<{
    productId: number;
    productName: string;
    variationType?: string | null;
    variationValue?: string | null;
    quantity: number;
    price: number;
  }>;
}

export function StripePaymentForm({
  amount,
  onSuccess,
  onBack,
  customerData,
  orderItems,
}: StripePaymentFormProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { stripePromise } = useStripeContext();

  const [clientSecret, setClientSecret] = useState<string>("");
  const [paymentIntentId, setPaymentIntentId] = useState<string>("");

  // Créer le Payment Intent au montage du composant
  useEffect(() => {
    // Éviter la création multiple si on a déjà un clientSecret
    if (clientSecret) return;

    let isActive = true; // Flag pour éviter les mises à jour sur un composant démonté

    const createPaymentIntent = async () => {
      try {
        // Pour les tests, utilisons un montant fixe si amount est 0
        const testAmount = amount > 0 ? amount : 10; // 10€ pour tester

        console.log("🔄 Création Payment Intent pour:", testAmount, "€");

        const data = await apiRequest(
          "POST",
          "/api/checkout/create-payment-intent",
          {
            amount: testAmount,
            currency: "eur",
            metadata: {
              source: "focus-light-commerce",
              test: "true",
            },
          }
        );

        if (isActive) {
          console.log("✅ Payment Intent créé:", data);
          setClientSecret(data.clientSecret);
          setPaymentIntentId(data.paymentIntentId);
        }
      } catch (error) {
        if (isActive) {
          console.error("❌ Erreur création Payment Intent:", error);
          toast({
            title: "Erreur",
            description: "Impossible d'initialiser le paiement",
            variant: "destructive",
          });
        }
      }
    };

    createPaymentIntent();

    // Cleanup pour éviter les mises à jour sur un composant démonté
    return () => {
      isActive = false;
    };
  }, [amount, toast]);

  // Attendre que stripePromise et clientSecret soient disponibles
  if (!stripePromise || !clientSecret) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">
            {t("checkout.payment.init")}
          </p>
        </div>
      </div>
    );
  }

  // Apparence Stripe accordée à la palette Alto (maquette RARE.design)
  const isDark = document.documentElement.classList.contains("dark");
  const options = {
    clientSecret,
    appearance: {
      theme: isDark ? ("night" as const) : ("stripe" as const),
      variables: {
        colorPrimary: "#F54501",
        colorBackground: isDark ? "#35120F" : "#FFFFFF",
        colorText: isDark ? "#FEF7E8" : "#161615",
        borderRadius: "4px",
        fontFamily:
          "'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <StripePaymentFormInner
        amount={amount}
        onSuccess={onSuccess}
        onBack={onBack}
        clientSecret={clientSecret}
        paymentIntentId={paymentIntentId}
        customerData={customerData}
        orderItems={orderItems}
      />
    </Elements>
  );
}

interface StripePaymentFormInnerProps {
  amount: number;
  onSuccess: (orderId: number, orderNumber: string) => void;
  onBack: () => void;
  clientSecret: string;
  paymentIntentId: string;
  customerData?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address?: string;
    postalCode?: string;
    city?: string;
    country?: string;
    relayPoint?: any;
  };
  orderItems?: Array<{
    productId: number;
    productName: string;
    variationType?: string | null;
    variationValue?: string | null;
    quantity: number;
    price: number;
  }>;
}

function StripePaymentFormInner({
  amount,
  onSuccess,
  onBack,
  clientSecret,
  paymentIntentId,
  customerData,
  orderItems,
}: StripePaymentFormInnerProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { t } = useLanguage();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Fonction pour finaliser la commande après paiement réussi
  const finalizeOrder = async (paymentIntentId: string) => {
    if (!customerData) {
      throw new Error("Informations client manquantes");
    }

    if (!orderItems || orderItems.length === 0) {
      throw new Error("Panier vide");
    }

    console.log("🔄 Finalisation de la commande...");
    console.log("Customer:", customerData);
    console.log("Order items:", orderItems);

    // Préparer les données de commande selon le schéma
    const checkoutData = {
      customer: {
        firstName: customerData.firstName,
        lastName: customerData.lastName,
        email: customerData.email,
        phone: customerData.phone,
        address: customerData.address || "",
        postalCode: customerData.postalCode || "",
        city: customerData.city || "",
        country: customerData.country || "FR",
        // Ajouter relayPoint s'il existe
        ...(customerData.relayPoint && {
          relayPoint: customerData.relayPoint,
        }),
      },
      items: orderItems,
      totalAmount: orderItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
      paymentIntentId,
    };

    console.log("💰 Données de commande:", checkoutData);

    // Envoyer la commande au serveur
    const response = await apiRequest("POST", "/api/checkout", checkoutData);

    console.log("✅ Commande finalisée:", response);

    return response;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Protection contre la double soumission
    if (isSubmitted || isLoading) {
      console.log("🚫 Soumission déjà en cours, ignorée");
      return;
    }

    if (!stripe || !elements || !clientSecret) {
      toast({
        title: t("checkout.error.payment"),
        description: t("checkout.payment.notReady"),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setIsSubmitted(true);

    try {
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
        redirect: "if_required",
      });

      if (result.error) {
        // Gestion des erreurs de paiement
        console.error("Erreur Stripe:", result.error);

        let errorMessage = "Une erreur est survenue lors du paiement";

        switch (result.error.type) {
          case "card_error":
            errorMessage = result.error.message || "Erreur de carte bancaire";
            break;
          case "validation_error":
            errorMessage = "Veuillez vérifier vos informations";
            break;
          case "api_connection_error":
            errorMessage = "Problème de connexion, veuillez réessayer";
            break;
          default:
            errorMessage = result.error.message || errorMessage;
        }

        toast({
          title: "Paiement échoué",
          description: errorMessage,
          variant: "destructive",
        });
      } else if (result.paymentIntent) {
        // Paiement réussi
        if (result.paymentIntent.status === "succeeded") {
          console.log("🎉 Paiement réussi:", result.paymentIntent.id);

          try {
            // Finaliser la commande après paiement réussi
            const orderResponse = await finalizeOrder(result.paymentIntent.id);

            toast({
              title: "Paiement réussi",
              description: "Votre commande a été confirmée",
            });

            // Passer les vrais ID et numéro de commande
            onSuccess(orderResponse.orderId, orderResponse.orderNumber);
          } catch (orderError) {
            console.error("❌ Erreur finalisation commande:", orderError);
            toast({
              title: "Paiement réussi mais erreur",
              description:
                "Votre paiement est validé. Nous traitons votre commande.",
              variant: "default",
            });
            // En cas d'erreur, rediriger vers la page d'accueil avec un message
            onSuccess(0, "ERROR_" + result.paymentIntent.id);
          }
        }
      }
    } catch (error) {
      console.error("Erreur lors du paiement:", error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue est survenue",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      // Ne pas remettre isSubmitted à false pour éviter les doubles soumissions
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2
          className="mb-2 text-xl font-bold text-alto-brown dark:text-alto-cream md:text-2xl"
          style={{ fontFamily: "var(--font-titles)" }}
        >
          {t("checkout.payment")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t("checkout.payment.totalToPay")}{" "}
          <span className="text-lg font-bold text-primary">
            {formatPrice(amount)}
          </span>
        </p>
      </div>

      <div className="flex items-center gap-3 border-l-4 border-alto-blue bg-alto-blue/5 p-4 dark:border-alto-cream/60 dark:bg-alto-cream/5">
        <Shield className="h-4 w-4 shrink-0 text-alto-blue dark:text-alto-cream" />
        <p className="text-sm">{t("checkout.payment.securityNote")}</p>
      </div>

      {clientSecret ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Formulaire de paiement Stripe */}
          <div className="space-y-4">
            <div className="mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <h3
                className="font-bold"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                {t("checkout.payment.infoTitle")}
              </h3>
            </div>

            <PaymentElement
              options={{
                layout: "tabs",
              }}
            />
          </div>

          {/* Adresse de facturation */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <h3
                className="font-bold"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                {t("checkout.payment.billing")}
              </h3>
            </div>
            <AddressElement
              options={{
                mode: "billing",
                allowedCountries: ["FR", "BE", "LU", "CH"],
              }}
            />
          </div>

          {/* Boutons */}
          <div className="flex flex-col gap-3 pt-4 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              className="h-12 w-full rounded-none text-base sm:w-1/3"
              onClick={onBack}
              disabled={isLoading}
            >
              ← {t("checkout.payment.back")}
            </Button>

            <Button
              type="submit"
              className="h-12 w-full rounded-none bg-alto-orange text-base font-bold text-alto-cream hover:bg-alto-orange-soft sm:w-2/3"
              style={{ fontFamily: "var(--font-titles)" }}
              disabled={!stripe || !elements || isLoading || isSubmitted}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t("checkout.payment.processing")}
                </div>
              ) : (
                `${t("checkout.payment.pay")} ${formatPrice(amount)}`
              )}
            </Button>
          </div>
        </form>
      ) : (
        <div className="py-8 text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-muted-foreground">{t("checkout.payment.init")}</p>
        </div>
      )}
    </div>
  );
}
