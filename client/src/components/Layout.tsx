import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { CartOverlay } from "@/components/CartOverlay";
import { AnimatedCartIcon } from "@/components/AnimatedCartIcon";
import { useCart } from "@/hooks/useCart";
import { ShoppingBag, Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import ThemeDecorator from "@/components/decorations/ThemeDecorator";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ThemeDecoration } from "../../../shared/schema";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageToggle } from "@/components/LanguageToggle";
import "./Layout-dark-contrast.css";

interface LayoutProps {
  children: ReactNode;
  showCart?: boolean;
}

interface ThemeDecorationResponse {
  themeDecoration: ThemeDecoration;
}

export function Layout({ children, showCart = true }: LayoutProps) {
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { getTotalItems } = useCart();
  const [location, setLocation] = useLocation();
  const { t } = useLanguage();

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

  // Récupérer la décoration thématique active
  const { data: themeData, isPending } = useQuery({
    queryKey: ["themeDecoration"],
    queryFn: async () => {
      const response = await apiRequest<ThemeDecorationResponse>(
        "GET",
        "/api/versions/theme-decoration"
      );
      return response;
    },
  });

  // Calculer une seule fois le nombre d'articles
  const cartItemCount = getTotalItems();

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      {/* Intégration des décorations thématiques */}
      {themeData && <ThemeDecorator decoration={themeData.themeDecoration} />}

      <header className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50 border-b border-gray-200/20 dark:border-gray-700/20">
        <div className="flex items-center justify-between h-16 px-5">
          {/* Menu burger à gauche - Design minimaliste WOW */}
          <div>
            <button
              onClick={() => setMenuOpen(true)}
              className="group p-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-300 ease-out"
              aria-label={t("nav.menu")}
            >
              {/* Icône burger minimaliste avec animation */}
              <div className="relative w-6 h-5 flex flex-col justify-between transform transition-all duration-300 group-hover:scale-110">
                <span className="block h-0.5 w-6 bg-current transform transition-all duration-300 group-hover:w-7 origin-left"></span>
                <span className="block h-0.5 w-5 bg-current transform transition-all duration-300 group-hover:w-6 origin-left"></span>
                <span className="block h-0.5 w-6 bg-current transform transition-all duration-300 group-hover:w-7 origin-left"></span>
              </div>
            </button>
          </div>

          {/* Logo centré */}
          <div className="flex-1 flex justify-center">
            <button
              onClick={backToLanding}
              className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-all duration-300 ease-out hover:scale-105"
              aria-label="Retour à l'accueil"
            >
              <img
                src="/images/logo.png"
                alt="Alto Lille"
                className="h-8 w-auto object-contain"
              />
              <span
                className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 hidden xs:block"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                Alto Lille
              </span>
            </button>
          </div>

          {/* Icônes à droite - Style ultra minimaliste */}
          <div className="flex items-center gap-1">
            <LanguageToggle variant="minimal" size="sm" showLabel={false} />
            <ThemeToggle variant="minimal" size="sm" showLabel={false} />
            {showCart && (
              <button
                className="p-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-300 ease-out hover:scale-110 relative"
                onClick={() => setCartOpen(true)}
                aria-label={`${t("nav.cart")} - ${cartItemCount} ${t(
                  "cart.itemAdded"
                ).toLowerCase()}`}
              >
                <AnimatedCartIcon
                  itemCount={cartItemCount}
                  onCartUpdate={() => {
                    // Optionnel: ajouter un son ou autre feedback
                  }}
                />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Menu mobile overlay */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setMenuOpen(false)}
          />

          {/* Menu sidebar sobre et épuré */}
          <div className="fixed top-0 left-0 bottom-0 w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl z-50 transform transition-transform duration-500 ease-out overflow-y-auto shadow-2xl border-r border-gray-200/30 dark:border-gray-700/30">
            {/* Header du menu épuré - Style identique à index.html */}
            <div
              className="flex items-center justify-between px-6 border-b border-gray-200/20 dark:border-gray-700/20 bg-gray-50/80 dark:bg-gray-800/20 backdrop-blur-lg"
              style={{ height: "64px" }}
            >
              <div className="flex items-center gap-3">
                <img
                  src="/images/logo.png"
                  alt="Alto Lille"
                  className="w-auto object-contain"
                  style={{ height: "24px" }}
                />
                <h2
                  className="text-lg font-semibold text-gray-900 dark:text-gray-100 m-0"
                  style={{ fontFamily: "var(--font-titles)" }}
                >
                  {t("nav.menu")}
                </h2>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="group p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-all duration-300 ease-out hover:scale-110"
                aria-label={t("nav.close")}
              >
                <X className="h-5 w-5 transform group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            {/* Navigation sobre et épurée - Structure identique à index.html */}
            <nav className="flex flex-col p-6">
              {/* Action principale - Accueil */}
              <div className="mb-6">
                <button
                  onClick={() => {
                    backToLanding();
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center px-3 py-3 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 ease-out group mb-1 hover:translate-x-1"
                  style={{
                    fontFamily: "var(--font-nav)",
                    fontSize: "16px",
                    fontWeight: "500",
                  }}
                >
                  <svg
                    className="w-4 h-4 mr-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9,22 9,12 15,12 15,22" />
                  </svg>
                  <span>{t("nav.home")}</span>
                </button>
              </div>

              <div className="border-t border-gray-200/30 dark:border-gray-700/30 mb-6" />

              {/* Section Boutique */}
              <div className="mb-6">
                <div
                  className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 px-3"
                  style={{
                    fontSize: "12px",
                    letterSpacing: "0.05em",
                    fontWeight: "600",
                  }}
                >
                  {t("nav.shopSection")}
                </div>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setLocation("/shop");
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center px-3 py-3 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg transition-all duration-200 ease-out group mb-1 hover:translate-x-1"
                    style={{
                      fontFamily: "var(--font-nav)",
                      fontSize: "16px",
                      fontWeight: "500",
                    }}
                  >
                    <svg
                      className="w-4 h-4 mr-3"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>
                    <span>{t("nav.shopFocus")}</span>
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-200/30 dark:border-gray-700/30 mb-6" />

              {/* Projets */}
              <div className="mb-6">
                <div
                  className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 px-3"
                  style={{
                    fontSize: "12px",
                    letterSpacing: "0.05em",
                    fontWeight: "600",
                  }}
                >
                  {t("nav.projects")}
                </div>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setLocation("/design-en-action");
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center px-3 py-3 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg transition-all duration-200 ease-out group mb-1 hover:translate-x-1"
                    style={{
                      fontFamily: "var(--font-nav)",
                      fontSize: "16px",
                      fontWeight: "500",
                    }}
                  >
                    <span>{t("nav.designInAction")}</span>
                  </button>

                  <button
                    onClick={() => {
                      setLocation("/creations-sur-mesure");
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center px-3 py-3 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg transition-all duration-200 ease-out group mb-1 hover:translate-x-1"
                    style={{
                      fontFamily: "var(--font-nav)",
                      fontSize: "16px",
                      fontWeight: "500",
                    }}
                  >
                    <span>{t("nav.customCreations")}</span>
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-200/30 dark:border-gray-700/30 mb-6" />

              {/* À propos */}
              <div className="mb-6">
                <div
                  className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 px-3"
                  style={{
                    fontSize: "12px",
                    letterSpacing: "0.05em",
                    fontWeight: "600",
                  }}
                >
                  {t("nav.about")}
                </div>
                <button
                  onClick={() => {
                    setLocation("/about");
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center px-3 py-3 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg transition-all duration-200 ease-out group mb-1 hover:translate-x-1"
                  style={{
                    fontFamily: "var(--font-nav)",
                    fontSize: "16px",
                    fontWeight: "500",
                  }}
                >
                  <span>{t("projects.whoami")}</span>
                </button>
              </div>

              <div className="border-t border-gray-200/30 dark:border-gray-700/30 mb-6" />

              {/* Paramètres */}
              <div className="mb-6">
                <div
                  className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 px-3"
                  style={{
                    fontSize: "12px",
                    letterSpacing: "0.05em",
                    fontWeight: "600",
                  }}
                >
                  {t("settings.title")}
                </div>
                <div className="px-4 py-3 space-y-4 bg-gray-50/30 dark:bg-gray-800/20 rounded-lg">
                  <LanguageToggle
                    variant="switch"
                    size="default"
                    showLabel={true}
                  />
                  <div style={{ marginLeft: "-7px" }}>
                    <ThemeToggle size="md" />
                  </div>
                </div>
              </div>
            </nav>

            {/* Footer sobre et épuré */}
            <div className="mt-auto border-t border-gray-200/30 dark:border-gray-700/30 bg-gray-50/30 dark:bg-gray-800/20 px-6 py-4">
              <div className="space-y-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  © 2025 Alto Lille
                </p>

                {/* Badge EcoIndex - adaptatif au thème */}
                <div className="flex justify-center">
                  <a
                    href="https://bff.ecoindex.fr/redirect/?url=https://www.alto-lille.fr"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Voir le score EcoIndex du site"
                    className="inline-block hover:opacity-80 transition-opacity duration-300"
                  >
                    <img
                      src="https://bff.ecoindex.fr/badge/?theme=light&url=https://www.alto-lille.fr"
                      alt="Badge EcoIndex"
                      className="h-5 dark:hidden"
                    />
                    <img
                      src="https://bff.ecoindex.fr/badge/?theme=dark&url=https://www.alto-lille.fr"
                      alt="Badge EcoIndex"
                      className="h-5 hidden dark:block"
                    />
                  </a>
                </div>

                {/* Mention développeur */}
                <div className="text-center">
                  <a
                    href="https://pogodev.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-300"
                    title="Site développé par Etienne Pogoda"
                  >
                    Développé par Etienne Pogoda
                  </a>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Spacer pour compenser le header fixe */}
      <div className="h-16" />

      <main className="flex-1 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {children}
      </main>

      <footer className="bg-white dark:bg-gray-900 border-t border-slate-200 dark:border-gray-700 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand & Social */}
            <div>
              <div className="flex items-center mb-5">
                <img
                  src="/images/logo.png"
                  alt="Alto Lille"
                  className="h-8 w-auto object-contain mr-3"
                />
                <span
                  className="text-xl sm:text-2xl font-medium text-gray-900 dark:text-gray-100"
                  style={{ fontFamily: "var(--font-titles)" }}
                >
                  Alto Lille
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-5 text-sm leading-relaxed">
                {t("about.description")}
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition p-1"
                  aria-label="Instagram"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Contact */}
            <div className="sm:col-span-1 lg:col-span-2">
              <h4
                className="font-medium text-base mb-5 text-gray-900 dark:text-gray-100"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                {t("footer.contact")}
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg
                    className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-3 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <a
                    href="mailto:altolille@gmail.com"
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-300 text-sm leading-relaxed"
                  >
                    altolille@gmail.com
                  </a>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-3 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    +33 782 086 690
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-3 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    95 rue Pierre Ledent
                    <br />
                    Montreuil-sur-Mer 62170
                  </span>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4
                className="font-medium text-base mb-5 text-gray-900 dark:text-gray-100"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                {t("services.title")}
              </h4>
              <ul className="grid grid-cols-1 gap-2">
                <li>
                  <Link
                    href="/livraison"
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-300 text-sm inline-block"
                  >
                    {t("services.delivery")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/retours"
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-300 text-sm inline-block"
                  >
                    {t("services.returns")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/garantie"
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-300 text-sm inline-block"
                  >
                    {t("services.warranty")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-300 text-sm inline-block"
                  >
                    {t("footer.faq")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-gray-700 mt-10 pt-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div className="flex flex-col items-center md:items-start gap-3 order-2 md:order-1">
                <p className="text-gray-500 dark:text-gray-400 text-xs text-center md:text-left">
                  {t("footer.rights")}
                </p>
                <div className="flex items-center gap-4">
                  {/* Badge EcoIndex - adaptatif au thème */}
                  <a
                    href="https://bff.ecoindex.fr/redirect/?url=https://www.alto-lille.fr"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Voir le score EcoIndex du site"
                  >
                    <img
                      src="https://bff.ecoindex.fr/badge/?theme=light&url=https://www.alto-lille.fr"
                      alt="Ecoindex Badge"
                      className="h-5 dark:hidden"
                    />
                    <img
                      src="https://bff.ecoindex.fr/badge/?theme=dark&url=https://www.alto-lille.fr"
                      alt="Ecoindex Badge"
                      className="h-5 hidden dark:block"
                    />
                  </a>
                  {/* Mention pogodev.com */}
                  <a
                    href="https://pogodev.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-xs transition-colors duration-300"
                    title={t("footer.developer")}
                  >
                    {t("footer.developer")}
                  </a>
                </div>
              </div>

              <div className="flex flex-wrap justify-center md:justify-end gap-5 order-1 md:order-2 mb-4 md:mb-0">
                <Link
                  href="/mentions-legales"
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xs transition-colors duration-300"
                >
                  {t("footer.legal")}
                </Link>
                <Link
                  href="/politique-confidentialite"
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xs transition-colors duration-300"
                >
                  {t("footer.privacy")}
                </Link>
                <Link
                  href="/cgv"
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xs transition-colors duration-300"
                >
                  {t("footer.cgv")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Cart overlay */}
      <CartOverlay open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
