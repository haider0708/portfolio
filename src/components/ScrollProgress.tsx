import { useRef } from "react";
import { gsap, useGSAP } from "../lib/gsap";

/** Thin gold bar at the top of the viewport that tracks page progress. */
const ScrollProgress = () => {
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.to(barRef.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
    });
  });

  return <div className="scroll-progress" ref={barRef} aria-hidden="true" />;
};

export default ScrollProgress;
