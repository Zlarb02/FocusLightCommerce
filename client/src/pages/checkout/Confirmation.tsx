import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Check } from "lucide-react";
import { useCheckout } from "@/hooks/useCheckout";
import { formatPrice } from "@/lib/utils";

interface ConfirmationProps {
  orderId: number;
  orderNumber: string;
}

export function Confirmation({ orderId, orderNumber }: ConfirmationProps) {
  const [, navigate] = useLocation();
  const { customer, orderDetails } = useCheckout();

  const handleContinueShopping = () => {
    navigate("/");
  };

  return (
    <div className="text-center py-4 md:py-8 px-4 md:px-0">
      <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <Check className="text-green-600 dark:text-green-400 h-5 w-5 md:h-6 md:w-6" />
      </div>
      <h2 className="font-heading font-bold text-xl md:text-2xl mb-2 text-gray-900 dark:text-gray-100">
        Commande confirmée
      </h2>
      <p className="text-sm md:text-base text-muted-foreground dark:text-gray-400 mb-6">
        Merci pour votre achat ! Votre commande a été reçue.
      </p>

      <div className="max-w-md mx-auto bg-slate-50 dark:bg-gray-800 rounded-lg p-4 md:p-6 text-left mb-6 md:mb-8 border border-gray-200 dark:border-gray-600">
        <div className="flex justify-between mb-4 text-sm md:text-base">
          <span className="text-muted-foreground dark:text-gray-400">
            Numéro de commande:
          </span>
          <span className="font-medium text-gray-900 dark:text-gray-100 break-all">
            {orderNumber}
          </span>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
          {orderDetails.map((item, index) => (
            <div key={index} className="flex gap-3 md:gap-4 mb-4">
              <img
                src={item.product.imageUrl}
                alt={`${item.product.productName} ${item.product.variationValue}`}
                className="w-12 h-12 md:w-16 md:h-16 object-contain flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="font-medium text-sm md:text-base text-gray-900 dark:text-gray-100 leading-tight">
                  {item.product.productName}
                </h4>
                <p className="text-xs md:text-sm text-muted-foreground dark:text-gray-400">
                  {item.product.variationType}: {item.product.variationValue}
                </p>
                <p className="text-xs md:text-sm font-medium mt-1 text-gray-900 dark:text-gray-100">
                  {formatPrice(
                    (item.product.price || item.product.basePrice) *
                      item.quantity
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-600 pt-4 mt-4 text-sm md:text-base">
          <div className="flex justify-between mb-1">
            <span>Sous-total</span>
            <span>
              {formatPrice(
                orderDetails.reduce(
                  (sum, item) =>
                    sum +
                    (item.product.price || item.product.basePrice) *
                      item.quantity,
                  0
                )
              )}
            </span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Livraison</span>
            <span className="text-green-600 dark:text-green-400">Gratuite</span>
          </div>
          <div className="flex justify-between font-bold mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
            <span>Total</span>
            <span>
              {formatPrice(
                orderDetails.reduce(
                  (sum, item) =>
                    sum +
                    (item.product.price || item.product.basePrice) *
                      item.quantity,
                  0
                )
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="text-sm md:text-base space-y-2 mb-6 md:mb-8">
        <p className="text-muted-foreground dark:text-gray-400">
          Un email de confirmation a été envoyé à{" "}
          <span className="font-medium break-all">{customer?.email}</span>
        </p>
        <p className="text-muted-foreground dark:text-gray-400">
          Vous avez des questions ?{" "}
          <a href="#" className="text-primary hover:underline">
            Contactez-nous
          </a>
        </p>
      </div>

      <Button
        onClick={handleContinueShopping}
        className="w-full sm:w-auto h-12 md:h-auto text-base md:text-sm"
      >
        Continuer mes achats
      </Button>
    </div>
  );
}
