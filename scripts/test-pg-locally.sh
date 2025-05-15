#!/bin/bash

# Ce script aide à tester la migration PostgreSQL localement

# Assurez-vous que PostgreSQL est installé et en cours d'exécution
echo "🐘 Vérification de PostgreSQL..."
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL n'est pas installé. Veuillez l'installer avant de continuer."
    exit 1
fi

# Variables d'environnement pour la connexion PostgreSQL
export DB_USER="postgres"
export DB_PASSWORD="postgres"
export DB_NAME="focuslight"
export DB_PORT="5432"
export FORCE_PG="true"

# Créer la base de données si elle n'existe pas
echo "🔄 Création de la base de données $DB_NAME si elle n'existe pas..."
psql -U $DB_USER -c "CREATE DATABASE $DB_NAME WITH ENCODING 'UTF8' LC_COLLATE='C' LC_CTYPE='C' TEMPLATE=template0;" || true

# Exécuter les migrations
echo "🔄 Exécution des migrations..."
node server/dist/server/migrate.js

# Lancer l'application avec PostgreSQL forcé
echo "🚀 Lancement de l'application avec PostgreSQL..."
node server/dist/server/index.js
