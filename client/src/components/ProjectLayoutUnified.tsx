import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, ShoppingBag, Menu, X } from "lucide-react";

interface ProjectLayoutUnifiedProps {
  children: ReactNode;
  title: string;
  currentProject: string;
  showSidebar?: boolean;
}

export default function ProjectLayoutUnified({
  children,
  title,
  currentProject,
  showSidebar = true,
}: ProjectLayoutUnifiedProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location, setLocation] = useLocation();

  // Fonction pour retourner à la landing page de façon sécurisée
  const backToLanding = () => {
    // Utiliser l'API History pour la navigation
    window.history.pushState({}, "", "/");

    // Récupérer les éléments de façon sécurisée avant manipulation
    const landingContainer = document.getElementById("landing-container");
    const rootElement = document.getElementById("root");

    if (landingContainer && rootElement) {
      landingContainer.style.display = "block";
      rootElement.style.display = "none";

      // Émettre un événement personnalisé pour réinitialiser l'animation Three.js
      window.dispatchEvent(new CustomEvent("returnToLanding"));

      // Réinitialiser la position de défilement
      window.scrollTo(0, 0);
    }
  };

  // Navigation vers un projet spécifique avec wouter pour une navigation fluide
  const navigateToProject = (projectName: string) => {
    const projectUrls: { [key: string]: string } = {
      Focus01: "/focus-01",
      SeaCle: "/sea-cle",
      LowtechVynil: "/lowtech-vynil",
      BraderieDeLArt: "/braderie-de-l-art",
      Waterfall: "/waterfall",
      ChaussuresCustom: "/chaussures-custom",
      QuiSuisJe: "/anatolle-collet",
    };

    const url = projectUrls[projectName];
    if (url) {
      setLocation(url);
    }
  };

  // Navigation items avec les vraies routes
  const navigationItems = [
    {
      name: "Accueil",
      icon: Home,
      action: () => backToLanding(),
      type: "home",
    },
    {
      name: "Shop",
      icon: ShoppingBag,
      action: () => {
        // Émettre l'événement routeChange pour indiquer qu'on vient de la landing
        window.dispatchEvent(
          new CustomEvent("routeChange", {
            detail: { path: "/shop" },
          })
        );
        setLocation("/shop");
      },
      type: "shop",
    },
    { name: "Projets", type: "divider" },
    {
      name: "Focus.01",
      action: () => navigateToProject("Focus01"),
      type: "project",
      current: currentProject === "Focus01",
    },
    {
      name: "Sea-clé",
      action: () => navigateToProject("SeaCle"),
      type: "project",
      current: currentProject === "SeaCle",
    },
    {
      name: "Without speaker",
      action: () => navigateToProject("LowtechVynil"),
      type: "project",
      current: currentProject === "LowtechVynil",
    },
    {
      name: "Braderie de l'Art",
      action: () => navigateToProject("BraderieDeLArt"),
      type: "project",
      current: currentProject === "BraderieDeLArt",
    },
    {
      name: "Waterfall",
      action: () => navigateToProject("Waterfall"),
      type: "project",
      current: currentProject === "Waterfall",
    },
    {
      name: "Chaussures Custom",
      action: () => navigateToProject("ChaussuresCustom"),
      type: "project",
      current: currentProject === "ChaussuresCustom",
    },
    { name: "À propos", type: "divider" },
    {
      name: "Qui suis-je",
      action: () => navigateToProject("QuiSuisJe"),
      type: "project",
      current: currentProject === "QuiSuisJe",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header unique et simplifié */}
      <header className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Menu mobile à gauche */}
          {showSidebar && (
            <div className="lg:hidden">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                aria-label="Ouvrir le menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Logo/Titre centré avec margin responsive */}
          <div
            className={`flex-1 flex justify-center ${
              showSidebar ? "lg:justify-start lg:ml-64" : ""
            }`}
          >
            <button
              onClick={backToLanding}
              className="text-xl font-bold text-gray-900 hover:text-gray-700 transition-colors"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              Alto Lille
            </button>
          </div>

          {/* Actions droite */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-sm"
              onClick={() => {
                // Émettre l'événement routeChange pour indiquer qu'on vient de la landing
                window.dispatchEvent(
                  new CustomEvent("routeChange", {
                    detail: { path: "/shop" },
                  })
                );
                setLocation("/shop");
              }}
            >
              <ShoppingBag className="h-4 w-4 mr-1" />
              Shop
            </Button>
          </div>
        </div>
      </header>

      {showSidebar && (
        <>
          {/* Sidebar Desktop */}
          <aside className="hidden lg:block fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-gray-200 z-40 overflow-y-auto">
            <div className="flex flex-col h-full">
              {/* Header sidebar */}
              <div className="px-6 py-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">
                  Portfolio
                </h2>
                <button
                  onClick={() => navigateToProject("QuiSuisJe")}
                  className="text-sm text-gray-500 mt-1 hover:text-gray-700 transition-colors cursor-pointer"
                >
                  Anatole Collet
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-2">
                {navigationItems.map((item, index) => {
                  if (item.type === "divider") {
                    return (
                      <div key={index} className="pt-6 pb-2">
                        <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          {item.name}
                        </h3>
                      </div>
                    );
                  }

                  const Icon = item.icon;
                  const isActive = item.current;

                  return (
                    <button
                      key={index}
                      onClick={item.action}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                        isActive
                          ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      {Icon && <Icon className="h-4 w-4 mr-3 flex-shrink-0" />}
                      <span className="truncate">{item.name}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-100">
                <div className="text-center space-y-2">
                  <p className="text-xs text-gray-400">© 2025 Alto lille</p>
                  <div className="flex items-center justify-center gap-3">
                    {/* Badge EcoIndex */}
                    <div id="ecoindex-badge"></div>
                    {/* Mention pogodev.com */}
                    <a
                      href="https://pogodev.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-600 text-xs transition-colors"
                      title="Site développé par PoGoDev"
                    >
                      Développé par PoGoDev
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Mobile Sidebar */}
          <div
            className={`fixed top-0 left-0 h-full w-64 bg-white z-50 transform transition-transform duration-300 ease-in-out lg:hidden shadow-xl ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex flex-col h-full">
              {/* Mobile Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2
                  className="text-lg font-bold text-gray-900"
                  style={{ fontFamily: "var(--font-titles)" }}
                >
                  Portfolio
                </h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  aria-label="Fermer le menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {navigationItems.map((item, index) => {
                  if (item.type === "divider") {
                    return (
                      <div key={index} className="pt-6 pb-2">
                        <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          {item.name}
                        </h3>
                      </div>
                    );
                  }

                  const Icon = item.icon;
                  const isActive = item.current;

                  return (
                    <button
                      key={index}
                      onClick={() => {
                        if (item.action) {
                          item.action();
                        }
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                        isActive
                          ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      {Icon && <Icon className="h-4 w-4 mr-3 flex-shrink-0" />}
                      <span className="truncate">{item.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </>
      )}

      {/* Main Content avec margin adaptatif */}
      <main className={`pt-16 min-h-screen ${showSidebar ? "lg:ml-64" : ""}`}>
        {/* Navigation retour mobile seulement si pas de sidebar */}
        {!showSidebar && (
          <div className="lg:hidden px-4 py-4">
            <button
              onClick={backToLanding}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span>Retour à l'accueil</span>
            </button>
          </div>
        )}

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Script EcoIndex */}
      <script
        type="text/javascript"
        src="https://www.ecoindex.fr/badge/"
        defer
      ></script>
    </div>
  );
}
