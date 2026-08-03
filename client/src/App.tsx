import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import CheckoutNew from "@/pages/checkout/CheckoutNew";
import { OrderConfirmation } from "@/pages/checkout/OrderConfirmation";
import { CartProvider } from "@/hooks/useCart";
import { CheckoutProvider } from "@/hooks/useCheckout";
import { Suspense, lazy, useEffect } from "react";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import ProductDetail from "@/pages/ProductDetail";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { StripeProvider } from "@/components/StripeProvider";

// Pages de contenu (chargées à la demande)
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
import SliderConfig from "./pages/gestion/SliderConfig";
import ProtectedGestionRoute from "./components/ProtectedGestionRoute";

// Pages légales et services
import MentionsLegales from "./pages/legal/MentionsLegales";
import PolitiqueConfidentialite from "./pages/legal/PolitiqueConfidentialite";
import CGV from "./pages/legal/CGV";
import Livraison from "./pages/service/Livraison";
import Retours from "./pages/service/Retours";
import FAQ from "./pages/service/FAQ";

const lazyFallback = (
  <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
    Chargement…
  </div>
);

function Router() {
  const [location, navigate] = useLocation();

  /* wouter ne réinitialise pas le scroll d'une route à l'autre : sans ça, en
     partant du bas d'une page (typiquement depuis le footer), on arrive en bas
     de la suivante. Le lien « Contact », lui, scrolle volontairement vers le
     footer une fois la page rendue. */
  useEffect(() => {
    window.scrollTo(0, 0);

    /* Certaines pages cachent l'essentiel sous la ligne de flottaison : sur le
       Studio la tagline est posée TOUT EN BAS du hero (photo entière, Anatole
       jamais rogné), et sur le catalogue c'est le pied de la première ligne de
       produits. Fabrication et Sur-mesure ne sont plus concernées : leur hero
       tient désormais dans le premier écran, écriture comprise.
       Arriver à scroll 0 ne montre alors qu'un mur d'image. On repère
       donc l'élément marqué `data-reveal-bottom` et on descend en douceur
       jusqu'à son bas.
       Le marqueur peut arriver après coup (le catalogue attend son API) : on
       réessaie pendant ~1,3 s, et on abandonne dès que l'utilisateur a pris la
       main sur le scroll. */
    let attempts = 0;
    const reveal = window.setInterval(() => {
      if (window.scrollY > 0 || attempts++ > 10) {
        window.clearInterval(reveal);
        return;
      }
      const target = document.querySelector<HTMLElement>("[data-reveal-bottom]");
      if (!target) return;
      window.clearInterval(reveal);
      const overflow = Math.round(
        target.getBoundingClientRect().bottom - window.innerHeight
      );
      if (overflow < 8) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: overflow, behavior: reduced ? "auto" : "smooth" });
    }, 120);

    return () => window.clearInterval(reveal);
  }, [location]);

  return (
    <Switch>
      {/* Accueil */}
      <Route path="/" component={Home} />

      {/* Boutique */}
      <Route path="/shop" component={Shop} />
      <Route path="/shop/:id" component={ProductDetail} />
      <Route path="/checkout" component={CheckoutNew} />
      <Route path="/checkout/confirmation/:orderNumber">
        {(params) => (
          <OrderConfirmation
            orderNumber={params.orderNumber}
            onBackToHome={() => navigate("/")}
          />
        )}
      </Route>

      {/* Pages de contenu */}
      <Route path="/design-action">
        <Suspense fallback={lazyFallback}>
          <DesignEnAction />
        </Suspense>
      </Route>
      <Route path="/design-en-action">
        <Suspense fallback={lazyFallback}>
          <DesignEnAction />
        </Suspense>
      </Route>
      <Route path="/creations-demande">
        <Suspense fallback={lazyFallback}>
          <CreationsSurMesure />
        </Suspense>
      </Route>
      <Route path="/creations-sur-mesure">
        <Suspense fallback={lazyFallback}>
          <CreationsSurMesure />
        </Suspense>
      </Route>
      <Route path="/about">
        <Suspense fallback={lazyFallback}>
          <About />
        </Suspense>
      </Route>
      <Route path="/a-propos">
        <Suspense fallback={lazyFallback}>
          <About />
        </Suspense>
      </Route>
      <Route path="/anatolle-collet">
        <Suspense fallback={lazyFallback}>
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
      <Route path="/gestion/landing">
        <ProtectedGestionRoute component={SliderConfig} />
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

      {/* Fallback pour les routes non gérées */}
      <Route component={NotFound} />
    </Switch>
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
