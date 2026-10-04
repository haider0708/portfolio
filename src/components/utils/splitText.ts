import { gsap, revealAt, SplitText } from "../../lib/gsap";

/**
 * Animates every `.reveal-words` / `.reveal-chars` element in once as it scrolls into view.
 * SplitText's `autoSplit` re-splits on resize/font load and reverts the
 * returned animation for us, so no manual refresh listeners are needed.
 */
export function initSplitText() {
  const mm = gsap.matchMedia();

  mm.add("(min-width: 900px)", () => {
    const start = window.innerWidth <= 1024 ? "top 60%" : "20% 60%";

    const reveal = (
      selector: string,
      type: string,
      target: "words" | "chars",
      from: gsap.TweenVars,
      to: gsap.TweenVars,
    ) => {
      document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
        SplitText.create(el, {
          type,
          linesClass: "split-mask",
          autoSplit: true,
          onSplit: (self) =>
            gsap.fromTo(self[target], from, {
              ...to,
              autoAlpha: 1,
              // Play once and stay visible (never paused or reversed).
              scrollTrigger: revealAt(
                el.parentElement?.parentElement ?? el,
                start,
              ),
            }),
        });
      });
    };

    reveal(
      ".reveal-words",
      "lines,words",
      "words",
      { autoAlpha: 0, y: 80 },
      { y: 0, duration: 1, ease: "power3.out", stagger: 0.02 },
    );
    reveal(
      ".reveal-chars",
      "chars,lines",
      "chars",
      { autoAlpha: 0, y: 80, rotate: 10 },
      { y: 0, rotate: 0, duration: 0.8, ease: "power2.inOut", stagger: 0.03 },
    );
  });

  return () => mm.revert();
}
