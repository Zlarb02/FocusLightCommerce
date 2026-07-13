import { useState, useEffect, useCallback, type ReactNode } from "react";
import { Layout } from "@/components/Layout";
import { useLocation } from "wouter";
import { useCart } from "@/hooks/useCart";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { StripePaymentForm } from "@/components/StripePaymentForm";
import { MondialRelayWidget } from "@/components/MondialRelayWidget";
import { ValidatedInput } from "@/components/ValidatedInput";
import { EditableOrderSummary } from "@/components/EditableOrderSummary";
import {
  ShoppingBag,
  User,
  MapPin,
  CreditCard,
  ArrowLeft,
  Truck,
  Heart,
  Lock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface RelayPoint {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  distance?: number;
  openingHours?: string;
  latitude?: number;
  longitude?: number;
}

const titleFont = { fontFamily: "var(--font-titles)" } as const;

/** Encadré de section du tunnel — cadre fin, fond carte, style maquette. */
function CheckoutSection({
  icon,
  title,
  done,
  children,
}: {
  icon: ReactNode;
  title: string;
  done?: boolean;
  children: ReactNode;
}) {
  return (
    <section className="border-2 border-alto-brown/15 bg-card dark:border-alto-cream/15">
      <header className="flex items-center gap-3 border-b-2 border-alto-brown/15 px-5 py-4 dark:border-alto-cream/15">
        <span className="text-primary">{icon}</span>
        <h2 className="text-lg font-bold md:text-xl" style={titleFont}>
          {title}
        </h2>
        {done && <CheckCircle2 className="ml-auto h-5 w-5 text-primary" />}
      </header>
      <div className="p-5 md:p-6">{children}</div>
    </section>
  );
}

export default function CheckoutNew() {
  const { items, getTotalPrice, clearCart } = useCart();
  const [, navigate] = useLocation();
  const { t } = useLanguage();
  const { toast } = useToast();

  // États de l'interface fluide
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  // Données du formulaire
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    selectedRelayPoint: null as RelayPoint | null,
  });

  // États de validation
  const [validationState, setValidationState] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
  });

  // Callbacks de validation stabilisés
  const handleFirstNameValidation = useCallback((isValid: boolean) => {
    setValidationState((prev) => ({ ...prev, firstName: isValid }));
  }, []);

  const handleLastNameValidation = useCallback((isValid: boolean) => {
    setValidationState((prev) => ({ ...prev, lastName: isValid }));
  }, []);

  const handleEmailValidation = useCallback((isValid: boolean) => {
    setValidationState((prev) => ({ ...prev, email: isValid }));
  }, []);

  const handlePhoneValidation = useCallback((isValid: boolean) => {
    setValidationState((prev) => ({ ...prev, phone: isValid }));
  }, []);

  // Validation des sections
  const isContactValid =
    validationState.firstName &&
    validationState.lastName &&
    validationState.email &&
    validationState.phone;
  const isShippingValid = formData.selectedRelayPoint;
  const canProceedToPayment = isContactValid && isShippingValid;

  // Redirect si panier vide
  useEffect(() => {
    if (items.length === 0) {
      navigate("/");
    }
  }, [items, navigate]);

  const handlePaymentSuccess = async (orderId: number, orderNumber: string) => {
    try {
      setIsProcessing(true);

      // La commande a déjà été créée par StripePaymentForm
      clearCart();

      // Rediriger directement vers la page de confirmation avec le numéro de commande
      navigate(`/checkout/confirmation/${orderNumber}`);
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: t("checkout.error.payment"),
        description: t("checkout.error.finalize"),
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: t("checkout.error.payment"),
      description: error,
      variant: "destructive",
    });
    setIsProcessing(false);
  };

  // Indicateur d'étapes façon maquette : cases numérotées
  const steps = [
    { label: t("checkout.steps.customer"), done: Boolean(isContactValid) },
    { label: t("checkout.steps.delivery"), done: Boolean(isShippingValid) },
    { label: t("checkout.steps.payment"), done: false },
  ];

  if (showPayment) {
    return (
      <Layout showCart={false} headerTone="brown-desktop" footerTone="none">
        <div className="min-h-screen bg-background">
          <div className="mx-auto max-w-3xl px-4 py-8 md:px-8 md:py-12">
            <button
              onClick={() => setShowPayment(false)}
              disabled={isProcessing}
              className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary disabled:opacity-50"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("checkout.backToInfo")}
            </button>

            <div className="space-y-6">
              <CheckoutSection
                icon={<CreditCard className="h-5 w-5" />}
                title={t("checkout.securedPayment")}
              >
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Récap commande */}
                  <div>
                    <h3 className="mb-3 font-bold" style={titleFont}>
                      {t("checkout.summary")}
                    </h3>
                    <div className="space-y-1 text-sm">
                      <div className="font-semibold">
                        {formData.firstName} {formData.lastName}
                      </div>
                      <div className="text-muted-foreground">{formData.email}</div>
                      <div className="text-muted-foreground">{formData.phone}</div>
                      {formData.selectedRelayPoint && (
                        <div className="mt-3 border-l-4 border-alto-blue bg-alto-blue/5 p-3 dark:border-alto-cream/60 dark:bg-alto-cream/5">
                          <div className="font-medium">
                            {formData.selectedRelayPoint.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formData.selectedRelayPoint.address},{" "}
                            {formData.selectedRelayPoint.city}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Articles */}
                  <div>
                    <h3 className="mb-3 font-bold" style={titleFont}>
                      {t("checkout.articles")} ({items.length})
                    </h3>
                    <div className="space-y-2">
                      {items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>
                            {item.product.productName} x{item.quantity}
                          </span>
                          <span className="font-medium">
                            {formatPrice(
                              (item.product.price || item.product.basePrice) *
                                item.quantity
                            )}
                          </span>
                        </div>
                      ))}
                      <div className="flex justify-between border-t-2 border-alto-brown/15 pt-2 font-bold dark:border-alto-cream/15">
                        <span>{t("checkout.total")}</span>
                        <span className="text-primary">
                          {formatPrice(getTotalPrice())}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CheckoutSection>

              <section className="border-2 border-alto-brown/15 bg-card p-5 dark:border-alto-cream/15 md:p-6">
                <StripePaymentForm
                  amount={getTotalPrice()}
                  onSuccess={handlePaymentSuccess}
                  onBack={() => setShowPayment(false)}
                  customerData={{
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    country: "FR",
                    ...(formData.selectedRelayPoint && {
                      relayPoint: formData.selectedRelayPoint,
                    }),
                  }}
                  orderItems={items.map((item) => ({
                    productId: item.product.id,
                    productName: item.product.productName,
                    variationType: item.product.variationType,
                    variationValue: item.product.variationValue,
                    quantity: item.quantity,
                    price: item.product.price || item.product.basePrice,
                  }))}
                />
              </section>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Interface principale fluide
  return (
    <Layout showCart={false} headerTone="brown-desktop" footerTone="none">
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-5xl px-4 py-8 md:px-8 md:py-12">
          {/* Titre + total */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <button
                onClick={() => navigate("/shop")}
                className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4" />
                {t("checkout.backToShop")}
              </button>
              <h1
                className="text-3xl font-bold text-alto-brown dark:text-alto-cream md:text-4xl"
                style={titleFont}
              >
                {t("checkout.title")}
              </h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShoppingBag className="h-4 w-4" />
              <span>
                {items.length}{" "}
                {items.length !== 1
                  ? t("checkout.cart.items_plural")
                  : t("checkout.cart.items")}
              </span>
              <span className="text-2xl font-bold text-primary" style={titleFont}>
                {formatPrice(getTotalPrice())}
              </span>
            </div>
          </div>

          {/* Récapitulatif de commande éditable */}
          <EditableOrderSummary className="mb-8" />

          {/* Étapes */}
          <div className="mb-8 grid grid-cols-3 border-2 border-alto-brown/15 dark:border-alto-cream/15">
            {steps.map((step, i) => (
              <div
                key={step.label}
                className={cn(
                  "flex items-center gap-2 px-3 py-3 md:gap-3 md:px-5",
                  i > 0 && "border-l-2 border-alto-brown/15 dark:border-alto-cream/15"
                )}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center text-xs font-bold md:h-7 md:w-7",
                    step.done
                      ? "bg-primary text-primary-foreground"
                      : "border-2 border-alto-brown/25 text-muted-foreground dark:border-alto-cream/25"
                  )}
                  style={titleFont}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "truncate text-xs font-medium md:text-sm",
                    step.done ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            {/* Section Contact */}
            <CheckoutSection
              icon={<User className="h-5 w-5" />}
              title={t("checkout.customer.title")}
              done={Boolean(isContactValid)}
            >
              <div className="space-y-4">
                {/* Message de bienvenue rassurant */}
                <div className="mb-6 border-l-4 border-primary bg-primary/5 p-4">
                  <div className="flex items-start gap-3">
                    <Heart className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <div>
                      <h4 className="mb-1 font-bold" style={titleFont}>
                        {t("checkout.customer.welcome.title")}
                      </h4>
                      <p className="mb-3 text-sm text-muted-foreground">
                        {t("checkout.customer.welcome.description")}
                      </p>
                      <div className="inline-flex items-center gap-2 bg-alto-brown px-3 py-1.5 text-xs font-medium text-alto-cream dark:bg-alto-brown-deep">
                        <Lock className="h-3 w-3" />
                        <span>{t("checkout.customer.promise")}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <ValidatedInput
                    id="firstName"
                    name="firstName"
                    label={t("checkout.customer.firstName.label")}
                    value={formData.firstName}
                    onChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        firstName: value,
                      }))
                    }
                    onValidationChange={handleFirstNameValidation}
                    type="text"
                    placeholder={t("checkout.customer.firstName.placeholder")}
                    required
                    helperText={t("checkout.customer.firstName.helper")}
                    autoComplete="given-name"
                  />

                  <ValidatedInput
                    id="lastName"
                    name="lastName"
                    label={t("checkout.customer.lastName.label")}
                    value={formData.lastName}
                    onChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        lastName: value,
                      }))
                    }
                    onValidationChange={handleLastNameValidation}
                    type="text"
                    placeholder={t("checkout.customer.lastName.placeholder")}
                    required
                    helperText={t("checkout.customer.lastName.helper")}
                    autoComplete="family-name"
                  />

                  <ValidatedInput
                    id="email"
                    name="email"
                    label={t("checkout.customer.email.label")}
                    value={formData.email}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, email: value }))
                    }
                    onValidationChange={handleEmailValidation}
                    type="email"
                    placeholder={t("checkout.customer.email.placeholder")}
                    required
                    helperText={t("checkout.customer.email.helper")}
                    privacyNote={t("checkout.customer.email.privacy")}
                    autoComplete="email"
                  />

                  <ValidatedInput
                    id="phone"
                    name="phone"
                    label={t("checkout.customer.phone.label")}
                    value={formData.phone}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, phone: value }))
                    }
                    onValidationChange={handlePhoneValidation}
                    type="tel"
                    placeholder={t("checkout.customer.phone.placeholder")}
                    required
                    helperText={t("checkout.customer.phone.helper")}
                    privacyNote={t("checkout.customer.phone.privacy")}
                    autoComplete="tel"
                  />
                </div>
              </div>

              {isContactValid && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-6 border-l-4 border-alto-blue bg-alto-blue/5 p-4 dark:border-alto-cream/60 dark:bg-alto-cream/5"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-alto-blue dark:text-alto-cream" />
                    <div>
                      <span className="text-sm font-semibold">
                        {t("checkout.customer.validation.success")}
                      </span>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {t("checkout.customer.validation.canSelectRelay")}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </CheckoutSection>

            {/* Section Livraison */}
            <CheckoutSection
              icon={<MapPin className="h-5 w-5" />}
              title={t("checkout.delivery.title")}
              done={Boolean(isShippingValid)}
            >
              {!isContactValid ? (
                <div className="flex items-center gap-3 border-l-4 border-alto-brown/40 bg-muted/50 p-4 text-sm text-muted-foreground">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{t("checkout.delivery.fillContactFirst")}</span>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Livraison offerte */}
                  <div className="flex items-center gap-3 border-l-4 border-alto-blue bg-alto-blue/5 p-4 dark:border-alto-cream/60 dark:bg-alto-cream/5">
                    <Truck className="h-6 w-6 shrink-0 text-alto-blue dark:text-alto-cream" />
                    <div>
                      <h3 className="font-bold" style={titleFont}>
                        {t("checkout.delivery.free.title")}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {t("checkout.delivery.free.description")}
                      </p>
                    </div>
                  </div>

                  {/* Affichage conditionnel : sélection ou confirmation */}
                  {formData.selectedRelayPoint ? (
                    <div className="border-l-4 border-primary bg-primary/5 p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                        <div className="flex-1">
                          <h4 className="font-bold" style={titleFont}>
                            {formData.selectedRelayPoint.name}
                          </h4>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {formData.selectedRelayPoint.address}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formData.selectedRelayPoint.postalCode}{" "}
                            {formData.selectedRelayPoint.city}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              selectedRelayPoint: null,
                            }))
                          }
                        >
                          {t("checkout.delivery.change")}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <MondialRelayWidget
                      postalCode="75001"
                      weight={1000}
                      onParcelShopSelected={(shop) => {
                        if (shop) {
                          setFormData((prev) => ({
                            ...prev,
                            selectedRelayPoint: {
                              id: shop.id,
                              name: shop.name,
                              address: shop.address,
                              city: shop.city,
                              postalCode: shop.postalCode,
                              distance: shop.distance,
                              openingHours: shop.openingHours,
                              latitude: shop.latitude,
                              longitude: shop.longitude,
                            },
                          }));
                        } else {
                          setFormData((prev) => ({
                            ...prev,
                            selectedRelayPoint: null,
                          }));
                        }
                      }}
                    />
                  )}
                </div>
              )}
            </CheckoutSection>

            {/* Total + paiement — bloc brun maquette */}
            <section className="bg-alto-brown p-6 text-alto-cream dark:bg-alto-brown-deep md:p-8">
              <div className="flex items-baseline justify-between">
                <span className="text-alto-cream/80">
                  {t("checkout.payment.total")}
                </span>
                <span className="text-3xl font-bold text-alto-orange-soft" style={titleFont}>
                  {formatPrice(getTotalPrice())}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-3 border-t border-alto-cream/15 pt-4 text-sm">
                <Truck className="h-5 w-5 shrink-0 text-alto-orange-soft" />
                <div>
                  <span className="font-semibold">
                    {t("checkout.payment.freeShipping")}
                  </span>
                  <span className="ml-2 text-alto-cream/70">
                    {t("checkout.payment.freeShippingDetails")}
                  </span>
                </div>
              </div>

              <Button
                onClick={() => setShowPayment(true)}
                disabled={!canProceedToPayment || isProcessing}
                className="mt-6 h-14 w-full rounded-none bg-alto-orange text-lg font-bold text-alto-cream hover:bg-alto-orange-soft"
                style={titleFont}
              >
                <CreditCard className="mr-2 h-5 w-5" />
                {canProceedToPayment
                  ? `${t("checkout.payment.pay")} ${formatPrice(getTotalPrice())}`
                  : t("checkout.payment.completeInfo")}
              </Button>
              <p className="mt-3 text-center text-sm text-alto-cream/70">
                {t("checkout.payment.secure")}
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}
