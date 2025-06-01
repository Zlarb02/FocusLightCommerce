import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, ShoppingBag, Menu, X } from "lucide-react";

interface ProjectLayoutProps {
  children: ReactNode;
  title: string;
  currentProject: string;
}

export default function ProjectLayout({
  children,
  title,
  currentProject,
}: ProjectLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location] = useLocation();

  // Navigation items avec les vraies routes
  const navigationItems = [
    {
      name: "Accueil",
      icon: Home,
      href: "/",
      type: "home",
    },
    {
      name: "Shop",
      icon: ShoppingBag,
      href: "/shop",
      type: "shop",
    },
    { name: "Projets", type: "divider" },
    {
      name: "Focus.01",
      href: "/focus-01",
      type: "project",
      current: currentProject === "Focus01",
    },
    {
      name: "Sea-clé",
      href: "/sea-cle",
      type: "project",
      current: currentProject === "SeaCle",
    },
    {
      name: "Without speaker",
      href: "/lowtech-vynil",
      type: "project",
      current: currentProject === "LowtechVynil",
    },
    {
      name: "Braderie de l'Art",
      href: "/braderie-de-l-art",
      type: "project",
      current: currentProject === "BraderieDeLArt",
    },
    {
      name: "Waterfall",
      href: "/waterfall",
      type: "project",
      current: currentProject === "Waterfall",
    },
    {
      name: "Chaussures Custom",
      href: "/chaussures-custom",
      type: "project",
      current: currentProject === "ChaussuresCustom",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header principal fixe */}
      <header className="fixed top-0 left-0 right-0 bg-white z-30 border-b border-gray-200">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Menu mobile */}
          <div className="lg:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          {/* Logo/Titre centré */}
          <div className="flex-1 flex justify-center lg:justify-start lg:ml-64">
            <Link
              to="/"
              className="text-xl font-bold text-gray-900"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              Alto Lille
            </Link>
          </div>

          {/* Actions droite */}
          <div className="flex items-center space-x-4">
            <Link to="/shop">
              <Button variant="ghost" size="sm">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Shop
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Sidebar Desktop */}
      <div className="hidden lg:block fixed top-16 left-0 h-full w-64 bg-white border-r border-gray-200 z-20">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-6 py-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Portfolio</h2>
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

              if (!item.href) return null;

              const Icon = item.icon;
              const isActive = item.current;

              return (
                <Link key={index} to={item.href}>
                  <button
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      isActive
                        ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {Icon && <Icon className="h-4 w-4 mr-3 flex-shrink-0" />}
                    <span className="truncate">{item.name}</span>
                  </button>
                </Link>
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
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
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

              if (!item.href) return null;

              const Icon = item.icon;
              const isActive = item.current;

              return (
                <Link key={index} to={item.href}>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      isActive
                        ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {Icon && <Icon className="h-4 w-4 mr-3 flex-shrink-0" />}
                    <span className="truncate">{item.name}</span>
                  </button>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16">
        <div className="lg:hidden px-4 py-4">
          <Link to="/">
            <button className="inline-flex items-center text-gray-600 hover:text-gray-900 transition">
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span>Retour à l'accueil</span>
            </button>
          </Link>
        </div>

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
