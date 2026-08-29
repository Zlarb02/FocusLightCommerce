#!/usr/bin/env node
/**
 * Migrations ponctuelles des fichiers JSON de contenu.
 *
 * `/app/data` est un volume Docker : il recouvre le dossier `data/` de l'image,
 * donc un fichier déjà présent dans le volume ne bouge plus jamais, même si le
 * dépôt en livre une nouvelle version. Le `docker-entrypoint.sh` sait copier les
 * fichiers ABSENTS ; ce script s'occupe du cas inverse — compléter un fichier
 * qui existe déjà, sans écraser ce qu'Anatole y a saisi.
 *
 * Chaque migration ne tourne qu'une fois : son nom est enregistré dans
 * `data/.migrations.json`. Sans ça, une valeur effacée volontairement depuis la
 * gestion réapparaîtrait à chaque redémarrage du conteneur.
 */
import fs from "fs";
import path from "path";

const DATA = path.join(process.cwd(), "data");
const DEFAULTS = path.join(process.cwd(), "data-defaults");
const LEDGER = path.join(DATA, ".migrations.json");

function readJson(file, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJson(file, value) {
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + "\n", "utf8");
}

const done = new Set(readJson(LEDGER, []) ?? []);

/** Enregistre la migration `name` si elle n'a pas déjà tourné. */
function migrate(name, run) {
  if (done.has(name)) {
    console.log(`  ✓ ${name} déjà appliquée`);
    return;
  }
  try {
    const summary = run();
    done.add(name);
    writeJson(LEDGER, [...done]);
    console.log(`  → ${name} : ${summary}`);
  } catch (error) {
    console.error(`  ⚠️  ${name} a échoué :`, error.message);
  }
}

console.log("🔧 Migrations des fichiers de contenu...");

// Les silhouettes produits sont arrivées après la première mise en service :
// productContent.json existait donc déjà dans le volume, sans elles.
migrate("silhouettes-produits", () => {
  const livePath = path.join(DATA, "productContent.json");
  const defaults = readJson(path.join(DEFAULTS, "productContent.json"));
  const live = readJson(livePath);
  if (!defaults || !live) return "aucun fichier à compléter";

  let added = 0;
  for (const [productId, entry] of Object.entries(defaults)) {
    if (!entry?.silhouette) continue;
    const current = live[productId];
    if (!current) {
      live[productId] = entry;
      added += 1;
    } else if (!current.silhouette) {
      current.silhouette = entry.silhouette;
      added += 1;
    }
  }

  if (added > 0) writeJson(livePath, live);
  return `${added} produit(s) complété(s)`;
});

// Auferte, Applique Focus et Lampadaire Focus n'avaient aucune section activée :
// leur bandeau « Caractéristique » ne s'affichait pas, et donc leur silhouette
// non plus. On ne complète que les produits dont la liste est vide côté volume.
migrate("sections-produits-manquantes", () => {
  const livePath = path.join(DATA, "productContent.json");
  const defaults = readJson(path.join(DEFAULTS, "productContent.json"));
  const live = readJson(livePath);
  if (!defaults || !live) return "aucun fichier à compléter";

  let added = 0;
  for (const [productId, entry] of Object.entries(defaults)) {
    if (!entry?.sections?.length) continue;
    const current = live[productId];
    if (!current) {
      live[productId] = entry;
      added += 1;
    } else if (!current.sections?.length) {
      current.sections = entry.sections;
      added += 1;
    }
  }

  if (added > 0) writeJson(livePath, live);
  return `${added} produit(s) complété(s)`;
});

// Les textes des pages éditoriales (Fabrication, Studio, Sur-mesure, landing…)
// sont arrivés après la mise en service : le volume garde un translations.json
// d'avant, où ces clés n'existent pas. Les pages s'affichaient quand même —
// le client embarque les traductions en repli — mais la gestion ne pouvait pas
// les montrer, donc Anatole ne pouvait pas les modifier.
migrate("textes-manquants-2026-08", () => {
  const livePath = path.join(DATA, "translations.json");
  const defaults = readJson(path.join(DEFAULTS, "translations.json"));
  const live = readJson(livePath);
  if (!defaults || !live) return "aucun fichier à compléter";

  let added = 0;
  for (const lang of ["fr", "en"]) {
    if (!defaults[lang]) continue;
    live[lang] = live[lang] ?? {};
    for (const [key, value] of Object.entries(defaults[lang])) {
      // On n'écrase jamais un texte saisi en gestion : on ne comble que les trous.
      if (!(key in live[lang])) {
        live[lang][key] = value;
        added += 1;
      }
    }
  }

  if (added > 0) writeJson(livePath, live);
  return `${added} clé(s) ajoutée(s)`;
});

console.log("✅ Migrations terminées");
