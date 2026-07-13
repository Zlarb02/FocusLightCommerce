import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RotateCcw, ChevronsDown } from "lucide-react";
import { AltoLogotype } from "@/components/alto/AltoBrand";
import { AltoHeader } from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";

/** Hero slider (piloté depuis /gestion) : la 1re image reste la photo lampe
 *  soignée, calée exactement ; les slides admin défilent au même emplacement. */
interface Slide {
  url: string;
  alt?: string;
  order?: number;
}
interface SliderConfig {
  slides?: Slide[];
  autoPlayInterval?: number;
}
const HERO_SLIDE: Slide = {
  url: "/images/alto/hero.jpg",
  alt: "Lampe FOCUS.01 allumée — Alto Lille",
};

/* ===== Config de l'animation 3D (reprise de l'ancienne landing) ===== */
const CFG = {
  urls: [
    "/images/focus.glb",
    "https://raw.githubusercontent.com/Zlarb02/test-landing/main/src/assets/focus.glb",
  ],
  intro: 0.02,
  rotEnd: 0.75,
  timeScale: 1.35,
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

/* Sur mobile : alternance design entre les coins haut/bas, jamais deux
   légendes consécutives dans la même zone (pas de chevauchement pendant
   les fondus), et le centre reste libre pour la lampe. */
const CAPTION_MOBILE_SLOT = [
  "max-md:top-[84px] max-md:left-[6vw] max-md:text-left",
  "max-md:bottom-[112px] max-md:right-[6vw] max-md:text-right",
  "max-md:top-[84px] max-md:right-[6vw] max-md:text-right",
  "max-md:bottom-[112px] max-md:left-[6vw] max-md:text-left",
  "max-md:top-[84px] max-md:left-[6vw] max-md:text-left",
  "max-md:bottom-[112px] max-md:right-[6vw] max-md:text-right",
];

/**
 * Accueil — premier viewport fidèle à la maquette (tagline + logotype géant
 * + photo lampe), puis animation 3D de la lampe FOCUS.01 pilotée par le
 * scroll (légendes, CTA, replay). Le header Alto reste sticky au-dessus.
 */
export default function Home() {
  const [, navigate] = useLocation();
  const { t } = useLanguage();

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

  /* ----- Hero slider (config /gestion) : 1re image = photo lampe soignée ----- */
  const { data: sliderConfig } = useQuery<SliderConfig>({
    queryKey: ["/api/slider/config"],
  });
  const heroSlides = useMemo(() => {
    const admin = (sliderConfig?.slides ?? [])
      .filter((s) => s.url && s.url !== HERO_SLIDE.url)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return [HERO_SLIDE, ...admin];
  }, [sliderConfig]);

  const [heroIndex, setHeroIndex] = useState(0);
  useEffect(() => {
    if (heroSlides.length < 2) return;
    const base = Math.max(sliderConfig?.autoPlayInterval ?? 3500, 2500);
    // La 1re image (compo soignée) reste affichée 1 s de plus que les autres
    const delay = heroIndex === 0 ? base + 1000 : base;
    const id = window.setTimeout(
      () => setHeroIndex((i) => (i + 1) % heroSlides.length),
      delay
    );
    return () => window.clearTimeout(id);
  }, [heroIndex, heroSlides.length, sliderConfig?.autoPlayInterval]);

  const heroSlide = heroSlides[heroIndex % heroSlides.length];


  /* ----- Scène Three.js + boucle liée au scroll ----- */
  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!canvas || !stage || !track) return;

    const isLargeScreen = window.innerWidth > 1440;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        powerPreference: "high-performance",
        precision: isLargeScreen ? "highp" : "mediump",
        stencil: false,
        alpha: true, // canvas transparent : le fond vient de la page (voir plus bas)
      });
    } catch {
      // Pas de WebGL disponible : on masque le canvas et on réduit le track
      // (le premier viewport maquette reste, lui, toujours affiché au-dessus).
      canvas.style.display = "none";
      track.style.height = "100vh";
      return;
    }
    rendererRef.current = renderer;
    renderer.setSize(stage.clientWidth, stage.clientHeight);
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, isLargeScreen ? 2 : 1.5)
    );
    /* Canvas TRANSPARENT plutôt qu'une couleur d'effacement égale au fond.
       Le tone mapping ACES ci-dessous s'applique à TOUTE l'image, couleur
       d'effacement comprise : même exacte, elle ressortait transformée et la
       scène ne se raccordait pas au hero. En laissant le canvas transparent,
       c'est le fond CSS de la page qui traverse — donc exactement la même
       couleur que le hero, dans les quatre variantes, sans conversion. */
    renderer.setClearColor(0x000000, 0);
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

  /* ----- Visite guidée : défilement automatique, interruptible -----
     Un peu accéléré (6,5 s). L'utilisateur reprend la main à tout moment :
     un scroll manuel (molette, tactile, clavier) annule l'auto-scroll sans
     bloquer — on détecte l'écart entre la position posée et la position réelle. */
  const guidedScroll = (fromTop: boolean) => {
    const run = () => {
      autoScrollingRef.current = true;
      const startTime = performance.now();
      const startPos = window.scrollY;
      const target = document.body.scrollHeight - window.innerHeight;
      const distance = target - startPos;
      const duration = 6500;
      let expected = startPos; // position posée à la frame précédente

      const cancel = () => {
        autoScrollingRef.current = false;
        removeEventListener("wheel", onUserScroll);
        removeEventListener("touchmove", onUserScroll);
        removeEventListener("keydown", onUserScroll);
      };
      // Intention explicite de scroller à la main → on rend la main aussitôt
      const onUserScroll = () => cancel();
      addEventListener("wheel", onUserScroll, { passive: true });
      addEventListener("touchmove", onUserScroll, { passive: true });
      addEventListener("keydown", onUserScroll);

      const step = (now: number) => {
        if (!autoScrollingRef.current) return; // annulé par l'utilisateur
        // Sécurité : si la position réelle a dévié de ce qu'on a posé, l'utilisateur a repris la main
        if (Math.abs(window.scrollY - expected) > 4 && now - startTime > 60) {
          cancel();
          return;
        }
        const p = Math.min((now - startTime) / duration, 1);
        let e;
        if (p < 0.2) e = (p / 0.2) * 0.25;
        else if (p < 0.9) e = 0.25 + ((p - 0.2) / 0.7) * 0.65;
        else e = 0.9 + (1 - Math.pow(1 - (p - 0.9) / 0.1, 1.5)) * 0.1;
        expected = startPos + distance * e;
        window.scrollTo(0, expected);
        if (p < 1) requestAnimationFrame(step);
        else cancel();
      };
      requestAnimationFrame(step);
    };
    if (fromTop) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(run, 700);
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
      {/* Header maquette sticky (demande Anatole : reste visible au scroll) */}
      <AltoHeader tone="brown-desktop" />

      {/* Premier viewport (Web 1920–9 / iPhone–1) — mobile-first, structure
          unique : bloc texte + photo carrée côte à côte, jamais en absolu.
          Mobile : empilé (tagline|logo en ligne, puis photo dessous).
          Desktop : grille 2 colonnes (texte à gauche, photo à droite). */}
      {/* Desktop : le découpage n'est PAS 50/50. Relevé sur web-9 (en px 1920) :
          logotype x 27→1140, photo x 1182→1866. Soit 1,4vw de marge à gauche,
          une colonne texte de 58vw, 2,2vw de gouttière, la photo sur 35,6vw et
          2,8vw à droite. En 50/50 le logotype sortait 20 % trop petit et
          décollé du bord gauche. */}
      <section
        ref={introRef}
        className="flex w-full flex-col justify-center bg-background min-h-[calc(100svh-57px)] md:grid md:grid-cols-[57.97fr_35.6fr] md:items-center md:gap-[2.19vw] md:min-h-0 md:h-[calc(100svh-96px)] md:pl-[1.4vw] md:pr-[2.8vw]"
      >
        {/* Bloc texte : tagline + logotype. En desktop la maquette ne le centre
            pas — elle le cale en BAS, à hauteur du pied de la photo (logotype
            jusqu'à y=1023 sur 1074). La photo, elle, reste centrée. */}
        <div className="flex flex-row items-start justify-between gap-4 px-6 pb-10 pt-6 md:h-full md:flex-col md:items-start md:justify-end md:gap-10 md:px-0 md:pb-[51px] md:pt-0">
          <p
            className="max-w-[52%] font-medium leading-snug text-alto-brown dark:text-alto-cream md:max-w-none text-[clamp(15px,1.875vw,36px)]"
            style={{ fontFamily: "var(--font-nav)" }}
          >
            {t("home.tagline")}
          </p>
          <button
            onClick={goToShop}
            aria-label={t("landing.cta")}
            className="group w-[42%] shrink-0 md:w-full"
          >
            {/* En DESKTOP le logotype suit son fond : orange sur le crème du
                thème clair (web-9), crème sur le brun du thème sombre (web-10).
                En MOBILE il reste ORANGE dans les deux thèmes — iphone-1 et
                iphone-4 le montrent orange sur crème comme sur brun. */}
            <span className="md:hidden">
              <AltoLogotype
                color="orange"
                alt="ALTO Lille"
                className="w-full transition-transform duration-300 group-hover:scale-[1.01]"
              />
            </span>
            <span className="hidden md:block">
              <AltoLogotype
                color="orange"
                alt="ALTO Lille"
                className="w-full transition-transform duration-300 group-hover:scale-[1.01] dark:hidden"
              />
              <AltoLogotype
                color="cream"
                alt="ALTO Lille"
                className="hidden w-full transition-transform duration-300 group-hover:scale-[1.01] dark:block"
              />
            </span>
          </button>
        </div>

        {/* Hero slider — portrait, ratio fixe (~3:4), jamais déformé. 1re image =
            photo lampe soignée (cadrage object-[center_22%]) ; slides admin
            au même emplacement. Desktop : hauteur de la cellule ; mobile : pleine largeur. */}
        <div className="relative mx-6 mb-10 md:mx-0 md:mb-0 md:flex md:h-full md:items-center md:justify-end">
          <button
            onClick={goToShop}
            aria-label={t("landing.cta")}
            className="group relative block aspect-[3/4] w-full overflow-hidden md:h-auto md:w-full md:aspect-[3/4]"
          >
            <AnimatePresence initial={false}>
              <motion.img
                key={`${heroSlide.url}-${heroIndex}`}
                src={heroSlide.url}
                alt={heroSlide.alt ?? "Création Alto Lille"}
                className="absolute inset-0 h-full w-full object-cover object-[center_22%]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.32, 0.72, 0.22, 1] }}
              />
            </AnimatePresence>
          </button>
          {/* Invitation à défiler (desktop, sur la photo) */}
          <button
            onClick={() => guidedScroll(false)}
            className="absolute bottom-4 right-4 z-10 hidden flex-col items-center gap-1 text-alto-cream/80 transition-colors hover:text-alto-cream md:flex"
            aria-label={t("landing.scroll")}
          >
            <ChevronsDown className="h-6 w-6 animate-bounce" />
            <span className="text-xs font-medium uppercase tracking-widest">
              {t("landing.scroll")}
            </span>
          </button>
        </div>
      </section>

      {/* Parcours 3D piloté par le scroll (démarre sous le viewport maquette).
          Le fond de page est répété ici : le canvas apparaît en fondu (et peut
          ne jamais apparaître, sans WebGL), il ne doit y avoir aucune rupture
          avec le hero pendant ce temps. */}
      <div ref={trackRef} className="relative h-[550vh] bg-background">
        <div
          ref={stageRef}
          className="sticky top-0 h-screen overflow-hidden bg-background"
        >
          {/* Rendu 3D */}
          <canvas
            ref={canvasRef}
            aria-label="Visualisation 3D de la lampe FOCUS.01"
            className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-500"
          />

          {/* Légendes autour de la lampe */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <p
              key={i}
              ref={(el) => {
                capRefs.current[i] = el;
              }}
              className={`pointer-events-none absolute text-xl font-bold leading-snug text-primary opacity-0 transition-opacity duration-300 md:max-w-[34vw] md:text-3xl max-md:max-w-[64vw] ${CAPTION_POS[i]} ${CAPTION_MOBILE_SLOT[i]}`}
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

          {/* Crédits (pendant l'animation) — mobile first : nom + logo */}
          <div
            ref={creditsRef}
            className="landing-indicator absolute inset-x-0 bottom-3 z-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4 text-xs text-foreground/70 md:bottom-4 md:gap-x-6"
          >
            <a
              href="https://www.instagram.com/alto_lille/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <img
                src="/images/credits/alto-lille.jpg"
                alt="Alto Lille"
                className="h-5 w-5 rounded-full"
                loading="lazy"
              />
              Alto Lille
            </a>
            <a
              href="https://www.instagram.com/rare_design/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <img
                src="/images/credits/rare-design.jpg"
                alt="RARE.design"
                className="h-5 w-5 rounded-full"
                loading="lazy"
              />
              RARE.design
            </a>
            <a
              href="https://pogodev.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <img
                src="/images/credits/pogodev-logo.svg"
                alt="pogodev.com"
                className="h-5 w-5 rounded-[3px]"
                loading="lazy"
              />
              pogodev.com
            </a>
          </div>

          {/* CTA fin de parcours : texte centré, la lampe termine la
              phrase à droite (clin d'œil Pixar, comme l'ancienne landing) */}
          <button
            ref={ctaRef}
            onClick={goToShop}
            className="group pointer-events-none absolute inset-0 flex items-center justify-center pr-[18vw] opacity-0 transition-opacity duration-500 md:pr-[14vw]"
          >
            <span
              className="text-[clamp(32px,6vw,72px)] font-bold text-foreground transition-colors duration-300 group-hover:text-primary"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              {t("landing.cta")}
            </span>
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
    </div>
  );
}
