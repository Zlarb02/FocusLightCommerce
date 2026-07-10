import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RotateCcw, ChevronsDown, Menu, ArrowRight } from "lucide-react";
import { AltoMark } from "@/components/alto/AltoBrand";
import { AltoMenu } from "@/components/alto/AltoMenu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

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

/** Cartes de navigation autour du slider (redessinées, palette Alto). */
const LINK_CARDS: Array<{ labelKey: string; href: string; img: string; alt: string }> = [
  {
    labelKey: "nav.fabrication",
    href: "/design-en-action",
    img: "/images/alto/fab-bois.jpg",
    alt: "Tasseaux de chêne massif de réemploi",
  },
  {
    labelKey: "nav.studio",
    href: "/about",
    img: "/images/alto/studio-portrait.jpg",
    alt: "Anatole Collet dans son atelier",
  },
  {
    labelKey: "nav.surMesure",
    href: "/creations-sur-mesure",
    img: "/images/alto/surmesure-lampe.jpg",
    alt: "Lampe sur-mesure chêne et PLA orange",
  },
  {
    labelKey: "nav.catalogue",
    href: "/shop",
    img: "/images/alto/prod-auferte.jpg",
    alt: "Vide-poche Auferte.01",
  },
];

/* ===== Config de l'animation 3D (reprise de l'ancienne landing) ===== */
const CFG = {
  urls: [
    "/images/focus.glb",
    "https://raw.githubusercontent.com/Zlarb02/test-landing/main/src/assets/focus.glb",
  ],
  intro: 0.08,
  rotEnd: 0.75,
  timeScale: 1.2,
  legend: { seg: 0.12, fade: 0.04 },
  slideRight: { start: 0.6, end: 0.9 },
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.max(0, Math.min(v, 1));

function slideAmount(width: number) {
  if (width <= 600) return 36;
  if (width > 1500) return 20;
  return 25;
}

/**
 * Positions des légendes : coins/bords sur desktop ; sur mobile, deux
 * créneaux centrés alternés (pair/impair) pour qu'aucun texte ne se
 * superpose pendant les fondus enchaînés.
 */
const CAPTION_POS = [
  "md:left-[6vw] md:top-[42%]", // cap0
  "md:right-[6vw] md:top-[16%] md:text-right", // cap1
  "md:right-[6vw] md:top-[42%] md:text-right", // cap2
  "md:bottom-[14%] md:right-[6vw] md:text-right", // cap3
  "md:left-[6vw] md:top-[16%]", // cap4
  "md:bottom-[14%] md:left-[6vw]", // cap5
];
const CAPTION_MOBILE_SLOT = [
  "max-md:top-[76px]",
  "max-md:top-[132px]",
  "max-md:top-[76px]",
  "max-md:top-[132px]",
  "max-md:top-[76px]",
  "max-md:top-[132px]",
];

function LinkCard({
  card,
  t,
}: {
  card: (typeof LINK_CARDS)[number];
  t: (k: string) => string;
}) {
  return (
    <Link
      href={card.href}
      className="group flex min-h-0 flex-1 flex-col overflow-hidden"
    >
      <div className="min-h-0 flex-1 overflow-hidden bg-white">
        <img
          src={card.img}
          alt={card.alt}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          loading="lazy"
        />
      </div>
      <span
        className="mt-2 flex items-center justify-between text-sm font-bold text-primary md:text-base"
        style={{ fontFamily: "var(--font-titles)" }}
      >
        {t(card.labelKey)}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

/**
 * Accueil — landing 3D historique remise aux couleurs Alto :
 * intro (slider produits + 4 cartes de navigation), puis animation 3D
 * de la lampe FOCUS.01 pilotée par le scroll, légendes, CTA et replay.
 */
export default function Home() {
  const [, navigate] = useLocation();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const creditsRef = useRef<HTMLDivElement>(null);
  const replayRef = useRef<HTMLButtonElement>(null);
  const capRefs = useRef<Array<HTMLParagraphElement | null>>([]);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const autoScrollingRef = useRef(false);

  /* ----- Slider produits (config admin) pendant l'intro ----- */
  const { data: config } = useQuery<SliderConfig>({
    queryKey: ["/api/slider/config"],
  });

  const slides = useMemo(() => {
    const list = (config?.slides ?? [])
      .filter((s) => s.url)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return list.length > 0 ? list : FALLBACK_SLIDES;
  }, [config]);

  const [slideIndex, setSlideIndex] = useState(0);
  useEffect(() => {
    if (slides.length < 2) return;
    const interval = window.setInterval(
      () => setSlideIndex((i) => (i + 1) % slides.length),
      Math.max(config?.autoPlayInterval ?? 4000, 2500)
    );
    return () => window.clearInterval(interval);
  }, [slides.length, config?.autoPlayInterval]);

  const slide = slides[slideIndex % slides.length];

  /* ----- Couleur de fond du rendu selon le thème ----- */
  useEffect(() => {
    rendererRef.current?.setClearColor(
      theme === "dark" ? "#4A2020" : "#FEF7E8",
      1
    );
  }, [theme]);

  /* ----- Scène Three.js + boucle liée au scroll ----- */
  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!canvas || !stage || !track) return;

    const isLargeScreen = window.innerWidth > 1440;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: "high-performance",
      precision: isLargeScreen ? "highp" : "mediump",
      stencil: false,
    });
    rendererRef.current = renderer;
    renderer.setSize(stage.clientWidth, stage.clientHeight);
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, isLargeScreen ? 2 : 1.5)
    );
    renderer.setClearColor(
      document.documentElement.classList.contains("dark")
        ? "#4A2020"
        : "#FEF7E8",
      1
    );
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      stage.clientWidth / stage.clientHeight,
      0.1,
      1000
    );
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment()).texture;
    scene.add(new THREE.AmbientLight(0xffffff, 1));
    (
      [
        ["#ffffff", 6, 10, 10],
        ["#66ccff", -6, 7, -10],
      ] as const
    ).forEach(([color, x, y, z]) => {
      const spot = new THREE.SpotLight(color, 1.2, 0, Math.PI / 8, 0.25);
      spot.position.set(x, y, z);
      scene.add(spot);
    });

    /* Chargement du modèle */
    let center = new THREE.Vector3();
    let R = 0;
    let r0 = 1, r1 = 1, y0 = 0, y1 = 0, rIntro = 1, yIntro = 0;
    let mixer: THREE.AnimationMixer | undefined;
    let act: THREE.AnimationAction | undefined;
    let clip = 4;
    const loader = new GLTFLoader();
    let disposed = false;

    (async () => {
      for (const url of CFG.urls) {
        try {
          await new Promise<void>((res, rej) =>
            loader.load(
              url,
              (g) => {
                if (disposed) return res();
                scene.add(g.scene);
                g.scene.traverse((o: any) => {
                  if (o.material?.isMeshStandardMaterial) {
                    o.material.envMapIntensity = 1.1;
                  }
                });
                const sphere = new THREE.Box3()
                  .setFromObject(g.scene)
                  .getBoundingSphere(new THREE.Sphere());
                R = sphere.radius;
                center = sphere.center;
                r0 = R * 1.9;
                r1 = R * 7;
                y0 = center.y;
                y1 = center.y - R * 0.05;
                rIntro = R * 2;
                yIntro = center.y + R * 0.8;
                if (g.animations[0]) {
                  mixer = new THREE.AnimationMixer(g.scene);
                  act = mixer.clipAction(g.animations[0]);
                  act.setLoop(THREE.LoopOnce, 0);
                  act.clampWhenFinished = true;
                  act.play();
                  clip = g.animations[0].duration;
                }
                res();
              },
              undefined,
              rej
            )
          );
          break;
        } catch {
          /* essaie l'URL suivante */
        }
      }
    })();

    /* Progression du scroll */
    let prog = 0;
    const reduceMotion = matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    let travelAmp = reduceMotion || window.innerWidth < 600 ? 0.25 : 0.6;
    let slideAmt = slideAmount(window.innerWidth);
    let replayVisible = false;

    const onScroll = () => {
      const max = track.offsetHeight - window.innerHeight;
      prog = clamp01((window.scrollY - track.offsetTop) / Math.max(max, 1));

      const atBottom = prog >= 0.999;
      if (atBottom !== replayVisible) {
        replayVisible = atBottom;
        replayRef.current?.classList.toggle("opacity-100", atBottom);
        replayRef.current?.classList.toggle("pointer-events-auto", atBottom);
      }
    };

    const onResize = () => {
      renderer.setSize(stage.clientWidth, stage.clientHeight);
      camera.aspect = stage.clientWidth / stage.clientHeight;
      camera.updateProjectionMatrix();
      travelAmp = reduceMotion || window.innerWidth < 600 ? 0.25 : 0.6;
      slideAmt = slideAmount(window.innerWidth);
    };

    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onResize);
    onScroll();

    const OFFSET = Math.PI * 0.5;
    let rafId = 0;

    const setCapOpacity = (tt: number) => {
      capRefs.current.forEach((el, i) => {
        if (!el) return;
        const a = i * CFG.legend.seg;
        const b = a + CFG.legend.seg;
        let o = 0;
        if (tt >= a - CFG.legend.fade && tt <= b + CFG.legend.fade) {
          o =
            tt < a
              ? (tt - (a - CFG.legend.fade)) / CFG.legend.fade
              : tt > b
              ? 1 - (tt - b) / CFG.legend.fade
              : 1;
        }
        el.style.opacity = String(o);
      });
    };

    const anim = () => {
      rafId = requestAnimationFrame(anim);
      if (!R) return;

      if (prog < CFG.intro) {
        const k = prog / CFG.intro;
        const r = lerp(rIntro, r0, k);
        const y = lerp(yIntro, y0, k);
        camera.position.set(
          center.x + Math.cos(OFFSET) * r,
          y,
          center.z + Math.sin(OFFSET) * r
        );
        camera.lookAt(center);
        capRefs.current.forEach((el) => el && (el.style.opacity = "0"));
        if (ctaRef.current) {
          ctaRef.current.style.opacity = "0";
          ctaRef.current.style.pointerEvents = "none";
        }
        indicatorRef.current?.classList.add("landing-visible");
        creditsRef.current?.classList.remove("landing-visible");
        canvas.style.opacity = "0";
        if (introRef.current) {
          introRef.current.style.opacity = "1";
          introRef.current.style.pointerEvents = "auto";
        }
        if (act && mixer) {
          act.time = clip - k * (clip - Math.min(5.2, clip));
          mixer.update(0);
        }
      } else {
        canvas.style.opacity = "1";
        const tt = (prog - CFG.intro) / (1 - CFG.intro);
        const rot = clamp01(tt / CFG.rotEnd);
        const ang = OFFSET - rot * Math.PI * 2;
        const r = lerp(r0, r1, tt);
        let y = lerp(y0, y1, tt);
        y +=
          tt <= 0.3
            ? travelAmp * R * clamp01((tt - 0.15) / 0.15)
            : tt < 0.55
            ? travelAmp * R * clamp01((0.55 - tt) / 0.25) * 0.7
            : 0;
        camera.position.set(
          center.x + Math.cos(ang) * r,
          y,
          center.z + Math.sin(ang) * r
        );
        camera.lookAt(center.x, center.y - R * 0.15, center.z);
        setCapOpacity(tt);
        indicatorRef.current?.classList.remove("landing-visible");
        creditsRef.current?.classList.add("landing-visible");

        // L'intro s'efface avant la première légende
        const introOpacity =
          tt < CFG.legend.fade ? 1 - tt / CFG.legend.fade : 0;
        if (introRef.current) {
          introRef.current.style.opacity = String(introOpacity);
          introRef.current.style.pointerEvents =
            introOpacity > 0.5 ? "auto" : "none";
        }

        if (ctaRef.current) {
          const o = tt > 0.95 ? clamp01((tt - 0.95) / 0.05) : 0;
          ctaRef.current.style.opacity = String(o);
          ctaRef.current.style.pointerEvents = o > 0.5 ? "auto" : "none";
        }
        if (act && mixer) {
          act.time = Math.min(tt * CFG.timeScale, 1) * clip;
          mixer.update(0);
        }

        const { start, end } = CFG.slideRight;
        const sp =
          tt <= start ? 0 : tt >= end ? 1 : clamp01((tt - start) / (end - start));
        canvas.style.transform = `translateX(${sp * slideAmt}%)`;
      }
      renderer.render(scene, camera);
    };
    anim();

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onResize);
      pmrem.dispose();
      renderer.dispose();
      rendererRef.current = null;
    };
  }, []);

  /* ----- Visite guidée : défilement automatique (9 s) ----- */
  const guidedScroll = (fromTop: boolean) => {
    const run = () => {
      autoScrollingRef.current = true;
      const startTime = performance.now();
      const startPos = window.scrollY;
      const target = document.body.scrollHeight - window.innerHeight;
      const distance = target - startPos;
      const duration = 9000;
      const step = (now: number) => {
        const p = Math.min((now - startTime) / duration, 1);
        let e;
        if (p < 0.2) e = (p / 0.2) * 0.25;
        else if (p < 0.9) e = 0.25 + ((p - 0.2) / 0.7) * 0.65;
        else e = 0.9 + (1 - Math.pow(1 - (p - 0.9) / 0.1, 1.5)) * 0.1;
        window.scrollTo(0, startPos + distance * e);
        if (p < 1) requestAnimationFrame(step);
        else autoScrollingRef.current = false;
      };
      requestAnimationFrame(step);
    };
    if (fromTop) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(run, 800);
    } else {
      run();
    }
  };

  const goToShop = () => {
    if (autoScrollingRef.current) return;
    navigate("/shop");
  };

  return (
    <div className="bg-background text-foreground">
      <div ref={trackRef} className="relative h-[800vh]">
        <div
          ref={stageRef}
          className="sticky top-0 h-screen overflow-hidden"
        >
          {/* Rendu 3D */}
          <canvas
            ref={canvasRef}
            aria-label="Visualisation 3D de la lampe FOCUS.01"
            className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-500"
          />

          {/* Intro : slider produits + cartes de navigation */}
          <div
            ref={introRef}
            className="absolute inset-0 flex flex-col bg-background px-4 pb-24 pt-20 transition-opacity duration-300 md:px-8 md:pb-28 md:pt-24"
          >
            <div className="mx-auto flex h-full w-full max-w-[1500px] min-h-0 flex-1 flex-col gap-4 md:grid md:grid-cols-[1fr_1.6fr_1fr] md:gap-8">
              {/* Colonne gauche (desktop) */}
              <div className="hidden min-h-0 flex-col gap-6 md:flex">
                <LinkCard card={LINK_CARDS[0]} t={t} />
                <LinkCard card={LINK_CARDS[1]} t={t} />
              </div>

              {/* Slider central → boutique */}
              <button
                onClick={goToShop}
                className="group relative block min-h-0 flex-1 overflow-hidden bg-white md:flex-none"
                aria-label={t("landing.cta")}
              >
                <AnimatePresence initial={false}>
                  <motion.img
                    key={`${slide.url}-${slideIndex}`}
                    src={slide.url}
                    alt={slide.alt ?? "Création Alto Lille"}
                    className="absolute inset-0 h-full w-full object-cover"
                    initial={{ x: "100%", y: "10%" }}
                    animate={{ x: 0, y: 0 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.7, ease: [0.32, 0.72, 0.22, 1] }}
                  />
                </AnimatePresence>
                <span
                  className="absolute bottom-4 left-4 rounded-full bg-alto-orange px-5 py-2 text-sm font-bold text-alto-cream opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ fontFamily: "var(--font-titles)" }}
                >
                  {t("landing.cta")}
                </span>
              </button>

              {/* Colonne droite (desktop) */}
              <div className="hidden min-h-0 flex-col gap-6 md:flex">
                <LinkCard card={LINK_CARDS[2]} t={t} />
                <LinkCard card={LINK_CARDS[3]} t={t} />
              </div>

              {/* Cartes en grille compacte sous le slider (mobile) */}
              <div className="grid shrink-0 grid-cols-2 gap-x-4 gap-y-3 md:hidden">
                {LINK_CARDS.map((card) => (
                  <Link
                    key={card.href}
                    href={card.href}
                    className="group flex items-center gap-3"
                  >
                    <img
                      src={card.img}
                      alt={card.alt}
                      className="h-14 w-14 flex-shrink-0 object-cover"
                      loading="lazy"
                    />
                    <span
                      className="flex min-w-0 flex-1 items-center justify-between gap-1 text-sm font-bold text-primary"
                      style={{ fontFamily: "var(--font-titles)" }}
                    >
                      <span className="truncate">{t(card.labelKey)}</span>
                      <ArrowRight className="h-4 w-4 flex-shrink-0 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Habillage : burger, marque, toggles (persistant) */}
          <div className="absolute inset-x-0 top-0 z-20 flex h-16 items-center justify-between px-4 md:h-20 md:px-8">
            <button
              onClick={() => setMenuOpen(true)}
              className="p-2 text-foreground"
              aria-label={t("nav.menu")}
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link
              href="/"
              className="absolute left-1/2 flex -translate-x-1/2 items-center gap-3 text-primary"
              aria-label="Alto Lille"
            >
              <AltoMark className="h-8 w-8 md:h-10 md:w-10" />
              <span
                className="text-lg font-bold md:text-xl"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                Alto Lille
              </span>
            </Link>
            <span className="flex items-center gap-1 text-foreground">
              <LanguageToggle variant="minimal" size="sm" showLabel={false} />
              <ThemeToggle variant="minimal" size="sm" showLabel={false} />
            </span>
          </div>

          {/* Légendes autour de la lampe */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <p
              key={i}
              ref={(el) => {
                capRefs.current[i] = el;
              }}
              className={`pointer-events-none absolute text-lg font-bold leading-snug text-primary opacity-0 transition-opacity duration-300 md:max-w-[34vw] md:text-3xl max-md:left-1/2 max-md:w-[88vw] max-md:-translate-x-1/2 max-md:text-center ${CAPTION_POS[i]} ${CAPTION_MOBILE_SLOT[i]}`}
              style={{ fontFamily: "var(--font-titles)" }}
            >
              {t(`landing.cap${i}`)}
            </p>
          ))}

          {/* Indicateur de scroll (intro) */}
          <div
            ref={indicatorRef}
            className="landing-indicator absolute bottom-4 left-1/2 z-10 -translate-x-1/2 md:bottom-6"
          >
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => guidedScroll(false)}
                className="flex flex-col items-center gap-1 text-foreground/80 transition-colors hover:text-foreground"
                aria-label={t("landing.scroll")}
              >
                <ChevronsDown className="h-6 w-6 animate-bounce" />
                <span className="text-xs font-medium uppercase tracking-widest">
                  {t("landing.scroll")}
                </span>
              </button>
            </div>
          </div>

          {/* Crédits (pendant l'animation) */}
          <div
            ref={creditsRef}
            className="landing-indicator absolute bottom-4 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap text-xs text-foreground/60"
          >
            © 2025 Alto Lille ·{" "}
            <a
              href="https://pogodev.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Développé par Etienne Pogoda
            </a>{" "}
            · {t("footer.design")}
          </div>

          {/* CTA fin de parcours */}
          <button
            ref={ctaRef}
            onClick={goToShop}
            className="pointer-events-none absolute bottom-[14vh] left-1/2 -translate-x-1/2 rounded-full bg-alto-orange px-12 py-5 text-xl font-bold text-alto-cream opacity-0 shadow-lg transition-transform hover:scale-105 md:text-2xl"
            style={{ fontFamily: "var(--font-titles)" }}
          >
            {t("landing.cta")}
          </button>

          {/* Rejouer l'animation */}
          <button
            ref={replayRef}
            onClick={() => guidedScroll(true)}
            className="pointer-events-none absolute bottom-16 right-4 flex items-center gap-2 rounded-full border border-current px-4 py-2 text-sm font-medium text-foreground/80 opacity-0 transition-opacity duration-300 hover:text-foreground md:bottom-20 md:right-6"
          >
            <RotateCcw className="h-4 w-4" />
            {t("landing.replay")}
          </button>
        </div>
      </div>

      <AltoMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}
