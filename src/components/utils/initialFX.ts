import { gsap, SplitText } from "../../lib/gsap";
import { smoother } from "../Navbar";

const REVEAL_FROM = { opacity: 0, y: 80, filter: "blur(5px)" };
const REVEAL_TO = {
  opacity: 1,
  y: 0,
  filter: "blur(0px)",
  duration: 1.2,
  ease: "power3.inOut",
  stagger: 0.025,
  delay: 0.3,
};

/** Seconds each role word stays on screen before flipping. */
const ROLE_HOLD = 2.6;

let introCtx: gsap.Context | undefined;

/** Plays the hero intro. Safe to call again — the previous run is reverted. */
export function initialFX() {
  introCtx?.revert();
  introCtx = gsap.context(() => {
    document.body.style.overflowY = "auto";
    smoother?.paused(false);
    document.querySelector("main")?.classList.add("is-revealed");
    gsap.to("body", { backgroundColor: "#07090d", duration: 0.5, delay: 1 });

    const heroText = new SplitText(
      [".hero__kicker", ".hero__hello", ".hero__name"],
      { type: "chars,lines", linesClass: "split-mask" },
    );
    gsap.fromTo(heroText.chars, REVEAL_FROM, REVEAL_TO);

    gsap.fromTo(
      [".site-header", ".rail", ".header-fade"],
      { opacity: 0 },
      { opacity: 1, duration: 1.2, ease: "power1.inOut", delay: 0.1 },
    );
    gsap.fromTo(
      ".hero__focus",
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out", delay: 1.2 },
    );
    gsap.to(".hero__cue", { opacity: 1, duration: 1, delay: 2.2 });

    revealPortrait();
    flipRoles();
  });
}

/** Stops the intro's looping animations (call when the home page unmounts). */
export function revertIntro() {
  introCtx?.revert();
  introCtx = undefined;
}

/**
 * The hero role flips through each word in turn: the current word's letters
 * roll up and out while the next word's letters roll in from below — same
 * timing, direction and easing every time.
 */
function flipRoles() {
  const words = gsap.utils.toArray<HTMLElement>(".hero__word");
  if (!words.length) return;
  const splits = words.map((w) => new SplitText(w, { type: "chars" }));

  gsap.set(words, { visibility: "visible" });
  splits.slice(1).forEach((s) => gsap.set(s.chars, { yPercent: 110 }));
  gsap.fromTo(
    splits[0].chars,
    { yPercent: 110, opacity: 0 },
    {
      yPercent: 0,
      opacity: 1,
      duration: 1.1,
      ease: "power3.out",
      stagger: 0.035,
      delay: 0.6,
    },
  );
  if (splits.length < 2) return;

  const tl = gsap.timeline({ repeat: -1, delay: 0.6 + 1.1 });
  splits.forEach((current, i) => {
    const next = splits[(i + 1) % splits.length];
    tl.to(
      current.chars,
      {
        yPercent: -110,
        duration: 0.6,
        ease: "power3.in",
        stagger: 0.03,
      },
      `+=${ROLE_HOLD}`,
    ).fromTo(
      next.chars,
      { yPercent: 110 },
      { yPercent: 0, duration: 0.8, ease: "power3.out", stagger: 0.03 },
      "<0.3",
    );
  });
}

function revealPortrait() {
  gsap
    .timeline({ delay: 0.2, defaults: { ease: "expo.out" } })
    .fromTo(
      ".hero-glow",
      { opacity: 0, scale: 0.6 },
      { opacity: 1, scale: 1, duration: 2.4 },
      0,
    )
    .fromTo(
      ".hero-frame",
      { clipPath: "inset(100% 0% 0% 0%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut" },
      0.1,
    )
    .fromTo(".hero-media", { scale: 1.25 }, { scale: 1, duration: 2.2 }, 0.3)
    .fromTo(
      ".hero-ring",
      { opacity: 0, scale: 0.94 },
      { opacity: 1, scale: 1, duration: 1.6 },
      0.9,
    )
    .fromTo(
      ".hero-badge",
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 1 },
      1.4,
    );
}
