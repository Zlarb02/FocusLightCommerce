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

console.log("✅ Migrations terminées");
