import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";
import Checkout from "@/pages/checkout";
import { CartProvider } from "@/hooks/useCart";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminOrders from "@/pages/admin/Orders";
import AdminProducts from "@/pages/admin/Products";
import AdminAnalytics from "@/pages/admin/Analytics";
import AdminLogin from "@/pages/admin/Login";
import { CheckoutProvider } from "@/hooks/useCheckout";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      
      {/* Checkout Routes */}
      <Route path="/checkout" component={Checkout} />
      
      {/* Admin Routes */}
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/orders" component={AdminOrders} />
      <Route path="/admin/products" component={AdminProducts} />
      <Route path="/admin/analytics" component={AdminAnalytics} />
      <Route path="/admin/login" component={AdminLogin} />
      
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
