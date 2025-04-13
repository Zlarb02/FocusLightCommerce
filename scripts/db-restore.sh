#!/bin/bash

# Script pour restaurer un dump de la base de données
# Usage: ./db-restore.sh [dump_file] [env]
# dump_file: chemin vers le fichier dump
# env: dev (default) ou prod

DUMP_FILE=$1
ENV=${2:-dev}
CONTAINER_NAME=${ENV}-focuslight-db

if [ -z "$DUMP_FILE" ]; then
  echo "Erreur: Veuillez spécifier un fichier dump"
  echo "Usage: ./db-restore.sh [dump_file] [env]"
  exit 1
fi

if [ ! -f "$DUMP_FILE" ]; then
  echo "Erreur: Le fichier $DUMP_FILE n'existe pas"
  exit 1
fi

echo "Restauration de la base de données ($ENV) à partir du dump: $DUMP_FILE"

if [ "$ENV" = "prod" ]; then
  # En production
  docker exec -i $CONTAINER_NAME psql -U ${DB_USER:-focuslight} -d ${DB_NAME:-focuslight} < $DUMP_FILE
else
  # En développement
  docker-compose exec -T db psql -U ${DB_USER:-focuslight} -d ${DB_NAME:-focuslight} < $DUMP_FILE
fi

echo "Base de données restaurée avec succès"
