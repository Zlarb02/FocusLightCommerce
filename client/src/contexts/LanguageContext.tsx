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
      const langToggle = document.getElementById(
        "lang-toggle"
      ) as HTMLInputElement | null;
      const langLabel = document.getElementById("lang-label");

      if (langToggle) langToggle.checked = language === "en";
      if (langLabel) langLabel.textContent = language === "en" ? "EN" : "FR";
    }
  }, [language]);

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
