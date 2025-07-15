import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, MapPin, Home } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useLanguage } from "@/contexts/LanguageContext";

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
    productImage?: string | null;
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
  const { t } = useLanguage();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderNumber) {
      setError(t("checkout.confirmation.error"));
      setLoading(false);
      return;
    }

    // Gérer les cas d'erreur spéciaux
    if (orderNumber.startsWith("ERROR_")) {
      setError(t("checkout.confirmation.error"));
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
        setError(t("checkout.confirmation.error"));
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
          <p className="text-gray-600">{t("checkout.confirmation.loading")}</p>
        </div>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>
            {error || t("checkout.confirmation.error")}
          </AlertDescription>
        </Alert>
        <Button onClick={onBackToHome} className="mt-4">
          <Home className="w-4 h-4 mr-2" />
          {t("checkout.confirmation.backHome")}
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
          {t("checkout.confirmation.title")}
        </h1>
        <p className="text-xl text-gray-600 mb-4">
          {t("checkout.confirmation.subtitle")}
        </p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 inline-block">
          <p className="text-green-800">
            <strong>
              {t("checkout.confirmation.orderNumber")} {orderData.orderNumber}
            </strong>
          </p>
          <p className="text-green-600 text-sm">
            {t("checkout.confirmation.orderDate")}{" "}
            {new Date(orderData.createdAt).toLocaleDateString("fr-FR")}
          </p>
        </div>
      </div>

      {/* Notification email et SMS améliorée */}
      <div className="mb-6 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">📧</span>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              {t("checkout.confirmation.emailSent")}
            </h3>
            <p className="text-blue-800 dark:text-blue-200 mb-3">
              {t("checkout.confirmation.emailTo")}{" "}
              <strong>{orderData.customer.email}</strong>
            </p>

            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3 mb-3">
              <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
                <span>💡</span>
                {t("checkout.confirmation.checkSpam")}
              </p>
            </div>

            <div className="space-y-2 text-sm text-blue-600 dark:text-blue-400">
              <p className="flex items-center gap-2">
                <span>📱</span>
                <span>
                  <strong>SMS :</strong> {t("checkout.confirmation.smsTrackingShort")} <strong>{orderData.customer.phone}</strong>
                </span>
              </p>
              <p className="text-xs text-blue-500 dark:text-blue-400 italic">
                {t("checkout.confirmation.wrongContact")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Message simple et sympathique */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">😊</span>
              </div>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                {t("checkout.confirmation.simpleMessage")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Informations de livraison */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              {t("checkout.confirmation.deliveryInfo")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {orderData.relayPoint ? (
              <div className="space-y-2">
                <p className="font-medium">
                  {t("checkout.confirmation.relaySelected")}
                </p>
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
                  {t("checkout.confirmation.deliveryDelay")}
                </p>
              </div>
            ) : (
              <p className="text-gray-600">
                {t("checkout.confirmation.noDeliveryMode")}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="mt-8 flex justify-center">
        <Button onClick={onBackToHome} className="flex items-center gap-2">
          <Home className="w-4 h-4" />
          {t("checkout.confirmation.backHome")}
        </Button>
      </div>

      {/* Message rassurant */}
      <Alert className="mt-8 bg-blue-50 border-blue-200">
        <AlertDescription className="text-blue-800">
          {t("checkout.confirmation.emailConfirmation")}
          <br />
          {t("checkout.confirmation.smsTracking")}
        </AlertDescription>
      </Alert>
    </div>
  );
}
