import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { CartOverlay } from "@/components/CartOverlay";
import { useCart } from "@/hooks/useCart";
import { ShoppingBag, Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import ThemeDecorator from "@/components/decorations/ThemeDecorator";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ThemeDecoration } from "/Users/etiennepogoda/Downloads/FocusLightCommerce/shared/schema";

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
  const [location] = useLocation();

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
    <div className="flex flex-col min-h-screen bg-white">
      {/* Intégration des décorations thématiques */}
      {themeData && <ThemeDecorator decoration={themeData.themeDecoration} />}

      <header className="sticky top-0 bg-white z-10 border-b border-slate-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8">
          <div className="w-10">
            {/* Espace réservé à gauche pour équilibrer */}
          </div>

          {/* Titre centré */}
          <Link href="/" className="scale-125">
            <a className="text-[var(--color-text)] transition-colors hover:text-primary flex-1 text-center">
              <span
                className="font-accent text-xl sm:text-2xl md:text-3xl"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                Alto Lille
              </span>
            </a>
          </Link>

          <div className="w-12 flex justify-end">
            {/* Espace réservé à droite pour le panier */}
            {showCart && (
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-transparent scale-125"
                onClick={() => setCartOpen(true)}
                aria-label={`Voir panier - ${cartItemCount} article${
                  cartItemCount !== 1 ? "s" : ""
                }`}
              >
                <ShoppingBag className="" aria-hidden="true" />
                {cartItemCount > 0 && (
                  <span
                    className="absolute -top-2 -right-2 bg-[var(--color-button)] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                    aria-hidden="true"
                  >
                    {cartItemCount}
                  </span>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-100 animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col py-4 px-4 space-y-4 bg-white">
              <Link href="/">
                <a
                  className={`text-base font-medium ${
                    location === "/"
                      ? "text-primary"
                      : "text-[var(--color-text)]"
                  }`}
                  onClick={() => setMenuOpen(false)}
                  style={{ fontFamily: "var(--font-nav)" }}
                >
                  Accueil
                </a>
              </Link>
              <a
                href="#product-details"
                className="text-base font-medium text-[var(--color-text)]"
                onClick={() => setMenuOpen(false)}
                style={{ fontFamily: "var(--font-nav)" }}
              >
                Produit
              </a>
              <a
                href="#contact"
                className="text-base font-medium text-[var(--color-text)]"
                onClick={() => setMenuOpen(false)}
                style={{ fontFamily: "var(--font-nav)" }}
              >
                Contact
              </a>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-white border-t border-slate-200 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand & Social */}
            <div>
              <div className="flex items-center mb-5">
                <span
                  className="text-xl sm:text-2xl font-medium text-[var(--color-text)]"
                  style={{ fontFamily: "var(--font-titles)" }}
                >
                  Alto Lille
                </span>
              </div>
              <p className="text-gray-600 mb-5 text-sm leading-relaxed">
                Illuminez votre intérieur avec notre concept de lampe écologique
                et design, fabriquée en France.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-500 hover:text-[var(--color-text)] transition p-1"
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
                className="font-medium text-base mb-5 text-[var(--color-text)]"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                Contact
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg
                    className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0"
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
                    className="text-gray-600 hover:text-[var(--color-text)] transition text-sm leading-relaxed"
                  >
                    altolille@gmail.com
                  </a>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0"
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
                  <span className="text-gray-600 text-sm leading-relaxed">
                    +33 782 086 690
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0"
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
                  <span className="text-gray-600 text-sm leading-relaxed">
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
                className="font-medium text-base mb-5 text-[var(--color-text)]"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                Services
              </h4>
              <ul className="grid grid-cols-1 gap-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-[var(--color-text)] transition text-sm inline-block"
                  >
                    Livraison
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-[var(--color-text)] transition text-sm inline-block"
                  >
                    Retours
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-[var(--color-text)] transition text-sm inline-block"
                  >
                    Garantie
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-[var(--color-text)] transition text-sm inline-block"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 mt-10 pt-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <p className="text-gray-500 text-xs order-2 md:order-1 text-center md:text-left">
                &copy; 2023 Alto Lille. Tous droits réservés.
              </p>

              <div className="flex flex-wrap justify-center md:justify-end gap-5 order-1 md:order-2 mb-4 md:mb-0">
                <a
                  href="#"
                  className="text-gray-500 hover:text-[var(--color-text)] text-xs transition"
                >
                  Mentions légales
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:text-[var(--color-text)] text-xs transition"
                >
                  Politique de confidentialité
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:text-[var(--color-text)] text-xs transition"
                >
                  CGV
                </a>
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
