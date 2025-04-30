# Étape 1 : Build du backend TypeScript
FROM node:18-alpine AS builder

WORKDIR /app

# Copier les fichiers de configuration
COPY server/package*.json ./server/
COPY server/tsconfig.json ./server/

# Copier tout le code source nécessaire pour le build
COPY shared ./shared
COPY server ./server

# Installer toutes les dépendances (avec shared déjà présent)
RUN cd server && npm install

# Compiler le backend TypeScript
RUN cd server && npm run build

# Étape 2 : Image finale légère
FROM node:18-alpine

WORKDIR /app

# Copier package.json du serveur et installer les deps de prod uniquement
COPY server/package*.json ./server/
RUN cd server && npm install --omit=dev

# Copier les fichiers compilés et les fichiers partagés nécessaires
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/shared ./shared

EXPOSE 5005

# Lancer l'application compilée
CMD ["node", "server/dist/index.js"]
