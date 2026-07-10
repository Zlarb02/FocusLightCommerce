import { useEffect, useState } from "react";
import { Link } from "wouter";
import { X, ArrowUpRight, Instagram } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AltoMark } from "@/components/alto/AltoBrand";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";

export const NAV_ITEMS: Array<{ labelKey: string; href: string }> = [
  { labelKey: "nav.catalogue", href: "/shop" },
  { labelKey: "nav.fabrication", href: "/design-en-action" },
  { labelKey: "nav.studio", href: "/about" },
  { labelKey: "nav.surMesure", href: "/creations-sur-mesure" },
];

export function scrollToContact() {
  const el = document.getElementById("footer-contact");
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  } else {
    window.location.href = "mailto:altolille@gmail.com";
  }
}

const INSTAGRAM_URL = "https://www.instagram.com/alto_lille/";

/** Entrées du menu avec leur visuel d'aperçu (desktop). */
const MENU_ENTRIES: Array<{ labelKey: string; href: string; img: string }> = [
  { labelKey: "nav.home", href: "/", img: "/images/alto/hero.jpg" },
  { labelKey: "nav.catalogue", href: "/shop", img: "/images/alto/prod-auferte.jpg" },
  {
    labelKey: "nav.fabrication",
    href: "/design-en-action",
    img: "/images/alto/fab-bois.jpg",
  },
  { labelKey: "nav.studio", href: "/about", img: "/images/alto/studio-portrait.jpg" },
  {
    labelKey: "nav.surMesure",
    href: "/creations-sur-mesure",
    img: "/images/alto/surmesure-lampe.jpg",
  },
];

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.32, 0.72, 0.22, 1] },
  },
};

interface AltoMenuProps {
  open: boolean;
  onClose: () => void;
}

/** Menu plein écran (mobile + landing) aux couleurs Alto. */
export function AltoMenu({ open, onClose }: AltoMenuProps) {
  const { t } = useLanguage();
  const [hovered, setHovered] = useState(0);

  // Échap pour fermer + verrouillage du scroll pendant l'ouverture
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  const preview = MENU_ENTRIES[hovered] ?? MENU_ENTRIES[0];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[60] flex flex-col bg-alto-brown text-alto-cream dark:bg-alto-brown-deep"
          role="dialog"
          aria-modal="true"
        >
          {/* Barre du haut */}
          <div className="flex h-16 shrink-0 items-center justify-between px-4 md:h-20 md:px-8">
            <Link href="/" onClick={onClose} aria-label="Accueil Alto Lille">
              <AltoMark className="h-9 w-9 transition-transform duration-300 hover:rotate-6 md:h-10 md:w-10" />
            </Link>
            <button
              onClick={onClose}
              className="group flex items-center gap-2 p-2 text-alto-cream/80 transition-colors hover:text-alto-cream"
              aria-label={t("nav.close")}
            >
              <span
                className="hidden text-xs font-semibold uppercase tracking-[0.22em] md:inline"
                style={{ fontFamily: "var(--font-nav)" }}
              >
                {t("nav.close")}
              </span>
              <X className="h-7 w-7 transition-transform duration-300 group-hover:rotate-90" />
            </button>
          </div>

          {/* Corps : liste à gauche, aperçu photo à droite (desktop) */}
          <div className="flex min-h-0 flex-1 items-center">
            <div className="mx-auto grid w-full max-w-[1500px] gap-10 px-6 md:grid-cols-[1.4fr_1fr] md:px-14">
              <motion.nav
                variants={listVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col justify-center"
              >
                {MENU_ENTRIES.map((entry, i) => (
                  <motion.div key={entry.href} variants={itemVariants}>
                    <Link
                      href={entry.href}
                      onClick={onClose}
                      onMouseEnter={() => setHovered(i)}
                      onFocus={() => setHovered(i)}
                      className="group flex items-baseline gap-4 border-b border-alto-cream/10 py-3 md:gap-6 md:py-4"
                    >
                      <span
                        className="w-7 shrink-0 text-sm font-semibold text-alto-orange-soft md:text-base"
                        style={{ fontFamily: "var(--font-nav)" }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className="text-3xl font-bold leading-tight transition-all duration-300 group-hover:translate-x-2 group-hover:text-alto-orange-soft md:text-5xl lg:text-6xl"
                        style={{ fontFamily: "var(--font-titles)" }}
                      >
                        {t(entry.labelKey)}
                      </span>
                      <ArrowUpRight className="h-6 w-6 shrink-0 self-center opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100 md:h-8 md:w-8" />
                    </Link>
                  </motion.div>
                ))}

                <motion.div variants={itemVariants}>
                  <button
                    onClick={() => {
                      onClose();
                      setTimeout(scrollToContact, 300);
                    }}
                    className="group flex w-full items-baseline gap-4 py-3 text-left md:gap-6 md:py-4"
                  >
                    <span
                      className="w-7 shrink-0 text-sm font-semibold text-alto-orange-soft md:text-base"
                      style={{ fontFamily: "var(--font-nav)" }}
                    >
                      {String(MENU_ENTRIES.length + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="text-3xl font-bold leading-tight transition-all duration-300 group-hover:translate-x-2 group-hover:text-alto-orange-soft md:text-5xl lg:text-6xl"
                      style={{ fontFamily: "var(--font-titles)" }}
                    >
                      {t("nav.contact")}
                    </span>
                    <ArrowUpRight className="h-6 w-6 shrink-0 self-center opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100 md:h-8 md:w-8" />
                  </button>
                </motion.div>
              </motion.nav>

              {/* Aperçu photo de la section survolée */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25, duration: 0.45 }}
                className="relative hidden aspect-[4/5] max-h-[62vh] w-full self-center overflow-hidden md:block"
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.img
                    key={preview.img}
                    src={preview.img}
                    alt={t(preview.labelKey)}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                  />
                </AnimatePresence>
                <span
                  className="absolute bottom-4 left-4 bg-alto-orange px-4 py-1.5 text-sm font-bold text-alto-cream"
                  style={{ fontFamily: "var(--font-titles)" }}
                >
                  {t(preview.labelKey)}
                </span>
              </motion.div>
            </div>
          </div>

          {/* Pied de menu : contact + réglages */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="flex shrink-0 flex-col gap-4 border-t border-alto-cream/10 px-6 py-5 text-sm text-alto-cream/80 md:flex-row md:items-center md:justify-between md:px-14"
          >
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <a href="mailto:altolille@gmail.com" className="hover:text-alto-cream hover:underline">
                altolille@gmail.com
              </a>
              <a href="tel:+33782086690" className="hover:text-alto-cream hover:underline">
                +33 782 086 690
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-alto-cream hover:underline"
              >
                <Instagram className="h-4 w-4" />
                Instagram
              </a>
            </div>
            <div className="flex items-center gap-4">
              <LanguageToggle variant="switch" size="default" showLabel={true} />
              <ThemeToggle size="md" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
