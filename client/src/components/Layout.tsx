import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { CartOverlay } from "@/components/CartOverlay";
import { useCart } from "@/hooks/useCart";
import { ShoppingBag, Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

interface LayoutProps {
  children: ReactNode;
  showCart?: boolean;
}

export function Layout({ children, showCart = true }: LayoutProps) {
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { getTotalItems } = useCart();
  const [location] = useLocation();

  // Calculer une seule fois le nombre d'articles
  const cartItemCount = getTotalItems();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="sticky top-0 bg-white z-10 border-b border-slate-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <div className="w-10">
            {" "}
            {/* Espace réservé à gauche pour équilibrer */}
            {/* Mobile menu trigger */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {menuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </Button>
          </div>

          {/* Titre centré */}
          <Link href="/">
            <a className="text-[var(--color-text)] transition-colors hover:text-primary flex-1 text-center">
              <span
                className="font-accent text-xl sm:text-2xl md:text-3xl"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                Alto Lille
              </span>
            </a>
          </Link>

          <div className="w-10 flex justify-end">
            {" "}
            {/* Espace réservé à droite pour le panier */}
            {showCart && (
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-transparent"
                onClick={() => setCartOpen(true)}
                aria-label={`Voir panier - ${cartItemCount} article${
                  cartItemCount !== 1 ? "s" : ""
                }`}
              >
                <ShoppingBag className="h-5 w-5" aria-hidden="true" />
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

      <footer id="contact" className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <span
                  className="text-xl font-medium"
                  style={{ fontFamily: "var(--font-titles)" }}
                >
                  Alto Lille
                </span>
              </div>
              <p className="text-gray-400 mb-4">
                Illuminez votre intérieur avec notre concept de lampe écologique
                et design, fabriquée en France.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition"
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
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition"
                  aria-label="Facebook"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="md:col-span-2">
              <h4
                className="font-medium text-lg mb-4"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                Contact
              </h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <svg
                    className="h-5 w-5 text-gray-400 mt-1 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <a
                    href="mailto:altolille@gmail.com"
                    className="text-gray-400 hover:text-white transition"
                  >
                    altolille@gmail.com
                  </a>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-5 w-5 text-gray-400 mt-1 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span className="text-gray-400">+33 782 086 690</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-5 w-5 text-gray-400 mt-1 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-gray-400">
                    95 rue Pierre Ledent
                    <br />
                    Montreuil-sur-Mer 62170
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h4
                className="font-medium text-lg mb-4"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                Services
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Livraison
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Retours
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Garantie
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; 2023 Alto Lille. Tous droits réservés.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition"
              >
                Mentions légales
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition"
              >
                Politique de confidentialité
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition"
              >
                CGV
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Cart overlay */}
      <CartOverlay open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
