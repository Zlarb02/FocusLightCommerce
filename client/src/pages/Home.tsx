import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { AltoLogotype } from "@/components/alto/AltoBrand";

interface Slide {
  url: string;
  alt?: string;
  order?: number;
}

interface SliderConfig {
  slides?: Slide[];
  autoPlayInterval?: number;
}

const FALLBACK_SLIDES: Slide[] = [
  { url: "/images/alto/hero.jpg", alt: "Lampe Focus.01 — Alto Lille" },
];

/**
 * Accueil — hero plein écran de la maquette :
 * tagline, logotype géant, photo produit en carrousel
 * (« la photo suivante arrive par la droite, en dessous de l'actuelle »).
 */
export default function Home() {
  const { data: config } = useQuery<SliderConfig>({
    queryKey: ["/api/slider/config"],
  });

  const slides = useMemo(() => {
    const list = (config?.slides ?? [])
      .filter((s) => s.url)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return list.length > 0 ? list : FALLBACK_SLIDES;
  }, [config]);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const interval = window.setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      Math.max(config?.autoPlayInterval ?? 4500, 2500)
    );
    return () => window.clearInterval(interval);
  }, [slides.length, config?.autoPlayInterval]);

  const slide = slides[index % slides.length];

  return (
    <Layout headerTone="brown" footerTone="none">
      <section className="grid min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)] grid-cols-1 lg:grid-cols-2">
        {/* Photo produit — carrousel */}
        <div className="relative order-1 lg:order-2 h-[46vh] lg:h-auto overflow-hidden">
          <AnimatePresence initial={false}>
            <motion.img
              key={`${slide.url}-${index}`}
              src={slide.url}
              alt={slide.alt ?? "Création Alto Lille"}
              className="absolute inset-0 h-full w-full object-cover"
              initial={{ x: "100%", y: "10%" }}
              animate={{ x: 0, y: 0 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.7, ease: [0.32, 0.72, 0.22, 1] }}
            />
          </AnimatePresence>
        </div>

        {/* Tagline + logotype */}
        <div className="order-2 lg:order-1 flex flex-col justify-between px-6 py-8 md:px-14 md:py-12">
          <p className="text-xl md:text-2xl font-medium text-foreground">
            Produire moins, fabriquer mieux
          </p>
          <div className="mt-8 lg:mt-0">
            <AltoLogotype
              color="orange"
              className="block w-full max-w-[860px] dark:hidden"
              alt="ALTO Lille"
            />
            <AltoLogotype
              color="cream"
              className="hidden w-full max-w-[860px] dark:block"
              alt="ALTO Lille"
            />
          </div>
        </div>
      </section>
    </Layout>
  );
}
