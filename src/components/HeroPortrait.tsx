import { useEffect, useRef } from "react";
import { gsap } from "../lib/gsap";
import { siteConfig } from "../data/siteConfig";
import "./styles/HeroPortrait.css";

const HeroPortrait = () => {
  const tiltRef = useRef<HTMLDivElement>(null);
  const initials = `${siteConfig.firstName[0]}${siteConfig.lastName[0]}`;

  // Subtle 3D tilt toward the pointer (mouse/trackpad only).
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = tiltRef.current!;
    const rotY = gsap.quickTo(el, "rotationY", {
      duration: 0.9,
      ease: "power3",
    });
    const rotX = gsap.quickTo(el, "rotationX", {
      duration: 0.9,
      ease: "power3",
    });

    const onMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      rotY(x * 10);
      rotX(-y * 8);
    };
    document.addEventListener("mousemove", onMove, { passive: true });
    return () => document.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="hero-portrait">
      <div className="hero-glow" aria-hidden="true"></div>
      <div className="hero-portrait-tilt" ref={tiltRef}>
        <div className="hero-ring" aria-hidden="true"></div>
        <div className="hero-frame">
          {siteConfig.portrait ? (
            <img
              className="hero-media"
              src={siteConfig.portrait}
              alt={siteConfig.name}
              width={1122}
              height={1402}
              decoding="async"
              // lower-case: React 18 doesn't know the camel-cased prop yet
              {...{ fetchpriority: "high" }}
            />
          ) : (
            <div className="hero-media hero-monogram" aria-hidden="true">
              <span>{initials}</span>
            </div>
          )}
        </div>
        {siteConfig.available && (
          <div className="hero-badge">
            <span className="hero-badge-status">Available</span>
            <span className="hero-badge-divider" aria-hidden="true" />
            <span className="hero-badge-terms">
              {siteConfig.contracts.join(" · ")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroPortrait;
