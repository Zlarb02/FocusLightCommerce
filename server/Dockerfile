FROM node:18-alpine

WORKDIR /app

# Copier package.json du serveur
COPY server/package*.json ./

# Installer les dépendances
RUN npm install

# Copier uniquement les fichiers du serveur
COPY server/ .

# Exposer le port
EXPOSE 5005

# Démarrer l'application
CMD ["node", "index.js"]
