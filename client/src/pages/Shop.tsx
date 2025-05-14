import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { ProductWithVariations } from "@shared/schema";
import { Button } from "@/components/ui/button";

export default function Shop() {
  // Récupère tous les produits (pas seulement les lampes Focus)
  const { data: products = [] } = useQuery<ProductWithVariations[]>({
    queryKey: ["/api/products"],
  });

  // Suppression de la logique de catégories, on affiche tous les produits sans filtre
  return (
    <Layout>
      <div className="container mx-auto py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Boutique</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">
              Aucun produit trouvé.
            </div>
          ) : (
            products.flatMap((product) =>
              (product.variations || []).map((variation) => (
                <ProductCard
                  key={variation.id}
                  product={product}
                  variation={variation}
                />
              ))
            )
          )}
        </div>
      </div>
    </Layout>
  );
}
