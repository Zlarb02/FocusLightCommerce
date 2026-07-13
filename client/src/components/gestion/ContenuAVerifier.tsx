import { AlertTriangle } from "lucide-react";
import { Link } from "wouter";

/**
 * Les pages Livraison, Retours, FAQ, CGV, Mentions légales et Politique de
 * confidentialité ont été livrées avec des textes de REMPLISSAGE (délais,
 * transporteurs, garanties, mentions juridiques). Ils passent tous par des clés
 * de traduction, donc ils sont éditables — encore faut-il savoir qu'ils sont à
 * remplacer, d'où cet avertissement.
 *
 * À supprimer quand Anatole aura validé ces pages.
 */
const PREFIXES: { label: string; prefixe: string }[] = [
  { label: "Livraison (délais, zones, transporteurs)", prefixe: "livraison." },
  { label: "Retours et remboursements", prefixe: "retours." },
  { label: "Questions fréquentes", prefixe: "faq." },
  { label: "Conditions générales de vente", prefixe: "cgv." },
  { label: "Mentions légales", prefixe: "mentions." },
  { label: "Politique de confidentialité", prefixe: "confidentialite." },
];

export function ContenuAVerifier({ compact = false }: { compact?: boolean }) {
  return (
    <div className="mb-6 rounded-lg border-l-4 border-amber-500 bg-amber-50 p-4 dark:bg-amber-950/30">
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        <div className="space-y-2">
          <p className="font-semibold text-amber-900 dark:text-amber-200">
            À vérifier : les informations de livraison et les pages légales sont
            des textes de remplissage
          </p>
          <p className="text-sm text-amber-900/80 dark:text-amber-200/80">
            Les délais, les transporteurs, les conditions de retour et les
            mentions juridiques ont été écrits pour remplir la page — ils ne
            décrivent pas forcément votre fonctionnement réel, et les mentions
            légales vous engagent. Remplacez-les par vos vraies informations.
          </p>

          {!compact && (
            <ul className="mt-2 space-y-1 text-sm text-amber-900/80 dark:text-amber-200/80">
              {PREFIXES.map((p) => (
                <li key={p.prefixe}>
                  • {p.label} — cherchez{" "}
                  <code className="rounded bg-amber-500/15 px-1 py-0.5 font-mono">
                    {p.prefixe}
                  </code>
                </li>
              ))}
            </ul>
          )}

          <Link
            href="/gestion/contenu"
            className="inline-block pt-1 text-sm font-semibold text-amber-900 underline dark:text-amber-200"
          >
            Modifier ces textes dans Traductions →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ContenuAVerifier;
