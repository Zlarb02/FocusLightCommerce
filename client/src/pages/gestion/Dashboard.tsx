import DashboardLayout from "./DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Package,
  ShoppingCart,
  CheckCircle,
  TrendingUp,
  FileText,
} from "lucide-react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ProductWithVariations, Order } from "../../../../shared/schema";
import { formatPrice } from "@/lib/utils";

export default function Dashboard() {
  const [, setLocation] = useLocation();

  // Récupération des données depuis l'API
  const { data: products = [] } = useQuery<ProductWithVariations[]>({
    queryKey: ["/api/products"],
  });

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  // Calcul des statistiques réelles
  const stockTotal = products.reduce((acc, product) => {
    return acc + (product.variations?.reduce((sum, v) => sum + v.stock, 0) || 0);
  }, 0);

  // Variations avec stock faible (≤ 5)
  const lowStockVariations = products.flatMap((product) =>
    (product.variations || [])
      .filter((v) => v.stock <= 5)
      .map((v) => ({ ...v, productName: product.name }))
  );

  // Commandes en attente (status: pending ou processing)
  const pendingOrders = orders.filter(
    (order) => order.status === "pending" || order.status === "processing"
  );

  // Commandes complétées (status: delivered)
  const completedOrders = orders.filter((order) => order.status === "delivered");

  // Chiffre d'affaires du mois (commandes livrées ou expédiées ce mois)
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const revenueMonth = orders
    .filter((order) => {
      if (!order.createdAt) return false;
      const orderDate = new Date(order.createdAt);
      return (
        orderDate >= startOfMonth &&
        (order.status === "shipped" || order.status === "delivered")
      );
    })
    .reduce((sum, order) => sum + order.totalAmount, 0);

  const stats = {
    stockTotal,
    stockLow: lowStockVariations.length,
    ordersTotal: orders.length,
    ordersPending: pendingOrders.length,
    ordersCompleted: completedOrders.length,
    // totalAmount est stocké en euros en BDD
    revenueMonth: formatPrice(revenueMonth),
  };

  return (
    <DashboardLayout title="Tableau de bord">
      {/* Statistiques générales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Stock total</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.stockTotal} unités</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.stockLow} produits en stock faible
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Commandes</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ordersTotal}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.ordersPending} en attente de traitement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Commandes livrées
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ordersCompleted}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Depuis le lancement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Chiffre du mois
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.revenueMonth}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Commandes expédiées/livrées
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Accès rapides */}
      <h2 className="font-medium text-xl mb-4">Accès rapides</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Button
          variant="outline"
          className="h-auto py-6 flex flex-col items-center justify-center gap-2"
          onClick={() => setLocation("/gestion/stocks")}
        >
          <Package className="h-6 w-6" />
          <span>Gérer les stocks</span>
        </Button>

        <Button
          variant="outline"
          className="h-auto py-6 flex flex-col items-center justify-center gap-2"
          onClick={() => setLocation("/gestion/commandes")}
        >
          <ShoppingCart className="h-6 w-6" />
          <span>Traiter les commandes</span>
        </Button>

        <Button
          variant="outline"
          className="h-auto py-6 flex flex-col items-center justify-center gap-2"
          onClick={() => setLocation("/gestion/contenu")}
        >
          <FileText className="h-6 w-6" />
          <span>Modifier le contenu</span>
        </Button>
      </div>

      {/* Alertes */}
      <h2 className="font-medium text-xl mb-4">Alertes</h2>
      <div className="space-y-4">
        {/* Alertes de stock faible */}
        {lowStockVariations.length > 0 ? (
          lowStockVariations.slice(0, 3).map((variation) => (
            <Card
              key={variation.id}
              className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20"
            >
              <CardContent className="p-4 flex items-center gap-3">
                <div className="bg-amber-100 dark:bg-amber-800/50 p-2 rounded-full">
                  <Package className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-amber-900 dark:text-amber-100">
                    Stock faible: {variation.productName} - {variation.variationValue}
                  </h3>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    {variation.stock === 0
                      ? "Rupture de stock !"
                      : `Il ne reste que ${variation.stock} unité${variation.stock > 1 ? "s" : ""} en stock`}
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="ml-auto border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-800/50"
                  size="sm"
                  onClick={() => setLocation("/gestion/stocks")}
                >
                  Gérer
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="bg-green-100 dark:bg-green-800/50 p-2 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-medium text-green-900 dark:text-green-100">
                  Tous les stocks sont OK
                </h3>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Aucun produit en rupture ou stock faible
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Alerte commandes en attente */}
        {pendingOrders.length > 0 ? (
          <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="bg-blue-100 dark:bg-blue-800/50 p-2 rounded-full">
                <ShoppingCart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-blue-900 dark:text-blue-100">
                  {pendingOrders.length} commande{pendingOrders.length > 1 ? "s" : ""} à traiter
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Commandes en attente de validation ou traitement
                </p>
              </div>
              <Button
                variant="outline"
                className="ml-auto border-blue-300 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-800/50"
                size="sm"
                onClick={() => setLocation("/gestion/commandes")}
              >
                Voir
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="bg-green-100 dark:bg-green-800/50 p-2 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-medium text-green-900 dark:text-green-100">
                  Aucune commande en attente
                </h3>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Toutes les commandes ont été traitées
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
