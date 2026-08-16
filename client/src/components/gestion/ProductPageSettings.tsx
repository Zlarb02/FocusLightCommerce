import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AlertTriangle, Check, ExternalLink, Save, X } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { SILHOUETTES, type SilhouetteAsset } from "@/lib/silhouettes";
import type { Media } from "@shared/schema";

interface Silhouette {
  cream: string;
  brown: string;
}

interface Section {
  id: string;
  type: string;
  enabled: boolean;
  [key: string]: unknown;
}

interface ProductContent {
  sections: Section[];
  images?: Record<string, string>;
  silhouette?: Silhouette;
}

/** Les sections que la fiche produit sait afficher, dans l'ordre de la page. */
const SECTIONS: Array<{ id: string; type: string; label: string; help: string }> =
  [
    {
      id: "features",
      type: "features",
      label: "Points forts",
      help: "La bande de trois pictogrammes sous la photo.",
    },
    {
      id: "details",
      type: "details",
      label: "Caractéristique",
      help: "Le grand bandeau brun — c'est lui qui porte la silhouette.",
    },
    {
      id: "specs",
      type: "specifications",
      label: "Fiche technique",
      help: "Dimensions, matériaux, éclairage.",
    },
    {
      id: "testimonials",
      type: "elfsight",
      label: "Avis clients",
      help: "Le widget d'avis en bas de page.",
    },
  ];

/**
 * Réglages de la page d'un produit : quelles sections s'affichent, et quelle
 * silhouette accompagne le bandeau « Caractéristique ».
 *
 * Les deux vont ensemble — une silhouette choisie sans la section
 * « Caractéristique » ne s'affiche nulle part —, d'où le fait de les régler au
 * même endroit plutôt que dans deux écrans différents.
 */
export function ProductPageSettings({ productId }: { productId: number }) {
  const { toast } = useToast();
  const [customCream, setCustomCream] = useState("");
  const [customBrown, setCustomBrown] = useState("");

  const { data: content, isLoading } = useQuery<ProductContent>({
    queryKey: [`/api/products/${productId}/content`],
    enabled: productId > 0,
  });

  const { data: medias = [] } = useQuery<Media[]>({ queryKey: ["/api/medias"] });
  const imageMedias = useMemo(
    () => medias.filter((m) => m.type === "image"),
    [medias],
  );

  const current = content?.silhouette;
  const currentAsset = useMemo(
    () =>
      SILHOUETTES.find(
        (s) => s.cream === current?.cream && s.brown === current?.brown,
      ),
    [current],
  );

  const detailsOn =
    content?.sections?.find((s) => s.id === "details")?.enabled ?? false;

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: [`/api/products/${productId}/content`],
    });

  const silhouetteMutation = useMutation({
    mutationFn: (silhouette: Silhouette | null) =>
      apiRequest(
        "PUT",
        `/api/products/${productId}/content/silhouette`,
        silhouette ?? { silhouette: null },
      ),
    onSuccess: () => {
      invalidate();
      toast({ title: "Silhouette enregistrée" });
    },
    onError: () =>
      toast({
        title: "Erreur",
        description: "La silhouette n'a pas pu être enregistrée",
        variant: "destructive",
      }),
  });

  // Le contenu produit se met à jour en bloc : on renvoie donc la liste des
  // sections complète, en repartant de celle du serveur.
  const sectionsMutation = useMutation({
    mutationFn: (sections: Section[]) =>
      apiRequest("PUT", `/api/products/${productId}/content`, {
        sections,
        images: content?.images ?? {},
        ...(content?.silhouette ? { silhouette: content.silhouette } : {}),
      }),
    onSuccess: () => invalidate(),
    onError: () =>
      toast({
        title: "Erreur",
        description: "La section n'a pas pu être modifiée",
        variant: "destructive",
      }),
  });

  const toggleSection = (id: string, type: string, enabled: boolean) => {
    const existing = content?.sections ?? [];
    const next = existing.some((s) => s.id === id)
      ? existing.map((s) => (s.id === id ? { ...s, enabled } : s))
      : [...existing, { id, type, enabled }];
    sectionsMutation.mutate(next);
  };

  if (isLoading) {
    return (
      <p className="py-4 text-sm text-muted-foreground">Chargement des réglages…</p>
    );
  }

  return (
    <div className="space-y-6 border-t pt-4">
      <section className="space-y-3">
        <div>
          <h4 className="text-sm font-semibold">Sections de la page produit</h4>
          <p className="text-xs text-muted-foreground">
            Ce qui s'affiche sur la fiche, dans l'ordre de la page.
          </p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {SECTIONS.map((section) => {
            const enabled =
              content?.sections?.find((s) => s.id === section.id)?.enabled ??
              false;
            return (
              <label
                key={section.id}
                className="flex items-start gap-3 rounded-lg bg-muted/40 p-3"
              >
                <Switch
                  checked={enabled}
                  disabled={sectionsMutation.isPending}
                  onCheckedChange={(v) =>
                    toggleSection(section.id, section.type, v)
                  }
                />
                <span className="min-w-0">
                  <span className="block text-sm font-medium">
                    {section.label}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {section.help}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <h4 className="text-sm font-semibold">Silhouette du produit</h4>
          <p className="text-xs text-muted-foreground">
            Le dessin posé à côté du texte « Caractéristique ». Sans silhouette,
            le texte prend simplement toute la largeur.
          </p>
        </div>

        {!detailsOn && (
          <p className="flex items-start gap-2 rounded-lg bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-500">
            <AlertTriangle className="mt-px h-3.5 w-3.5 shrink-0" />
            <span>
              La section « Caractéristique » est désactivée : la silhouette
              choisie ici ne s'affichera pas tant qu'elle reste éteinte.
            </span>
          </p>
        )}

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          <button
            type="button"
            onClick={() => silhouetteMutation.mutate(null)}
            disabled={silhouetteMutation.isPending}
            className={`flex h-[132px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-2 text-xs transition ${
              current
                ? "border-border text-muted-foreground hover:border-primary/50"
                : "border-primary text-foreground ring-2 ring-primary/30"
            }`}
          >
            <X className="h-5 w-5" />
            Aucune
          </button>

          {SILHOUETTES.map((asset: SilhouetteAsset) => {
            const selected = currentAsset?.id === asset.id;
            return (
              <button
                key={asset.id}
                type="button"
                onClick={() =>
                  silhouetteMutation.mutate({
                    cream: asset.cream,
                    brown: asset.brown,
                  })
                }
                disabled={silhouetteMutation.isPending}
                className={`relative rounded-lg border p-2 text-left transition ${
                  selected
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {selected && (
                  <span className="absolute right-2 top-2 rounded-full bg-primary p-1 text-primary-foreground">
                    <Check className="h-3 w-3" />
                  </span>
                )}
                <div
                  className="flex h-20 items-center justify-center rounded"
                  style={{ backgroundColor: "#4A2020" }}
                >
                  <img
                    src={asset.cream}
                    alt=""
                    className="max-h-16 max-w-full object-contain"
                  />
                </div>
                <p className="mt-1.5 text-[11px] font-medium leading-tight">
                  {asset.label}
                </p>
                {asset.warning && (
                  <p className="mt-1 flex gap-1 text-[10px] leading-tight text-amber-600 dark:text-amber-500">
                    <AlertTriangle className="mt-px h-2.5 w-2.5 shrink-0" />
                    <span>{asset.warning}</span>
                  </p>
                )}
              </button>
            );
          })}
        </div>

        <details className="rounded-lg bg-muted/40 p-3">
          <summary className="cursor-pointer text-xs font-medium">
            Utiliser une image téléversée dans Médias
          </summary>
          <p className="mt-2 text-xs text-muted-foreground">
            Il en faut deux : une claire pour le bandeau brun, une foncée pour le
            thème sombre. Un PNG à fond transparent donne le meilleur résultat.
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="text-xs">
              Version claire
              <select
                className="mt-1 w-full rounded border bg-background p-2 text-sm"
                value={customCream}
                onChange={(e) => setCustomCream(e.target.value)}
              >
                <option value="">—</option>
                {imageMedias.map((m) => (
                  <option key={m.id} value={m.path}>
                    {m.filename}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs">
              Version foncée
              <select
                className="mt-1 w-full rounded border bg-background p-2 text-sm"
                value={customBrown}
                onChange={(e) => setCustomBrown(e.target.value)}
              >
                <option value="">—</option>
                {imageMedias.map((m) => (
                  <option key={m.id} value={m.path}>
                    {m.filename}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="mt-3 flex justify-end">
            <Button
              size="sm"
              disabled={
                !customCream || !customBrown || silhouetteMutation.isPending
              }
              onClick={() =>
                silhouetteMutation.mutate({
                  cream: customCream,
                  brown: customBrown,
                })
              }
            >
              <Save className="mr-2 h-4 w-4" />
              Utiliser ces images
            </Button>
          </div>
        </details>

        {current && !currentAsset && (
          <p className="text-xs text-muted-foreground">
            Silhouette personnalisée : {current.cream} / {current.brown}
          </p>
        )}
      </section>

      <p className="text-xs text-muted-foreground">
        Les textes de ces sections se modifient dans{" "}
        <a href="/gestion/contenu" className="underline">
          Contenu du site
        </a>
        <ExternalLink className="ml-1 inline h-3 w-3" />
      </p>
    </div>
  );
}
