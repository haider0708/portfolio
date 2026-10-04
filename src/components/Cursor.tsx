import { useEffect, useRef } from "react";
import { gsap } from "../lib/gsap";
import "./styles/Cursor.css";

type CursorMode = "hide" | "snap" | "view";

/**
 * Soft follower cursor (pointer devices only). Elements opt into a mode with
 * `data-cursor`: "hide" fades it out, "snap" wraps it around the element,
 * "view" turns it into a gold "View" disc.
 */
const Cursor = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current!;
    const toX = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3" });
    const toY = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3" });
    let snapped = false;

    const modeTarget = (e: Event) =>
      (e.target as Element | null)?.closest<HTMLElement>("[data-cursor]");

    const onMove = (e: MouseEvent) => {
      if (snapped) return;
      toX(e.clientX);
      toY(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const target = modeTarget(e);
      if (!target) return;
      const mode = target.dataset.cursor as CursorMode;
      el.dataset.state = mode;
      if (mode === "snap") {
        const box = target.getBoundingClientRect();
        el.style.setProperty("--snap-h", `${box.height}px`);
        toX(box.left);
        toY(box.top);
        snapped = true;
      }
    };

    const onOut = (e: MouseEvent) => {
      if (!modeTarget(e)) return;
      delete el.dataset.state;
      snapped = false;
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, []);

  return <div className="cursor" ref={ref} aria-hidden="true" />;
};

export default Cursor;
