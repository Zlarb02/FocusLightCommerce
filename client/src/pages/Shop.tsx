import { useEffect, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { ProductWithVariations } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Shop() {
  // Récupère tous les produits (pas seulement les lampes Focus)
  const { data: products = [] } = useQuery<ProductWithVariations[]>({
    queryKey: ["/api/products"],
  });

  const [searchTerm, setSearchTerm] = useState("");

  // Filtrer les produits selon la recherche
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Filtre par recherche
      return (
        searchTerm === "" ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [products, searchTerm]);

  return (
    <Layout>
      <div className="container mx-auto py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Boutique Générale</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez notre collection complète de produits design et
            éco-responsables.
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="relative max-w-md mx-auto mb-8">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>

        {/* Affichage des produits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-12">
              {searchTerm
                ? "Aucun produit ne correspond à votre recherche."
                : "Aucun produit disponible."}
            </div>
          ) : (
            filteredProducts.flatMap((product) =>
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
