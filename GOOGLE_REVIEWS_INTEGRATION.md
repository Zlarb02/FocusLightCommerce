# Intégration des Avis Google - Instructions

## Composant GoogleReviews

J'ai créé un composant `GoogleReviews` qui affiche les avis Google de votre entreprise sur la page ShopFocus.

### Données actuelles

Le composant utilise actuellement des données d'exemple. Pour intégrer les vrais avis Google, vous avez plusieurs options :

## Option 1 : API Google Places (Recommandée)

### Étapes :

1. **Créer un projet Google Cloud** :

   - Allez sur https://console.cloud.google.com/
   - Créez un nouveau projet ou sélectionnez un existant

2. **Activer l'API Google Places** :

   - Dans la console Google Cloud, allez dans "API et services" > "Bibliothèque"
   - Recherchez "Places API" et activez-la

3. **Créer une clé API** :

   - Allez dans "API et services" > "Identifiants"
   - Cliquez sur "Créer des identifiants" > "Clé API"
   - Restreignez la clé à l'API Places et à vos domaines

4. **Trouver votre Place ID** :

   - Utilisez l'outil Place ID Finder : https://developers.google.com/maps/documentation/places/web-service/place-id
   - Ou recherchez votre entreprise sur Google Maps et récupérez l'ID depuis l'URL

5. **Implémenter l'API** :
   ```typescript
   // Ajoutez cette fonction dans le composant GoogleReviews
   const fetchGoogleReviews = async (placeId: string, apiKey: string) => {
     try {
       const response = await fetch(
         `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${apiKey}`
       );
       const data = await response.json();
       return data.result;
     } catch (error) {
       console.error("Erreur lors de la récupération des avis:", error);
       return null;
     }
   };
   ```

## Option 2 : Widget Google Business Profile

### Étapes :

1. **Accéder à votre profil Google Business** :

   - Allez sur https://business.google.com/
   - Connectez-vous avec votre compte Google associé à votre entreprise

2. **Générer un widget** :
   - Malheureusement, Google ne propose plus de widget d'avis officiel
   - Vous pouvez utiliser des services tiers comme Trustpilot, Podium, ou Grade.us

## Option 3 : Service tiers (Plus simple)

### Services recommandés :

1. **EmbedSocial** : https://embedsocial.com/
2. **Trustpilot** : https://business.trustpilot.com/
3. **Podium** : https://www.podium.com/
4. **Grade.us** : https://grade.us/

## Configuration actuelle

Le composant est configuré avec :

- **Lien vers vos avis** : https://g.co/kgs/wKEbWM2
- **Avis factices** : 5 avis avec notes de 4-5 étoiles
- **Design responsive** : Adapté mobile et desktop
- **Thème sombre** : Compatible avec le mode sombre

## Personnalisation

Pour modifier les avis actuels, éditez le tableau `sampleReviews` dans le fichier :
`client/src/components/GoogleReviews.tsx`

## Intégration dans la page

Le composant est déjà intégré dans `ShopFocus.tsx` à la place de l'ancien widget Trustpilot.

## Variables d'environnement

Si vous choisissez l'option API Google Places, ajoutez votre clé API dans le fichier `.env` :

```env
VITE_GOOGLE_PLACES_API_KEY=votre_cle_api_ici
VITE_GOOGLE_PLACE_ID=votre_place_id_ici
```

## Note importante

⚠️ **Attention** : L'API Google Places a des limitations :

- Coût par requête (gratuit jusqu'à un certain quota)
- Nécessite une clé API sécurisée
- Les avis peuvent être limités en nombre

Je recommande d'utiliser un service tiers pour une solution plus robuste et sans frais d'API.
