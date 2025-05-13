# Étape 1 : Build du backend TypeScript
FROM node:18-alpine AS builder

WORKDIR /app

# Copier les fichiers package.json de la racine et du serveur
COPY package*.json ./
COPY server/package*.json ./server/
COPY server/tsconfig.json ./server/

# Copier tout le code source nécessaire pour le build
COPY shared ./shared
COPY server ./server

# Installer les dépendances du projet racine (pour les dépendances partagées)
RUN npm install

# Installer les dépendances du serveur et compiler
RUN cd server && npm install
RUN cd server && npm run build

# Étape 2 : Image finale légère
FROM node:18-alpine

WORKDIR /app

# Copier les package.json pour l'installation des dépendances de production
COPY package*.json ./
COPY server/package*.json ./server/

# Installer uniquement les dépendances de production
RUN npm install --omit=dev
RUN cd server && npm install --omit=dev

# Copier les fichiers compilés et les fichiers partagés nécessaires
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/shared ./shared
COPY --from=builder /app/server/uploads ./server/uploads

# Définir la variable d'environnement pour le port
ENV PORT=5005
EXPOSE 5005

# Lancer l'application compilée
CMD ["node", "server/dist/server/index.js"]

