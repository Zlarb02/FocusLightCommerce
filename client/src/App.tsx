import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/Shop";
import NotFound from "@/pages/not-found";
import Checkout from "@/pages/checkout";
import { CartProvider } from "@/hooks/useCart";
import { CheckoutProvider } from "@/hooks/useCheckout";
import { useEffect, useState } from "react";

// Pages de gestion
import GestionLogin from "./pages/gestion/Login";
import Dashboard from "./pages/gestion/Dashboard";
import Stocks from "./pages/gestion/Stocks";
import Commandes from "./pages/gestion/Commandes";
import Contenu from "./pages/gestion/Contenu";
import Parametres from "./pages/gestion/Parametres";

// Type pour l'événement personnalisé de changement de route
interface RouteChangeEvent extends CustomEvent {
  detail: {
    path: string;
  };
}

function Router() {
  // Suivre si on vient de la landing page pour ajouter un bouton de retour si nécessaire
  const [comingFromLanding, setComingFromLanding] = useState(false);

  useEffect(() => {
    // Vérifier si on est sur /shop, ce qui signifie qu'on vient probablement de la landing
    const isShopRoute = window.location.pathname === "/shop";
    setComingFromLanding(isShopRoute);

    // Écouter les événements personnalisés de changement de route depuis la landing
    const handleRouteChange = (e: RouteChangeEvent) => {
      if (e.detail?.path === "/shop") {
        setComingFromLanding(true);
      }
    };

    window.addEventListener("routeChange", handleRouteChange as EventListener);

    return () => {
      window.removeEventListener(
        "routeChange",
        handleRouteChange as EventListener
      );
    };
  }, []);

  // Fonction pour retourner à la landing page de façon sécurisée
  const backToLanding = () => {
    // Utiliser l'API History pour la navigation
    history.pushState({}, "", "/");

    // Récupérer les éléments de façon sécurisée avant manipulation
    const landingContainer = document.getElementById("landing-container");
    const rootElement = document.getElementById("root");

    if (landingContainer && rootElement) {
      landingContainer.style.display = "block";
      rootElement.style.display = "none";
    }
  };

  return (
    <>
      {/* Bouton de retour vers la landing avec accessibilité améliorée */}
      {comingFromLanding && (
        <button
          onClick={backToLanding}
          className=" scale-110 fixed top-4 left-4 z-50 flex items-center gap-1 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-md text-sm shadow-sm hover:bg-white transition-all"
          style={{ fontFamily: "var(--font-futura)" }}
          aria-label="Retour à l'accueil"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>Alto</span>
        </button>
      )}

      <Switch>
        {/* Routes principales de l'application */}
        <Route path="/shop" component={Home} />
        <Route path="/checkout" component={Checkout} />

        {/* Routes d'administration */}
        <Route path="/gestion" component={GestionLogin} />
        <Route path="/gestion/dashboard" component={Dashboard} />
        <Route path="/gestion/stocks" component={Stocks} />
        <Route path="/gestion/commandes" component={Commandes} />
        <Route path="/gestion/contenu" component={Contenu} />
        <Route path="/gestion/parametres" component={Parametres} />

        {/* Route / est gérée par la landing dans index.html */}
        {/* Fallback pour les routes non gérées */}
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <CheckoutProvider>
          <Router />
          <Toaster />
        </CheckoutProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
