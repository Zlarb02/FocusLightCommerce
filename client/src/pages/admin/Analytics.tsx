import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { formatPrice } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Product } from "@shared/schema";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminAnalytics() {
  const { data: orders = [] } = useQuery({
    queryKey: ["/api/orders"],
  });

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const [totalSales, setTotalSales] = useState(0);
  const [salesByColor, setSalesByColor] = useState<any[]>([]);
  const [salesByDate, setSalesByDate] = useState<any[]>([]);

  useEffect(() => {
    if (orders.length) {
      // Calculate total sales
      const total = orders.reduce((sum, order) => sum + order.totalAmount, 0);
      setTotalSales(total);

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

      // Calculate sales by date
      const dateSales: Record<string, number> = {};
      orders.forEach(order => {
        const date = new Date(order.createdAt).toLocaleDateString();
        dateSales[date] = (dateSales[date] || 0) + order.totalAmount;
      });

      const dateData = Object.entries(dateSales).map(([date, sales]) => ({
        date,
        sales
      }));

      setSalesByDate(dateData);
    }
  }, [orders, products]);

  // Colors for the pie chart
  const COLORS = ['#2563EB', '#DC2626', '#F97316', '#F1F5F9'];

  // Weekly data (simulated for demonstration)
  const weeklyData = [
    { name: 'Lun', sales: 0 },
    { name: 'Mar', sales: 0 },
    { name: 'Mer', sales: 0 },
    { name: 'Jeu', sales: 0 },
    { name: 'Ven', sales: 0 },
    { name: 'Sam', sales: totalSales / 2 },
    { name: 'Dim', sales: totalSales / 2 },
  ];

  // Monthly data (simulated for demonstration)
  const monthlyData = salesByDate.length > 0 
    ? salesByDate 
    : Array.from({ length: 31 }, (_, i) => ({
        date: `${i + 1}/7`,
        sales: i === 15 ? totalSales : 0
      }));

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Analytiques</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Chiffre d'affaires
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(totalSales)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Commandes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Produits Vendus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {orders.reduce((sum, order) => 
                  sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0)
                , 0)}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Évolution des ventes</CardTitle>
              <CardDescription>Tendance des ventes sur la période</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <Tabs defaultValue="daily">
                <TabsList className="mb-4">
                  <TabsTrigger value="daily">Quotidien</TabsTrigger>
                  <TabsTrigger value="weekly">Hebdomadaire</TabsTrigger>
                  <TabsTrigger value="monthly">Mensuel</TabsTrigger>
                </TabsList>
                
                <TabsContent value="daily">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={salesByDate}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis tickFormatter={(value) => `${value}€`} />
                      <Tooltip formatter={(value) => formatPrice(Number(value))} />
                      <Line type="monotone" dataKey="sales" stroke="#2563EB" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>
                
                <TabsContent value="weekly">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={weeklyData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `${value}€`} />
                      <Tooltip formatter={(value) => formatPrice(Number(value))} />
                      <Line type="monotone" dataKey="sales" stroke="#2563EB" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>
                
                <TabsContent value="monthly">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={monthlyData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis tickFormatter={(value) => `${value}€`} />
                      <Tooltip formatter={(value) => formatPrice(Number(value))} />
                      <Line type="monotone" dataKey="sales" stroke="#2563EB" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Ventes par couleur</CardTitle>
              <CardDescription>Répartition des ventes par variante de couleur</CardDescription>
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
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Top des produits</CardTitle>
              <CardDescription>Produits les plus vendus par quantité</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 overflow-auto">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="text-left pb-2">Produit</th>
                      <th className="text-left pb-2">Couleur</th>
                      <th className="text-right pb-2">Quantité</th>
                      <th className="text-right pb-2">CA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => {
                      const productSales = orders.reduce((total, order) => {
                        const items = order.items.filter(item => item.productId === product.id);
                        return total + items.reduce((sum, item) => sum + item.quantity, 0);
                      }, 0);
                      
                      const productRevenue = orders.reduce((total, order) => {
                        const items = order.items.filter(item => item.productId === product.id);
                        return total + items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                      }, 0);
                      
                      return (
                        <tr key={product.id} className="border-t">
                          <td className="py-2">{product.name}</td>
                          <td className="py-2">{product.color}</td>
                          <td className="py-2 text-right">{productSales}</td>
                          <td className="py-2 text-right">{formatPrice(productRevenue)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
