import { ScrollSmoother, ScrollTrigger } from "./gsap";

/**
 * Smooth scrolling is for mouse and trackpad only. Touch screens keep the
 * browser's native momentum scrolling: a JS-driven scroller there fights the
 * finger and the collapsing address bar, which shows up as jitter and jumps.
 */
let smoother: ScrollSmoother | undefined;

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Starts the home page at the top (the intro plays there) and creates the
 *  smoother on pointer devices; touch screens keep native scrolling. */
export const createSmoother = () => {
  // A reload must not restore a mid-page position under the intro.
  // (ScrollTrigger manages history.scrollRestoration itself, so ask it.)
  ScrollTrigger.clearScrollMemory("manual");
  window.scrollTo(0, 0);
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  const reduceMotion = prefersReducedMotion();
  smoother = ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: reduceMotion ? 0 : 1.4,
    speed: 1,
    effects: !reduceMotion,
    autoResize: true,
    ignoreMobileResize: true,
  });
  smoother.scrollTop(0);
  smoother.paused(true); // until the intro has played
};

export const destroySmoother = () => {
  smoother?.kill();
  smoother = undefined;
};

/** Pauses smooth scrolling (the intro and the open mobile menu). Returns the
 *  previous state so callers can restore it. Native scrolling is locked with
 *  CSS instead. */
export const pauseSmoother = (paused: boolean) => {
  const was = smoother?.paused() ?? false;
  smoother?.paused(paused);
  return was;
};

/** Scrolls to a selector ("#work") or an offset, the same way on every device. */
export const scrollToTarget = (target: string | number) => {
  if (smoother) {
    smoother.scrollTo(target, true, "top top");
    return;
  }
  const behavior: ScrollBehavior = prefersReducedMotion() ? "auto" : "smooth";
  if (typeof target === "number") window.scrollTo({ top: target, behavior });
  else document.querySelector(target)?.scrollIntoView({ behavior, block: "start" });
};
