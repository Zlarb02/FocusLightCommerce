import { useState, useEffect } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
  AddressElement,
  Elements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, CreditCard } from "lucide-react";
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
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Initialisation du paiement...
          </p>
        </div>
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: "stripe" as const,
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
        title: "Erreur",
        description: "Le système de paiement n'est pas prêt",
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
        <h2 className="font-heading font-bold text-xl md:text-2xl mb-2 text-gray-900 dark:text-gray-100">
          {t("checkout.payment")}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Total à payer :{" "}
          <span className="font-bold text-lg">{formatPrice(amount)}</span>
        </p>
      </div>

      <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
        <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
        <AlertDescription className="text-sm text-green-800 dark:text-green-200">
          🔒 Paiement sécurisé par Stripe - Vos données sont protégées
        </AlertDescription>
      </Alert>

      {clientSecret ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Formulaire de paiement Stripe */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                Informations de paiement
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
            <h3 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
              📍 Adresse de facturation
            </h3>
            <AddressElement
              options={{
                mode: "billing",
                allowedCountries: ["FR", "BE", "LU", "CH"],
              }}
            />
          </div>

          {/* Boutons */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-1/3 h-12 text-base"
              onClick={onBack}
              disabled={isLoading}
            >
              ← Retour
            </Button>

            <Button
              type="submit"
              className="w-full sm:w-2/3 h-12 text-base font-semibold"
              disabled={!stripe || !elements || isLoading || isSubmitted}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Traitement en cours...
                </div>
              ) : (
                `💳 Payer ${formatPrice(amount)}`
              )}
            </Button>
          </div>
        </form>
      ) : (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Initialisation du paiement sécurisé...
          </p>
        </div>
      )}
    </div>
  );
}
