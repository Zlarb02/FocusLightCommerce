import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { useLocation } from "wouter";
import { CustomerInfo } from "./CustomerInfo";
import { Shipping } from "./ShippingNew";
import { Payment } from "./Payment";
import { Confirmation } from "./Confirmation";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/utils";
import {
  Check,
  ShoppingBag,
  User,
  MapPin,
  CreditCard,
  Package,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function CheckoutNew() {
  const [step, setStep] = useState(1);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [orderNumber, setOrderNumber] = useState<string>("");
  const { items, getTotalPrice } = useCart();
  const [, navigate] = useLocation();

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && step !== 4) {
      navigate("/");
    }
  }, [items, step, navigate]);

  const handleNext = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleConfirmation = (newOrderId: number, newOrderNumber: string) => {
    setOrderId(newOrderId);
    setOrderNumber(newOrderNumber);
    setStep(4);
  };

  const steps = [
    { number: 1, title: "Informations", icon: User, completed: step > 1 },
    { number: 2, title: "Livraison", icon: MapPin, completed: step > 2 },
    { number: 3, title: "Paiement", icon: CreditCard, completed: step > 3 },
    { number: 4, title: "Confirmation", icon: Package, completed: step === 4 },
  ];

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <CustomerInfo onNext={handleNext} />;
      case 2:
        return <Shipping onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <Payment onNext={handleConfirmation} onBack={handleBack} />;
      case 4:
        return <Confirmation orderId={orderId!} orderNumber={orderNumber} />;
      default:
        return <CustomerInfo onNext={handleNext} />;
    }
  };

  return (
    <Layout showCart={false}>
      <div className="min-h-screen bg-gray-50">
        {/* Header épuré */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <h1
                className="text-2xl font-bold text-gray-900"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                Finaliser ma commande
              </h1>
              {step < 4 && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {items.length} article{items.length !== 1 ? "s" : ""}
                  </span>
                  <span className="font-medium">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Progress Steps - Design moderne */}
            <div className="mb-8 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                {steps.map((stepItem, index) => {
                  const Icon = stepItem.icon;
                  const isActive = step === stepItem.number;
                  const isCompleted = stepItem.completed;

                  return (
                    <div key={stepItem.number} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-200",
                            isCompleted
                              ? "bg-green-500 text-white"
                              : isActive
                              ? "bg-primary text-white"
                              : "bg-gray-200 text-gray-500"
                          )}
                        >
                          {isCompleted ? (
                            <Check className="w-5 h-5" />
                          ) : (
                            <Icon className="w-5 h-5" />
                          )}
                        </div>
                        <span
                          className={cn(
                            "text-sm font-medium transition-colors",
                            isActive || isCompleted
                              ? "text-gray-900"
                              : "text-gray-500"
                          )}
                        >
                          {stepItem.title}
                        </span>
                      </div>

                      {index < steps.length - 1 && (
                        <div
                          className={cn(
                            "flex-1 h-0.5 mx-4 transition-colors",
                            stepItem.completed ? "bg-green-500" : "bg-gray-200"
                          )}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Contenu principal */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Formulaire principal */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  {renderStepContent()}
                </div>
              </div>

              {/* Récapitulatif de commande */}
              {step < 4 && (
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
                    <h3 className="font-semibold text-lg mb-4">
                      Récapitulatif
                    </h3>

                    <div className="space-y-4">
                      {items.map((item, index) => (
                        <div key={index} className="flex gap-3">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <img
                              src={item.product.imageUrl}
                              alt={`${item.product.productName} ${item.product.variationValue}`}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">
                              {item.product.productName}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {item.product.variationType}:{" "}
                              {item.product.variationValue}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-gray-500">
                                Qté: {item.quantity}
                              </span>
                              <span className="text-sm font-medium">
                                {formatPrice(
                                  (item.product.price ||
                                    item.product.basePrice) * item.quantity
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-gray-200 mt-6 pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Sous-total</span>
                        <span>{formatPrice(getTotalPrice())}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Livraison</span>
                        <span className="text-green-600 font-medium">
                          Gratuite
                        </span>
                      </div>
                      <div className="flex justify-between font-bold text-lg pt-2 border-t">
                        <span>Total</span>
                        <span>{formatPrice(getTotalPrice())}</span>
                      </div>
                    </div>

                    {/* Badges de confiance */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="w-2 h-2 text-white" />
                        </div>
                        <span>Paiement sécurisé</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="w-2 h-2 text-white" />
                        </div>
                        <span>Livraison gratuite</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="w-2 h-2 text-white" />
                        </div>
                        <span>Retour 30 jours</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
