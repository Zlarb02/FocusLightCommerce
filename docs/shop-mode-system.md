# Documentation du système de boutique à deux modes

## Vue d'ensemble

Le système de boutique de Focus Light Commerce offre deux modes d'affichage :

1. **Mode Focus** : Affiche uniquement les lampes Focus.01
2. **Mode Généraliste** : Affiche tous les produits disponibles avec des catégories

Ce document explique comment le système est mis en œuvre et comment l'utiliser.

## Architecture

### Backend

- **Stockage** : `settingsStorage.ts` gère le stockage du mode boutique actuel

  ```typescript
  interface SiteSettings {
    shopMode: "general" | "focus";
    // autres paramètres...
  }
  ```

- **API** : `settingsRoutes.ts` expose les endpoints pour lire et modifier le mode
  ```
  GET /api/settings/shop-mode  // Récupère le mode boutique actuel
  PUT /api/settings/shop-mode  // Modifie le mode boutique (admin seulement)
  ```

### Frontend

- **Hook** : `useShopMode.tsx` est un hook personnalisé qui gère l'interaction avec l'API

  ```typescript
  const { shopMode, setShopMode, toggleShopMode, isLoading } = useShopMode();
  ```

- **Routing** : Dans `App.tsx`, le mode détermine quelle page est affichée sur `/shop`

  ```typescript
  <Route path="/shop" component={shopMode === "focus" ? Home : Shop} />
  ```

- **Interface administrateur** : Des toggles dans le Dashboard et dans Paramètres permettent aux administrateurs de changer le mode

## Pages

### ShopFocus.tsx

Page dédiée au mode Focus qui :

- Affiche uniquement les produits contenant "focus" dans leur nom
- Présente une mise en page optimisée pour la gamme Focus.01
- Inclut une sélection de couleurs et des sections spécifiques

### Shop.tsx

Page dédiée au mode Généraliste qui :

- Affiche tous les produits disponibles
- Organise les produits par catégories
- Offre une barre de recherche et un système de filtrage

## Utilisation du hook useShopMode

```tsx
import { useShopMode } from "@/hooks/useShopMode";

function MaPage() {
  const {
    shopMode, // Valeur actuelle : "focus" ou "general"
    setShopMode, // Fonction pour définir directement un mode
    toggleShopMode, // Fonction pour basculer entre les modes
    isLoading, // Booléen indiquant si une requête est en cours
  } = useShopMode();

  // Exemple d'utilisation
  return (
    <div>
      <p>Mode actuel : {shopMode === "focus" ? "Focus" : "Généraliste"}</p>
      <button onClick={toggleShopMode} disabled={isLoading}>
        Changer de mode
      </button>
    </div>
  );
}
```

## Sécurité

- Seuls les administrateurs authentifiés peuvent modifier le mode boutique
- L'authentification est vérifiée via le middleware `isAdmin` sur le backend
- Les utilisateurs non-admin peuvent uniquement consulter le mode actuel

## Maintenance et extension

Pour ajouter de nouveaux modes à l'avenir :

1. Modifier le type `ShopMode` dans `settingsStorage.ts` et `useShopMode.tsx`
2. Ajouter la logique de routing appropriée dans `App.tsx`
3. Créer les nouvelles pages ou composants nécessaires
4. Mettre à jour l'interface utilisateur du Dashboard et des Paramètres

## Tests

Avant toute mise en production, tester :

1. La bascule entre les modes depuis le Dashboard et les Paramètres
2. Le comportement lors de la navigation entre les pages
3. La persistance du mode après actualisation du navigateur
4. La sécurité de l'API (accès admin uniquement)
