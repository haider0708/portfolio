import { CSSProperties, useEffect, useState } from "react";
import { siteConfig } from "../data/siteConfig";
import { intro } from "../lib/intro";
import "./styles/Preloader.css";

type Phase = "loading" | "welcome" | "exit";

/** Pause on 100% before greeting, greeting duration, exit duration (ms). */
const WELCOME_AFTER = 600;
const EXIT_AFTER = 1000;
const EXIT_DURATION = 900;

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
        ? Math.min(100, value + 4)
        : Math.min(90, value + Math.ceil(Math.random() * 4));
      setPercent(value);
      if (value >= 100) window.clearInterval(timer);
    }, 40);
    return () => window.clearInterval(timer);
  }, []);

  return percent;
};

/**
 * First-visit preloader: a gold counter and progress line on deep navy.
 * At 100% it greets the visitor, then lifts away to reveal the site.
 */
const Preloader = ({ onFinish }: { onFinish: () => void }) => {
  const percent = useLoadProgress();
  const [phase, setPhase] = useState<Phase>("loading");

  useEffect(() => {
    if (percent < 100) return;
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) =>
      timers.push(window.setTimeout(fn, ms));

    later(() => setPhase("welcome"), WELCOME_AFTER);
    later(() => setPhase("exit"), WELCOME_AFTER + EXIT_AFTER);
    later(
      async () => {
        const { initialFX } = await import("./utils/initialFX");
        initialFX();
        intro.played = true;
        onFinish();
      },
      WELCOME_AFTER + EXIT_AFTER + EXIT_DURATION,
    );

    return () => timers.forEach(window.clearTimeout);
  }, [percent, onFinish]);

  return (
    <div
      className={`preloader is-${phase}`}
      style={{ "--progress": percent / 100 } as CSSProperties}
      role="status"
      aria-live="polite"
      aria-label={phase === "loading" ? `Loading ${percent}%` : "Welcome"}
    >
      <div className="preloader__bar">
        <span className="preloader__brand">{siteConfig.brand}</span>
        <span className="preloader__tag">Portfolio · {siteConfig.year}</span>
      </div>

      <div className="preloader__center" aria-hidden="true">
        <div className="preloader__swap">
          <span className="preloader__count">
            {String(percent).padStart(2, "0")}
            <small>%</small>
          </span>
          <span className="preloader__welcome">
            Welcome<span className="serif-accent">.</span>
          </span>
        </div>
        <div className="preloader__line">
          <i />
        </div>
      </div>

      <p className="preloader__roles" aria-hidden="true">
        {siteConfig.loadingWords.join("  ·  ")}
      </p>
    </div>
  );
};

export default Preloader;
