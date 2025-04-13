#!/bin/sh

# Remplacer les variables d'environnement dans le fichier env-config.js
ENV_CONFIG_FILE=/usr/share/nginx/html/env-config.js

# Créer le fichier de configuration avec les variables d'environnement
cat > $ENV_CONFIG_FILE << EOF
window.ENV = {
  API_URL: "${API_URL:-''}",
  NODE_ENV: "${NODE_ENV:-'production'}"
};
EOF

echo "Variables d'environnement injectées dans env-config.js"
exec "$@"
