import { createContext, useContext, useState, ReactNode } from "react";
import { Customer, Product } from "@shared/schema";
import { useCart } from "./useCart";

type OrderItem = {
  product: Product;
  quantity: number;
};

interface CheckoutContextType {
  customer: Customer | null;
  updateCustomer: (customerData: Partial<Customer>) => void;
  orderDetails: OrderItem[];
  updateOrderDetails: (items: OrderItem[]) => void;
  clearCheckout: () => void;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

interface CheckoutProviderProps {
  children: ReactNode;
}

export function CheckoutProvider({ children }: CheckoutProviderProps) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderItem[]>([]);
  const { items } = useCart();

  const updateCustomer = (customerData: Partial<Customer>) => {
    setCustomer((prevCustomer) => ({
      ...prevCustomer as Customer,
      ...customerData,
    }));
  };

  const updateOrderDetails = (items: OrderItem[]) => {
    setOrderDetails(items);
  };

  const clearCheckout = () => {
    setCustomer(null);
    setOrderDetails([]);
  };

  // Automatically update order details when cart changes
  if (items.length > 0 && JSON.stringify(items) !== JSON.stringify(orderDetails)) {
    updateOrderDetails(items as OrderItem[]);
  }

  return (
    <CheckoutContext.Provider
      value={{
        customer,
        updateCustomer,
        orderDetails,
        updateOrderDetails,
        clearCheckout,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error("useCheckout must be used within a CheckoutProvider");
  }
  return context;
}
