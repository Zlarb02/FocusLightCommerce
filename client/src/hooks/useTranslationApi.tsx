import { createContext, useContext, ReactNode, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

interface TranslationContextType {
  translations: Record<string, Record<string, string>>;
  isLoading: boolean;
  error: any;
  refreshTranslations: () => void;
}

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined
);

interface TranslationProviderProps {
  children: ReactNode;
}

export function TranslationProvider({ children }: TranslationProviderProps) {
  const {
    data: translationsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["/api/translations"],
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Assurer que translations a le bon type
  const translations: Record<
    string,
    Record<string, string>
  > = (translationsData as Record<string, Record<string, string>>) || {};

  const refreshTranslations = () => {
    refetch();
  };

  // Écouter les changements de traductions depuis l'admin et rafraîchir automatiquement
  useEffect(() => {
    const handleTranslationUpdate = () => {
      refreshTranslations();
    };

    // Écouter un événement personnalisé pour les mises à jour de traductions
    window.addEventListener("translationsUpdated", handleTranslationUpdate);

    return () => {
      window.removeEventListener(
        "translationsUpdated",
        handleTranslationUpdate
      );
    };
  }, []);

  const value = {
    translations,
    isLoading,
    error,
    refreshTranslations,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslationApi() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error(
      "useTranslationApi must be used within a TranslationProvider"
    );
  }
  return context;
}

// Hook pour obtenir une traduction spécifique
export function useTranslation() {
  const { translations } = useTranslationApi();

  return (key: string, language: string = "fr"): string => {
    return translations[language]?.[key] || key;
  };
}

// Hook pour obtenir toutes les traductions d'une langue
export function useTranslationsByLanguage(language: string = "fr") {
  const { translations } = useTranslationApi();
  return translations[language] || {};
}
