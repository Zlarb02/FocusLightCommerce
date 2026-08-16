import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AlertTriangle, Check, Save, Upload } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { SILHOUETTES, type SilhouetteAsset } from "@/lib/silhouettes";
import type { Media } from "@shared/schema";

interface Silhouette {
  cream: string;
  brown: string;
}

interface ProductContent {
  silhouette?: Silhouette;
}

interface SilhouettePickerProps {
  productId: number;
}

/**
 * Choix de la silhouette affichée dans le bandeau « Caractéristique » de la
 * fiche produit.
 *
 * Deux sources : les silhouettes livrées avec le site (dessins d'Anatole, déjà
 * aux bonnes couleurs) et n'importe quelle image téléversée depuis Médias — de
 * quoi remplacer une silhouette sans passer par le code.
 */
export function SilhouettePicker({ productId }: SilhouettePickerProps) {
  const { toast } = useToast();
  const [customCream, setCustomCream] = useState("");
  const [customBrown, setCustomBrown] = useState("");

  const { data: content } = useQuery<ProductContent>({
    queryKey: [`/api/products/${productId}/content`],
    enabled: productId > 0,
  });

  const { data: medias = [] } = useQuery<Media[]>({
    queryKey: ["/api/medias"],
  });

  const imageMedias = useMemo(
    () => medias.filter((m) => m.type === "image"),
    [medias],
  );

  const current = content?.silhouette;

  /** Silhouette livrée correspondant au réglage actuel, s'il y en a une. */
  const currentAsset = useMemo(
    () =>
      SILHOUETTES.find(
        (s) => s.cream === current?.cream && s.brown === current?.brown,
      ),
    [current],
  );

  const saveMutation = useMutation({
    mutationFn: (silhouette: Silhouette | null) =>
      apiRequest(
        "PUT",
        `/api/products/${productId}/content/silhouette`,
        silhouette ?? { silhouette: null },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/api/products/${productId}/content`],
      });
      toast({ title: "Silhouette enregistrée" });
    },
    onError: () =>
      toast({
        title: "Erreur",
        description: "La silhouette n'a pas pu être enregistrée",
        variant: "destructive",
      }),
  });

  const select = (asset: SilhouetteAsset) =>
    saveMutation.mutate({ cream: asset.cream, brown: asset.brown });

  const saveCustom = () => {
    if (!customCream || !customBrown) {
      toast({
        title: "Il manque une image",
        description:
          "Une silhouette a besoin des deux versions : claire pour le fond brun, foncée pour le fond crème.",
        variant: "destructive",
      });
      return;
    }
    saveMutation.mutate({ cream: customCream, brown: customBrown });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Silhouette du produit</CardTitle>
        <p className="text-sm text-muted-foreground">
          Le dessin affiché à côté du texte « Caractéristique ». Il en faut deux
          versions : une claire, posée sur le bandeau brun, et une foncée pour le
          thème sombre.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {SILHOUETTES.map((asset) => {
            const selected = currentAsset?.id === asset.id;
            return (
              <button
                key={asset.id}
                type="button"
                onClick={() => select(asset)}
                disabled={saveMutation.isPending}
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
                  className="flex h-24 items-center justify-center rounded"
                  style={{ backgroundColor: "#4A2020" }}
                >
                  <img
                    src={asset.cream}
                    alt=""
                    className="max-h-20 max-w-full object-contain"
                  />
                </div>
                <p className="mt-2 text-xs font-medium">{asset.label}</p>
                {asset.warning && (
                  <p className="mt-1 flex gap-1 text-[11px] leading-tight text-amber-600 dark:text-amber-500">
                    <AlertTriangle className="mt-px h-3 w-3 shrink-0" />
                    <span>{asset.warning}</span>
                  </p>
                )}
              </button>
            );
          })}
        </div>

        <div className="space-y-3 rounded-lg bg-muted/40 p-3">
          <div className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            <h4 className="text-sm font-medium">
              Ou une image téléversée dans Médias
            </h4>
          </div>
          <p className="text-xs text-muted-foreground">
            Téléversez d'abord les deux versions dans Médias, puis choisissez-les
            ici. Un PNG à fond transparent donne le meilleur résultat.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs">
              Version claire (sur fond brun)
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
              Version foncée (sur fond crème)
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
          <div className="flex flex-wrap justify-end gap-2">
            {current && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => saveMutation.mutate(null)}
                disabled={saveMutation.isPending}
              >
                Revenir à la silhouette par défaut
              </Button>
            )}
            <Button
              size="sm"
              onClick={saveCustom}
              disabled={saveMutation.isPending}
            >
              <Save className="mr-2 h-4 w-4" />
              Utiliser ces images
            </Button>
          </div>
        </div>

        {current && !currentAsset && (
          <p className="text-xs text-muted-foreground">
            Silhouette personnalisée : {current.cream} / {current.brown}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
