import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import CheckoutNew from "@/pages/checkout/CheckoutNew";
import { OrderConfirmation } from "@/pages/checkout/OrderConfirmation";
import { CartProvider } from "@/hooks/useCart";
import { CheckoutProvider } from "@/hooks/useCheckout";
import { useEffect, useState, Suspense, lazy } from "react";
import Shop from "@/pages/Shop";
import ProductDetail from "@/pages/ProductDetail";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { StripeProvider } from "@/components/StripeProvider";

// Pages de projets autonomes
const DesignEnAction = lazy(() => import("@/pages/DesignEnAction"));
const CreationsSurMesure = lazy(() => import("@/pages/CreationsSurMesure"));
const About = lazy(() => import("@/pages/About"));

// Pages de gestion
import GestionLogin from "./pages/gestion/Login";
import Dashboard from "./pages/gestion/Dashboard";
import Stocks from "./pages/gestion/Stocks";
import Commandes from "./pages/gestion/Commandes";
import Contenu from "./pages/gestion/Contenu";
import Parametres from "./pages/gestion/Parametres";
import Medias from "./pages/gestion/Medias";
import { GestionStripeTest } from "./pages/gestion/StripeTest";
import Versions from "./pages/gestion/Versions";
import SliderConfig from "./pages/gestion/SliderConfig";
import ProtectedGestionRoute from "./components/ProtectedGestionRoute";

// Pages légales et services
import MentionsLegales from "./pages/legal/MentionsLegales";
import PolitiqueConfidentialite from "./pages/legal/PolitiqueConfidentialite";
import CGV from "./pages/legal/CGV";
import Livraison from "./pages/service/Livraison";
import Retours from "./pages/service/Retours";
import FAQ from "./pages/service/FAQ";

// Type pour l'événement personnalisé de changement de route
interface RouteChangeEvent extends CustomEvent {
  detail: {
    path: string;
  };
}

function Router() {
  const [, navigate] = useLocation();

  const OrderConfirmationWrapper = ({
    orderNumber,
  }: {
    orderNumber: string;
  }) => {
    // Fonction pour retourner à la landing page de façon sécurisée
    const backToLanding = () => {
      // Utiliser l'API History pour la navigation
      window.history.pushState({}, "", "/");

      // Récupérer les éléments de façon sécurisée avant manipulation
      const landingContainer = document.getElementById("landing-container");
      const rootElement = document.getElementById("root");

      if (landingContainer && rootElement) {
        landingContainer.style.display = "block";
        rootElement.style.display = "none";

        // Émettre un événement personnalisé pour réinitialiser l'animation Three.js
        window.dispatchEvent(new CustomEvent("returnToLanding"));

        // Réinitialiser la position de défilement
        window.scrollTo(0, 0);
      }
    };

    return (
      <OrderConfirmation
        orderNumber={orderNumber}
        onBackToHome={backToLanding}
      />
    );
  };
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
    window.history.pushState({}, "", "/");

    // Récupérer les éléments de façon sécurisée avant manipulation
    const landingContainer = document.getElementById("landing-container");
    const rootElement = document.getElementById("root");

    if (landingContainer && rootElement) {
      landingContainer.style.display = "block";
      rootElement.style.display = "none";

      // Émettre un événement personnalisé pour réinitialiser l'animation Three.js
      window.dispatchEvent(new CustomEvent("returnToLanding"));

      // Réinitialiser la position de défilement
      window.scrollTo(0, 0);
    }
  };

  return (
    <>
      <Switch>
        {/* Routes principales de l'application */}
        <Route path="/shop" component={Shop} />
        <Route path="/shop/:id" component={ProductDetail} />
        <Route path="/checkout" component={CheckoutNew} />
        <Route path="/checkout/confirmation/:orderNumber">
          {(params) => (
            <OrderConfirmationWrapper orderNumber={params.orderNumber} />
          )}
        </Route>

        {/* Routes des projets */}
        <Route path="/design-action">
          <Suspense fallback={<div className="loading">Chargement...</div>}>
            <DesignEnAction />
          </Suspense>
        </Route>
        <Route path="/creations-demande">
          <Suspense fallback={<div className="loading">Chargement...</div>}>
            <CreationsSurMesure />
          </Suspense>
        </Route>
        {/* Routes de compatibilité */}
        <Route path="/design-en-action">
          <Suspense fallback={<div className="loading">Chargement...</div>}>
            <DesignEnAction />
          </Suspense>
        </Route>
        <Route path="/creations-sur-mesure">
          <Suspense fallback={<div className="loading">Chargement...</div>}>
            <CreationsSurMesure />
          </Suspense>
        </Route>

        {/* Page à propos */}
        <Route path="/about">
          <Suspense fallback={<div className="loading">Chargement...</div>}>
            <About />
          </Suspense>
        </Route>
        <Route path="/a-propos">
          <Suspense fallback={<div className="loading">Chargement...</div>}>
            <About />
          </Suspense>
        </Route>
        <Route path="/anatolle-collet">
          <Suspense fallback={<div className="loading">Chargement...</div>}>
            <About />
          </Suspense>
        </Route>

        {/* Routes d'administration */}
        <Route path="/gestion" component={GestionLogin} />
        <Route path="/gestion/dashboard">
          <ProtectedGestionRoute component={Dashboard} />
        </Route>
        <Route path="/gestion/stocks">
          <ProtectedGestionRoute component={Stocks} />
        </Route>
        <Route path="/gestion/commandes">
          <ProtectedGestionRoute component={Commandes} />
        </Route>
        <Route path="/gestion/medias">
          <ProtectedGestionRoute component={Medias} />
        </Route>
        <Route path="/gestion/contenu">
          <ProtectedGestionRoute component={Contenu} />
        </Route>
        <Route path="/gestion/parametres">
          <ProtectedGestionRoute component={Parametres} />
        </Route>
        <Route path="/gestion/versions">
          <ProtectedGestionRoute component={Versions} />
        </Route>
        <Route path="/gestion/landing">
          <ProtectedGestionRoute component={SliderConfig} />
        </Route>
        <Route path="/gestion/stripe-test">
          <ProtectedGestionRoute component={GestionStripeTest} />
        </Route>

        {/* Pages légales */}
        <Route path="/mentions-legales" component={MentionsLegales} />
        <Route
          path="/politique-confidentialite"
          component={PolitiqueConfidentialite}
        />
        <Route path="/cgv" component={CGV} />

        {/* Pages de service */}
        <Route path="/livraison" component={Livraison} />
        <Route path="/retours" component={Retours} />
        <Route path="/faq" component={FAQ} />

        {/* Route / est gérée par la landing dans index.html */}
        <Route path="/">
          {() => {
            // Si on arrive sur / depuis React, on redirige vers /shop
            navigate("/shop");
            return null;
          }}
        </Route>

        {/* Fallback pour les routes non gérées */}
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <StripeProvider>
            <CartProvider>
              <CheckoutProvider>
                <Router />
                <Toaster />
              </CheckoutProvider>
            </CartProvider>
          </StripeProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
