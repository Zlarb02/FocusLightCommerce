/**
 * Taille maximale, en vw, qu'un titre de hero peut prendre sans sortir de son
 * cadre — le garde-fou des pages Fabrication et Sur-mesure.
 *
 * Le cadre fait 94 vw (`px-[3%]` de chaque côté) et une capitale de Geist Bold
 * en fait au plus 0,672 em de large, tracking `--ls-tight` (-0.025em) compris.
 * Mesuré sur les quatre titres du site, avec les métriques du fichier de police :
 * MESURE 0,672 · BESPOKE 0,654 · CRAFTSMANSHIP 0,654 · FABRICATION 0,608.
 * On retient 0,72 : 7 % de marge, de quoi encaisser la police de secours pendant
 * le chargement de Geist et une future traduction un peu plus large.
 *
 * On raisonne sur le MOT le plus long, pas sur la chaîne entière : « Sur-mesure »
 * revient à la ligne après le trait d'union, c'est donc « MESURE » qui contraint,
 * pas les dix lettres.
 *
 * Sans ce plafond, aux tailles de la maquette : « MESURE » sortait de 4 vw en
 * français, et l'anglais débordait franchement (« BESPOKE » 110 vw pour 94,
 * « CRAFTSMANSHIP » 110 vw pour 94, y compris en desktop).
 */
export function heroTitleFitVw(title: string): number {
  const longestWord = Math.max(
    1,
    ...title.split(/[\s-]+/).map((word) => word.length),
  );
  return 94 / (0.72 * longestWord);
}
