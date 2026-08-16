/**
 * Silhouettes produits fournies par Anatole (Drive « 5x », 16/08/2026).
 *
 * Chaque silhouette existe en deux coloris : `cream` se pose sur un fond brun
 * (thème clair, bandeau « Caractéristique ») et `brown` sur un fond crème
 * (thème sombre). Les deux fichiers sont transparents et aux couleurs exactes
 * de la palette (`#FEF7E8` / `#4A2020`).
 *
 * Ce catalogue sert à alimenter le sélecteur de la gestion : Anatole choisit
 * une silhouette par produit sans avoir à connaître les chemins de fichiers, et
 * peut toujours en téléverser une autre depuis Médias.
 */
export interface SilhouetteAsset {
  /** Identifiant stable, aussi le préfixe des fichiers. */
  id: string;
  /** Nom affiché dans la gestion. */
  label: string;
  cream: string;
  brown: string;
  /** Renseigné quand la silhouette a un défaut connu, affiché en gestion. */
  warning?: string;
}

const base = "/images/alto/silhouettes";

const asset = (
  id: string,
  label: string,
  warning?: string,
): SilhouetteAsset => ({
  id,
  label,
  cream: `${base}/${id}-cream.png`,
  brown: `${base}/${id}-brown.png`,
  ...(warning ? { warning } : {}),
});

export const SILHOUETTES: SilhouetteAsset[] = [
  asset("auferte", "Auferte.01"),
  asset(
    "applique-focus",
    "Applique Focus.01",
    "Le câble est dessiné dans la couleur du fond : il n'apparaît pas. Silhouette lisible malgré tout.",
  ),
  asset("lampadaire-focus", "Lampadaire Focus.01"),
  asset("caligo", "Caligo.01"),
  asset("deposit", "Deposit.01"),
  asset("aurora", "Aurora.01 — abat-jour seul"),
  asset("aurora-lampe", "Aurora sur lampe de table"),
  asset(
    "aurora-lampadaire",
    "Aurora sur lampadaire",
    "La version brune a son câble exporté en aplat : à ne poser que sur fond crème, ou à redemander à Anatole.",
  ),
  {
    id: "focus",
    label: "Focus.01",
    cream: "/images/alto/silhouette-focus-cream.png",
    brown: "/images/alto/silhouette-focus-brown.png",
    warning:
      "Ancien fichier : basse définition et fond brun incrusté (pas de transparence). À remplacer quand Anatole l'aura redessiné.",
  },
];

export function findSilhouette(id: string): SilhouetteAsset | undefined {
  return SILHOUETTES.find((s) => s.id === id);
}
