import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";
import Checkout from "@/pages/checkout";
import { CartProvider } from "@/hooks/useCart";
import { CheckoutProvider } from "@/hooks/useCheckout";

// Pages de gestion
import GestionLogin from "./pages/gestion/Login";
import Dashboard from "./pages/gestion/Dashboard";
import Stocks from "./pages/gestion/Stocks";
import Commandes from "./pages/gestion/Commandes";
import Contenu from "./pages/gestion/Contenu";
import Parametres from "./pages/gestion/Parametres";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />

      {/* Checkout Routes */}
      <Route path="/checkout" component={Checkout} />

      {/* Gestion Routes */}
      <Route path="/gestion" component={GestionLogin} />
      <Route path="/gestion/dashboard" component={Dashboard} />
      <Route path="/gestion/stocks" component={Stocks} />
      <Route path="/gestion/commandes" component={Commandes} />
      <Route path="/gestion/contenu" component={Contenu} />
      <Route path="/gestion/parametres" component={Parametres} />

      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
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
