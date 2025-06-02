import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCart } from "@/hooks/useCart";
import { useCheckout } from "@/hooks/useCheckout";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/utils";

const paymentSchema = z.object({
  cardNumber: z
    .string()
    .min(16, "Le numéro de carte doit comporter au moins 16 chiffres")
    .max(19, "Le numéro de carte ne doit pas dépasser 19 caractères")
    .regex(/^\d[\d\s-]*$/, "Le numéro de carte n'est pas valide"),
  expiryDate: z
    .string()
    .regex(
      /^(0[1-9]|1[0-2])\/\d{2}$/,
      "La date d'expiration doit être au format MM/AA"
    ),
  cvv: z
    .string()
    .min(3, "Le CVV doit comporter au moins 3 chiffres")
    .max(4, "Le CVV ne doit pas dépasser 4 chiffres")
    .regex(/^\d+$/, "Le CVV doit contenir uniquement des chiffres"),
  cardName: z.string().min(1, "Le nom sur la carte est requis"),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

interface PaymentProps {
  onNext: (orderId: number, orderNumber: string) => void;
  onBack: () => void;
}

export function Payment({ onNext, onBack }: PaymentProps) {
  const { items, getTotalPrice, clearCart } = useCart();
  const { customer } = useCheckout();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardName: "",
    },
  });

  const onSubmit = async (data: PaymentFormValues) => {
    if (!customer) {
      toast({
        title: "Erreur",
        description: "Les informations client sont manquantes",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Format data for checkout API
      const checkoutData = {
        customer,
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        totalAmount: getTotalPrice(),
      };

      const response = await apiRequest("POST", "/api/checkout", checkoutData);
      const orderResult = await response.json();

      // Clear the cart after successful order
      clearCart();

      // Move to confirmation page with order details
      onNext(orderResult.orderId, orderResult.orderNumber);
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Erreur de paiement",
        description:
          "Une erreur est survenue lors du traitement du paiement. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const totalPrice = getTotalPrice();

  return (
    <div>
      <h2 className="font-heading font-bold text-2xl mb-6 text-gray-900 dark:text-gray-100">
        Paiement sécurisé
      </h2>

      <Alert className="mb-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
        <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
        <AlertDescription className="text-sm text-green-800 dark:text-green-200">
          Toutes vos informations de paiement sont cryptées et sécurisées.
        </AlertDescription>
      </Alert>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="cardNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numéro de carte</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="1234 5678 9012 3456"
                      {...field}
                      onChange={(e) => {
                        // Format card number with spaces
                        const value = e.target.value.replace(/\s/g, "");
                        const formattedValue = value
                          .replace(/(\d{4})/g, "$1 ")
                          .trim();
                        field.onChange(formattedValue);
                      }}
                    />
                    <div className="absolute right-3 top-3 flex gap-2">
                      <svg
                        className="w-6 h-6 text-blue-800"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M7.5 11.5h9v1h-9zM7.5 8.5h9v1h-9zM16 4H8a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V8a4 4 0 0 0-4-4z" />
                      </svg>
                      <svg
                        className="w-6 h-6 text-red-600"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 15.5a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8.5 11.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M11.5 7a.5.5 0 0 1 1 0v1a.5.5 0 0 1-1 0V7z"
                        />
                        <path d="M8 4a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V8a4 4 0 0 0-4-4H8z" />
                      </svg>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date d'expiration</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="MM/AA"
                      {...field}
                      onChange={(e) => {
                        // Format expiry date with /
                        const value = e.target.value.replace(/\D/g, "");
                        if (value.length <= 2) {
                          field.onChange(value);
                        } else {
                          field.onChange(
                            `${value.slice(0, 2)}/${value.slice(2, 4)}`
                          );
                        }
                      }}
                      maxLength={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cvv"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CVV</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="123"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        field.onChange(value);
                      }}
                      maxLength={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="cardName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom sur la carte</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
            <div className="flex justify-between mb-2 text-gray-700 dark:text-gray-300">
              <span>Sous-total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between mb-2 text-gray-700 dark:text-gray-300">
              <span>Livraison</span>
              <span className="text-green-600 dark:text-green-400">
                Gratuite
              </span>
            </div>
            <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-gray-100">
              <span>Total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="w-1/3"
              onClick={onBack}
              disabled={isProcessing}
            >
              Retour
            </Button>
            <Button type="submit" className="w-2/3" disabled={isProcessing}>
              {isProcessing
                ? "Traitement en cours..."
                : `Payer ${formatPrice(totalPrice)}`}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
