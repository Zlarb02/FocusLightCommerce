#!/usr/bin/env bash
# Sauvegarde de la base Postgres de production Alto Lille.
# Se connecte au VPS (mot de passe SSH demandé), dump le conteneur alto-db
# et écrit une archive datée dans backups/ (dossier ignoré par git —
# destiné à être poussé dans un repo GitHub PRIVÉ dédié aux sauvegardes).
#
# Usage : ./scripts/backup-prod-db.sh
set -euo pipefail

HOST="debian@57.129.41.126"
OUT_DIR="$(cd "$(dirname "$0")/.." && pwd)/backups"
mkdir -p "$OUT_DIR"
STAMP="$(date +%Y%m%d-%H%M%S)"
OUT="$OUT_DIR/focuslight-prod-$STAMP.sql.gz"

echo "Dump de la base de prod (alto-db) vers ${OUT} ..."
# Les $(…) sont entre quotes simples : ils s'exécutent sur le VPS.
ssh "$HOST" 'docker exec alto-db pg_dump --no-owner -U "$(docker exec alto-db printenv POSTGRES_USER)" "$(docker exec alto-db printenv POSTGRES_DB)"' | gzip > "$OUT"

gunzip -t "$OUT"
echo "OK — archive valide : $OUT ($(du -h "$OUT" | cut -f1))"
