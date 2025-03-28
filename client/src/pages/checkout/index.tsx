import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { useLocation } from "wouter";
import { CustomerInfo } from "./CustomerInfo";
import { Shipping } from "./Shipping";
import { Payment } from "./Payment";
import { Confirmation } from "./Confirmation";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/utils";

export default function Checkout() {
  const [step, setStep] = useState(1);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [orderNumber, setOrderNumber] = useState<string>("");
  const { items } = useCart();
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
      <div className="container mx-auto px-4 py-8">
        {/* Checkout steps navigation */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex justify-between">
            <div className="flex flex-col items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center mb-2 font-medium",
                step >= 1 ? "bg-primary text-primary-foreground" : "bg-gray-200 text-muted-foreground"
              )}>
                1
              </div>
              <span className="text-sm">Informations</span>
            </div>
            <div className="flex-grow border-t border-gray-300 relative top-4 mx-2"></div>
            <div className="flex flex-col items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center mb-2 font-medium",
                step >= 2 ? "bg-primary text-primary-foreground" : "bg-gray-200 text-muted-foreground"
              )}>
                2
              </div>
              <span className="text-sm">Livraison</span>
            </div>
            <div className="flex-grow border-t border-gray-300 relative top-4 mx-2"></div>
            <div className="flex flex-col items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center mb-2 font-medium",
                step >= 3 ? "bg-primary text-primary-foreground" : "bg-gray-200 text-muted-foreground"
              )}>
                3
              </div>
              <span className="text-sm">Paiement</span>
            </div>
            <div className="flex-grow border-t border-gray-300 relative top-4 mx-2"></div>
            <div className="flex flex-col items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center mb-2 font-medium",
                step >= 4 ? "bg-primary text-primary-foreground" : "bg-gray-200 text-muted-foreground"
              )}>
                4
              </div>
              <span className="text-sm">Confirmation</span>
            </div>
          </div>
        </div>

        {/* Step content */}
        <div className="max-w-3xl mx-auto">
          {renderStepContent()}
        </div>
      </div>
    </Layout>
  );
}
