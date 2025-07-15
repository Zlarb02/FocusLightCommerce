import { StripePaymentForm } from "@/components/StripePaymentForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { testProducts, getVariationPrice } from "@/data/testProducts";
import { formatPrice, translateColor } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { ProductVariation } from "@shared/schema";
import { ShoppingCart, CreditCard, Shield, TestTube } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import DashboardLayout from "./DashboardLayout";

export function GestionStripeTest() {
  const [selectedVariation, setSelectedVariation] = useState<{
    productId: number;
    variationId: number;
    quantity: number;
  } | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const { t } = useLanguage();

  const handleSuccess = (orderId: number, orderNumber: string) => {
    alert(`✅ Paiement réussi ! Commande #${orderNumber} (ID: ${orderId})`);
    setShowPayment(false);
    setSelectedVariation(null);
  };

  const handleError = (error: string) => {
    alert(`❌ Erreur de paiement: ${error}`);
  };

  const handleBuyNow = (productId: number, variationId: number) => {
    setSelectedVariation({ productId, variationId, quantity: 1 });
    setShowPayment(true);
  };

  // Calculer le montant total si un produit est sélectionné
  const getAmount = () => {
    if (!selectedVariation) return 10; // Fallback pour les tests

    const product = testProducts.find(
      (p) => p.id === selectedVariation.productId
    );
    if (!product) return 10;

    const variation = product.variations?.find(
      (v) => v.id === selectedVariation.variationId
    );
    if (!variation) return 10;

    return getVariationPrice(product, variation) * selectedVariation.quantity;
  };

  const getSelectedProductInfo = () => {
    if (!selectedVariation) return null;

    const product = testProducts.find(
      (p) => p.id === selectedVariation.productId
    );
    if (!product) return null;

    const variation = product.variations?.find(
      (v) => v.id === selectedVariation.variationId
    );
    if (!variation) return null;

    return { product, variation };
  };

  if (showPayment) {
    const productInfo = getSelectedProductInfo();

    return (
      <DashboardLayout title="Test Paiement Stripe">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button
              onClick={() => setShowPayment(false)}
              variant="outline"
              className="mb-4"
            >
              ← Retour à la sélection
            </Button>

            {productInfo && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Test Paiement Admin - {productInfo.product.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <img
                      src={productInfo.variation.images[0]?.url}
                      alt={productInfo.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="font-semibold">
                        {productInfo.product.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {productInfo.variation.variationType}:{" "}
                        {translateColor(
                          productInfo.variation.variationValue,
                          t
                        )}
                      </p>
                      <p className="font-bold text-lg">
                        {formatPrice(
                          getVariationPrice(
                            productInfo.product,
                            productInfo.variation
                          )
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <StripePaymentForm
            amount={getAmount()}
            onSuccess={handleSuccess}
            onBack={() => setShowPayment(false)}
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Test Stripe">
      <div className="max-w-6xl mx-auto">
        {/* Header Admin */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <TestTube className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold">🧪 Test Stripe Admin</h1>
              <p className="text-gray-600">
                Interface de test sécurisée pour l'intégration Stripe
              </p>
            </div>
          </div>

          {/* Alert Admin */}
          <Alert className="mb-6 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
            <Shield className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertDescription className="text-sm text-amber-800 dark:text-amber-200">
              🔒 <strong>Zone Admin</strong> - Cette page de test est réservée
              aux administrateurs. Toutes les transactions sont en mode test
              Stripe.
            </AlertDescription>
          </Alert>
        </div>

        {/* Cartes de test Stripe */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              💳 Cartes de test Stripe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="font-semibold text-green-800">
                  ✅ Carte valide
                </div>
                <div className="font-mono">4242 4242 4242 4242</div>
                <div className="text-green-600">
                  Expiration: future, CVC: 3 chiffres
                </div>
              </div>
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="font-semibold text-red-800">
                  ❌ Carte refusée
                </div>
                <div className="font-mono">4000 0000 0000 0002</div>
                <div className="text-red-600">Simule un paiement refusé</div>
              </div>
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="font-semibold text-yellow-800">
                  ⚠️ 3D Secure
                </div>
                <div className="font-mono">4000 0025 0000 3155</div>
                <div className="text-yellow-600">
                  Nécessite authentification
                </div>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="font-semibold text-blue-800">
                  🔄 Fonds insuffisants
                </div>
                <div className="font-mono">4000 0000 0000 9995</div>
                <div className="text-blue-600">Simule fonds insuffisants</div>
              </div>
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="font-semibold text-purple-800">
                  ⏰ Traitement
                </div>
                <div className="font-mono">4000 0000 0000 9979</div>
                <div className="text-purple-600">Traitement en cours</div>
              </div>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="font-semibold text-gray-800">
                  🚫 CVC incorrect
                </div>
                <div className="font-mono">4000 0000 0000 0127</div>
                <div className="text-gray-600">Échec de vérification CVC</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Produits de test */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <ShoppingCart className="w-6 h-6" />
            🛍️ Produits de test
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testProducts.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <p className="text-sm text-gray-600">{product.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {product.variations?.map((variation) => (
                      <div
                        key={variation.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={variation.images[0]?.url}
                            alt={`${product.name} - ${variation.variationValue}`}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <div>
                            <div className="font-medium text-sm">
                              {variation.variationType}:{" "}
                              {translateColor(variation.variationValue, t)}
                            </div>
                            <div className="text-sm text-gray-500">
                              Stock: {variation.stock}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">
                            {formatPrice(getVariationPrice(product, variation))}
                          </div>
                          <Button
                            size="sm"
                            onClick={() =>
                              handleBuyNow(product.id, variation.id)
                            }
                            disabled={variation.stock === 0}
                            className="mt-1"
                          >
                            <TestTube className="w-4 h-4 mr-1" />
                            Tester
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Configuration technique */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              ⚙️ Configuration Stripe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Environment:</span>
                  <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    {window.ENV?.NODE_ENV || "development"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">API URL:</span>
                  <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs">
                    {window.ENV?.API_URL || "http://localhost:5000"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Stripe Key:</span>
                  <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs">
                    {window.ENV?.STRIPE_PUBLISHABLE_KEY?.substring(0, 12)}...
                  </span>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Mode Test Actif</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Webhooks Désactivés</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Aucun Frais Réel</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                💡 <strong>Accès Dashboard:</strong>{" "}
                <a
                  href="https://dashboard.stripe.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:no-underline"
                >
                  dashboard.stripe.com
                </a>{" "}
                (mode test)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
