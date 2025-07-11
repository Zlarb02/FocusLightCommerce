import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Import des traductions depuis le fichier JSON
import translationsData from "./translations.json";

export type Language = "fr" | "en";

// Type pour les traductions
type Translations = Record<Language, Record<string, string>>;
const translations: Translations = translationsData as Translations;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>("fr");

  // Charger la langue depuis le localStorage au montage
  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang === "fr" || savedLang === "en") {
      setLanguage(savedLang);
    }
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
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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
