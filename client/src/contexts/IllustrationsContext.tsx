import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { apiRequest } from "../lib/queryClient";

// Import des illustrations depuis le fichier JSON (fallback)
import illustrationsData from "./illustrations.json";

export interface Illustration {
  key: string;
  title: string;
  url: string;
  description?: string;
  category: string;
  pages?: string[];
}

interface IllustrationData {
  title: string;
  url: string;
  description?: string;
  category: string;
  pages?: string[];
}

type Illustrations = Record<string, IllustrationData>;

interface IllustrationsContextType {
  illustrations: Illustrations;
  getIllustration: (key: string) => Illustration | null;
  refreshIllustrations: () => Promise<void>;
}

const IllustrationsContext = createContext<IllustrationsContextType | null>(null);

interface IllustrationsProviderProps {
  children: ReactNode;
}

export function IllustrationsProvider({ children }: IllustrationsProviderProps) {
  const [illustrations, setIllustrations] = useState<Illustrations>(
    illustrationsData as Illustrations
  );

  // Fonction pour récupérer les illustrations depuis l'API
  const refreshIllustrations = async () => {
    try {
      const newIllustrations = await apiRequest("GET", "/api/illustrations/public");
      setIllustrations(newIllustrations);
      console.log("Illustrations mises à jour depuis l'API");
    } catch (error) {
      console.warn("Impossible de récupérer les illustrations depuis l'API, utilisation du fichier local", error);
      // Garde les illustrations existantes (fichier local)
    }
  };

  // Charger les illustrations depuis l'API au montage
  useEffect(() => {
    refreshIllustrations();
  }, []);

  // Écouter les événements de mise à jour des illustrations
  useEffect(() => {
    const handleIllustrationsUpdate = () => {
      refreshIllustrations();
    };

    window.addEventListener("illustrationsUpdated", handleIllustrationsUpdate);
    return () => {
      window.removeEventListener("illustrationsUpdated", handleIllustrationsUpdate);
    };
  }, []);

  // Fonction pour récupérer une illustration par clé
  const getIllustration = (key: string): Illustration | null => {
    const illustration = illustrations[key];
    if (!illustration) return null;
    
    return {
      key,
      ...illustration
    };
  };

  return (
    <IllustrationsContext.Provider value={{ illustrations, getIllustration, refreshIllustrations }}>
      {children}
    </IllustrationsContext.Provider>
  );
}

export function useIllustrations() {
  const context = useContext(IllustrationsContext);
  if (!context) {
    throw new Error("useIllustrations must be used within an IllustrationsProvider");
  }
  return context;
}

// Hook pour faciliter l'accès à une illustration spécifique
export function useIllustration(key: string) {
  const { getIllustration } = useIllustrations();
  return getIllustration(key);
}
