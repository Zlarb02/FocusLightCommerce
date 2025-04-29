# Étape 1 : Build du backend TypeScript
FROM node:18-alpine AS builder

WORKDIR /app

# Copier les fichiers nécessaires pour installer les dépendances du backend
COPY server/package*.json server/tsconfig.json ./server/
COPY shared/schema.ts ./shared/

# Installer les dépendances
RUN cd server && npm install

# Copier tout le code backend + les fichiers partagés
COPY server ./server
COPY shared ./shared

# Compiler le backend
RUN cd server && npm run build

# Étape 2 : Image finale légère
FROM node:18-alpine

WORKDIR /app

# Reprendre uniquement les fichiers nécessaires à l'exécution
COPY server/package*.json ./server/
RUN cd server && npm install --omit=dev

# Copier la sortie compilée
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/shared ./shared

EXPOSE 5005

CMD ["node", "server/dist/index.js"]
