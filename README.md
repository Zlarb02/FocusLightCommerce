# Alto

## Architecture de déploiement hybride

Cette application utilise une approche de déploiement hybride :

- **Frontend**: Déployé sur Vercel
- **Backend & Base de données**: Déployés via Docker sur VPS

### Prérequis

- Docker et Docker Compose installés sur le VPS
- Un compte Vercel pour le déploiement du frontend
- Un VPS avec Docker installé

### Configuration du déploiement

#### 1. Déploiement du Backend (API + DB)

1. Clonez le dépôt sur votre VPS :

```bash
git clone https://github.com/YourUsername/Alto.git
cd Alto
```

2. Créez un fichier .env basé sur .env.example :

```bash
cp .env.example .env
# Modifiez le fichier .env avec vos propres valeurs
```

3. Déployez les services backend :

```bash
make deploy-backend
```

#### 2. Déploiement du Frontend sur Vercel

1. Connectez votre dépôt GitHub à Vercel
2. Configurez les variables d'environnement suivantes dans le projet Vercel :

   - `API_URL` : L'URL de votre backend (ex: https://api.alto-lille.fr)

3. Déployez le frontend en poussant sur la branche principale ou en utilisant l'interface Vercel

### Commandes utiles

```bash
# Déployer seulement le backend et la base de données
make deploy-backend

# Arrêter les services backend
make stop-backend

# Créer un dump de la base de données de production
make dump-prod

# Restaurer la base de données à partir d'un dump
make restore-prod file=./db/dumps/nom_du_fichier.sql
```

### Environnement de développement local

Pour le développement local, vous pouvez toujours utiliser les commandes suivantes :

```bash
# Installer les dépendances et créer la structure de dossiers
make init

# Démarrer l'environnement de développement complet (front, back, db)
make dev

# Arrêter l'environnement de développement
make stop-dev
```

### Structure des conteneurs en production

- **backend** : L'API serveur Node.js
- **db** : Base de données PostgreSQL

Le frontend est servi depuis les CDN de Vercel.
