import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fallbackProductColors,
  resolveProductColor,
  type ProductColorMap,
  type ResolvedProductColor,
} from "@/lib/productColors";

/** Registre complet des couleurs (API, ou repli embarqué tant qu'elle se tait). */
export function useProductColors(): ProductColorMap {
  const { data } = useQuery<ProductColorMap>({
    queryKey: ["/api/product-colors"],
    staleTime: 5 * 60 * 1000,
  });
  // `??` et non un merge : une couleur supprimée en gestion doit disparaître.
  return data ?? fallbackProductColors;
}

/**
 * Équivalent React de l'ancien `getColorInfo` : la pastille suit désormais ce
 * qu'Anatole a enregistré, et le composant se redessine quand l'API répond.
 */
export function useColorInfo(): (name: string) => ResolvedProductColor {
  const colors = useProductColors();
  return useCallback(
    (name: string) => resolveProductColor(colors, name),
    [colors]
  );
}
