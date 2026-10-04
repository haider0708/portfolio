import { gsap, revealAt, ScrollTrigger } from "../../lib/gsap";

const DESKTOP = "(min-width: 1025px)";
const MOBILE = "(max-width: 1024px)";

/*
 * Two kinds of scroll animation live here:
 *
 * 1. Motion (positions, scale, the career line, pins) is *scrubbed* — tied to
 *    the scroll position, so it always matches where the reader is.
 * 2. Content reveals (text, cards, roles) *play once on time* when reached and
 *    never hide again. `end: "max"` keeps the trigger active from its start to
 *    the bottom of the page, so a reveal also plays if the page loads, jumps
 *    or is scrolled quickly past it — text can never be left invisible.
 */

const scrub = (trigger: string, start: string, end: string) =>
  gsap.timeline({
    scrollTrigger: {
      trigger,
      start,
      end,
      scrub: true,
      invalidateOnRefresh: true,
    },
  });

/* ───────────────────────────── Landing & About ───────────────────────────── */

const setLandingTimelines = () => {
  scrub(".hero", "top top", "bottom top")
    // Portrait glides left to sit beside the About copy.
    .fromTo(".hero-portrait", { x: 0 }, { x: "-25%", duration: 1 }, 0)
    .to(".hero-glow", { scale: 1.3, duration: 1 }, 0)
    .to(".hero-badge", { opacity: 0, duration: 0.3 }, 0)
    // The cue goes as soon as scrolling starts (children, so the intro's
    // fade-in on the cue itself never fights this).
    .to(".hero__cue > *", { opacity: 0, duration: 0.12 }, 0)
    .to(".hero__inner", { opacity: 0, duration: 0.4 }, 0)
    .to(".hero__inner", { y: "40%", duration: 0.8 }, 0)
    // About rises into place from below (never overlaps the hero).
    .fromTo(".about__body", { y: 120 }, { y: 0 }, 0);

  scrub(".about", "center 55%", "bottom top")
    .to(".about", { y: "30%", duration: 6 }, 0)
    .to(".about", { opacity: 0, delay: 3, duration: 2 }, 0)
    .to(
      ".hero-portrait",
      {
        y: "-14%",
        scale: 0.9,
        opacity: 0,
        delay: 0.4,
        duration: 2.6,
        ease: "power1.in",
      },
      0,
    );
};

/* ── Services ("What I do") ── */

/** Frame lines draw in, then each card and its copy fade up in turn. */
const servicesReveal = (scrollTrigger: ScrollTrigger.Vars) => {
  const tl = gsap.timeline({
    defaults: { ease: "power3.out" },
    scrollTrigger,
  });
  tl.fromTo(
    ".services__frame",
    { maxHeight: "0%" },
    { maxHeight: "100%", duration: 1, ease: "power2.inOut" },
    0,
  );
  gsap.utils.toArray<HTMLElement>(".service").forEach((card, i) => {
    const at = 0.2 + i * 0.35;
    tl.fromTo(
      card,
      { autoAlpha: 0, y: 40 },
      { autoAlpha: 1, y: 0, duration: 0.8 },
      at,
    )
      .fromTo(
        card.querySelector(".service__rule"),
        { maxWidth: "0%" },
        { maxWidth: "100%", duration: 0.9, ease: "power2.inOut" },
        at + 0.1,
      )
      .fromTo(
        card.querySelectorAll(
          ".service__kicker, .service__title, .service__text",
        ),
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.07 },
        at + 0.2,
      )
      .fromTo(
        card.querySelectorAll(".service__flow li, .service__toggle"),
        { autoAlpha: 0, y: 8 },
        { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.04 },
        at + 0.4,
      );
  });
};

const setServicesDesktop = () => {
  const section = document.querySelector<HTMLElement>(".services");
  if (!section) return;
  // Hold the section on screen long enough to read both cards.
  const pin = ScrollTrigger.create({
    trigger: section,
    start: "top top",
    end: "+=180%",
    pin: true,
    invalidateOnRefresh: true,
  });
  // The cards build in as the section arrives, so they are complete when it pins.
  servicesReveal({
    ...revealAt(section, () => pin.start - window.innerHeight * 0.5),
    refreshPriority: -1,
  });
};

const setServicesMobile = () => {
  servicesReveal(revealAt(".services__stack", "top 80%"));
};

/* ─────────────────────────────── Experience ─────────────────────────────── */

const roleReveal = (box: HTMLElement, scrollTrigger: ScrollTrigger.Vars) =>
  gsap
    .timeline({ defaults: { ease: "power3.out" }, scrollTrigger })
    .fromTo(box, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 0)
    .fromTo(
      box.querySelector(".role__head"),
      { x: -50 },
      { x: 0, duration: 0.9 },
      0,
    )
    .fromTo(
      box.querySelector(".role__body"),
      { x: 50, autoAlpha: 0 },
      { x: 0, autoAlpha: 1, duration: 0.9 },
      0.1,
    );

/**
 * Desktop: the section pins while the timeline line grows downward (scrubbed);
 * each role plays in once the line reaches it. If the list is taller than the
 * viewport the content glides up so every entry is seen.
 */
const setExperienceDesktop = () => {
  const section = document.querySelector<HTMLElement>(".experience");
  if (!section) return;
  const container = section.querySelector<HTMLElement>(".experience__inner")!;
  const info = section.querySelector<HTMLElement>(".timeline")!;
  const boxes = gsap.utils.toArray<HTMLElement>(".role", section);
  const overflow = () =>
    Math.max(
      0,
      container.offsetTop + container.offsetHeight + 80 - window.innerHeight,
    );

  const line = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: () => `+=${window.innerHeight * boxes.length + overflow()}`,
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
    },
  });
  line
    .fromTo(
      ".timeline__line",
      { maxHeight: "0%" },
      { maxHeight: "100%", duration: 1 },
      0,
    )
    .fromTo(container, { y: 0 }, { y: () => -overflow(), duration: 1 }, 0);

  const pin = line.scrollTrigger!;
  boxes.forEach((box) => {
    // Fraction of the line's travel at which it reaches this entry.
    const reach = () => Math.min(0.85, box.offsetTop / info.offsetHeight);
    roleReveal(box, {
      ...revealAt(
        section,
        () => pin.start + (pin.end - pin.start) * reach() - 60,
      ),
      refreshPriority: -1,
    });
  });
};

const setExperienceMobile = () => {
  gsap.fromTo(
    ".timeline__line",
    { maxHeight: "0%" },
    {
      maxHeight: "100%",
      ease: "none",
      scrollTrigger: {
        trigger: ".timeline",
        start: "top 75%",
        end: "bottom 55%",
        scrub: true,
      },
    },
  );
  gsap.utils.toArray<HTMLElement>(".role").forEach((box) => {
    roleReveal(box, revealAt(box, "top 85%"));
  });
};

/* ───────────────────────────────── Shared ───────────────────────────────── */

/** Generic fade-up for `[data-reveal]` elements. */
const setRevealOnScroll = () => {
  gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
    gsap.fromTo(
      el,
      { autoAlpha: 0, y: 30 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: revealAt(el, "top 90%"),
      },
    );
  });
};

/**
 * ScrollTriggers are created from several components in effect order, not
 * page order. Pins change everything below them, so refresh in DOM order.
 */
const sortTriggersByPosition = () => {
  ScrollTrigger.sort((a: ScrollTrigger, b: ScrollTrigger) => {
    const priority =
      (b.vars.refreshPriority ?? 0) - (a.vars.refreshPriority ?? 0);
    if (priority) return priority;
    const ta = a.trigger;
    const tb = b.trigger;
    if (!ta || !tb || ta === tb) return (ta ? 1 : 0) - (tb ? 1 : 0);
    return ta.compareDocumentPosition(tb) & Node.DOCUMENT_POSITION_FOLLOWING
      ? -1
      : 1;
  });
};

/**
 * Registers every scroll-driven animation. Breakpoint changes are handled by
 * gsap.matchMedia, which reverts and rebuilds the matching set automatically.
 * Returns a cleanup function.
 */
export function initScrollAnimations() {
  const mm = gsap.matchMedia();

  mm.add(DESKTOP, () => {
    setLandingTimelines();
    setServicesDesktop();
    setExperienceDesktop();
  });

  mm.add(MOBILE, () => {
    setServicesMobile();
    setExperienceMobile();
  });

  mm.add("all", setRevealOnScroll);

  // Keep DOM order on every refresh (breakpoint changes recreate triggers).
  ScrollTrigger.addEventListener("refreshInit", sortTriggersByPosition);
  sortTriggersByPosition();
  ScrollTrigger.refresh();

  return () => {
    ScrollTrigger.removeEventListener("refreshInit", sortTriggersByPosition);
    mm.revert();
  };
}
