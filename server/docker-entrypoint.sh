#!/bin/sh

# Script d'entrée Docker qui exécute les migrations et initialise la DB avant de démarrer le serveur
set -e

echo "🚀 Démarrage de l'initialisation du serveur FocusLight..."

echo "🔄 Attente de la disponibilité de PostgreSQL..."
# Attendre que PostgreSQL soit prêt (max 60s)
timeout=60
counter=0
until pg_isready -h db -U ${DB_USER} -d ${DB_NAME} > /dev/null 2>&1; do
    counter=$((counter+1))
    if [ $counter -ge $timeout ]; then
        echo "❌ Timeout en attendant PostgreSQL ($timeout secondes)"
        exit 1
    fi
    echo "⏳ PostgreSQL n'est pas prêt, attente... ($counter/$timeout)"
    sleep 1
done

echo "✅ PostgreSQL est prêt!"

# Exécuter les migrations
echo "🔄 Exécution des migrations..."
node server/dist/server/migrate.js

# Démarrer l'application
echo "🚀 Démarrage de l'application..."
exec node server/dist/server/index.js
