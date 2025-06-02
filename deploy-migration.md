# Migration des images en production

## Problème identifié

Les images des lampes Focus (rouge, blanche, bleue, orange) en production utilisent encore les anciennes URLs qui pointent vers des images avec fond blanc au lieu des nouvelles images avec transparence et noms chiffrés.

## Solution

### Option 1 : Migration via SSH (Recommandée)

Si vous avez accès SSH à votre serveur de production :

```bash
# Se connecter au serveur
ssh votre-serveur-prod

# Aller dans le répertoire de l'application
cd /path/to/focus-light-commerce/server

# Exécuter la migration
npm run migrate:images
```

### Option 2 : Via interface d'administration

Si votre hébergeur propose une interface en ligne de commande (comme Heroku, Railway, etc.) :

```bash
# Exemple avec Heroku
heroku run npm run migrate:images --app votre-app-name

# Exemple avec Railway
railway run npm run migrate:images
```

### Option 3 : Redéploiement avec migration automatique

Ajouter la migration au processus de déploiement en modifiant le script de build :

1. Modifier `server/package.json` pour inclure la migration dans le processus de démarrage :

```json
{
  "scripts": {
    "start": "node dist/migrate.js && node dist/migrate-images.js && node dist/index.js"
  }
}
```

## Vérification

Après la migration, vérifiez que :

1. Les URLs des variations de produits pointent vers `https://www.alto-lille.fr/uploads/[UUID].png`
2. Les images affichent bien la transparence
3. Aucune erreur 404 sur les images

## URLs mappées

- `/uploads/blanche.png` → `https://www.alto-lille.fr/uploads/fbf9e3c1-9afe-446f-9e3d-5966f078b4c0.png`
- `/uploads/bleue.png` → `https://www.alto-lille.fr/uploads/6b611585-bb6c-411c-85bf-342fe95950c6.png`
- `/uploads/rouge.png` → `https://www.alto-lille.fr/uploads/1f1cdf28-f233-4191-9c1a-f9d7e12b709f.png`
- `/uploads/orange.png` → `https://www.alto-lille.fr/uploads/a8e085a1-8bc5-4c90-a738-151c7ce4d8d0.png`
