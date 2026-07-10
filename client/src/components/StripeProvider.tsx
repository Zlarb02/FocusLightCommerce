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

  // Ne pas bloquer le site : Stripe n'est nécessaire qu'au checkout.
  // stripePromise reste null tant que la clé n'est pas chargée ;
  // <Elements stripe={null}> gère nativement cet état d'attente.
  return (
    <StripeContext.Provider value={{ stripePromise }}>
      {children}
    </StripeContext.Provider>
  );
}
