import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import DashboardLayout from "./DashboardLayout";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BLOCK_LABELS,
  emptyBlock,
  type Phrase,
  type SiteBlock,
  type SiteBlockType,
  type SitePage,
} from "@/lib/sitePages";
import type { Media } from "@shared/schema";

const BLOCK_TYPES: SiteBlockType[] = [
  "heading",
  "paragraph",
  "list",
  "faq",
  "callout",
  "image",
];

/**
 * Gestion des pages annexes — Livraison, Retours, FAQ, Mentions légales,
 * Politique de confidentialité, CGV.
 *
 * Chaque page est une suite de blocs qu'on ajoute, déplace et supprime. Rien
 * n'est figé dans le code : la page publique affiche exactement ce qui est ici.
 */
export default function Pages() {
  const { toast } = useToast();
  const [slug, setSlug] = useState<string | null>(null);
  const [draft, setDraft] = useState<SitePage | null>(null);

  const { data: pages, isLoading } = useQuery<Record<string, SitePage>>({
    queryKey: ["/api/pages"],
  });

  const { data: medias = [] } = useQuery<Media[]>({ queryKey: ["/api/medias"] });

  const slugs = useMemo(() => Object.keys(pages ?? {}), [pages]);

  // À l'arrivée, on ouvre la première page ; ensuite on suit la sélection.
  useEffect(() => {
    if (!slug && slugs.length > 0) setSlug(slugs[0]);
  }, [slug, slugs]);

  useEffect(() => {
    if (slug && pages?.[slug]) {
      setDraft(structuredClone(pages[slug]));
    }
  }, [slug, pages]);

  const dirty = useMemo(() => {
    if (!draft || !slug || !pages?.[slug]) return false;
    return JSON.stringify(draft) !== JSON.stringify(pages[slug]);
  }, [draft, pages, slug]);

  const saveMutation = useMutation({
    mutationFn: (page: SitePage) =>
      apiRequest("PUT", `/api/pages/${page.slug}`, page),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pages"] });
      if (slug) {
        queryClient.invalidateQueries({ queryKey: [`/api/pages/${slug}`] });
      }
      toast({ title: "Page enregistrée" });
    },
    onError: () =>
      toast({
        title: "Erreur",
        description: "La page n'a pas pu être enregistrée",
        variant: "destructive",
      }),
  });

  const patchBlock = (id: string, patch: Partial<SiteBlock>) =>
    setDraft((d) =>
      d
        ? {
            ...d,
            blocks: d.blocks.map((b) =>
              b.id === id ? ({ ...b, ...patch } as SiteBlock) : b,
            ),
          }
        : d,
    );

  const moveBlock = (index: number, delta: number) =>
    setDraft((d) => {
      if (!d) return d;
      const target = index + delta;
      if (target < 0 || target >= d.blocks.length) return d;
      const blocks = [...d.blocks];
      [blocks[index], blocks[target]] = [blocks[target], blocks[index]];
      return { ...d, blocks };
    });

  const removeBlock = (id: string) =>
    setDraft((d) =>
      d ? { ...d, blocks: d.blocks.filter((b) => b.id !== id) } : d,
    );

  const addBlock = (type: SiteBlockType) =>
    setDraft((d) =>
      d ? { ...d, blocks: [...d.blocks, emptyBlock(type, d.slug)] } : d,
    );

  return (
    <DashboardLayout title="Pages du site">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Pages du site</h1>
          <p className="text-sm text-muted-foreground">
            Livraison, retours, FAQ et pages légales. Ajoutez, déplacez ou
            supprimez les blocs : la page publique suit à la lettre.
          </p>
        </div>

        {isLoading && (
          <p className="text-sm text-muted-foreground">Chargement…</p>
        )}

        <div className="flex flex-wrap gap-2">
          {slugs.map((s) => (
            <Button
              key={s}
              size="sm"
              variant={s === slug ? "default" : "outline"}
              onClick={() => setSlug(s)}
            >
              {pages?.[s]?.label ?? s}
            </Button>
          ))}
        </div>

        {draft && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-base">Titre de la page</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Le grand titre en haut de la page.
                  </p>
                </div>
                <a
                  href={draft.route}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 whitespace-nowrap text-sm text-muted-foreground hover:text-foreground"
                >
                  Voir la page <ExternalLink className="h-3 w-3" />
                </a>
              </CardHeader>
              <CardContent>
                <PhraseFields
                  value={draft.title}
                  onChange={(title) =>
                    setDraft((d) => (d ? { ...d, title } : d))
                  }
                />
              </CardContent>
            </Card>

            <div className="space-y-4">
              {draft.blocks.map((block, index) => (
                <Card key={block.id}>
                  <CardHeader className="flex flex-row items-center justify-between gap-2 py-3">
                    <CardTitle className="text-sm font-medium">
                      {BLOCK_LABELS[block.type]}
                      {block.type === "heading" && (
                        <select
                          className="ml-2 rounded border bg-background px-1 py-0.5 text-xs"
                          value={block.level}
                          onChange={(e) =>
                            patchBlock(block.id, {
                              level: Number(e.target.value) as 2 | 3,
                            } as Partial<SiteBlock>)
                          }
                        >
                          <option value={2}>Grand titre</option>
                          <option value={3}>Sous-titre</option>
                        </select>
                      )}
                    </CardTitle>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => moveBlock(index, -1)}
                        disabled={index === 0}
                        aria-label="Monter le bloc"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => moveBlock(index, 1)}
                        disabled={index === draft.blocks.length - 1}
                        aria-label="Descendre le bloc"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeBlock(block.id)}
                        aria-label="Supprimer le bloc"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <BlockFields
                      block={block}
                      medias={medias}
                      onChange={(patch) => patchBlock(block.id, patch)}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-dashed">
              <CardContent className="flex flex-wrap items-center gap-2 py-4">
                <span className="text-sm text-muted-foreground">
                  Ajouter un bloc :
                </span>
                {BLOCK_TYPES.map((type) => (
                  <Button
                    key={type}
                    variant="outline"
                    size="sm"
                    onClick={() => addBlock(type)}
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    {BLOCK_LABELS[type]}
                  </Button>
                ))}
              </CardContent>
            </Card>

            <div className="sticky bottom-4 flex justify-end">
              <Button
                onClick={() => saveMutation.mutate(draft)}
                disabled={!dirty || saveMutation.isPending}
                className="shadow-lg"
              >
                <Save className="mr-2 h-4 w-4" />
                {dirty ? "Enregistrer la page" : "Aucune modification"}
              </Button>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

/** Couple de champs français / anglais, le motif de toute la gestion. */
function PhraseFields({
  value,
  onChange,
  multiline,
  label,
}: {
  value: Phrase;
  onChange: (p: Phrase) => void;
  multiline?: boolean;
  label?: string;
}) {
  const Component = multiline ? Textarea : Input;
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {label && (
        <span className="text-sm font-medium md:col-span-2">{label}</span>
      )}
      <label className="text-xs text-muted-foreground">
        Français
        <Component
          className="mt-1"
          value={value.fr}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            onChange({ ...value, fr: e.target.value })
          }
        />
      </label>
      <label className="text-xs text-muted-foreground">
        Anglais <span className="opacity-70">— vide : le français s'affiche</span>
        <Component
          className="mt-1"
          value={value.en}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            onChange({ ...value, en: e.target.value })
          }
        />
      </label>
    </div>
  );
}

function BlockFields({
  block,
  medias,
  onChange,
}: {
  block: SiteBlock;
  medias: Media[];
  onChange: (patch: Partial<SiteBlock>) => void;
}) {
  switch (block.type) {
    case "heading":
      return (
        <PhraseFields
          value={block.text}
          onChange={(text) => onChange({ text } as Partial<SiteBlock>)}
        />
      );

    case "paragraph":
    case "callout":
      return (
        <PhraseFields
          multiline
          value={block.text}
          onChange={(text) => onChange({ text } as Partial<SiteBlock>)}
        />
      );

    case "list":
      return (
        <ItemList
          items={block.items}
          onChange={(items) => onChange({ items } as Partial<SiteBlock>)}
          empty={{ fr: "", en: "" }}
          addLabel="Ajouter une puce"
          render={(item, set) => (
            <PhraseFields value={item} onChange={set} />
          )}
        />
      );

    case "faq":
      return (
        <ItemList
          items={block.items}
          onChange={(items) => onChange({ items } as Partial<SiteBlock>)}
          empty={{ question: { fr: "", en: "" }, answer: { fr: "", en: "" } }}
          addLabel="Ajouter une question"
          render={(item, set) => (
            <div className="space-y-3">
              <PhraseFields
                label="Question"
                value={item.question}
                onChange={(question) => set({ ...item, question })}
              />
              <PhraseFields
                label="Réponse"
                multiline
                value={item.answer}
                onChange={(answer) => set({ ...item, answer })}
              />
            </div>
          )}
        />
      );

    case "image":
      return (
        <div className="space-y-3">
          <label className="block text-xs text-muted-foreground">
            Image (téléversée dans Médias)
            <select
              className="mt-1 w-full rounded border bg-background p-2 text-sm"
              value={block.src}
              onChange={(e) =>
                onChange({ src: e.target.value } as Partial<SiteBlock>)
              }
            >
              <option value="">—</option>
              {medias
                .filter((m) => m.type === "image")
                .map((m) => (
                  <option key={m.id} value={m.path}>
                    {m.filename}
                  </option>
                ))}
            </select>
          </label>
          {block.src && (
            <img
              src={block.src}
              alt=""
              className="max-h-40 rounded border object-contain"
            />
          )}
          <PhraseFields
            label="Description de l'image (pour les lecteurs d'écran)"
            value={block.alt}
            onChange={(alt) => onChange({ alt } as Partial<SiteBlock>)}
          />
        </div>
      );

    default:
      return null;
  }
}

/** Liste d'éléments répétables (puces, questions/réponses). */
function ItemList<T>({
  items,
  onChange,
  empty,
  addLabel,
  render,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  empty: T;
  addLabel: string;
  render: (item: T, set: (next: T) => void) => React.ReactNode;
}) {
  const setAt = (index: number, next: T) =>
    onChange(items.map((it, i) => (i === index ? next : it)));

  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={index}
          className="flex items-start gap-2 rounded-lg bg-muted/40 p-3"
        >
          <div className="flex-1">{render(item, (next) => setAt(index, next))}</div>
          <div className="flex flex-col gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => move(index, -1)}
              disabled={index === 0}
              aria-label="Monter"
            >
              <ArrowUp className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => move(index, 1)}
              disabled={index === items.length - 1}
              aria-label="Descendre"
            >
              <ArrowDown className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
              aria-label="Supprimer"
            >
              <Trash2 className="h-3 w-3 text-destructive" />
            </Button>
          </div>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onChange([...items, structuredClone(empty)])}
      >
        <Plus className="mr-1 h-3 w-3" />
        {addLabel}
      </Button>
    </div>
  );
}
