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
  const { getTotalItems } = useCart();
  const [location] = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <a className="flex items-center">
              <img
                src="/public/images/logo.png"
                alt="FOCUS"
                className="h-10 w-auto"
              />
            </a>
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link href="/">
              <a
                className={`font-medium ${
                  location === "/"
                    ? "text-primary"
                    : "text-dark hover:text-primary-foreground/80 transition"
                }`}
              >
                Accueil
              </a>
            </Link>
            <a
              href="#product-details"
              className="font-medium text-dark hover:text-muted-foreground transition"
            >
              Produits
            </a>
            <a
              href="#"
              className="font-medium text-dark hover:text-muted-foreground transition"
            >
              À propos
            </a>
            <a
              href="#"
              className="font-medium text-dark hover:text-muted-foreground transition"
            >
              Contact
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            {showCart && (
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-transparent"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingBag className="h-5 w-5" />
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {getTotalItems()}
                </span>
              </Button>
            )}

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col h-full pt-6">
                  <nav className="flex flex-col space-y-4">
                    <Link href="/">
                      <a
                        className={`font-medium px-2 py-2 ${
                          location === "/" ? "text-primary" : "text-dark"
                        }`}
                      >
                        Accueil
                      </a>
                    </Link>
                    <a
                      href="#product-details"
                      className="font-medium px-2 py-2"
                    >
                      Produits
                    </a>
                    <a href="#" className="font-medium px-2 py-2">
                      À propos
                    </a>
                    <a href="#" className="font-medium px-2 py-2">
                      Contact
                    </a>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img
                  src="/public/images/logo.png"
                  alt="FOCUS"
                  className="h-10 w-auto"
                />
              </div>
              <p className="text-gray-400 mb-4">
                Illuminez votre intérieur avec notre concept de lampe écologique
                et design, fabriquée en France.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition"
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
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-lg mb-4">Produits</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    FOCUS.01
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Nouveautés
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Meilleures ventes
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Éditions limitées
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-lg mb-4">Services</h4>
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

            <div>
              <h4 className="font-medium text-lg mb-4">Contact</h4>
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
                  <span className="text-gray-400">contact@focus-design.fr</span>
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
                  <span className="text-gray-400">+33 (0)1 23 45 67 89</span>
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
                    12 rue des Luminaires
                    <br />
                    75011 Paris, France
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; 2023 FOCUS. Tous droits réservés.
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

            <div className="flex gap-2 mt-4 md:mt-0">
              <svg
                className="h-8 w-auto opacity-70"
                viewBox="0 0 576 512"
                fill="currentColor"
              >
                <path d="M470.1 231.3s7.6 37.2 9.3 45H446c3.3-8.9 16-43.5 16-43.5-.2.3 3.3-9.1 5.3-14.9l2.8 13.4zM576 80v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48h480c26.5 0 48 21.5 48 48zM152.5 331.2L215.7 176h-42.5l-39.3 106-4.3-21.5-14-71.4c-2.3-9.9-9.1-12.7-18.2-13.1H32.7l-.7 3.1c15.8 4 29.9 9.8 42.2 17.1l35.8 135h42.5zm94.4.2L272.1 176h-40.2l-25.1 155.4h40.1zm139.9-50.8c.2-17.7-10.6-31.2-33.7-42.3-14.1-7.1-22.7-11.9-22.7-19.2.2-6.6 7.3-13.4 23.1-13.4 13.1-.3 22.7 2.8 29.9 5.9l3.6 1.7 5.5-33.6c-7.9-3.1-20.5-6.6-36-6.6-39.7 0-67.6 21.2-67.8 51.4-.3 22.3 20 34.7 35.2 42.2 15.5 7.6 20.8 12.6 20.8 19.3-.2 10.4-12.6 15.2-24.1 15.2-16 0-24.6-2.5-37.7-8.3l-5.3-2.5-5.6 34.9c9.4 4.3 26.8 8.1 44.8 8.3 42.2.1 69.7-20.8 70-53zM528 331.4L495.6 176h-31.1c-9.6 0-16.9 2.8-21 12.9l-59.7 142.5H426s6.9-19.2 8.4-23.3H486c1.2 5.5 4.8 23.3 4.8 23.3H528z" />
              </svg>
              <svg
                className="h-8 w-auto opacity-70"
                viewBox="0 0 576 512"
                fill="currentColor"
              >
                <path d="M482.9 410.3c0 6.8-4.6 11.7-11.2 11.7-6.8 0-11.2-5.2-11.2-11.7 0-6.5 4.4-11.7 11.2-11.7 6.6 0 11.2 5.2 11.2 11.7zm-310.8-11.7c-7.1 0-11.2 5.2-11.2 11.7 0 6.5 4.1 11.7 11.2 11.7 6.5 0 10.9-4.9 10.9-11.7-.1-6.5-4.4-11.7-10.9-11.7zm117.5-.3c-5.4 0-8.7 3.5-9.5 8.7h19.1c-.9-5.7-4.4-8.7-9.6-8.7zm107.8.3c-6.8 0-10.9 5.2-10.9 11.7 0 6.5 4.1 11.7 10.9 11.7 6.8 0 11.2-4.9 11.2-11.7 0-6.5-4.4-11.7-11.2-11.7zm105.9 26.1c0 .3.3.5.3 1.1 0 .3-.3.5-.3 1.1-.3.3-.3.5-.5.8-.3.3-.5.5-1.1.5-.3.3-.5.3-1.1.3-.3 0-.5 0-1.1-.3-.3 0-.5-.3-.8-.5-.3-.3-.5-.5-.5-.8-.3-.5-.3-.8-.3-1.1 0-.5 0-.8.3-1.1 0-.5.3-.8.5-.8.3-.3.5-.5.8-.5.5-.3.8-.3 1.1-.3.5 0 .8 0 1.1.3.5.3.8.3.8.5s.3.5.5.8zm-2.2 1.4c.5 0 .5-.3.8-.3 0-.3.3-.3.3-.5 0-.3 0-.3.3-.3 0-.3-.3-.3-.3-.3-.3 0-.5-.3-.8-.3-.3 0-.5 0-.8.3 0 0-.3 0-.3.3 0 0 0 .3.3.3 0 .3.3.3.3.5.5-.3.5-.3.8-.3zm3.3-10.3c-6.8 0-10.9 5.2-10.9 11.7 0 6.5 4.1 11.7 10.9 11.7 6.8 0 11.2-4.9 11.2-11.7 0-6.5-4.4-11.7-11.2-11.7zm-3.6-1.5h7.4v-17.6h10.6v-7.8h-28.3v7.8h10.3v17.6zm-9-9.1h-7.4v-7.5h-10.9v7.5h-5.2v6.1h5.2v10.6c0 5.4 2.7 7.8 8.7 7.8 3.3 0 6.3-1.1 8.4-2.2v-6.8c-1.4.3-3.3.8-4.6.8-1.9 0-2.7-.8-2.7-3v-7.1h7.5v-6.2zm46.7-7.4h-7.9v2.2c-2.2-1.9-5.2-3-9-3-8.7 0-15.8 7.3-15.8 16.3s7.1 16.3 15.8 16.3c3.8 0 6.8-1.1 9-3v2.2h7.9V383zm36.2 0c-2.2-1.9-5.2-3-9-3-8.7 0-15.8 7.3-15.8 16.3s7.1 16.3 15.8 16.3c3.8 0 6.8-1.1 9-3v2.2h7.9V383h-7.9v2.2zm-9 16.3c3.3 0 5.7-2.4 5.7-5.7 0-3.3-2.4-5.7-5.7-5.7-3.3 0-5.7 2.4-5.7 5.7 0 3.3 2.4 5.7 5.7 5.7zm-99.3-16.3h-7.9v2.2c-2.2-1.9-5.2-3-9-3-8.7 0-15.8 7.3-15.8 16.3s7.1 16.3 15.8 16.3c3.8 0 6.8-1.1 9-3v2.2h7.9V383zm-9 16.3c3.3 0 5.7-2.4 5.7-5.7 0-3.3-2.4-5.7-5.7-5.7-3.3 0-5.7 2.4-5.7 5.7 0 3.3 2.4 5.7 5.7 5.7zm-26.6-26.1v-16.3h-7.9v44h7.9v-16c0-7.6 11.7-6.5 11.7 0v16h7.9v-18.2c.1-10.1-15.9-10.8-19.6-2.7v-6.8zm54.8 10.4v22h-7.9v-22c0-4.1-2.7-5.7-5.7-5.7-2.7 0-4.9 1.4-6 3.3v24.4h-7.9v-34.8h7.9v2.2c2.2-1.9 5.2-3 9-3 7.8-.1 10.6 5.7 10.6 13.6m-99.4-2.2c0-3.8-3-5.7-7.1-5.7-4.3 0-7.6 1.9-9.8 3.7l-3.5-5.4c3.3-2.7 8.2-4.6 13.9-4.6 8.2 0 14.7 3.8 14.7 12v16.3h-7.4v-2.2c-2.4 1.9-5.7 3-9.5 3-6 0-10.9-3.3-10.9-9.2.1-5.8 4.7-9.8 13.3-9.8h6.3v-1.1zm-6.8 7.3c-4.1 0-5.7 1.4-5.7 3.3 0 2.2 1.9 3.5 4.6 3.5 2.4 0 4.9-.8 6.3-2.2v-4.6h-5.2zm-32.9 5.7V383h7.9v39c0 7.8-3.8 10.3-11.7 10.3-3.3 0-6.3-.5-8.2-1.9v-7.3c1.4 1.1 3.3 1.4 5.4 1.4 2.8 0 6.6-.3 6.6-4.9v-2.5c-2.2 1.9-5.2 3-9 3-8.7 0-15.8-7.3-15.8-16.3s7.1-16.3 15.8-16.3c3.8 0 6.9 1.1 9 3zm-5.2 0c-3.3 0-5.7 2.4-5.7 5.7 0 3.3 2.4 5.7 5.7 5.7 3.3 0 5.7-2.4 5.7-5.7 0-3.3-2.4-5.7-5.7-5.7z" />
              </svg>
              <svg
                className="h-8 w-auto opacity-70"
                viewBox="0 0 640 512"
                fill="currentColor"
              >
                <path d="M116.9 158.5c-7.5 8.9-19.5 15.9-31.5 14.9-1.5-37.1 32.1-46.2 32.1-46.2-2.8 32.9-9.3 54.9 9.5 68.3-12.1-4-22-8.1-22-8.1s.7 13.5 20.2 26.7c0 0-12.4 1.9-25.1-5.9 8.4 27.5 32.2 34.2 32.2 34.2-29.8 5.5-60.7-6.8-60.7-6.8-37.8 41.5 22.1 86.9 108.9 99.9 98.1 14.5 143.6-24 156-41.9 3.1-4.5 4.1-8.6 4.1-12-11.7-27.1-59.7-41.5-85.6-38.4 3.1-9.4 13.3-16.6 13.3-16.6 14.5 5.6 61.2 31.1 78.8 42.7 48.5-7.8 31-65.2 31-65.2s31.9-5 21.2-36.4c1-1.7-32.9-17-62-14.9 20.5-32.8-29-51.6-29-51.6-53.4 24.7-33.3 99.9-33.3 99.9 10.3-15.5 64.2-24.4 64.2-24.4 19.1 7.3 33.3 27.1 33.3 27.1-8.4-57.1-69.8-51.2-74.8-50.2-39.7 10.4-75.2 57-76.3 58.4-1.7-3.2-2.6-11.7 0-20.7-1.1-.3-1.9 0-2.8 0 0-7.2 1.9-17.6 2.8-20.7 0 0-.9-.4-1.7-.3-3.1 1.5-3.9 22.3-3.9 22.3-1.1 0-1.9.3-2.8.3l.1-.3c-4.7 9.8-10.9 20.7-13.9 25.1-5.9-6.2-20.2-46.8-27.4-53.2 30.7-8.9 31.3-38.2 23.1-55-7.8-9.9-20.6-11.3-20.6-11.3 4.5-56.8-42.3-83.1-90.8-43.4-70.1 57.5 23.6 115.3 23.6 115.3-58.9 4.7-53.2 85-53.2 85-3.4 118 141.3 152.5 176.4 123.5-56.3 44.4-146.7 32.4-146.7 32.4 29.3 13.6 89.9 34.8 121.6 28.7 31.7-6.1 95.2-74.4 95.2-74.4 32.7 62.1-36.5 153.4-138.1 164-6.7.7 40.8 28-64.4 28-128.9 0-84.1-75.2-84.1-75.2 23.6 5.1 53.9 2.9 77.5-7.3 0 0 .9-6.5-6.4-9-7.3-2.5-43.4-11.3-71.2-38.5 0 0-26.6-46.4 17.4-82.1-5.9 7.3-14.2 18.1-14.2 18.1-46.3 43-9.5 117.2 65.5 146.6C187.9 489.3 106 467.1 89 429.8c0 0-20-29.9 14.6-73.5-10.9 2.8-28 10.3-32.8 14.5 0 0-14.4-12.1-24.7-36.5C36.5 310.2 6.6 345.6.9 392c-.7 5.6-3.5 51.9 78.1 92.7 48.1 24 114.2 24 160.6 11.7 118.1-31.4 130.2-131 130.2-131 16.1-57.5-23.4-92.7-57.5-123.5l-45.6-36.4zM80.7 272h3.1v33.3h-3.1zM91 272h4.1l2.8 8.5c.5 1.7 1.1 3.9 1.5 5.9h.1c.4-2 .9-4.1 1.5-5.9l2.8-8.5h3.9v33.3h-3v-15.2c0-3.9.3-9.7.5-13.6h-.1l-2.1 6.6-3.2 9.5h-1.5l-3.2-9.5-2.1-6.6h-.1c.2 3.9.5 9.7.5 13.6v15.2h-2.8zM114.1 272h3.1v33.3h-3.1zM133.9 272h3.1v30.1h9.2v3.2h-12.3zM151.6 272h3.1v33.3h-3.1zM161.8 272h3.1v33.3h-3.1zM173.6 275.1h-6.2V272h15.5v3.1h-6.2v30.1h-3.1zM190.5 272h5c6.1 0 9.9 3.5 9.9 10.4 0 7.7-4.7 10.9-9.4 10.9h-2.4v12h-3.1zm3.1 18.1h2c3.5 0 6.6-1.4 6.6-7.7 0-5.5-2.5-7.3-6.4-7.3h-2.2zM236.6 272h3.1v18.5c0 9.6-4.2 15.4-13.2 15.4-2 0-3.9-.3-5.5-.8v-3.2c1.4.5 3.1.9 5.3.9 7.3 0 10.3-4.3 10.3-12.2zM245.1 272h3.1v33.3h-3.1zM262.2 275.1H256V272h15.5v3.1h-6.2v30.1h-3.1zM308.6 304.6c-1.4.5-4.2.9-7.3.9-9.8 0-15.3-5.3-15.3-16.7 0-10.9 6.7-17.3 16.1-17.3 3.4 0 5.5.7 6.4 1.1l-1.1 2.8c-1.1-.4-2.7-1-5.3-1-6.2 0-12.9 4-12.9 14.1 0 8.6 4.3 13.7 12.6 13.7 2.3 0 4.5-.4 5.9-1zM334.1 289.3c0 10.9-6.7 16.8-14.8 16.8-8.5 0-14.4-6.3-14.4-16.2 0-10.3 6.1-16.8 14.8-16.8 8.9 0 14.4 6.7 14.4 16.2zm-25.9.4c0 6.8 3.5 13.4 11.4 13.4 8 0 11.3-7 11.3-13.8 0-6.1-3-13.4-11.3-13.4-8.3 0-11.4 6.9-11.4 13.8zM339.9 272h3.1v30.1h9.2v3.2h-12.3zM355.5 284.9c0-2.5-.1-4.5-.1-6.2h2.8v3.8h.1c1-2.5 3.4-4.3 6.2-4.3.5 0 .8 0 1.1.1v3.1c-.4-.1-.8-.1-1.3-.1-2.8 0-4.7 2-5.3 4.9-.1.5-.2 1.1-.2 1.7v12.7h-3.2zM366.7 297c1 .6 3.1 1.3 4.8 1.3 2.4 0 3.5-1 3.5-2.5s-.8-2.2-3.4-3.1c-3.4-1.1-5.1-2.9-5.1-5.8 0-3.4 2.8-6 7.1-6 2.1 0 3.9.5 5 1.1l-.9 2.7c-.8-.5-2.3-1.1-4.2-1.1-2.1 0-3.1 1.1-3.1 2.3 0 1.4.9 2 3.5 2.9 3.4 1.2 5 2.8 5 6 0 3.4-2.6 6.1-7.7 6.1-2.2 0-4.4-.6-5.5-1.3zM394.4 287.7c0-2.1 0-3.8-.1-5.3h2.9v3.4h.1c.7-1.4 2.6-3.9 6.5-3.9 2.7 0 5 1.6 5.9 3.9h.1c.7-1.1 1.5-1.9 2.5-2.6 1.3-.8 2.8-1.3 4.8-1.3 2.9 0 7.2 1.9 7.2 9.5v12.9H421v-12.4c0-4.2-1.6-6.8-4.8-6.8-2.3 0-4.1 1.7-4.8 3.6-.2.5-.3 1.2-.3 1.9v13.7h-3.3v-13.3c0-3.5-1.6-5.9-4.7-5.9-2.5 0-4.3 2-5 4 -.2.5-.3 1.2-.3 1.8v13.4h-3.3zM458.2 262v24.9h.1l8.8-9.1h4.1l-9.5 9.5 10.8 13.8h-4.1l-9-11.9-1.2 1.2v10.8h-3.1v-39.2zM486.8 304.4c-5.9 0-10.6-4.3-10.6-16.5 0-10.8 4.9-16.5 11-16.5 6.3 0 10.7 5.8 10.7 16.5 0 13.5-6.1 16.5-11 16.5zm.2-3c3.3 0 7.5-3.1 7.5-13.5 0-9.4-3.7-13.5-7.6-13.5-3.8 0-7.6 3.9-7.6 13.5 0 9.3 3.3 13.5 7.6 13.5zM530.1 285v-1.9c0-7.3-2.9-8.6-5.3-8.6-4.1 0-6.1 3.7-6.2 8.6H507c.4-8.1 6.5-15.7 18-15.7 10.7 0 16.1 6.1 16.1 17.3v11.5c0 2.9.1 5.1.2 6.6h-10.8c-.1-.9-.2-2.5-.2-4.1h-.1c-1.2 2.3-4.2 5.2-9.7 5.2-6.8 0-12.6-4.7-12.6-12 0-6.2 3.6-9.7 8.1-11.3 10.6-3.9 14.1-4.7 14.1-4.7zm-10.5 16.3c2.8 0 5-2.1 5.9-4.6.2-.5.3-1.1.3-1.6v-2.4c-6.2 1.5-9.1 3.1-9.1 5.5 0 1.7 1.3 3.1 2.9 3.1zM562.9 292.7c.2 3.2 2.7 4.9 6.3 4.9 2.4 0 4.5-.4 6.6-1.1l1.1 7.5c-2.5 1-6.1 1.5-9.6 1.5-10.2 0-16-5.9-16-16 0-8.1 4.7-16.9 15.2-16.9 9.2 0 13.6 7.2 13.6 15.6 0 1.9-.2 3.7-.4 4.7h-16.8zm8.5-7.5c0-1.9-.8-5.2-4.5-5.2-3.3 0-4.7 3.1-4.9 5.2h9.4z" />
              </svg>
            </div>
          </div>
        </div>
      </footer>

      {/* Cart overlay */}
      <CartOverlay open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
