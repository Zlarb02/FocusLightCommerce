import DashboardLayout from "./DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Package,
  ShoppingCart,
  CheckCircle,
  AlertCircle,
  FileText,
} from "lucide-react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { AuthGuard } from "@/components/AuthGuard";
import { ProductWithVariations } from "@shared/schema";

export default function Dashboard() {
  const [, setLocation] = useLocation();

  // Récupération des données depuis l'API (dans un environnement réel)
  const { data: products = [] } = useQuery<ProductWithVariations[]>({
    queryKey: ["/api/products"],
    enabled: false, // Désactivé pour la démo - à activer en production
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["/api/orders"],
    enabled: false, // Désactivé pour la démo - à activer en production
  });

  // Données de démonstration
  const stats = {
    stockTotal: 38,
    stockLow: 2,
    ordersTotal: 24,
    ordersPending: 5,
    ordersCompleted: 19,
    revenueMonth: "3 470€",
  };

  return (
    <AuthGuard>
      <DashboardLayout title="Tableau de bord">
        {/* Statistiques générales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Stock total</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.stockTotal} unités
              </div>
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
                Sur les 30 derniers jours
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Chiffre du mois
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.revenueMonth}</div>
              <p className="text-xs text-muted-foreground mt-1">
                +12% par rapport au mois dernier
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
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="bg-amber-100 p-2 rounded-full">
                <Package className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-medium">Stock faible: FOCUS.01 Rouge</h3>
                <p className="text-sm text-muted-foreground">
                  Il ne reste que 3 unités en stock
                </p>
              </div>
              <Button
                variant="outline"
                className="ml-auto"
                size="sm"
                onClick={() => setLocation("/gestion/stocks")}
              >
                Gérer
              </Button>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">5 nouvelles commandes à traiter</h3>
                <p className="text-sm text-muted-foreground">
                  Commandes en attente de validation
                </p>
              </div>
              <Button
                variant="outline"
                className="ml-auto"
                size="sm"
                onClick={() => setLocation("/gestion/commandes")}
              >
                Voir
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Intégration future d'un graphique ou tableau de bord avancé */}
        <div className="mt-8 p-6 border border-dashed rounded-lg flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-2">
              Espace réservé pour l'intégration future de graphiques
            </p>
            <p className="text-sm text-muted-foreground">
              Les statistiques détaillées seront disponibles ici
            </p>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
