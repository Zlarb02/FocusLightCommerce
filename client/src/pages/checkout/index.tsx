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
      <div className="container mx-auto px-2 sm:px-4 py-4 md:py-8">
        {/* Checkout steps navigation */}
        <div className="max-w-4xl mx-auto mb-6 md:mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-2 sm:p-4 md:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700 max-w-full">
              <div className="flex items-center min-w-0 flex-1">
                <div className="flex flex-col items-center flex-shrink-0 min-w-[80px]">
                  <div
                    className={cn(
                      "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mb-2 font-medium text-xs md:text-sm",
                      step >= 1
                        ? "bg-primary text-primary-foreground"
                        : "bg-gray-200 text-muted-foreground"
                    )}
                  >
                    1
                  </div>
                  <span className="text-xs md:text-sm text-center font-medium">
                    Info
                  </span>
                </div>
                <div className="flex-1 h-0.5 bg-gray-200 dark:bg-gray-600 mx-2 md:mx-4 relative top-[-8px]"></div>
              </div>

              <div className="flex items-center min-w-0 flex-1">
                <div className="flex flex-col items-center flex-shrink-0 min-w-[80px]">
                  <div
                    className={cn(
                      "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mb-2 font-medium text-xs md:text-sm",
                      step >= 2
                        ? "bg-primary text-primary-foreground"
                        : "bg-gray-200 text-muted-foreground"
                    )}
                  >
                    2
                  </div>
                  <span className="text-xs md:text-sm text-center font-medium">
                    Livraison
                  </span>
                </div>
                <div className="flex-1 h-0.5 bg-gray-200 dark:bg-gray-600 mx-2 md:mx-4 relative top-[-8px]"></div>
              </div>

              <div className="flex items-center min-w-0 flex-1">
                <div className="flex flex-col items-center flex-shrink-0 min-w-[80px]">
                  <div
                    className={cn(
                      "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mb-2 font-medium text-xs md:text-sm",
                      step >= 3
                        ? "bg-primary text-primary-foreground"
                        : "bg-gray-200 text-muted-foreground"
                    )}
                  >
                    3
                  </div>
                  <span className="text-xs md:text-sm text-center font-medium">
                    Paiement
                  </span>
                </div>
                <div className="flex-1 h-0.5 bg-gray-200 dark:bg-gray-600 mx-2 md:mx-4 relative top-[-8px]"></div>
              </div>

              <div className="flex items-center min-w-0">
                <div className="flex flex-col items-center flex-shrink-0 min-w-[80px]">
                  <div
                    className={cn(
                      "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mb-2 font-medium text-xs md:text-sm",
                      step >= 4
                        ? "bg-primary text-primary-foreground"
                        : "bg-gray-200 text-muted-foreground"
                    )}
                  >
                    4
                  </div>
                  <span className="text-xs md:text-sm text-center font-medium">
                    Confirmation
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step content */}
        <div className="max-w-4xl mx-auto px-2 md:px-0">
          {renderStepContent()}
        </div>
      </div>
    </Layout>
  );
}
