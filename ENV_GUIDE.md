# Guide des variables d'environnement - FocusLightCommerce

Ce document explique comment les variables d'environnement sont gérées dans le projet FocusLightCommerce.

## Architecture du projet

L'application utilise une architecture modulaire permettant plusieurs options de déploiement :

- **Architecture complète Docker** : Frontend, Backend et BDD dans des conteneurs Docker
- **Architecture hybride** : Frontend sur Vercel, Backend et BDD via Docker
- **Architecture locale** : Développement sans Docker (serveur Node.js local)

## 🔑 Variables d'environnement par environnement

### Développement local

#### Option 1 : Avec Docker (recommandé)

Utilisez le fichier `.env` à la racine pour configurer l'environnement Docker :

```env
# Base de données
DB_USER=focuslight
DB_PASSWORD=password
DB_NAME=focuslight
DB_CONNECTION_STRING=postgresql://focuslight:password@db:5432/focuslight
DB_PORT=5432

# Configuration du backend
NODE_ENV=development
SESSION_SECRET=dev-secret-key
PORT=5000

# Configuration CORS
FRONTEND_URL=http://localhost:5173
```

Puis lancez l'environnement complet avec :

```bash
make dev
```

#### Option 2 : Sans Docker

Pour le frontend :

- Modifiez `/client/public/env-config.js` pour définir `API_URL`
- Exécutez `cd client && npm run dev`

Pour le backend :

- Configurez les variables d'environnement système ou utilisez un fichier `.env` dans `/server`
- Exécutez `cd server && npm run dev`

### Production

#### Option A : Architecture hybride (Frontend Vercel + Backend Docker)

1. **Frontend sur Vercel**:

   - Dans l'interface Vercel : Project Settings > Environment Variables
   - Variables requises :
     - `API_URL`: URL de votre API backend (ex: https://api.votredomaine.com)
     - `NODE_ENV`: "production"

2. **Backend & BDD sur VPS via Docker**:
   - Créez un fichier `.env` sur le VPS :
   ```env
   DB_USER=focuslight
   DB_PASSWORD=motdepassesecurise
   DB_NAME=focuslight
   DB_CONNECTION_STRING=postgresql://focuslight:motdepassesecurise@db:5432/focuslight
   NODE_ENV=production
   SESSION_SECRET=motdepassetressecret
   PORT=5000
   FRONTEND_URL=https://focus-light-commerce.vercel.app,https://focus01.pogodev.com
   ```
   - Déployez avec `make deploy-backend`

#### Option B : Architecture tout-Docker

Sur votre VPS, configurez un fichier `.env` complet, puis utilisez :

```bash
make simulation  # Pour tester localement
make prod        # Pour le véritable environnement de production
```

## 📋 Utilisation des variables dans le code

### Frontend

```javascript
// Accès aux variables d'environnement frontend
const apiUrl = window.ENV?.API_URL || "http://localhost:5000";
```

### Backend

```javascript
// Accès aux variables d'environnement backend
const dbConnectionString = process.env.DB_CONNECTION_STRING;
const corsOrigin = process.env.FRONTEND_URL || "http://localhost:5173";
```

## 🛡️ Bonnes pratiques de sécurité

1. **Ne jamais commiter les fichiers `.env`** contenant des secrets
2. **Utiliser des valeurs par défaut sécuritaires** pour le développement
3. **Mettre à jour le fichier `.env.example`** lors de l'ajout de nouvelles variables
4. **Valider les variables critiques** au démarrage de l'application
5. **Utiliser des secrets GitHub** pour les variables sensibles dans les workflows CI/CD

## 🔄 Configuration CORS pour multiples domaines

Pour supporter plusieurs origines dans `FRONTEND_URL`, modifiez `server/vite.ts` :

```javascript
// Exemple de modification pour supporter plusieurs origines CORS
const corsOrigin = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",")
  : "http://localhost:5173";
```
