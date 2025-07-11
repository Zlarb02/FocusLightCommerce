import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Un switch "on/off" qui change le mode sombre/clair, avec un texte qui change selon le thème.
 * À placer juste sous l'image "Caractéristiques et détails" dans ShopFocus.
 */
export function LampOnOffSwitch() {
  // Pour détecter le thème actuel (dark ou light)
  const [isDark, setIsDark] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    // Vérifie le thème initial
    setIsDark(document.documentElement.classList.contains("dark"));
    // Écoute les changements de classe sur <html>
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // Change le thème (toggle dark/light)
  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setIsDark(html.classList.contains("dark"));
  };

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <div className="flex items-center gap-4 bg-white/95 dark:bg-gray-900/95 border border-blue-300 dark:border-yellow-300 rounded-xl px-6 py-2 shadow-xl">
        <span className="text-xl font-bold dark:text-yellow-300 text-blue-700 drop-shadow-sm">
          {isDark
            ? t("shop.focus.lampSwitch.seeOff")
            : t("shop.focus.lampSwitch.seeOn")}
        </span>
        <button
          onClick={toggleTheme}
          className="relative w-16 h-10 rounded-full transition bg-gray-200 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 flex items-center px-1 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-lg"
          aria-label="Basculer le mode sombre/clair"
        >
          {/* Track */}
          <span className="absolute left-0 top-0 w-full h-full rounded-full pointer-events-none" />
          {/* Thumb (ampoule) */}
          <span
            className={`z-10 w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 bg-white dark:bg-gray-900 shadow-md border border-gray-300 dark:border-gray-700 ${
              isDark ? "translate-x-6" : "translate-x-0"
            }`}
          >
            {isDark ? (
              // Ampoule "éteinte"
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-500"
              >
                <circle cx="12" cy="12" r="6" />
                <line x1="8" y1="16" x2="16" y2="8" />
              </svg>
            ) : (
              // Ampoule "allumée"
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-yellow-400"
              >
                <circle cx="12" cy="12" r="6" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </svg>
            )}
          </span>
        </button>
      </div>
    </div>
  );
}
