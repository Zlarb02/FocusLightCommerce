import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Package, MapPin, FileText, Home } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";

interface OrderData {
  id: number;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  items: Array<{
    id: number;
    productName: string;
    variationType: string | null;
    variationValue: string | null;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  invoice: {
    number: string | null;
    html: string | null;
  };
  relayPoint?: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
  };
}

interface OrderConfirmationProps {
  orderNumber: string;
  onBackToHome: () => void;
}

export function OrderConfirmation({
  orderNumber,
  onBackToHome,
}: OrderConfirmationProps) {
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    if (!orderNumber) {
      setError("Numéro de commande manquant");
      setLoading(false);
      return;
    }

    // Gérer les cas d'erreur spéciaux
    if (orderNumber.startsWith("ERROR_")) {
      setError("Une erreur est survenue lors de la finalisation de votre commande. Votre paiement a été effectué avec succès. Nous vous contacterons rapidement.");
      setLoading(false);
      return;
    }

    const fetchOrderData = async () => {
      try {
        console.log("🔍 Récupération commande:", orderNumber);
        const data = await apiRequest(
          "GET",
          `/api/checkout/order/${orderNumber}`
        );
        console.log("✅ Données commande récupérées:", data);
        setOrderData(data);
      } catch (err) {
        console.error("Erreur lors de la récupération de la commande:", err);
        setError("Impossible de récupérer les détails de la commande");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <div className="text-center py-8">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">
            Chargement des détails de votre commande...
          </p>
        </div>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>{error || "Commande non trouvée"}</AlertDescription>
        </Alert>
        <Button onClick={onBackToHome} className="mt-4">
          <Home className="w-4 h-4 mr-2" />
          Retour à l'accueil
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-6">
      {/* Header de confirmation */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🎉 C'est parti !
        </h1>
        <p className="text-xl text-gray-600 mb-4">
          Votre commande est confirmée et en cours de préparation
        </p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 inline-block">
          <p className="text-green-800">
            <strong>Commande N° {orderData.orderNumber}</strong>
          </p>
          <p className="text-green-600 text-sm">
            Commandée le{" "}
            {new Date(orderData.createdAt).toLocaleDateString("fr-FR")}
          </p>
        </div>
      </div>

      {/* Alerte pour vérifier les spams */}
      <Alert className="mb-6 bg-blue-50 border-blue-200">
        <AlertDescription className="flex items-center gap-2">
          <span className="text-blue-600">📧</span>
          <div>
            <strong>Email de confirmation envoyé !</strong> Un email avec votre facture a été envoyé à{" "}
            <strong>{orderData.customer.email}</strong>. 
            <br />
            <span className="text-blue-700">
              💡 Si vous ne le trouvez pas, pensez à vérifier vos dossiers spam/courrier indésirable.
            </span>
          </div>
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Détails de la commande */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Votre commande
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orderData.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                >
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    {item.variationType && item.variationValue && (
                      <p className="text-sm text-gray-600">
                        {item.variationType}: {item.variationValue}
                      </p>
                    )}
                    <p className="text-sm text-gray-500">
                      Quantité: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatPrice(item.totalPrice)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatPrice(item.unitPrice)} / unité
                    </p>
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(orderData.totalAmount)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informations de livraison */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Livraison
            </CardTitle>
          </CardHeader>
          <CardContent>
            {orderData.relayPoint ? (
              <div className="space-y-2">
                <p className="font-medium">Point relais sélectionné:</p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="font-semibold text-blue-900">
                    {orderData.relayPoint.name}
                  </p>
                  <p className="text-blue-700">
                    {orderData.relayPoint.address}
                  </p>
                  <p className="text-blue-700">
                    {orderData.relayPoint.postalCode}{" "}
                    {orderData.relayPoint.city}
                  </p>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  📦 Votre colis sera livré à ce point relais sous 2-3 jours
                  ouvrés. Vous recevrez un SMS/email dès qu'il sera disponible.
                </p>
              </div>
            ) : (
              <p className="text-gray-600">Mode de livraison non spécifié</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        {orderData.invoice.html && (
          <Button
            variant="outline"
            onClick={() => setShowInvoice(!showInvoice)}
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            {showInvoice ? "Masquer" : "Afficher"} la facture
          </Button>
        )}

        <Button onClick={onBackToHome} className="flex items-center gap-2">
          <Home className="w-4 h-4" />
          Retour à l'accueil
        </Button>
      </div>

      {/* Affichage de la facture */}
      {showInvoice && orderData.invoice.html && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Facture {orderData.invoice.number}</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="border rounded-lg p-4 bg-white"
              dangerouslySetInnerHTML={{ __html: orderData.invoice.html }}
            />
          </CardContent>
        </Card>
      )}

      {/* Message rassurant */}
      <Alert className="mt-8 bg-blue-50 border-blue-200">
        <AlertDescription className="text-blue-800">
          💌 <strong>Un email de confirmation</strong> a été envoyé à{" "}
          {orderData.customer.email} avec votre facture.
          <br />
          📱 Vous recevrez également un SMS dès que votre colis sera expédié
          avec le lien de suivi.
        </AlertDescription>
      </Alert>
    </div>
  );
}
