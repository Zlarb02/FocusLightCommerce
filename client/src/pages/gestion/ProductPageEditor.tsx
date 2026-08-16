import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Sparkles } from "lucide-react";

/**
 * Éditeur de page produit détaillée.
 *
 * Chaque texte de la page produit (ProductDetail) est résolu via la clé
 * `product.<id>.<suffixe>` qui, si absente, retombe sur la clé générique
 * `focus.<suffixe>` (textes historiques de FOCUS.01). Cet éditeur écrit ces
 * clés par produit via l'API traductions : tout produit peut ainsi avoir une
 * page aussi aboutie que FOCUS.01, sans toucher au code.
 */

interface FieldDef {
  suffix: string;
  label: string;
  multiline?: boolean;
}

interface FieldGroup {
  title: string;
  description: string;
  fields: FieldDef[];
}

const FIELD_GROUPS: FieldGroup[] = [
  {
    title: "Bandeau d'icônes (section « features »)",
    description: "Les trois points forts affichés sous la description du produit.",
    fields: [
      { suffix: "features.eco", label: "Point fort 1 (feuille)" },
      { suffix: "features.wood", label: "Point fort 2 (arbre)" },
      { suffix: "features.led", label: "Point fort 3 (ampoule)" },
    ],
  },
  {
    title: "Caractéristiques (section « details »)",
    description: "Les trois cartes de la grande section Caractéristiques.",
    fields: [
      { suffix: "sustainableMaterials", label: "Carte 1 — titre" },
      { suffix: "sustainableMaterials.text", label: "Carte 1 — texte", multiline: true },
      { suffix: "lighting.title", label: "Carte 2 — titre" },
      { suffix: "lighting.text", label: "Carte 2 — texte", multiline: true },
      { suffix: "artisanalCrafting", label: "Carte 3 — titre" },
      { suffix: "artisanalCrafting.text", label: "Carte 3 — texte", multiline: true },
    ],
  },
  {
    title: "Spécifications",
    description: "La liste à puces à droite de la photo d'ambiance.",
    fields: [
      { suffix: "dimensions.text", label: "Dimensions", multiline: true },
      { suffix: "materials.text", label: "Matériaux", multiline: true },
      { suffix: "lighting.label", label: "Éclairage — libellé" },
      { suffix: "lighting.details", label: "Éclairage — détails", multiline: true },
    ],
  },
  {
    title: "Divers",
    description: "Autres textes de la page.",
    fields: [
      { suffix: "colorSelection", label: "Introduction de la grille des coloris", multiline: true },
    ],
  },
];

// Sections par défaut d'une page produit complète (mêmes ids que ProductDetail)
const DEFAULT_SECTIONS = [
  { id: "features", type: "features" as const, enabled: true },
  { id: "details", type: "details" as const, enabled: true },
  { id: "testimonials", type: "elfsight" as const, enabled: false },
];

interface ProductPageEditorProps {
  productId: number;
  hasSections: boolean;
}

type FullTranslations = { fr: Record<string, string>; en: Record<string, string> };

export function ProductPageEditor({ productId, hasSections }: ProductPageEditorProps) {
  const { toast } = useToast();

  const { data: fullTranslations, isLoading } = useQuery<FullTranslations>({
    queryKey: ["/api/translations/full"],
  });

  // Brouillon local : { "fr:<suffixe>": valeur, "en:<suffixe>": valeur }
  const [draft, setDraft] = useState<Record<string, string>>({});

  const keyOf = (suffix: string) => `product.${productId}.${suffix}`;

  const initialValues = useMemo(() => {
    const values: Record<string, string> = {};
    if (!fullTranslations) return values;
    for (const group of FIELD_GROUPS) {
      for (const field of group.fields) {
        values[`fr:${field.suffix}`] = fullTranslations.fr?.[keyOf(field.suffix)] ?? "";
        values[`en:${field.suffix}`] = fullTranslations.en?.[keyOf(field.suffix)] ?? "";
      }
    }
    return values;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullTranslations, productId]);

  useEffect(() => {
    setDraft(initialValues);
  }, [initialValues]);

  const fallbackOf = (lang: "fr" | "en", suffix: string) =>
    fullTranslations?.[lang]?.[`focus.${suffix}`] ?? "";

  const dirty = useMemo(
    () =>
      Object.keys(draft).some((k) => (draft[k] ?? "") !== (initialValues[k] ?? "")),
    [draft, initialValues]
  );

  const saveMutation = useMutation({
    mutationFn: async () => {
      const updates: Array<{ key: string; value: string; language: "fr" | "en" }> = [];
      const deletions: string[] = [];

      for (const group of FIELD_GROUPS) {
        for (const field of group.fields) {
          const key = keyOf(field.suffix);
          const fr = (draft[`fr:${field.suffix}`] ?? "").trim();
          const en = (draft[`en:${field.suffix}`] ?? "").trim();
          const hadValue =
            (initialValues[`fr:${field.suffix}`] ?? "") !== "" ||
            (initialValues[`en:${field.suffix}`] ?? "") !== "";

          if (fr === "" && en === "") {
            // Champ vidé → retour au texte générique (suppression de la clé)
            if (hadValue) deletions.push(key);
            continue;
          }
          updates.push({ key, value: fr, language: "fr" });
          // Sans traduction anglaise, le front retombe sur le français
          if (en !== "") updates.push({ key, value: en, language: "en" });
        }
      }

      if (updates.length > 0) {
        await apiRequest("PUT", "/api/translations/bulk", updates);
      }
      for (const key of deletions) {
        await apiRequest("DELETE", `/api/translations/${encodeURIComponent(key)}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/translations/full"] });
      queryClient.invalidateQueries({ queryKey: ["/api/translations/public"] });
      window.dispatchEvent(new CustomEvent("translationsUpdated"));
      toast({ title: "Succès", description: "Textes de la page produit enregistrés" });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'enregistrement des textes",
        variant: "destructive",
      });
    },
  });

  const createSectionsMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("PUT", `/api/products/${productId}/content`, {
        sections: DEFAULT_SECTIONS,
        images: {},
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/api/products/${productId}/content`],
      });
      toast({
        title: "Succès",
        description: "Sections par défaut créées pour ce produit",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la création des sections",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!hasSections && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-3 py-6 text-center">
            <p className="text-sm text-muted-foreground max-w-md">
              Ce produit n'a pas encore de page détaillée. Créez les sections
              par défaut (points forts, caractéristiques, avis) puis
              personnalisez les textes ci-dessous.
            </p>
            <Button
              onClick={() => createSectionsMutation.mutate()}
              disabled={createSectionsMutation.isPending}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Créer la page détaillée
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Textes de la page produit</CardTitle>
          <p className="text-sm text-muted-foreground">
            Laissez un champ vide pour garder le texte générique (affiché en
            grisé). La version anglaise est optionnelle : à défaut, le texte
            français est utilisé.
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          {FIELD_GROUPS.map((group) => (
            <div key={group.title} className="space-y-4">
              <div>
                <h4 className="font-medium">{group.title}</h4>
                <p className="text-sm text-muted-foreground">{group.description}</p>
              </div>
              <div className="space-y-4">
                {group.fields.map((field) => {
                  const frKey = `fr:${field.suffix}`;
                  const enKey = `en:${field.suffix}`;
                  const Component = field.multiline ? Textarea : Input;
                  return (
                    <div
                      key={field.suffix}
                      className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-muted/40 rounded-lg"
                    >
                      <div className="md:col-span-2 flex items-baseline justify-between gap-2">
                        <label className="text-sm font-medium">{field.label}</label>
                        <code className="text-xs text-muted-foreground">
                          product.{productId}.{field.suffix}
                        </code>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Français</span>
                        <Component
                          value={draft[frKey] ?? ""}
                          placeholder={fallbackOf("fr", field.suffix)}
                          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                            setDraft((prev) => ({ ...prev, [frKey]: e.target.value }))
                          }
                        />
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Anglais</span>
                        <Component
                          value={draft[enKey] ?? ""}
                          placeholder={fallbackOf("en", field.suffix)}
                          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                            setDraft((prev) => ({ ...prev, [enKey]: e.target.value }))
                          }
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="flex justify-end">
            <Button
              onClick={() => saveMutation.mutate()}
              disabled={!dirty || saveMutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              Enregistrer les textes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
