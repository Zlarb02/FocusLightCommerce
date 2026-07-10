import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { CartOverlay } from "@/components/CartOverlay";
import { AnimatedCartIcon } from "@/components/AnimatedCartIcon";
import { useCart } from "@/hooks/useCart";
import { X, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageToggle } from "@/components/LanguageToggle";
import { AltoMark, AltoLogotype } from "@/components/alto/AltoBrand";
import ThemeDecorator from "@/components/decorations/ThemeDecorator";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ThemeDecoration } from "../../../shared/schema";
import "./Layout-dark-contrast.css";

interface LayoutProps {
  children: ReactNode;
  showCart?: boolean;
  /** brown = bandeau brun (Accueil, Catalogue) · surface = fond de page (autres pages) */
  headerTone?: "brown" | "surface";
  /** Couleur du footer selon la maquette : brun (commerce) ou bleu (studio / sur-mesure) */
  footerTone?: "brown" | "blue" | "none";
}

const NAV_ITEMS: Array<{ label: string; href: string }> = [
  { label: "Catalogue", href: "/shop" },
  { label: "Fabrication", href: "/design-en-action" },
  { label: "Studio", href: "/about" },
  { label: "Sur mesure", href: "/creations-sur-mesure" },
];

function scrollToContact() {
  const el = document.getElementById("footer-contact");
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  } else {
    window.location.href = "mailto:altolille@gmail.com";
  }
}

export function Layout({
  children,
  showCart = true,
  headerTone = "surface",
  footerTone = "brown",
}: LayoutProps) {
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { getTotalItems } = useCart();
  const [location] = useLocation();
  const { t } = useLanguage();

  const cartItemCount = getTotalItems();
  const isBrown = headerTone === "brown";

  // Décoration thématique saisonnière (gérée depuis l'admin)
  const { data: themeData } = useQuery({
    queryKey: ["themeDecoration"],
    queryFn: async () =>
      apiRequest<{ themeDecoration: ThemeDecoration }>(
        "GET",
        "/api/versions/theme-decoration"
      ),
  });

  const headerClasses = isBrown
    ? "bg-alto-brown text-alto-cream dark:bg-alto-brown-deep"
    : "bg-background text-primary";
  const linkClasses = isBrown
    ? "text-alto-cream/90 hover:text-alto-cream"
    : "text-primary hover:text-alto-orange-soft";

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {themeData && <ThemeDecorator decoration={themeData.themeDecoration} />}
      <header
        className={`sticky top-0 z-50 transition-colors duration-300 ${headerClasses}`}
      >
        <div className="mx-auto flex h-16 md:h-20 max-w-[1600px] items-center justify-between px-4 md:px-10">
          {/* Burger mobile */}
          <button
            onClick={() => setMenuOpen(true)}
            className="p-2 md:hidden"
            aria-label={t("nav.menu")}
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Monogramme */}
          <Link
            href="/"
            aria-label="Accueil Alto Lille"
            className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 transition-opacity hover:opacity-80"
          >
            <AltoMark className="h-9 w-9 md:h-11 md:w-11" />
          </Link>

          {/* Navigation desktop */}
          <nav
            className="hidden md:flex items-center gap-8 lg:gap-12 text-[17px] font-medium"
            style={{ fontFamily: "var(--font-nav)" }}
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${linkClasses} transition-colors ${
                  location === item.href ? "underline underline-offset-8" : ""
                }`}
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={scrollToContact}
              className={`${linkClasses} transition-colors`}
            >
              Contact
            </button>
          </nav>

          {/* Actions à droite */}
          <div className="flex items-center gap-1 md:gap-2">
            <span className="hidden md:flex items-center gap-1">
              <LanguageToggle variant="minimal" size="sm" showLabel={false} />
              <ThemeToggle variant="minimal" size="sm" showLabel={false} />
            </span>
            {showCart && (
              <button
                className="relative p-2 transition-transform hover:scale-110"
                onClick={() => setCartOpen(true)}
                aria-label={`${t("nav.cart")} (${cartItemCount})`}
              >
                <AnimatedCartIcon itemCount={cartItemCount} onCartUpdate={() => {}} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Menu mobile plein écran */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-alto-brown text-alto-cream dark:bg-alto-brown-deep">
          <div className="flex h-16 items-center justify-between px-4">
            <AltoMark className="h-9 w-9" />
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2"
              aria-label={t("nav.close")}
            >
              <X className="h-7 w-7" />
            </button>
          </div>
          <nav className="flex flex-1 flex-col justify-center gap-2 px-8">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="py-3 text-3xl font-bold"
            >
              Accueil
            </Link>
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="py-3 text-3xl font-bold"
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={() => {
                setMenuOpen(false);
                setTimeout(scrollToContact, 300);
              }}
              className="py-3 text-left text-3xl font-bold"
            >
              Contact
            </button>
          </nav>
          <div className="flex items-center gap-6 px-8 pb-10">
            <LanguageToggle variant="switch" size="default" showLabel={true} />
            <ThemeToggle size="md" />
          </div>
        </div>
      )}

      <main className="flex-1">{children}</main>

      {footerTone !== "none" && <AltoFooter tone={footerTone} />}

      <CartOverlay open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

function AltoFooter({ tone }: { tone: "brown" | "blue" }) {
  const { t } = useLanguage();
  const bg =
    tone === "blue"
      ? "bg-alto-blue"
      : "bg-alto-brown dark:bg-alto-brown-deep";

  return (
    <footer id="footer-contact" className={`${bg} text-alto-cream`}>
      <div className="mx-auto grid max-w-[1600px] gap-12 px-6 py-14 md:grid-cols-2 md:px-14 md:py-20">
        {/* Logotype géant */}
        <div className="flex items-end">
          <AltoLogotype
            color="cream"
            className="w-full max-w-[280px] md:max-w-[480px] h-auto"
          />
        </div>

        {/* Colonnes de liens */}
        <div className="grid grid-cols-2 gap-10 text-[16px] md:text-[17px]">
          <div className="space-y-4">
            <Link href="/shop" className="block font-bold hover:underline">
              Catalogue
            </Link>
            <Link
              href="/design-en-action"
              className="block font-bold hover:underline"
            >
              Fabrication
            </Link>
            <div className="pt-4">
              <p className="mb-2 font-bold">{t("footer.contact")}</p>
              <a
                href="mailto:altolille@gmail.com"
                className="block hover:underline"
              >
                altolille@gmail.com
              </a>
              <a href="tel:+33782086690" className="block hover:underline">
                +33 782 086 690
              </a>
              <p>
                95 rue Pierre Ledent
                <br />
                Montreuil-sur-Mer 62170
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <a
              href="https://www.instagram.com/altolille"
              target="_blank"
              rel="noopener noreferrer"
              className="block font-bold hover:underline"
            >
              Instagram
            </a>
            <Link href="/about" className="block font-bold hover:underline">
              Studio
            </Link>
            <div className="pt-4">
              <p className="mb-2 font-bold">{t("services.title")}</p>
              <Link href="/livraison" className="block hover:underline">
                {t("services.delivery")}
              </Link>
              <Link href="/retours" className="block hover:underline">
                {t("services.returns")}
              </Link>
              <Link href="/faq" className="block hover:underline">
                {t("footer.faq")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Ligne du bas */}
      <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-4 px-6 pb-8 text-[13px] text-alto-cream/80 md:flex-row md:px-14">
        <p>© 2025 Alto Lille — Tous droits réservés</p>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <Link href="/mentions-legales" className="hover:underline">
            {t("footer.legal")}
          </Link>
          <Link href="/politique-confidentialite" className="hover:underline">
            {t("footer.privacy")}
          </Link>
          <Link href="/cgv" className="hover:underline">
            {t("footer.cgv")}
          </Link>
          <a
            href="https://bff.ecoindex.fr/redirect/?url=https://www.alto-lille.fr"
            target="_blank"
            rel="noopener noreferrer"
            title="Score EcoIndex du site"
          >
            <img
              src="https://bff.ecoindex.fr/badge/?theme=dark&url=https://www.alto-lille.fr"
              alt="Badge EcoIndex"
              className="h-5"
              loading="lazy"
            />
          </a>
          <a
            href="https://pogodev.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Développé par Etienne Pogoda
          </a>
          <span>Design par RARE.design</span>
        </div>
      </div>
    </footer>
  );
}
