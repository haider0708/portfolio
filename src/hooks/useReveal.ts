import { useEffect } from "react";

/**
 * Adds `is-in` to every `[data-reveal]` element inside `root` as it enters the
 * viewport (CSS handles the transition). Re-runs when `deps` change.
 */
export const useReveal = (
  root: React.RefObject<HTMLElement>,
  deps: unknown[] = [],
) => {
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const targets = el.querySelectorAll<HTMLElement>(
      "[data-reveal]:not(.is-in)",
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
