import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./assets/global.css";
import "./assets/layout.css"; // Ajout du nouveau fichier CSS

/**
 */
const initializeApp = (): void => {
  const rootElement = document.getElementById("root");

  // Ne pas réinitialiser si déjà monté ou élément manquant
  if (rootElement && !rootElement.hasChildNodes()) {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.info("Application React initialisée");
  }
};

/**
 * Détermine si l'application doit être initialisée immédiatement
 * basé sur l'URL actuelle
 */
const shouldInitializeImmediately = (): boolean => {
  const path = window.location.pathname;
  // Routes nécessitant l'app React (toutes sauf la landing page)
  return path !== "/" && path !== "";
};

// Point d'entrée principal pour l'initialisation
if (shouldInitializeImmediately()) {
  // Initialisation immédiate pour les routes qui ne sont pas la landing
  window.addEventListener("DOMContentLoaded", initializeApp);
} else {
  // Attente de navigation pour la landing page
  window.addEventListener("routeChange", initializeApp);

  // Sécurité: vérifier si la route a changé avant la fin du chargement
  window.addEventListener("DOMContentLoaded", () => {
    if (shouldInitializeImmediately()) {
      initializeApp();
    }
  });
}
