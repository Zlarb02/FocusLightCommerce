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
import {
  Eye,
  Search,
  Package,
  CheckCheck,
  XCircle,
  Truck,
  Send,
  MessageSquare,
} from "lucide-react";
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
  shippedAt: string | null;
  deliveredAt: string | null;
  shippingEmailSentAt: string | null;
  shippingSmsSentAt: string | null;
  relayPoint: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
  } | null;
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
    productName: string;
    variationType: string | null;
    variationValue: string | null;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
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

  const { mutate: notifyShipping, isPending: isNotifying } = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest<{
        emailSent: boolean;
        smsSent: boolean;
        smsConfigured: boolean;
      }>("POST", `/api/orders/${id}/notify-shipping`);
    },
    onSuccess: (data: {
      emailSent: boolean;
      smsSent: boolean;
      smsConfigured: boolean;
    }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "Client prévenu de l'expédition 📦",
        description: `Email envoyé${
          data.smsConfigured
            ? data.smsSent
              ? " · SMS automatique envoyé"
              : " · SMS automatique en échec"
            : ""
        }. Commande passée en « Expédiée ».`,
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description:
          "L'envoi de la notification d'expédition a échoué. Vérifiez la configuration email.",
        variant: "destructive",
      });
      console.error(error);
    },
  });

  const handleNotifyShipping = (order: OrderWithDetails) => {
    const alreadySent = Boolean(order.shippingEmailSentAt);
    const message = alreadySent
      ? `Le client a déjà été prévenu le ${new Date(
          order.shippingEmailSentAt as string
        ).toLocaleDateString()}. Renvoyer l'email d'expédition à ${
          order.customer.email
        } ?`
      : `Envoyer l'email « colis expédié » à ${order.customer.firstName} ${order.customer.lastName} (${order.customer.email}) ?`;
    if (window.confirm(message)) {
      notifyShipping(order.id);
    }
  };

  // Marque le SMS comme envoyé en base quand Anatole ouvre son appli SMS
  const { mutate: markSmsSent } = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("POST", `/api/orders/${id}/mark-sms-sent`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
    },
  });

  // Annule le marquage "SMS envoyé" (fausse manip : appli SMS ouverte sans envoyer)
  const { mutate: cancelSmsSent } = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/orders/${id}/mark-sms-sent`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      setSelectedOrder((prev) =>
        prev ? { ...prev, shippingSmsSentAt: null } : prev
      );
      toast({
        title: "Marquage annulé",
        description: "Le SMS est de nouveau indiqué comme non envoyé.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible d'annuler le marquage du SMS.",
        variant: "destructive",
      });
      console.error(error);
    },
  });

  /**
   * Lien sms: qui ouvre l'appli SMS du téléphone avec le numéro du client
   * et le message de suivi pré-rempli — il ne reste qu'à appuyer sur Envoyer.
   * Gratuit : le SMS part du forfait du téléphone.
   */
  const buildSmsHref = (order: OrderWithDetails) => {
    const relay = order.relayPoint;
    const message = `Bonjour ${order.customer.firstName}, c'est Anatole d'Alto Lille. Votre commande ${
      order.orderNumber
    } est en route !${
      relay
        ? ` Retrait au point relais ${relay.name} (${relay.city}) d'ici 2-3 jours ouvrés, pièce d'identité requise.`
        : " Livraison d'ici 2-3 jours ouvrés."
    } Merci pour votre confiance !`;
    const phone = order.customer.phone.replace(/[\s.\-()]/g, "");
    // iOS attend "&body=", Android "?body="
    const separator = /iPad|iPhone|iPod/.test(navigator.userAgent) ? "&" : "?";
    return `sms:${phone}${separator}body=${encodeURIComponent(message)}`;
  };

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
        <div className="bg-card text-card-foreground rounded-lg border shadow-sm">
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
                    {/* totalAmount est stocké en euros en BDD */}
                    <TableCell>{formatPrice(order.totalAmount)}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {order.customer.phone && (
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            title={
                              order.shippingSmsSentAt
                                ? `SMS envoyé le ${new Date(
                                    order.shippingSmsSentAt
                                  ).toLocaleDateString()} — cliquer pour renvoyer`
                                : "Ouvre votre appli SMS avec le message de suivi pré-rempli"
                            }
                          >
                            <a
                              href={buildSmsHref(order)}
                              onClick={() => markSmsSent(order.id)}
                            >
                              {order.shippingSmsSentAt ? (
                                <CheckCheck className="h-4 w-4 mr-1.5 text-green-600" />
                              ) : (
                                <MessageSquare className="h-4 w-4 mr-1.5" />
                              )}
                              SMS
                            </a>
                          </Button>
                        )}
                        {order.shippingEmailSentAt ? (
                          <Button
                            variant="secondary"
                            size="sm"
                            disabled={isNotifying}
                            onClick={() => handleNotifyShipping(order)}
                            title={`Client prévenu le ${new Date(
                              order.shippingEmailSentAt
                            ).toLocaleDateString()} — cliquer pour renvoyer`}
                          >
                            <CheckCheck className="h-4 w-4 mr-1.5 text-green-600" />
                            Client prévenu
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            disabled={
                              isNotifying || order.status === "cancelled"
                            }
                            onClick={() => handleNotifyShipping(order)}
                            title="Envoyer l'email « colis expédié » au client"
                          >
                            <Send className="h-4 w-4 mr-1.5" />
                            Colis envoyé
                          </Button>
                        )}
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
                <div className="bg-muted p-4 rounded-md">
                  <p>
                    {selectedOrder.customer.firstName}{" "}
                    {selectedOrder.customer.lastName}
                  </p>
                  <p>{selectedOrder.customer.email}</p>
                  <p>{selectedOrder.customer.phone}</p>
                  {selectedOrder.customer.address && (
                    <div className="mt-2 pt-2 border-t">
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

                <h3 className="font-medium mb-2 mt-4">Suivi & notifications</h3>
                <div className="bg-muted p-4 rounded-md text-sm space-y-1">
                  <p>
                    <span className="font-medium">Colis livré :</span>{" "}
                    {selectedOrder.deliveredAt
                      ? `Oui (${new Date(
                          selectedOrder.deliveredAt
                        ).toLocaleDateString()})`
                      : "Non"}
                  </p>
                  <p>
                    <span className="font-medium">Email d'expédition :</span>{" "}
                    {selectedOrder.shippingEmailSentAt
                      ? `Envoyé le ${new Date(
                          selectedOrder.shippingEmailSentAt
                        ).toLocaleString()}`
                      : "Non envoyé"}
                  </p>
                  <p className="flex items-center gap-2 flex-wrap">
                    <span>
                      <span className="font-medium">SMS d'expédition :</span>{" "}
                      {selectedOrder.shippingSmsSentAt
                        ? `Envoyé le ${new Date(
                            selectedOrder.shippingSmsSentAt
                          ).toLocaleString()}`
                        : "Non envoyé"}
                    </span>
                    {selectedOrder.shippingSmsSentAt && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-destructive"
                        title="À utiliser si le SMS n'a finalement pas été envoyé"
                        onClick={() => cancelSmsSent(selectedOrder.id)}
                      >
                        Annuler
                      </Button>
                    )}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Produits commandés</h3>
                <div className="bg-muted p-4 rounded-md">
                  <ul className="divide-y divide-border">
                    {selectedOrder.items.map((item) => (
                      <li
                        key={item.id}
                        className="py-2 flex items-center gap-2"
                      >
                        <div className="flex-grow">
                          <p>
                            {item.productName}{" "}
                            {item.variationValue && `(${item.variationValue})`}
                          </p>
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Qté: {item.quantity}</span>
                            {/* total_price est stocké en euros/100 par checkoutRoutes */}
                            <span>{formatPrice(item.totalPrice * 100)}</span>
                          </div>
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
    </DashboardLayout>
  );
}
