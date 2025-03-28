import { AdminLayout } from "@/components/AdminLayout";
import { DataTable } from "@/components/ui/data-table";
import { useQuery, useMutation } from "@tanstack/react-query";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Eye } from "lucide-react";

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
  };
  items: Array<{
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
  }>;
};

export default function AdminOrders() {
  const { data: orders = [], isLoading } = useQuery<OrderWithDetails[]>({
    queryKey: ["/api/orders"],
  });

  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

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
        description: "Une erreur est survenue lors de la mise à jour du statut.",
        variant: "destructive",
      });
      console.error(error);
    },
  });

  const handleStatusChange = (orderId: number, newStatus: string) => {
    updateOrderStatus({ id: orderId, status: newStatus });
  };

  const handleViewDetails = (order: OrderWithDetails) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  const columns: ColumnDef<OrderWithDetails>[] = [
    {
      accessorKey: "orderNumber",
      header: "Numéro",
      cell: ({ row }) => <span>{row.getValue("orderNumber")}</span>,
    },
    {
      accessorKey: "customer",
      header: "Client",
      cell: ({ row }) => {
        const customer = row.original.customer;
        return <span>{customer.firstName} {customer.lastName}</span>;
      },
    },
    {
      accessorKey: "totalAmount",
      header: "Montant",
      cell: ({ row }) => <span>{formatPrice(row.original.totalAmount)}</span>,
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => (
        <span>
          {new Date(row.original.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        let badgeVariant: 
          | "default"
          | "secondary"
          | "destructive"
          | "outline" = "outline";
        
        switch (status) {
          case "pending":
            badgeVariant = "secondary";
            break;
          case "processing":
            badgeVariant = "default";
            break;
          case "shipped":
            badgeVariant = "outline";
            break;
          case "delivered":
            badgeVariant = "default";
            break;
          case "cancelled":
            badgeVariant = "destructive";
            break;
        }
        
        const statusLabels: Record<string, string> = {
          pending: "En attente",
          processing: "En traitement",
          shipped: "Expédiée",
          delivered: "Livrée",
          cancelled: "Annulée"
        };
        
        return (
          <Badge variant={badgeVariant}>{statusLabels[status] || status}</Badge>
        );
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div className="flex space-x-2">
            <Select 
              defaultValue={order.status}
              onValueChange={(value) => handleStatusChange(order.id, value)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Changer le statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="processing">En traitement</SelectItem>
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
        );
      },
    },
  ];

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Gestion des commandes</h1>
        
        <DataTable 
          columns={columns} 
          data={orders} 
          searchColumn="Rechercher une commande"
        />
        
        {selectedOrder && (
          <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Détails de la commande {selectedOrder.orderNumber}</DialogTitle>
                <DialogDescription>
                  Commande passée le {new Date(selectedOrder.createdAt).toLocaleDateString()}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Informations client</h3>
                  <div className="bg-muted p-3 rounded-md">
                    <p>{selectedOrder.customer.firstName} {selectedOrder.customer.lastName}</p>
                    <p>{selectedOrder.customer.email}</p>
                    <p>{selectedOrder.customer.phone}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Produits commandés</h3>
                  <div className="bg-muted p-3 rounded-md">
                    <ul className="divide-y">
                      {selectedOrder.items.map((item) => (
                        <li key={item.id} className="py-2">
                          <div className="flex justify-between">
                            <span>FOCUS.01 (x{item.quantity})</span>
                            <span>{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="pt-2 mt-2 border-t flex justify-between font-medium">
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
      </div>
    </AdminLayout>
  );
}
