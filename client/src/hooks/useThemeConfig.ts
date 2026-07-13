import { useQuery } from "@tanstack/react-query";

/**
 * Réglages d'apparence pilotés depuis /gestion → Apparence.
 * Voir server/routes/themeRoutes.ts pour ce que chaque option change.
 */
export type ThemeConfig = {
  /** Sombre neutre quasi noir au lieu du brun de la maquette. */
  trueDark: boolean;
  /** Footer brun sur Fabrication en desktop clair, comme web-11. */
  brownFooterOnFabrication: boolean;
};

export const THEME_CONFIG_DEFAULTS: ThemeConfig = {
  trueDark: false,
  brownFooterOnFabrication: true,
};

export function useThemeConfig() {
  const { data } = useQuery<ThemeConfig>({
    queryKey: ["/api/theme/config"],
    staleTime: 5 * 60 * 1000,
  });

  // Tant que la requête n'a pas répondu, on rend la maquette telle quelle.
  return data ?? THEME_CONFIG_DEFAULTS;
}
