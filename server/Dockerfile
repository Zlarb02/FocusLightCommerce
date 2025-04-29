FROM node:18-alpine

WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier l'ensemble des fichiers sources
COPY . .

# Exposer le port
EXPOSE 5005

# Démarrer l'application
CMD ["node", "index.js"]
