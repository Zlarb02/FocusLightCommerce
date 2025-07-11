# Synchronisation des Toggles entre index.html et Layout.tsx

## Problème résolu

Les toggles de langue et de thème dans `index.html` (landing page) et `Layout.tsx` (application React) n'étaient pas synchronisés. Changer la langue ou le thème dans l'un n'affectait pas l'autre.

## Solution implémentée

### 1. Synchronisation de la langue (LanguageContext.tsx)

#### Changements apportés :

- **Synchronisation bidirectionnelle** : Les changements dans React ou dans index.html se répercutent mutuellement
- **Événements personnalisés** : Utilisation de `languageChange` pour communiquer entre les deux environnements
- **Mise à jour des icônes** : Synchronisation automatique de l'icône de langue (`lang-icon`) dans index.html

#### Événements :

```javascript
// Depuis React vers index.html
window.dispatchEvent(
  new CustomEvent("languageChange", {
    detail: { language, fromReact: true },
  })
);

// Depuis index.html vers React
window.dispatchEvent(
  new CustomEvent("languageChange", {
    detail: { language: newLang, fromLanding: true },
  })
);
```

### 2. Synchronisation du thème (ThemeContext.tsx)

#### Changements apportés :

- **Mise à jour des icônes** : Synchronisation automatique de l'icône de thème (`theme-icon`) dans index.html
- **Événements bidirectionnels** : Communication entre React et index.html via `themeChange`
- **Prévention des boucles infinies** : Vérification de la source des événements avec `fromReact`

#### Événements :

```javascript
// Depuis React vers index.html
window.dispatchEvent(
  new CustomEvent("themeChange", {
    detail: { theme: newTheme, fromReact: true },
  })
);

// Depuis index.html vers React
window.dispatchEvent(
  new CustomEvent("themeChange", {
    detail: { theme: !isDarkMode ? "dark" : "light" },
  })
);
```

### 3. Modifications dans index.html

#### Ajouts :

- **Listener pour languageChange** : Écoute les changements venant de React
- **Correction de themeChange** : Amélioration de la condition de vérification des événements React
- **Mise à jour automatique** : Les icônes se mettent à jour automatiquement

## Fonctionnement

### Scénario 1 : Changement depuis la landing page (index.html)

1. Utilisateur clique sur le toggle de langue/thème
2. index.html met à jour localStorage et l'interface
3. index.html émet un événement `languageChange` ou `themeChange`
4. React reçoit l'événement et met à jour son état
5. Les composants React se re-rendent avec la nouvelle langue/thème

### Scénario 2 : Changement depuis l'application React

1. Utilisateur utilise un toggle dans Layout.tsx
2. React met à jour son état et localStorage
3. React émet un événement avec `fromReact: true`
4. index.html reçoit l'événement et met à jour son interface
5. L'icône dans index.html change pour refléter le nouvel état

## Tests de vérification

Pour tester la synchronisation :

1. **Test langue** :

   - Ouvrir la landing page (index.html)
   - Changer la langue avec le toggle 🌐
   - Naviguer vers la boutique
   - Vérifier que la langue est conservée dans Layout.tsx
   - Changer la langue dans Layout.tsx
   - Revenir à la landing page
   - Vérifier que l'icône et la langue sont correctes

2. **Test thème** :
   - Ouvrir la landing page (index.html)
   - Changer le thème avec le toggle 🌙/☀️
   - Naviguer vers la boutique
   - Vérifier que le thème est conservé dans Layout.tsx
   - Changer le thème dans Layout.tsx
   - Revenir à la landing page
   - Vérifier que l'icône et le thème sont corrects

## Fichiers modifiés

1. `/client/src/contexts/LanguageContext.tsx`
2. `/client/src/contexts/ThemeContext.tsx`
3. `/client/index.html`

## Note technique

La synchronisation utilise :

- **localStorage** pour la persistance
- **événements personnalisés** pour la communication inter-environnements
- **flags de source** (`fromReact`, `fromLanding`) pour éviter les boucles infinies
- **mise à jour directe du DOM** pour synchroniser les icônes
