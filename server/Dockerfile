# Étape 1 : Builder (avec les devDeps)
FROM node:18-alpine AS builder

WORKDIR /app/server

# Installer uniquement ce qui est nécessaire pour compiler
COPY package*.json tsconfig.json ./
RUN npm install

# Copier le code source
COPY . .

# Compiler en JS
RUN npm run build


# Étape 2 : Image finale (légère, sans TypeScript ni devDeps)
FROM node:18-alpine

WORKDIR /app/server

# Copier uniquement les fichiers nécessaires à l'exécution
COPY package*.json ./
RUN npm install --omit=dev

# Copier les fichiers compilés depuis l'étape "builder"
COPY --from=builder /app/server/dist ./dist


# Copier tout autre fichier nécessaire (ex: fichiers statiques, config, etc.)
# COPY --from=builder /app/public ./public  # ← si besoin

# Exposer le port utilisé par l'app
EXPOSE 5005

# Lancer l'app compilée
CMD ["node", "dist/index.js"]
