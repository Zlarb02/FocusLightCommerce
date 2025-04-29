# Étape 1 : Build du backend TypeScript
FROM node:18-alpine AS builder

WORKDIR /app

# Copier les fichiers package.json des deux dossiers
COPY server/package*.json ./server/
COPY server/tsconfig.json ./server/
COPY shared ./shared

# Installer toutes les dépendances, y compris les devDependencies
RUN cd server && npm install

# Copier le code source du backend
COPY server ./server

# Compiler le backend TypeScript
RUN cd server && npm run build

# Étape 2 : Image finale légère
FROM node:18-alpine

WORKDIR /app

# Copier package.json et installer uniquement les dépendances de production
COPY server/package*.json ./server/
RUN cd server && npm install --omit=dev

# Copier les fichiers compilés et partagés
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/shared ./shared

EXPOSE 5005

CMD ["node", "server/dist/index.js"]
