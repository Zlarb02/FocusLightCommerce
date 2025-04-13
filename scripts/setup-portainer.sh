#!/bin/bash

# Script pour configurer l'environnement Portainer sur le VPS
# À exécuter sur le VPS

# Créer le répertoire pour les fichiers de configuration
mkdir -p /opt/portainer/compose/focuslight

# Se positionner dans le répertoire
cd /opt/portainer/compose/focuslight

# Télécharger le fichier docker-compose.yml
curl -o docker-compose.yml https://raw.githubusercontent.com/YourUsername/FocusLightCommerce/main/docker-compose.yml

# Créer le répertoire pour les dumps de base de données
mkdir -p db/dumps

# Créer le fichier .env (à compléter manuellement)
cat > .env << EOL
# Configuration générale
TAG=latest
NODE_ENV=production

# Configuration de la base de données
DB_USER=focuslight
DB_PASSWORD=changeMe
DB_NAME=focuslight
DB_CONNECTION_STRING=postgresql://focuslight:changeMe@db:5432/focuslight
DB_PORT=5432

# Configuration de l'API
SESSION_SECRET=changeMe
API_URL=https://api.votredomaine.com
FRONTEND_PORT=80
BACKEND_PORT=5000
EOL

echo "Configuration de base créée dans /opt/portainer/compose/focuslight"
echo "Veuillez éditer le fichier .env avec vos informations"
echo "Puis démarrer les conteneurs avec 'docker-compose up -d'"
