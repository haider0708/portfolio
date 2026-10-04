import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

// Single registration point so every module can import from here.
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, useGSAP);

/**
 * Start/end for a ScrollTrigger spanning a section *including* any pin spacing
 * added to it. `before` = px before the section top reaches the viewport top,
 * `after` = px of scroll after its bottom reaches the viewport bottom.
 * Evaluated lazily so pins created later are taken into account.
 */
export const sectionRange = (
  section: Element,
  before: () => number,
  after: () => number,
) => {
  const pinFor = () => ScrollTrigger.getAll().find((t) => t.pin === section);
  return {
    trigger: section,
    start: () => {
      const pin = pinFor();
      return pin ? pin.start - before() : `top ${before()}px`;
    },
    end: () => {
      const pin = pinFor();
      return pin
        ? pin.end + after()
        : `bottom ${window.innerHeight - after()}px`;
    },
    invalidateOnRefresh: true,
    refreshPriority: -1, // measure after pins have added their spacing
  };
};

/**
 * ScrollTrigger vars for a play-once content reveal. `end: "max"` keeps the
 * trigger active from its start to the bottom of the page, so the reveal also
 * plays when the page loads, jumps or is scrolled quickly past it — and it is
 * never reversed, so content can't be left invisible.
 */
export const revealAt = (
  trigger: gsap.DOMTarget,
  start: ScrollTrigger.Vars["start"],
): ScrollTrigger.Vars => ({
  trigger,
  start,
  end: "max",
  toggleActions: "play none none none",
  invalidateOnRefresh: true,
});

export { gsap, ScrollTrigger, ScrollSmoother, SplitText, useGSAP };
