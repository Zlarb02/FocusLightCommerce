import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Vérifier d'abord localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || savedTheme === "light") {
      return savedTheme;
    }

    // Sinon, utiliser la préférence système
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }

    return "light";
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);

    // Appliquer le thème au body pour la cohérence avec la landing page
    if (newTheme === "dark") {
      document.body.classList.add("dark-mode");
      document.documentElement.classList.add("dark");
    } else {
      document.body.classList.remove("dark-mode");
      document.documentElement.classList.remove("dark");
    }

    // Émettre un événement personnalisé pour synchroniser avec la landing page
    window.dispatchEvent(
      new CustomEvent("themeChange", {
        detail: { theme: newTheme, fromReact: true },
      })
    );
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    // Appliquer le thème initial
    setTheme(theme);

    // Écouter les changements de thème de la landing page via localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "theme" && e.newValue) {
        if (e.newValue === "dark" || e.newValue === "light") {
          // Éviter la boucle infinie en vérifiant si le thème a vraiment changé
          if (e.newValue !== theme) {
            setThemeState(e.newValue);
            if (e.newValue === "dark") {
              document.body.classList.add("dark-mode");
              document.documentElement.classList.add("dark");
            } else {
              document.body.classList.remove("dark-mode");
              document.documentElement.classList.remove("dark");
            }
          }
        }
      }
    };

    // Écouter les événements personnalisés de la landing page
    const handleThemeChange = (e: CustomEvent) => {
      const newTheme = e.detail.theme;
      if (newTheme === "dark" || newTheme === "light") {
        // Éviter la boucle infinie en vérifiant si le thème a vraiment changé
        if (newTheme !== theme) {
          setThemeState(newTheme);
          // Pas besoin d'appliquer les classes ici car elles sont déjà appliquées par la landing page
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("themeChange", handleThemeChange as EventListener);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "themeChange",
        handleThemeChange as EventListener
      );
    };
  }, [theme]); // Inclure theme dans les dépendances pour la comparaison

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
