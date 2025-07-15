import { StripePaymentForm } from "@/components/StripePaymentForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { testProducts, getVariationPrice } from "@/data/testProducts";
import { formatPrice, translateColor } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { ProductVariation } from "@shared/schema";
import { ShoppingCart, CreditCard } from "lucide-react";

export function StripeTest() {
  const [selectedVariation, setSelectedVariation] = useState<{
    productId: number;
    variationId: number;
    quantity: number;
  } | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const { t } = useLanguage();

  const handleSuccess = (orderId: number, orderNumber: string) => {
    alert(`✅ Paiement réussi ! Commande: ${orderNumber} (ID: ${orderId})`);
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
      <div className="container max-w-4xl mx-auto p-6">
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
                  Paiement - {productInfo.product.name}
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
                      {translateColor(productInfo.variation.variationValue, t)}
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
    );
  }

  return (
    <div className="container max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">🧪 Test Stripe</h1>
        <p className="text-gray-600">
          Page de test pour l'intégration Stripe avec des produits réalistes
        </p>
      </div>

      {/* Cartes de test Stripe */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>💳 Cartes de test Stripe</CardTitle>
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
              <div className="font-semibold text-red-800">❌ Carte refusée</div>
              <div className="font-mono">4000 0000 0000 0002</div>
              <div className="text-red-600">Simule un paiement refusé</div>
            </div>
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="font-semibold text-yellow-800">⚠️ 3D Secure</div>
              <div className="font-mono">4000 0025 0000 3155</div>
              <div className="text-yellow-600">Nécessite authentification</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Produits de test */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">🛍️ Produits de test</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <p className="text-sm text-gray-600">{product.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {product.variations?.map((variation) => (
                    <div
                      key={variation.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
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
                          onClick={() => handleBuyNow(product.id, variation.id)}
                          disabled={variation.stock === 0}
                          className="mt-1"
                        >
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          Acheter
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
          <CardTitle>⚙️ Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1 text-sm text-gray-600">
            <div>
              Environment:{" "}
              <span className="font-mono">{window.ENV?.NODE_ENV}</span>
            </div>
            <div>
              API URL: <span className="font-mono">{window.ENV?.API_URL}</span>
            </div>
            <div>
              Stripe Key:{" "}
              <span className="font-mono">
                {window.ENV?.STRIPE_PUBLISHABLE_KEY?.substring(0, 12)}...
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
