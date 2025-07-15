import { ProductWithVariations } from "@shared/schema";

/**
 * Produits de test pour Stripe avec des données réalistes
 * Ces produits simulent les vraies données de l'application
 */
export const testProducts: ProductWithVariations[] = [
  {
    id: 999,
    name: "FOCUS.01 - Test",
    description: "Lampe d'appoint pour tests Stripe - Version de développement",
    price: 70.0,
    variations: [
      {
        id: 9991,
        productId: 999,
        variationType: "color",
        variationValue: "Blanc",
        price: null,
        stock: 5,
        images: [
          {
            url: "https://www.alto-lille.fr/uploads/fbf9e3c1-9afe-446f-9e3d-5966f078b4c0.png",
            order: 0,
          },
        ],
      },
      {
        id: 9992,
        productId: 999,
        variationType: "color",
        variationValue: "Bleu",
        price: null,
        stock: 3,
        images: [
          {
            url: "https://www.alto-lille.fr/uploads/6b611585-bb6c-411c-85bf-342fe95950c6.png",
            order: 0,
          },
        ],
      },
      {
        id: 9993,
        productId: 999,
        variationType: "color",
        variationValue: "Rouge",
        price: null,
        stock: 2,
        images: [
          {
            url: "https://www.alto-lille.fr/uploads/1f1cdf28-f233-4191-9c1a-f9d7e12b709f.png",
            order: 0,
          },
        ],
      },
    ],
  },
  {
    id: 998,
    name: "Cadre Photo Premium",
    description: "Cadre photo en bois massif avec finition artisanale",
    price: 45.0,
    variations: [
      {
        id: 9981,
        productId: 998,
        variationType: "size",
        variationValue: "A4",
        price: null,
        stock: 10,
        images: [
          {
            url: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400",
            order: 0,
          },
        ],
      },
      {
        id: 9982,
        productId: 998,
        variationType: "size",
        variationValue: "A3",
        price: 65.0,
        stock: 7,
        images: [
          {
            url: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400",
            order: 0,
          },
        ],
      },
    ],
  },
  {
    id: 997,
    name: "Vase Céramique",
    description: "Vase artisanal en céramique émaillée, pièce unique",
    price: 85.0,
    variations: [
      {
        id: 9971,
        productId: 997,
        variationType: "color",
        variationValue: "Bleu Océan",
        price: null,
        stock: 1,
        images: [
          {
            url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
            order: 0,
          },
        ],
      },
      {
        id: 9972,
        productId: 997,
        variationType: "color",
        variationValue: "Vert Olive",
        price: 95.0,
        stock: 2,
        images: [
          {
            url: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400",
            order: 0,
          },
        ],
      },
    ],
  },
];

/**
 * Obtenir un produit de test par son ID de variation
 */
export function getTestProductByVariationId(
  variationId: number
): { product: ProductWithVariations; variation: any } | null {
  for (const product of testProducts) {
    const variation = product.variations?.find((v) => v.id === variationId);
    if (variation) {
      return { product, variation };
    }
  }
  return null;
}

/**
 * Obtenir le prix réel d'une variation (avec override ou prix de base)
 */
export function getVariationPrice(
  product: ProductWithVariations,
  variation: any
): number {
  return variation.price !== null ? variation.price : product.price;
}
