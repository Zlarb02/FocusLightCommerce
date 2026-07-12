import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RotateCcw, ChevronsDown } from "lucide-react";
import { AltoLogotype } from "@/components/alto/AltoBrand";
import { AltoHeader } from "@/components/Layout";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { theme } = useTheme();
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
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        powerPreference: "high-performance",
        precision: isLargeScreen ? "highp" : "mediump",
        stencil: false,
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
      {/* Header maquette sticky (demande Anatole : reste visible au scroll) */}
      <AltoHeader tone="brown" />

      {/* Premier viewport fidèle à la maquette (Web 1920–9 / iPhone–1) */}
      <section
        ref={introRef}
        className="relative w-full overflow-hidden bg-background md:h-[calc(100svh-96px)]"
      >
        {/* ---------- Desktop : composition maquette en absolu ---------- */}
        <div className="hidden md:block">
          {/* Photo lampe allumée — colonne droite pleine hauteur */}
          <img
            src="/images/alto/hero.jpg"
            alt="Lampe FOCUS.01 allumée — Alto Lille"
            className="absolute bottom-0 right-0 h-full w-[40vw] object-cover"
          />

          {/* Tagline (haut-gauche) */}
          <p
            className="absolute left-[8.3vw] top-[40%] max-w-[42vw] text-[clamp(22px,1.9vw,36px)] font-medium leading-snug text-alto-brown dark:text-alto-cream"
            style={{ fontFamily: "var(--font-nav)" }}
          >
            {t("home.tagline")}
          </p>

          {/* Logotype orange géant, calé en bas-gauche (reste dans la colonne
              crème, bord droit avant la photo à 60vw) */}
          <button
            onClick={goToShop}
            aria-label={t("landing.cta")}
            className="group absolute bottom-0 left-[1.4vw] w-[58vw] max-w-[calc(60vw-1.4vw)]"
          >
            <AltoLogotype
              color="orange"
              alt="ALTO Lille"
              className="w-full transition-transform duration-300 group-hover:scale-[1.01]"
            />
          </button>

          {/* Invitation à défiler vers le parcours 3D (sur la photo, bas-droite) */}
          <button
            onClick={() => guidedScroll(false)}
            className="absolute bottom-6 right-8 z-10 flex flex-col items-center gap-1 text-alto-cream/80 transition-colors hover:text-alto-cream"
            aria-label={t("landing.scroll")}
          >
            <ChevronsDown className="h-6 w-6 animate-bounce" />
            <span className="text-xs font-medium uppercase tracking-widest">
              {t("landing.scroll")}
            </span>
          </button>
        </div>

        {/* ---------- Mobile : flux vertical (iPhone–1) ---------- */}
        <div className="flex flex-col md:hidden">
          <div className="flex items-start justify-between gap-4 px-[6vw] pb-8 pt-12">
            <p
              className="max-w-[52%] text-[clamp(15px,4.4vw,19px)] font-medium leading-snug text-alto-brown dark:text-alto-cream"
              style={{ fontFamily: "var(--font-nav)" }}
            >
              {t("home.tagline")}
            </p>
            <button
              onClick={goToShop}
              aria-label={t("landing.cta")}
              className="w-[42%] shrink-0"
            >
              <AltoLogotype color="orange" alt="ALTO Lille" className="w-full" />
            </button>
          </div>
          <img
            src="/images/alto/hero.jpg"
            alt="Lampe FOCUS.01 allumée — Alto Lille"
            className="mx-[6vw] mb-10 aspect-[360/540] object-cover"
          />
        </div>
      </section>

      {/* Parcours 3D piloté par le scroll (démarre sous le viewport maquette) */}
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
