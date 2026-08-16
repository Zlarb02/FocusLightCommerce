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

# Initialiser les fichiers JSON manquants depuis les défauts
echo "📁 Vérification des fichiers de configuration JSON..."
for file in translations.json illustrations.json sliderConfig.json productContent.json sitePages.json; do
    if [ ! -f "/app/data/$file" ]; then
        if [ -f "/app/data-defaults/$file" ]; then
            echo "  → Copie de $file depuis les défauts"
            cp "/app/data-defaults/$file" "/app/data/$file"
        else
            echo "  ⚠️  Fichier par défaut $file introuvable"
        fi
    else
        echo "  ✓ $file existe déjà"
    fi
done

# Compléter les fichiers JSON déjà présents dans le volume : la boucle
# ci-dessus ne sait que créer les fichiers absents, jamais ajouter une nouvelle
# clé à un fichier existant.
node scripts/seed-data.mjs || echo "⚠️  Migrations JSON ignorées"

# Exécuter les migrations
echo "🔄 Exécution des migrations..."
node server/dist/server/migrate.js

# Initialiser la base de données avec les bonnes URLs d'images
echo "🗄️  Initialisation de la base de données..."
node server/dist/server/init-db.js

# Mettre à jour les URLs d'images (simple et efficace)
echo "🖼️  Mise à jour des URLs d'images..."
if node server/dist/server/update-image-urls.js; then
    echo "✅ URLs d'images mises à jour avec succès"
else
    echo "❌ Erreur lors de la mise à jour des URLs d'images"
    echo "⚠️  Le serveur va démarrer quand même"
fi

# Démarrer l'application
echo "🚀 Démarrage de l'application..."
exec node server/dist/server/index.js
