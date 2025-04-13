FROM node:18-alpine

WORKDIR /app

# Copier les fichiers package.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers
COPY . .

# Exposer le port
EXPOSE 5005

# Démarrer l'application
CMD ["npm", "start"]
