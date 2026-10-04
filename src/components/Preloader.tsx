import { CSSProperties, useEffect, useRef, useState } from "react";
import { siteConfig } from "../data/siteConfig";
import { intro } from "../lib/intro";
import "./styles/Preloader.css";

type Phase = "loading" | "ready" | "exit";

/* Timeline after reaching 100% (ms). */
const READY_AFTER = 350; // counter settles, "Welcome" takes over
const EXIT_AFTER = 1100; // hold the greeting, then start the panel wave
const INTRO_OFFSET = 250; // start the hero intro while the panels lift
const EXIT_FALLBACK = 2200; // finish anyway if the last panel never reports

/** Vertical panels that make up the curtain (fewer on narrow screens). */
const PANELS = typeof window !== "undefined" && window.innerWidth < 768 ? 4 : 6;

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

/** Splits text into masked characters that rise in one after another. */
const RisingText = ({ text, delay = 0 }: { text: string; delay?: number }) => (
  <span className="pl-rise" aria-hidden="true">
    {[...text].map((char, i) => (
      <span className="pl-rise__mask" key={i}>
        <span
          className="pl-rise__char"
          style={{ "--d": `${delay + i * 45}ms` } as CSSProperties}
        >
          {char === " " ? " " : char}
        </span>
      </span>
    ))}
  </span>
);

/**
 * First-visit preloader. Name rises in, roles cycle, a three-digit gold
 * counter tracks real loading. At 100% it greets the visitor, then the
 * screen splits into vertical panels that lift away in a wave while the
 * hero builds in underneath.
 */
const Preloader = ({ onFinish }: { onFinish: () => void }) => {
  const percent = useLoadProgress();
  const [phase, setPhase] = useState<Phase>("loading");
  const [role, setRole] = useState(0);
  const panelsRef = useRef<HTMLDivElement>(null);

  // Cycle the role words while loading.
  useEffect(() => {
    if (phase !== "loading") return;
    const timer = window.setInterval(
      () => setRole((r) => (r + 1) % siteConfig.loadingWords.length),
      1100,
    );
    return () => window.clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (percent < 100) return;
    const timers: number[] = [];
    const at = (ms: number, fn: () => void) =>
      timers.push(window.setTimeout(fn, ms));

    at(READY_AFTER, () => setPhase("ready"));
    at(READY_AFTER + EXIT_AFTER, () => setPhase("exit"));
    at(READY_AFTER + EXIT_AFTER + INTRO_OFFSET, async () => {
      const { initialFX } = await import("./utils/initialFX");
      initialFX();
      intro.played = true;
    });

    return () => timers.forEach(window.clearTimeout);
  }, [percent]);

  // Unmount once the last panel has actually left the screen, so a busy main
  // thread can never cut the wave short.
  useEffect(() => {
    if (phase !== "exit") return;
    const last = panelsRef.current?.lastElementChild;
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      onFinish();
    };
    const onEnd = (e: Event) => {
      if ((e as TransitionEvent).propertyName === "transform") finish();
    };
    last?.addEventListener("transitionend", onEnd);
    const fallback = window.setTimeout(finish, EXIT_FALLBACK);
    return () => {
      last?.removeEventListener("transitionend", onEnd);
      window.clearTimeout(fallback);
    };
  }, [phase, onFinish]);

  const [first, ...rest] = siteConfig.name.toUpperCase().split(" ");

  return (
    <div
      className={`preloader is-${phase}`}
      style={{ "--progress": percent / 100 } as CSSProperties}
      role="status"
      aria-live="polite"
      aria-label={phase === "loading" ? `Loading ${percent}%` : "Welcome"}
    >
      {/* the curtain: vertical panels with gold leading edges */}
      <div className="pl-panels" ref={panelsRef} aria-hidden="true">
        {Array.from({ length: PANELS }, (_, i) => (
          <span key={i} style={{ "--i": i } as CSSProperties} />
        ))}
      </div>

      <div className="pl-content">
        <header className="pl-top">
          <span className="pl-brand">{siteConfig.brand}</span>
          <span className="pl-meta">Portfolio — ©{siteConfig.year}</span>
        </header>

        <div className="pl-center">
          <h2 className="pl-name">
            <RisingText text={first} delay={150} />
            <RisingText text={rest.join(" ")} delay={150 + first.length * 45} />
          </h2>
          <div className="pl-roles" aria-hidden="true">
            {siteConfig.loadingWords.map((word, i) => (
              <span
                key={word}
                className={i === role ? "is-current" : undefined}
              >
                {word}
              </span>
            ))}
          </div>
        </div>

        <footer className="pl-bottom">
          <div className="pl-swap" aria-hidden="true">
            <span className="pl-count">
              {String(percent).padStart(3, "0")}
              <small>%</small>
            </span>
            <span className="pl-welcome">
              Welcome<span className="serif-accent">.</span>
            </span>
          </div>
          <span className="pl-status">
            {phase === "loading" ? "Loading experience" : "Ready"}
          </span>
        </footer>

        <div className="pl-line" aria-hidden="true">
          <i />
        </div>
      </div>
    </div>
  );
};

export default Preloader;
