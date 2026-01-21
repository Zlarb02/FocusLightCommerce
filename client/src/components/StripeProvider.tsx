import { loadStripe, Stripe } from "@stripe/stripe-js";
import {
  ReactNode,
  useEffect,
  useState,
  createContext,
  useContext,
} from "react";

interface StripeContextType {
  stripePromise: Promise<Stripe | null> | null;
}

const StripeContext = createContext<StripeContextType | null>(null);

export const useStripeContext = () => {
  const context = useContext(StripeContext);
  if (!context) {
    throw new Error("useStripeContext must be used within a StripeProvider");
  }
  return context;
};

interface StripeProviderProps {
  children: ReactNode;
}

export function StripeProvider({ children }: StripeProviderProps) {
  const [stripePromise, setStripePromise] =
    useState<Promise<Stripe | null> | null>(null);

  useEffect(() => {
    // Attendre que window.ENV soit disponible
    const initStripe = () => {
      const stripePublicKey = window.ENV?.STRIPE_PUBLISHABLE_KEY;

      if (!stripePublicKey) {
        console.error("STRIPE_PUBLISHABLE_KEY manquante dans env-config.js");
        console.log("window.ENV disponible:", window.ENV);
        console.log(
          "Vérifiez que /env-config.js est bien chargé dans index.html"
        );
        return;
      }

      setStripePromise(loadStripe(stripePublicKey));
    };

    // Si window.ENV est déjà disponible
    if (window.ENV?.STRIPE_PUBLISHABLE_KEY) {
      initStripe();
    } else {
      // Attendre jusqu'à 1 seconde que le script se charge
      let attempts = 0;
      const maxAttempts = 10;

      const interval = setInterval(() => {
        attempts++;
        if (window.ENV?.STRIPE_PUBLISHABLE_KEY) {
          initStripe();
          clearInterval(interval);
        } else if (attempts >= maxAttempts) {
          console.error(
            "❌ Timeout: window.ENV toujours pas disponible après 1s"
          );
          clearInterval(interval);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, []);

  // Afficher un loader pendant l'initialisation de Stripe
  if (!stripePromise) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Initialisation du système de paiement...
          </p>
        </div>
      </div>
    );
  }

  return (
    <StripeContext.Provider value={{ stripePromise }}>
      {children}
    </StripeContext.Provider>
  );
}
