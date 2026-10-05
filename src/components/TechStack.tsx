import { CSSProperties, useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "../lib/gsap";
import { competences, StackItem, stackGroups } from "../data/stack";
import "./styles/TechStack.css";

const RADIUS = 190; // px of pointer influence
const PUSH = 14; // max px a tile is nudged away from the pointer
const TILT = 12; // max degrees of tilt
const WAVE_RADIUS = 520; // px reach of the press shockwave
const WAVE_FORCE = 26;

interface TileState {
  el: HTMLElement;
  cx: number;
  cy: number;
  w: number;
  h: number;
  tx: number;
  ty: number;
  rx: number;
  ry: number;
  s: number;
  glow: number;
  target: {
    tx: number;
    ty: number;
    rx: number;
    ry: number;
    s: number;
    glow: number;
  };
  kick: { x: number; y: number; s: number; at: number };
}

const Tile = ({
  item,
  index,
  group,
  dim,
}: {
  item: StackItem;
  index: number;
  group: string;
  dim: boolean;
}) => {
  const { Icon, label, tier } = item;
  const style = {
    "--float-delay": `${(-index * 0.53) % 6}s`,
    "--float-dur": `${6 + (index % 5) * 0.8}s`,
  } as CSSProperties;

  return (
    <li
      className={`stack-tile stack-${tier}${dim ? " is-dim" : ""}`}
      data-group={group}
      aria-hidden={dim || undefined}
    >
      <div className="stack-float" style={style}>
        <div className="stack-tile-in" title={label}>
          <Icon className="stack-icon" aria-hidden="true" />
          <span>{label}</span>
        </div>
      </div>
    </li>
  );
};

const ALL = "All";

const TechStack = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [filter, setFilter] = useState(ALL);
  const fieldRef = useRef<HTMLDivElement>(null);

  // Staggered reveal as the tiles scroll into view.
  useGSAP(
    () => {
      gsap.set(".stack-tile, .stack-expertise li", {
        autoAlpha: 0,
        y: 40,
        scale: 0.94,
      });
      ScrollTrigger.batch(".stack-tile, .stack-expertise li", {
        start: "top 95%",
        end: "max",
        once: true,
        // small batches, so a fast scroll never leaves tiles waiting in line
        batchMax: 8,
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.045,
          }),
      });
    },
    { scope: sectionRef },
  );

  // Idle floating only runs while the section is on screen.
  useEffect(() => {
    const section = sectionRef.current!;
    const observer = new IntersectionObserver(([entry]) =>
      section.classList.toggle("is-live", entry.isIntersecting),
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Pointer field: tiles lean away from the cursor and catch light; a click
  // or tap sends a shockwave through the grid. The frame loop only runs
  // while something is actually moving.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const field = fieldRef.current!;
    const tiles: TileState[] = [];
    let frame = 0;

    const measure = () => {
      tiles.length = 0;
      field.querySelectorAll<HTMLElement>(".stack-tile").forEach((li) => {
        const el = li.querySelector<HTMLElement>(".stack-tile-in")!;
        tiles.push({
          el,
          cx: li.offsetLeft + li.offsetWidth / 2,
          cy: li.offsetTop + li.offsetHeight / 2,
          w: li.offsetWidth,
          h: li.offsetHeight,
          tx: 0,
          ty: 0,
          rx: 0,
          ry: 0,
          s: 1,
          glow: 0,
          target: { tx: 0, ty: 0, rx: 0, ry: 0, s: 1, glow: 0 },
          kick: { x: 0, y: 0, s: 0, at: 0 },
        });
      });
    };

    const tick = (now: number) => {
      let moving = false;
      for (const t of tiles) {
        const k = t.kick;
        const kickLive = now >= k.at;
        const kx = kickLive ? k.x : 0;
        const ky = kickLive ? k.y : 0;
        const ks = kickLive ? k.s : 0;
        if (kickLive) {
          k.x *= 0.88;
          k.y *= 0.88;
          k.s *= 0.85;
        }

        t.tx += (t.target.tx + kx - t.tx) * 0.16;
        t.ty += (t.target.ty + ky - t.ty) * 0.16;
        t.rx += (t.target.rx - t.rx) * 0.14;
        t.ry += (t.target.ry - t.ry) * 0.14;
        t.s += (t.target.s + ks - t.s) * 0.18;
        t.glow += (t.target.glow - t.glow) * 0.12;

        t.el.style.transform = `translate3d(${t.tx.toFixed(2)}px, ${t.ty.toFixed(2)}px, 0) rotateX(${t.rx.toFixed(2)}deg) rotateY(${t.ry.toFixed(2)}deg) scale(${t.s.toFixed(4)})`;
        t.el.style.setProperty("--glow", t.glow.toFixed(3));

        if (
          Math.abs(k.x) + Math.abs(k.y) + Math.abs(k.s) > 0.05 ||
          !kickLive ||
          Math.abs(t.target.tx + kx - t.tx) > 0.05 ||
          Math.abs(t.target.ty + ky - t.ty) > 0.05 ||
          Math.abs(t.target.rx - t.rx) > 0.05 ||
          Math.abs(t.target.ry - t.ry) > 0.05 ||
          Math.abs(t.target.s + ks - t.s) > 0.001 ||
          Math.abs(t.target.glow - t.glow) > 0.005
        ) {
          moving = true;
        }
      }
      frame = moving ? requestAnimationFrame(tick) : 0;
    };

    const wake = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const localPoint = (e: PointerEvent) => {
      const rect = field.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const onMove = (e: PointerEvent) => {
      const p = localPoint(e);
      for (const t of tiles) {
        const dx = t.cx - p.x;
        const dy = t.cy - p.y;
        const dist = Math.hypot(dx, dy) || 1;
        const f = Math.max(0, 1 - dist / RADIUS);
        const ease = f * f * (3 - 2 * f); // smoothstep
        t.target.tx = (dx / dist) * ease * PUSH;
        t.target.ty = (dy / dist) * ease * PUSH;
        t.target.rx = (dy / dist) * ease * TILT;
        t.target.ry = (-dx / dist) * ease * TILT;
        t.target.s = 1 + ease * 0.06;
        t.target.glow = ease;
        t.el.style.setProperty("--mx", `${p.x - (t.cx - t.w / 2)}px`);
        t.el.style.setProperty("--my", `${p.y - (t.cy - t.h / 2)}px`);
      }
      wake();
    };

    const release = () => {
      for (const t of tiles) {
        t.target = { tx: 0, ty: 0, rx: 0, ry: 0, s: 1, glow: 0 };
      }
      wake();
    };

    /** Shockwave from a point: nearby tiles are pushed out, in distance order. */
    const wave = (e: PointerEvent) => {
      const p = localPoint(e);
      const now = performance.now();
      for (const t of tiles) {
        const dx = t.cx - p.x;
        const dy = t.cy - p.y;
        const dist = Math.hypot(dx, dy) || 1;
        const f = Math.max(0, 1 - dist / WAVE_RADIUS);
        if (f <= 0) continue;
        t.kick = {
          x: (dx / dist) * f * WAVE_FORCE,
          y: (dy / dist) * f * WAVE_FORCE,
          s: dist < Math.max(t.w, t.h) / 2 ? -0.12 : f * 0.05,
          at: now + dist * 0.9,
        };
      }
      wake();
    };

    // Mouse: the field follows the pointer and a click sends the wave.
    // Touch: a press is usually the start of a scroll, so only a finished
    // tap (one the browser didn't take over for scrolling) reacts — the
    // grid never shakes under a swipe.
    let releaseTimer = 0;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse") wave(e);
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      onMove(e);
      wave(e);
      window.clearTimeout(releaseTimer);
      releaseTimer = window.setTimeout(release, 420);
    };
    const onMouseMove = (e: PointerEvent) => {
      if (e.pointerType === "mouse") onMove(e);
    };
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType === "mouse") release();
    };

    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(field);
    field.addEventListener("pointermove", onMouseMove, { passive: true });
    field.addEventListener("pointerleave", onLeave);
    field.addEventListener("pointerdown", onDown);
    field.addEventListener("pointerup", onUp);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(releaseTimer);
      resizeObserver.disconnect();
      field.removeEventListener("pointermove", onMouseMove);
      field.removeEventListener("pointerleave", onLeave);
      field.removeEventListener("pointerdown", onDown);
      field.removeEventListener("pointerup", onUp);
    };
  }, []);

  let tileIndex = 0;

  return (
    <section className="stack-section" id="stack" ref={sectionRef}>
      <div className="stack-container wrap">
        <div className="stack-head">
          <h2>
            My <span className="serif-accent">Stack</span>
          </h2>
          <p className="stack-legend">
            <span className="stack-legend-dot" aria-hidden="true"></span>
            Core strengths
          </p>
        </div>

        <div className="stack-expertise">
          <h3 className="stack-label">Expertise</h3>
          <ul>
            {competences.map(({ label, Icon, tier }) => (
              <li key={label} className={`stack-exp-${tier}`}>
                <Icon aria-hidden="true" />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div
          className="stack-tabs"
          role="tablist"
          aria-label="Filter the stack"
        >
          {[ALL, ...stackGroups.map((g) => g.title)].map((title) => (
            <button
              key={title}
              type="button"
              role="tab"
              aria-selected={filter === title}
              className={`stack-tab${filter === title ? " is-active" : ""}`}
              onClick={() => setFilter(title)}
              data-cursor="hide"
            >
              {title}
              <span className="stack-tab-count">
                {title === ALL
                  ? stackGroups.reduce((n, g) => n + g.items.length, 0)
                  : stackGroups.find((g) => g.title === title)!.items.length}
              </span>
            </button>
          ))}
        </div>

        <div className="stack-field" ref={fieldRef}>
          <ul className="stack-grid">
            {stackGroups.flatMap((group) =>
              group.items.map((item) => (
                <Tile
                  key={item.label}
                  item={item}
                  index={tileIndex++}
                  group={group.title}
                  dim={filter !== ALL && filter !== group.title}
                />
              )),
            )}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
