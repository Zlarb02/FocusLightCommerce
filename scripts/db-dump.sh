#!/bin/bash

# Script pour créer un dump de la base de données
# Usage: ./db-dump.sh [env]
# env: prod (default) ou dev

ENV=${1:-prod}
CONTAINER_NAME=${ENV}-focuslight-db
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DUMP_FILE="focuslight_${ENV}_${TIMESTAMP}.sql"

echo "Création d'un dump de la base de données (${ENV})..."

if [ "$ENV" = "prod" ]; then
  # En production (via Portainer)
  docker exec $CONTAINER_NAME pg_dump -U ${DB_USER:-focuslight} -d ${DB_NAME:-focuslight} > ./db/dumps/$DUMP_FILE
else
  # En développement (local)
  docker-compose exec db pg_dump -U ${DB_USER:-focuslight} -d ${DB_NAME:-focuslight} > ./db/dumps/$DUMP_FILE
fi

echo "Dump créé avec succès: ./db/dumps/$DUMP_FILE"
