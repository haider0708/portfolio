import { useEffect, useRef } from "react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import { MdOutlineMail } from "react-icons/md";
import { TbNotes } from "react-icons/tb";
import { gsap, ScrollTrigger, sectionRange, useGSAP } from "../lib/gsap";
import { siteConfig } from "../data/siteConfig";
import RollLink from "./RollLink";
import "./styles/SideRail.css";

const links = [
  { label: "GitHub", href: siteConfig.socials.github, Icon: FaGithub },
  { label: "LinkedIn", href: siteConfig.socials.linkedin, Icon: FaLinkedinIn },
  { label: "Email", href: `mailto:${siteConfig.email}`, Icon: MdOutlineMail },
];

/** Pull radius (px from a slot's centre) and how far an icon may travel. */
const PULL_RADIUS = 34;
const PULL_STRENGTH = 0.45;

interface Slot {
  icon: HTMLElement;
  cx: number;
  cy: number;
  x: number;
  y: number;
  tx: number;
  ty: number;
}

/**
 * Fixed rail with social links (left) and an optional résumé link (right).
 * Icons lean toward a nearby pointer; the frame loop runs only while moving.
 */
const SideRail = () => {
  const railRef = useRef<HTMLDivElement>(null);
  const iconsRef = useRef<HTMLUListElement>(null);

  // Step aside where the rail would cover content: during the horizontal
  // Work scroll on desktop, and after the hero on small screens.
  useGSAP(() => {
    const rail = railRef.current!;
    const toggle = (self: ScrollTrigger) =>
      rail.classList.toggle("is-hidden", self.isActive);
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1025px)", () => {
      const work = document.querySelector("#work");
      if (!work) return;
      ScrollTrigger.create({
        ...sectionRange(
          work,
          () => window.innerHeight * 0.3,
          () => 0,
        ),
        onToggle: toggle,
      });
    });
    mm.add("(max-width: 1024px)", () => {
      ScrollTrigger.create({
        trigger: ".hero",
        start: "bottom 80%",
        end: "max",
        onToggle: toggle,
        refreshPriority: -1,
      });
    });
    return () => mm.revert();
  });

  useEffect(() => {
    const list = iconsRef.current!;
    const slots: Slot[] = [];
    let frame = 0;

    const measure = () => {
      slots.length = 0;
      list.querySelectorAll<HTMLElement>(".rail__slot").forEach((slot) => {
        const box = slot.getBoundingClientRect();
        slots.push({
          icon: slot.querySelector<HTMLElement>(".rail__icon")!,
          cx: box.left + box.width / 2,
          cy: box.top + box.height / 2,
          x: 0,
          y: 0,
          tx: 0,
          ty: 0,
        });
      });
    };

    const step = () => {
      let moving = false;
      for (const s of slots) {
        s.x += (s.tx - s.x) * 0.12;
        s.y += (s.ty - s.y) * 0.12;
        s.icon.style.transform = `translate(${s.x.toFixed(2)}px, ${s.y.toFixed(2)}px)`;
        if (Math.abs(s.tx - s.x) > 0.05 || Math.abs(s.ty - s.y) > 0.05)
          moving = true;
      }
      frame = moving ? requestAnimationFrame(step) : 0;
    };

    const onMove = (e: MouseEvent) => {
      for (const s of slots) {
        const dx = e.clientX - s.cx;
        const dy = e.clientY - s.cy;
        const inside = Math.hypot(dx, dy) < PULL_RADIUS;
        s.tx = inside ? dx * PULL_STRENGTH : 0;
        s.ty = inside ? dy * PULL_STRENGTH : 0;
      }
      if (!frame) frame = requestAnimationFrame(step);
    };

    measure();
    window.addEventListener("resize", measure);
    document.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", measure);
      document.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div className="rail" ref={railRef}>
      <ul className="rail__icons" data-cursor="snap" ref={iconsRef}>
        {links.map(({ label, href, Icon }) => (
          <li className="rail__slot" key={label}>
            <a
              className="rail__icon"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
            >
              <Icon />
            </a>
          </li>
        ))}
      </ul>
      {siteConfig.resumeUrl && (
        <a
          className="rail__cv"
          href={siteConfig.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <RollLink label="RESUME" />
          <TbNotes aria-hidden="true" />
        </a>
      )}
    </div>
  );
};

export default SideRail;
