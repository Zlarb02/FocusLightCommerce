import React, { useState, useEffect, useCallback } from "react";
import { Layout } from "@/components/Layout";
import { useLocation } from "wouter";
import { useCart } from "@/hooks/useCart";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { StripePaymentForm } from "@/components/StripePaymentForm";
import { MondialRelayWidget } from "@/components/MondialRelayWidget";
import { ValidatedInput } from "@/components/ValidatedInput";
import { EditableOrderSummary } from "@/components/EditableOrderSummary";
import {
  Check,
  ShoppingBag,
  User,
  MapPin,
  CreditCard,
  Package,
  ArrowLeft,
  Truck,
  Shield,
  Clock,
  Phone,
  Mail,
  Star,
  AlertCircle,
  CheckCircle2,
  Zap,
  Heart,
  Lock,
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

export default function CheckoutNew() {
  const { items, getTotalPrice, clearCart } = useCart();
  const [, navigate] = useLocation();
  const { t } = useLanguage();

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
      alert("❌ Erreur lors de la finalisation de la commande");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentError = (error: string) => {
    alert(`❌ Erreur de paiement: ${error}`);
    setIsProcessing(false);
  };

  if (showPayment) {
    return (
      <Layout showCart={false}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <Button
                onClick={() => setShowPayment(false)}
                variant="outline"
                className="mb-6"
                disabled={isProcessing}
              >
                {t("checkout.backToInfo")}
              </Button>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    {t("checkout.securedPayment")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Récap commande */}
                    <div>
                      <h3 className="font-semibold mb-3">
                        {t("checkout.summary")}
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <strong>
                            {formData.firstName} {formData.lastName}
                          </strong>
                        </div>
                        <div>{formData.email}</div>
                        <div>{formData.phone}</div>
                        {formData.selectedRelayPoint && (
                          <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <div className="font-medium">
                              {formData.selectedRelayPoint.name}
                            </div>
                            <div className="text-xs text-gray-600">
                              {formData.selectedRelayPoint.address},{" "}
                              {formData.selectedRelayPoint.city}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Articles */}
                    <div>
                      <h3 className="font-semibold mb-3">
                        {t("checkout.articles")} ({items.length})
                      </h3>
                      <div className="space-y-2">
                        {items.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between text-sm"
                          >
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
                        <div className="border-t pt-2 flex justify-between font-bold">
                          <span>{t("checkout.total")}</span>
                          <span>{formatPrice(getTotalPrice())}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

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
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Interface principale fluide
  return (
    <Layout showCart={false}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Header moderne responsive */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
          <div className="container mx-auto px-4 py-3 sm:py-4">
            {/* Layout mobile : stack vertical */}
            <div className="flex flex-col gap-3 sm:hidden">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => navigate("/shop")}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">
                    {t("checkout.backToShop")}
                  </span>
                  <span className="xs:hidden">
                    {t("checkout.backToShop.short")}
                  </span>
                </button>
                <div className="flex items-center gap-1.5 text-xs">
                  <ShoppingBag className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {items.length}
                  </span>
                  <span className="font-bold text-sm text-blue-600">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>
              </div>
              <div className="text-center">
                <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {t("checkout.title")}
                </h1>
              </div>
            </div>

            {/* Layout tablette et desktop : horizontal */}
            <div className="hidden sm:flex items-center justify-between">
              <div className="flex items-baseline gap-6 lg:gap-10">
                <button
                  onClick={() => navigate("/shop")}
                  className="flex items-center gap-2 px-3 py-2 md:px-4 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden md:inline">
                    {t("checkout.backToShop")}
                  </span>
                  <span className="md:hidden">
                    {t("checkout.backToShop.short")}
                  </span>
                </button>
                <h1 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {t("checkout.title")}
                </h1>
              </div>
              <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
                <div className="flex items-center gap-1.5 md:gap-2 text-sm">
                  <ShoppingBag className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400 hidden md:inline">
                    {items.length}{" "}
                    {items.length !== 1
                      ? t("checkout.cart.items_plural")
                      : t("checkout.cart.items")}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 md:hidden">
                    {items.length}
                  </span>
                  <span className="font-bold text-base md:text-lg text-blue-600 whitespace-nowrap">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Récapitulatif de commande éditable en haut */}
            <EditableOrderSummary className="mb-8" />

            {/* Progress indicator simplifié */}
            <div className="mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <CheckCircle2
                  className={cn(
                    "w-4 h-4",
                    isContactValid ? "text-green-500" : "text-gray-300"
                  )}
                />
                <span
                  className={isContactValid ? "text-green-600 font-medium" : ""}
                >
                  {t("checkout.steps.customer")}
                </span>
                <span>•</span>
                <CheckCircle2
                  className={cn(
                    "w-4 h-4",
                    isShippingValid ? "text-green-500" : "text-gray-300"
                  )}
                />
                <span
                  className={
                    isShippingValid ? "text-green-600 font-medium" : ""
                  }
                >
                  {t("checkout.steps.delivery")}
                </span>
                <span>•</span>
                <CreditCard className="w-4 h-4 text-gray-300" />
                <span>{t("checkout.steps.payment")}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Formulaire principal - plus large */}
              <div className="lg:col-span-2 space-y-6">
                {/* Section Contact */}
                <Card className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      {t("checkout.customer.title")}
                      {isContactValid && (
                        <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto" />
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {/* Message de bienvenue rassurant */}
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
                        <div className="flex items-start gap-3">
                          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-full">
                            <Heart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                              {t("checkout.customer.welcome.title")}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {t("checkout.customer.welcome.description")}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 rounded-lg px-2 py-1">
                              <Lock className="w-3 h-3" />
                              <span className="font-medium">
                                {t("checkout.customer.promise")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          placeholder={t(
                            "checkout.customer.firstName.placeholder"
                          )}
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
                          placeholder={t(
                            "checkout.customer.lastName.placeholder"
                          )}
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
                        className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full">
                            <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <span className="text-sm font-medium text-green-800 dark:text-green-200">
                              {t("checkout.customer.validation.success")}
                            </span>
                            <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">
                              {t("checkout.customer.validation.canSelectRelay")}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>

                {/* Section Livraison */}
                <Card className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      {t("checkout.delivery.title")}
                      {isShippingValid && (
                        <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto" />
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {!isContactValid ? (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          {t("checkout.delivery.fillContactFirst")}
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <div className="space-y-6">
                        {/* Message d'introduction */}
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                          <div className="flex items-center gap-3">
                            <Truck className="w-6 h-6 text-green-600 dark:text-green-400" />
                            <div>
                              <h3 className="font-semibold text-green-900 dark:text-green-100">
                                {t("checkout.delivery.free.title")}
                              </h3>
                              <p className="text-sm text-green-700 dark:text-green-300">
                                {t("checkout.delivery.free.description")}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Affichage conditionnel : sélection ou confirmation */}
                        {formData.selectedRelayPoint ? (
                          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                              <div className="flex-1">
                                <h4 className="font-medium text-green-800 dark:text-green-200">
                                  {formData.selectedRelayPoint.name}
                                </h4>
                                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                                  {formData.selectedRelayPoint.address}
                                </p>
                                <p className="text-sm text-green-700 dark:text-green-300">
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
                                className="text-blue-600 border-blue-200 hover:bg-blue-50"
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
                  </CardContent>
                </Card>

                {/* Résumé léger avant paiement */}
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {/* Total avec livraison gratuite */}
                      <div className="flex items-center justify-between text-lg">
                        <span className="text-gray-600 dark:text-gray-400">
                          {t("checkout.payment.total")}
                        </span>
                        <span className="font-bold text-2xl text-gray-900 dark:text-gray-100">
                          {formatPrice(getTotalPrice())}
                        </span>
                      </div>

                      {/* Livraison gratuite avec design cool */}
                      <div className="flex items-center justify-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full">
                            <Truck className="w-4 h-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-green-800 dark:text-green-200">
                              {t("checkout.payment.freeShipping")}
                            </div>
                            <div className="text-xs text-green-600 dark:text-green-400">
                              {t("checkout.payment.freeShippingDetails")}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Bouton de paiement */}
                <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Button
                        onClick={() => setShowPayment(true)}
                        disabled={!canProceedToPayment || isProcessing}
                        size="lg"
                        className="bg-white text-blue-600 hover:bg-gray-100 font-bold px-8 py-3 text-lg w-full"
                      >
                        <CreditCard className="w-5 h-5 mr-2" />
                        {canProceedToPayment
                          ? `${t("checkout.payment.pay")} ${formatPrice(
                              getTotalPrice()
                            )}`
                          : t("checkout.payment.completeInfo")}
                        <Zap className="w-5 h-5 ml-2" />
                      </Button>
                      <p className="text-white/90 text-sm mt-3">
                        {t("checkout.payment.secure")}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
