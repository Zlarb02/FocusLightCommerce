import { ReactNode, useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, ShoppingBag, Menu, X } from "lucide-react";

interface PolaroidPageProps {
  title: string;
  subtitle?: string;
  imagePath: string;
  description: string | ReactNode;
  additionalContent?: ReactNode;
  date?: string;
}

export default function PolaroidPage({
  title,
  subtitle,
  imagePath,
  description,
  additionalContent,
  date,
}: PolaroidPageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Navigation items
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
      action: () => navigateToShop(),
      type: "shop",
    },
    { name: "Projets", type: "divider" },
    {
      name: "Focus.01",
      action: () => navigateToProject("Focus01"),
      type: "project",
      current: title === "Focus.01",
    },
    {
      name: "Sea-clé",
      action: () => navigateToProject("SeaCle"),
      type: "project",
      current: title === "Sea-clé",
    },
    {
      name: "Without speaker",
      action: () => navigateToProject("LowtechVynil"),
      type: "project",
      current: title === "Without speaker",
    },
    {
      name: "Braderie de l'Art",
      action: () => navigateToProject("BraderieDeLArt"),
      type: "project",
      current: title === "Braderie de l'Art",
    },
    {
      name: "Waterfall",
      action: () => navigateToProject("Waterfall"),
      type: "project",
      current: title === "Waterfall",
    },
    {
      name: "Chaussures Custom",
      action: () => navigateToProject("ChaussuresCustom"),
      type: "project",
      current: title === "Chaussures Custom",
    },
  ];

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

  // Navigation vers le shop avec wouter pour une navigation fluide
  const navigateToShop = () => {
    window.history.pushState({}, "", "/shop");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  // Navigation vers un projet spécifique avec wouter pour une navigation fluide
  const navigateToProject = (projectName: string) => {
    // Mapping des noms de projets vers leurs URLs
    const projectUrls: { [key: string]: string } = {
      Focus01: "/focus-01",
      SeaCle: "/sea-cle",
      LowtechVynil: "/lowtech-vynil",
      BraderieDeLArt: "/braderie-de-l-art",
      Waterfall: "/waterfall",
      ChaussuresCustom: "/chaussures-custom",
    };

    const url = projectUrls[projectName];
    if (url) {
      // Utilisation de wouter pour navigation SPA fluide
      window.history.pushState({}, "", url);
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  };

  return (
    <Layout showCart={false}>
      {/* Sidebar/Navigation - Desktop */}
      <div className="fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-40 transform transition-transform duration-300 ease-in-out hidden lg:block">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-6 py-8 border-b border-gray-100">
            <h2
              className="text-xl font-bold text-gray-900"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              Portfolio
            </h2>
            <p className="text-sm text-gray-500 mt-1">Anatole Collet</p>
          </div>

          {/* Navigation */}
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
                <a
                  href="https://bff.ecoindex.fr/redirect/?url=https://www.alto-lille.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Voir le score EcoIndex du site"
                >
                  <img
                    src="https://bff.ecoindex.fr/badge/?theme=light&url=https://www.alto-lille.fr"
                    alt="Ecoindex Badge"
                    className="h-5"
                  />
                </a>
                {/* Mention pogodev.com */}
                <a
                  href="https://pogodev.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600 text-xs transition-colors"
                  title="Site développé par Etienne Pogoda"
                >
                  Développé par Etienne Pogoda
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
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

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Mobile Menu Button */}
        <div className="lg:hidden fixed top-4 left-4 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md bg-white shadow-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          {/* Navigation retour */}
          <div className="mb-8 lg:hidden">
            <button
              onClick={backToLanding}
              className="inline-flex items-center text-gray-600 hover:text-[var(--color-text)] transition cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span>Retour à l'accueil</span>
            </button>
          </div>

          {/* En-tête */}
          <div className="mb-12 text-center">
            <h1
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              {title}
            </h1>
            {subtitle && (
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {subtitle}
              </p>
            )}
            {date && <p className="text-sm text-gray-500 mt-2">{date}</p>}
          </div>

          {/* Image principale avec effet polaroid */}
          <div className="mb-16 flex justify-center">
            <div className="relative bg-white p-4 shadow-lg max-w-3xl w-full transform transition-transform hover:scale-[1.01] duration-300">
              <img
                src={imagePath}
                alt={title}
                className="w-full h-auto"
                style={{ aspectRatio: "4/3", objectFit: "cover" }}
              />
              <div className="h-10" /> {/* Espace blanc du polaroid en bas */}
            </div>
          </div>

          {/* Description */}
          <div className="prose prose-lg max-w-3xl mx-auto mb-12">
            {typeof description === "string" ? (
              <p className="text-gray-700 leading-relaxed">{description}</p>
            ) : (
              description
            )}
          </div>

          {/* Contenu supplémentaire */}
          {additionalContent && (
            <div className="max-w-4xl mx-auto mb-16">{additionalContent}</div>
          )}

          {/* Appel à l'action */}
          <div className="text-center mt-12">
            <Button
              className="text-base px-6 py-5"
              onClick={() => window.history.back()}
            >
              Découvrir les autres créations
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
