/**
 * Éléments d'identité Alto Lille (maquette RARE.design).
 *
 * Le monogramme n'est PAS redessiné : ce sont les fichiers livrés par le
 * designer, extraits de la maquette XD (Fichier 10/11/13/19 V1.png). Chaque
 * couleur est une déclinaison officielle distincte — ne jamais recolorier ni
 * recréer la forme.
 */

type AltoMarkColor = "cream" | "orange" | "blue" | "brown";

interface AltoMarkProps {
  /** cream = fonds bruns/bleus · orange = fonds crème · blue = pastilles · brown */
  color?: AltoMarkColor;
  className?: string;
  title?: string;
}

export function AltoMark({
  color = "orange",
  className = "h-9 w-9",
  title,
}: AltoMarkProps) {
  return (
    <img
      src={`/images/alto/mark-alto-${color}.png`}
      alt={title ?? "Alto Lille"}
      className={className}
    />
  );
}

interface AltoLogotypeProps {
  /** cream = crème (fonds bruns/bleus), orange = accent (fonds clairs) */
  color?: "cream" | "orange";
  className?: string;
  alt?: string;
}

export function AltoLogotype({
  color = "cream",
  className = "",
  alt = "ALTO Lille",
}: AltoLogotypeProps) {
  return (
    <img
      src={`/images/alto/logotype-${color}.png`}
      alt={alt}
      className={className}
      loading="lazy"
    />
  );
}
