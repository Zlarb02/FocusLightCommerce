FROM node:18-alpine

WORKDIR /app

# Copier package.json et package-lock.json
COPY server/package*.json ./

# Installer les dépendances
RUN npm install

# Copier index.js à la racine et le reste dans server/
COPY server/index.js ./
COPY server/src ./src/
COPY server/config ./config/

# Exposer le port
EXPOSE 5005

# Démarrer l'application
CMD ["node", "index.js"]
