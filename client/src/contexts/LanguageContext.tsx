import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { apiRequest } from "../lib/queryClient";

// Import des traductions depuis le fichier JSON (fallback)
import translationsData from "./translations.json";

export type Language = "fr" | "en";

// Type pour les traductions
type Translations = Record<Language, Record<string, string>>;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  refreshTranslations: () => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>("fr");
  const [translations, setTranslations] = useState<Translations>(
    translationsData as Translations
  );

  // Fonction pour récupérer les traductions depuis l'API
  const refreshTranslations = async () => {
    try {
      // Ajouter timestamp pour éviter le cache
      const timestamp = Date.now();
      const newTranslations = await apiRequest("GET", `/api/translations/public/full?t=${timestamp}`);
      // Fusionner avec le fichier local : l'API (éditable en admin) surcharge
      // les défauts, mais les clés absentes côté serveur restent traduites.
      const localData = translationsData as Translations;
      setTranslations({
        fr: { ...localData.fr, ...(newTranslations?.fr ?? {}) },
        en: { ...localData.en, ...(newTranslations?.en ?? {}) },
      });
      console.log("Traductions mises à jour depuis l'API");
    } catch (error) {
      console.warn("Impossible de récupérer les traductions depuis l'API, utilisation du fichier local", error);
      // Garde les traductions existantes (fichier local)
    }
  };

  // Charger la langue depuis le localStorage au montage
  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang === "fr" || savedLang === "en") {
      setLanguage(savedLang);
    }
  }, []);

  // Charger les traductions depuis l'API au montage
  useEffect(() => {
    refreshTranslations();
  }, []);

  // Écouter les événements de mise à jour des traductions
  useEffect(() => {
    const handleTranslationsUpdate = () => {
      refreshTranslations();
    };

    window.addEventListener("translationsUpdated", handleTranslationsUpdate);
    return () => {
      window.removeEventListener("translationsUpdated", handleTranslationsUpdate);
    };
  }, []);

  // Synchronisation DOM + localStorage
  useEffect(() => {
    localStorage.setItem("lang", language);

    if (typeof window !== "undefined") {
      // Synchronisation avec les toggles existants (Layout.tsx)
      const langToggle = document.getElementById(
        "lang-toggle"
      ) as HTMLInputElement | null;
      const langLabel = document.getElementById("lang-label");

      if (langToggle) langToggle.checked = language === "en";
      if (langLabel) langLabel.textContent = language === "en" ? "EN" : "FR";

      // Synchronisation avec index.html
      const langIcon = document.getElementById("lang-icon");
      if (langIcon) {
        langIcon.textContent = language === "en" ? "FR" : "EN";
      }

      // Émettre un événement pour la landing page
      window.dispatchEvent(
        new CustomEvent("languageChange", {
          detail: { language, fromReact: true },
        })
      );
    }
  }, [language]);

  // Écouter les changements de langue venant de la landing page
  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      if (event.detail.fromLanding) {
        setLanguage(event.detail.language);
      }
    };

    window.addEventListener(
      "languageChange",
      handleLanguageChange as EventListener
    );

    return () => {
      window.removeEventListener(
        "languageChange",
        handleLanguageChange as EventListener
      );
    };
  }, []);

  // Fonction de traduction avec fallback fr
  const t = (key: string): string => {
    const value = translations[language]?.[key] ?? translations["fr"]?.[key];
    return typeof value === "string" ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, refreshTranslations }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
