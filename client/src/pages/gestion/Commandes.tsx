import DashboardLayout from "./DashboardLayout";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, Search, Package, CheckCheck, XCircle, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type OrderWithDetails = {
  id: number;
  customerId: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  orderNumber: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  items: Array<{
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
    product?: {
      name: string;
      color: string;
      imageUrl: string;
    };
  }>;
};

export default function Commandes() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(
    null
  );
  const [detailsOpen, setDetailsOpen] = useState(false);

  const { data: orders = [], isLoading } = useQuery<OrderWithDetails[]>({
    queryKey: ["/api/orders"],
    // Dans un environnement de production, cette requête serait activée
    enabled: true,
  });

  const { mutate: updateOrderStatus } = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return apiRequest("PUT", `/api/orders/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "Statut mis à jour",
        description: "Le statut de la commande a été mis à jour avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description:
          "Une erreur est survenue lors de la mise à jour du statut.",
        variant: "destructive",
      });
      console.error(error);
    },
  });

  const handleViewDetails = (order: OrderWithDetails) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  const handleStatusChange = (orderId: number, newStatus: string) => {
    updateOrderStatus({ id: orderId, status: newStatus });
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.lastName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">En attente</Badge>;
      case "processing":
        return <Badge variant="secondary">En traitement</Badge>;
      case "shipped":
        return <Badge variant="outline">Expédiée</Badge>;
      case "delivered":
        return <Badge variant="default">Livrée</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Annulée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Package className="h-4 w-4 mr-1" />;
      case "processing":
        return <Package className="h-4 w-4 mr-1" />;
      case "shipped":
        return <Truck className="h-4 w-4 mr-1" />;
      case "delivered":
        return <CheckCheck className="h-4 w-4 mr-1" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout title="Gestion des commandes">
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-64">
          <Input
            placeholder="Rechercher une commande..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° Commande</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Aucune commande trouvée
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      {order.orderNumber}
                    </TableCell>
                    <TableCell>
                      {order.customer.firstName} {order.customer.lastName}
                    </TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{formatPrice(order.totalAmount)}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Select
                          defaultValue={order.status}
                          onValueChange={(value) =>
                            handleStatusChange(order.id, value)
                          }
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Changer le statut" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">En attente</SelectItem>
                            <SelectItem value="processing">
                              En traitement
                            </SelectItem>
                            <SelectItem value="shipped">Expédiée</SelectItem>
                            <SelectItem value="delivered">Livrée</SelectItem>
                            <SelectItem value="cancelled">Annulée</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleViewDetails(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {selectedOrder && (
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                Détails de la commande {selectedOrder.orderNumber}
              </DialogTitle>
              <DialogDescription>
                Commande passée le{" "}
                {new Date(selectedOrder.createdAt).toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Informations client</h3>
                <div className="bg-slate-50 p-4 rounded-md">
                  <p>
                    {selectedOrder.customer.firstName}{" "}
                    {selectedOrder.customer.lastName}
                  </p>
                  <p>{selectedOrder.customer.email}</p>
                  <p>{selectedOrder.customer.phone}</p>
                  {selectedOrder.customer.address && (
                    <div className="mt-2 pt-2 border-t border-slate-200">
                      <p>{selectedOrder.customer.address}</p>
                      <p>
                        {selectedOrder.customer.postalCode}{" "}
                        {selectedOrder.customer.city}
                      </p>
                      <p>{selectedOrder.customer.country}</p>
                    </div>
                  )}
                </div>

                <h3 className="font-medium mb-2 mt-4">Statut actuel</h3>
                <div className="flex items-center">
                  {getStatusIcon(selectedOrder.status)}
                  {getStatusBadge(selectedOrder.status)}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Produits commandés</h3>
                <div className="bg-slate-50 p-4 rounded-md">
                  <ul className="divide-y divide-slate-200">
                    {selectedOrder.items.map((item) => (
                      <li
                        key={item.id}
                        className="py-2 flex items-center gap-2"
                      >
                        {item.product?.imageUrl && (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product?.name || "Produit"}
                            className="w-10 h-10 object-contain"
                          />
                        )}
                        <div className="flex-grow">
                          <p>
                            {item.product?.name || "FOCUS.01"}{" "}
                            {item.product?.color && `(${item.product.color})`}
                          </p>
                          <div className="flex justify-between text-sm">
                            <span>Qté: {item.quantity}</span>
                            <span>{formatPrice(item.price)}</span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-2 mt-2 border-t border-slate-200 flex justify-between font-medium">
                    <span>Total</span>
                    <span>{formatPrice(selectedOrder.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDetailsOpen(false)}>
                Fermer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
}
