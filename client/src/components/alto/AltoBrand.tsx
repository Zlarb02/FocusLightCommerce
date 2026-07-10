/**
 * Éléments d'identité Alto Lille (maquette RARE.design).
 * Le monogramme est un carré plein percé d'un cercle (fill-rule evenodd),
 * il hérite de currentColor pour s'adapter à tous les fonds.
 */

interface AltoMarkProps {
  className?: string;
  title?: string;
}

export function AltoMark({ className = "h-9 w-9", title }: AltoMarkProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label={title ?? "Alto Lille"}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M0 0h100v100H0V0zm50 1.5A48.5 48.5 0 1 0 50 98.5 48.5 48.5 0 0 0 50 1.5z"
      />
    </svg>
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
