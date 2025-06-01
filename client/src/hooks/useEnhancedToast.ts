import { useState, useCallback } from "react";
import { EnhancedToastProps } from "@/components/EnhancedToast";

interface ToastOptions {
  title: string;
  description?: string;
  type?: "success" | "error" | "info" | "cart";
  duration?: number;
  productImage?: string;
  productName?: string;
  quantity?: number;
}

export function useEnhancedToast() {
  const [toasts, setToasts] = useState<EnhancedToastProps[]>([]);

  const addToast = useCallback((options: ToastOptions) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: EnhancedToastProps = {
      id,
      title: options.title,
      description: options.description,
      type: options.type || "info",
      duration: options.duration || 4000,
      productImage: options.productImage,
      productName: options.productName,
      quantity: options.quantity,
      onClose: removeToast,
    };

    setToasts((prev) => [...prev, newToast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    addToast,
    removeToast,
    clearAll,
  };
}
