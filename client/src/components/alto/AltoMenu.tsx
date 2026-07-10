import { Link } from "wouter";
import { X } from "lucide-react";
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

interface AltoMenuProps {
  open: boolean;
  onClose: () => void;
}

/** Menu plein écran (mobile + landing) aux couleurs Alto. */
export function AltoMenu({ open, onClose }: AltoMenuProps) {
  const { t } = useLanguage();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-alto-brown text-alto-cream dark:bg-alto-brown-deep">
      <div className="flex h-16 items-center justify-between px-4">
        <AltoMark className="h-9 w-9" />
        <button onClick={onClose} className="p-2" aria-label={t("nav.close")}>
          <X className="h-7 w-7" />
        </button>
      </div>
      <nav className="flex flex-1 flex-col justify-center gap-2 px-8">
        <Link href="/" onClick={onClose} className="py-3 text-3xl font-bold">
          {t("nav.home")}
        </Link>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className="py-3 text-3xl font-bold"
          >
            {t(item.labelKey)}
          </Link>
        ))}
        <button
          onClick={() => {
            onClose();
            setTimeout(scrollToContact, 300);
          }}
          className="py-3 text-left text-3xl font-bold"
        >
          {t("nav.contact")}
        </button>
      </nav>
      <div className="flex items-center gap-6 px-8 pb-10">
        <LanguageToggle variant="switch" size="default" showLabel={true} />
        <ThemeToggle size="md" />
      </div>
    </div>
  );
}
