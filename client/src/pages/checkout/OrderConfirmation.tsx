import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  MapPin,
  Home,
  Mail,
  Smartphone,
  FileText,
} from "lucide-react";
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

const titleFont = { fontFamily: "var(--font-titles)" } as const;

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
        const data = await apiRequest(
          "GET",
          `/api/checkout/order/${orderNumber}`
        );
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

  // Ouvre la facture HTML jointe à la commande dans un nouvel onglet
  const openInvoice = () => {
    if (!orderData?.invoice?.html) return;
    const win = window.open("", "_blank");
    if (win) {
      win.document.write(orderData.invoice.html);
      win.document.close();
    }
  };

  if (loading) {
    return (
      <Layout showCart={false} headerTone="brown-desktop" footerTone="none">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-muted-foreground">
            {t("checkout.confirmation.loading")}
          </p>
        </div>
      </Layout>
    );
  }

  if (error || !orderData) {
    return (
      <Layout showCart={false} headerTone="brown-desktop" footerTone="none">
        <div className="mx-auto max-w-xl px-6 py-24 text-center">
          <div className="border-l-4 border-[#B3261E] bg-card p-5 text-left">
            <p className="font-semibold">
              {error || t("checkout.confirmation.error")}
            </p>
          </div>
          <Button
            onClick={onBackToHome}
            className="mt-6 rounded-none bg-alto-orange font-bold text-alto-cream hover:bg-alto-orange-soft"
            style={titleFont}
          >
            <Home className="mr-2 h-4 w-4" />
            {t("checkout.confirmation.backHome")}
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showCart={false} headerTone="brown-desktop" footerTone="blue">
      <div className="mx-auto max-w-4xl px-4 py-10 md:px-6 md:py-16">
        {/* En-tête de confirmation */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-alto-orange">
            <CheckCircle className="h-9 w-9 text-alto-cream" />
          </div>
          <h1
            className="mb-2 text-3xl font-bold text-alto-brown dark:text-alto-cream md:text-5xl"
            style={titleFont}
          >
            {t("checkout.confirmation.title")}
          </h1>
          <p className="mb-6 text-lg text-muted-foreground md:text-xl">
            {t("checkout.confirmation.subtitle")}
          </p>
          <div className="inline-block bg-alto-brown px-6 py-4 text-alto-cream dark:bg-alto-brown-deep">
            <p className="font-bold" style={titleFont}>
              {t("checkout.confirmation.orderNumber")}{" "}
              <span className="text-alto-orange-soft">
                {orderData.orderNumber}
              </span>
            </p>
            <p className="mt-1 text-sm text-alto-cream/70">
              {t("checkout.confirmation.orderDate")}{" "}
              {new Date(orderData.createdAt).toLocaleDateString("fr-FR")}
            </p>
          </div>
        </div>

        {/* Email + SMS */}
        <div className="mb-6 border-2 border-alto-brown/15 bg-card p-5 dark:border-alto-cream/15 md:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center bg-alto-orange">
              <Mail className="h-5 w-5 text-alto-cream" />
            </div>
            <div className="flex-1">
              <h3 className="mb-2 font-bold" style={titleFont}>
                {t("checkout.confirmation.emailSent")}
              </h3>
              <p className="mb-3 text-sm">
                {t("checkout.confirmation.emailTo")}{" "}
                <strong>{orderData.customer.email}</strong>
              </p>

              <div className="mb-3 border-l-4 border-alto-orange bg-primary/5 p-3">
                <p className="text-sm">{t("checkout.confirmation.checkSpam")}</p>
              </div>

              <div className="space-y-1 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 shrink-0" />
                  <span>
                    <strong>SMS :</strong>{" "}
                    {t("checkout.confirmation.smsTrackingShort")}{" "}
                    <strong>{orderData.customer.phone}</strong>
                  </span>
                </p>
                <p className="text-xs italic">
                  {t("checkout.confirmation.wrongContact")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Message simple et sympathique */}
          <div className="flex items-center border-2 border-alto-brown/15 bg-card p-6 dark:border-alto-cream/15">
            <p className="text-lg leading-relaxed">
              {t("checkout.confirmation.simpleMessage")}
            </p>
          </div>

          {/* Informations de livraison */}
          <div className="border-2 border-alto-brown/15 bg-card dark:border-alto-cream/15">
            <header className="flex items-center gap-3 border-b-2 border-alto-brown/15 px-5 py-4 dark:border-alto-cream/15">
              <MapPin className="h-5 w-5 text-primary" />
              <h2 className="font-bold" style={titleFont}>
                {t("checkout.confirmation.deliveryInfo")}
              </h2>
            </header>
            <div className="p-5">
              {orderData.relayPoint ? (
                <div className="space-y-2">
                  <p className="font-medium">
                    {t("checkout.confirmation.relaySelected")}
                  </p>
                  <div className="border-l-4 border-alto-blue bg-alto-blue/5 p-3 dark:border-alto-cream/60 dark:bg-alto-cream/5">
                    <p className="font-bold" style={titleFont}>
                      {orderData.relayPoint.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {orderData.relayPoint.address}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {orderData.relayPoint.postalCode}{" "}
                      {orderData.relayPoint.city}
                    </p>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t("checkout.confirmation.deliveryDelay")}
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  {t("checkout.confirmation.noDeliveryMode")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {orderData.invoice?.html && (
            <Button
              onClick={openInvoice}
              className="w-full rounded-none bg-alto-orange font-bold text-alto-cream hover:bg-alto-orange-soft sm:w-auto"
              style={titleFont}
            >
              <FileText className="mr-2 h-4 w-4" />
              {t("checkout.confirmation.viewInvoice")}
            </Button>
          )}
          <Button
            onClick={onBackToHome}
            variant="outline"
            className="w-full rounded-none sm:w-auto"
            style={titleFont}
          >
            <Home className="mr-2 h-4 w-4" />
            {t("checkout.confirmation.backHome")}
          </Button>
        </div>

        {/* Message rassurant */}
        <div className="mt-10 border-l-4 border-primary bg-primary/5 p-4 text-sm">
          {t("checkout.confirmation.emailConfirmation")}
          <br />
          {t("checkout.confirmation.smsTracking")}
        </div>
      </div>
    </Layout>
  );
}
