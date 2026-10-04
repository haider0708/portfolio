import { CSSProperties, useEffect, useRef, useState } from "react";
import { siteConfig } from "../data/siteConfig";
import { intro } from "../lib/intro";
import "./styles/Preloader.css";

type Phase = "loading" | "ready" | "reveal" | "open";

/* Timeline after reaching 100% (ms). */
const READY_AFTER = 100; // frame closes, monogram catches the light
const REVEAL_AFTER = 800; // monogram fades, the portrait develops in the frame
const OPEN_AFTER = 1000; // then the frame opens out onto the page
const OPEN_FALLBACK = 2400; // finish anyway if the portal never reports

/** Counts towards 90% while assets load, then completes once they have. */
const useLoadProgress = () => {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    let value = 0;
    let ready = false;
    const markReady = () => {
      ready = true;
    };
    const pageLoaded =
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise((resolve) =>
            window.addEventListener("load", resolve, { once: true }),
          );
    Promise.all([document.fonts.ready, pageLoaded]).then(markReady, markReady);

    const timer = window.setInterval(() => {
      value = ready
        ? Math.min(100, value + 3)
        : Math.min(90, value + Math.ceil(Math.random() * 3));
      setPercent(value);
      if (value >= 100) window.clearInterval(timer);
    }, 40);
    return () => window.clearInterval(timer);
  }, []);

  return percent;
};

/* The portrait's arch, drawn as two halves that meet at the top. */
const ARCH_LEFT = "M200 500H24A24 25 0 0 1 0 475V200A200 200 0 0 1 200 0";
const ARCH_RIGHT = "M200 500H376A24 25 0 0 0 400 475V200A200 200 0 0 0 200 0";

/**
 * First-visit preloader. An arch — the exact frame of the hero portrait —
 * draws itself as the page loads while the monogram fills with gold. At
 * 100% the portrait develops inside the frame, then the frame opens out to
 * reveal the whole page.
 */
const Preloader = ({ onFinish }: { onFinish: () => void }) => {
  const percent = useLoadProgress();
  const [phase, setPhase] = useState<Phase>("loading");
  const [role, setRole] = useState(0);
  const portalRef = useRef<HTMLDivElement>(null);
  const words = siteConfig.loadingWords;

  // Roll through the role words while loading.
  useEffect(() => {
    if (phase !== "loading") return;
    const timer = window.setInterval(
      () => setRole((r) => (r + 1) % words.length),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [phase, words.length]);

  useEffect(() => {
    if (percent < 100) return;
    const timers: number[] = [];
    const at = (ms: number, fn: () => void) =>
      timers.push(window.setTimeout(fn, ms));

    const fx = import("./utils/initialFX"); // warm it up before it's needed

    at(READY_AFTER, () => setPhase("ready"));
    at(READY_AFTER + REVEAL_AFTER, async () => {
      const { initialFX } = await fx;
      setPhase("reveal");
      initialFX();
      intro.played = true;
    });
    at(READY_AFTER + REVEAL_AFTER + OPEN_AFTER, () => setPhase("open"));

    return () => timers.forEach(window.clearTimeout);
  }, [percent]);

  // Unmount once the frame has fully opened, so a busy main thread can
  // never cut the transition short.
  useEffect(() => {
    if (phase !== "open") return;
    const portal = portalRef.current;
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      onFinish();
    };
    const onEnd = (e: TransitionEvent) => {
      if (e.target === portal && e.propertyName === "width") finish();
    };
    portal?.addEventListener("transitionend", onEnd);
    const fallback = window.setTimeout(finish, OPEN_FALLBACK);
    return () => {
      portal?.removeEventListener("transitionend", onEnd);
      window.clearTimeout(fallback);
    };
  }, [phase, onFinish]);

  const monogram = `${siteConfig.firstName[0]}${siteConfig.lastName[0]}`;
  const loading = phase === "loading";

  return (
    <div
      className={`preloader is-${phase}`}
      style={{ "--progress": percent / 100 } as CSSProperties}
      role="status"
      aria-live="polite"
      aria-label={loading ? `Loading ${percent}%` : "Welcome"}
    >
      {/* The portal: a hole in the curtain shaped like the portrait frame */}
      <div className="pl-portal" ref={portalRef} aria-hidden="true">
        <div className="pl-fill">
          <div className="pl-mono">
            <span className="pl-mono__ghost">{monogram}</span>
            <span className="pl-mono__gold">{monogram}</span>
          </div>
          <span className="pl-count">
            {String(percent).padStart(3, "0")}
            <small>%</small>
          </span>
        </div>
        <svg className="pl-arch" viewBox="0 0 400 500" preserveAspectRatio="none">
          <defs>
            <linearGradient id="pl-gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#f3e3b5" />
              <stop offset="0.45" stopColor="#b48c47" />
              <stop offset="0.7" stopColor="#ecd49a" />
              <stop offset="1" stopColor="#7d5e2b" />
            </linearGradient>
          </defs>
          <path d={ARCH_LEFT} pathLength={1} />
          <path d={ARCH_RIGHT} pathLength={1} />
        </svg>
      </div>

      {/* Registration marks that lock onto the frame */}
      <div className="pl-marks" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>

      <div className="pl-ui">
        <header className="pl-row">
          <span className="pl-brand">{siteConfig.brand}</span>
          <span className="pl-label">Portfolio — ©{siteConfig.year}</span>
        </header>

        <div className="pl-roles" aria-hidden="true">
          <div
            className="pl-roles__track"
            style={{ "--role": role } as CSSProperties}
          >
            {words.map((word) => (
              <span key={word}>{word}</span>
            ))}
          </div>
        </div>

        <footer className="pl-row">
          <span className="pl-label pl-status">
            <span className={loading ? "is-on" : undefined}>Loading</span>
            <span className={loading ? undefined : "is-on"}>Ready</span>
          </span>
          <span className="pl-label">{siteConfig.location}</span>
        </footer>
      </div>
    </div>
  );
};

export default Preloader;
