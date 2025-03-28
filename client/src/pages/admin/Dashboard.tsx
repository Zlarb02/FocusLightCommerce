import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { formatPrice } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product } from "@shared/schema";

export default function AdminDashboard() {
  const { data: orders = [] } = useQuery({
    queryKey: ["/api/orders"],
  });

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const [totalSales, setTotalSales] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [averageOrderValue, setAverageOrderValue] = useState(0);
  const [salesByColor, setSalesByColor] = useState<any[]>([]);

  useEffect(() => {
    if (orders.length) {
      // Calculate total sales
      const total = orders.reduce((sum, order) => sum + order.totalAmount, 0);
      setTotalSales(total);
      
      // Count orders
      setOrderCount(orders.length);
      
      // Calculate average order value
      setAverageOrderValue(total / orders.length);

      // Calculate sales by color
      const colorSales: Record<string, number> = {};
      orders.forEach(order => {
        order.items.forEach(item => {
          const product = products.find(p => p.id === item.productId);
          if (product) {
            const color = product.color;
            colorSales[color] = (colorSales[color] || 0) + (item.price * item.quantity);
          }
        });
      });

      const colorData = Object.entries(colorSales).map(([color, sales]) => ({
        name: color,
        value: sales
      }));

      setSalesByColor(colorData);
    }
  }, [orders, products]);

  // Monthly sales data (simulated for demonstration)
  const monthlySalesData = [
    { name: 'Jan', sales: 0 },
    { name: 'Fév', sales: 0 },
    { name: 'Mar', sales: 0 },
    { name: 'Avr', sales: 0 },
    { name: 'Mai', sales: 0 },
    { name: 'Juin', sales: 0 },
    // Assume current month is July
    { name: 'Juil', sales: totalSales },
    { name: 'Aoû', sales: 0 },
    { name: 'Sep', sales: 0 },
    { name: 'Oct', sales: 0 },
    { name: 'Nov', sales: 0 },
    { name: 'Déc', sales: 0 },
  ];

  const COLORS = ['#2563EB', '#DC2626', '#F97316', '#F1F5F9'];

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Tableau de bord</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ventes Totales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(totalSales)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                +0% par rapport au mois précédent
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Nombre de Commandes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orderCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                +0% par rapport au mois précédent
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Panier Moyen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {orderCount ? formatPrice(averageOrderValue) : formatPrice(0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                +0% par rapport au mois précédent
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Ventes par couleur</CardTitle>
              <CardDescription>Distribution des ventes par variante de couleur</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={salesByColor}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {salesByColor.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatPrice(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Ventes mensuelles</CardTitle>
              <CardDescription>Évolution du chiffre d'affaires mensuel</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <Tabs defaultValue="sales">
                <TabsList className="mb-4">
                  <TabsTrigger value="sales">Ventes</TabsTrigger>
                  <TabsTrigger value="orders">Commandes</TabsTrigger>
                </TabsList>
                <TabsContent value="sales">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlySalesData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `${value}€`} />
                      <Tooltip formatter={(value) => formatPrice(Number(value))} />
                      <Bar dataKey="sales" fill="#2563EB" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </TabsContent>
                <TabsContent value="orders">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[...monthlySalesData].map(month => ({
                      ...month,
                      orders: month.name === 'Juil' ? orderCount : 0
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="orders" fill="#F97316" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
