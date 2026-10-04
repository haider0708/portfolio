import { MouseEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  gsap,
  ScrollSmoother,
  ScrollTrigger,
  sectionRange,
  useGSAP,
} from "../lib/gsap";
import { siteConfig } from "../data/siteConfig";
import RollLink from "./RollLink";
import "./styles/SiteHeader.css";

// eslint-disable-next-line react-refresh/only-export-components
export let smoother: ScrollSmoother | undefined;

/** In-page sections, plus the Projects route. */
const links = [
  { label: "ABOUT", href: "#about" },
  { label: "WORK", href: "#work" },
  { label: "PROJECTS", href: "/projects" },
  { label: "CONTACT", href: "#contact" },
];
const isRoute = (href: string) => href.startsWith("/");

const Navbar = () => {
  const [active, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Mobile menu: lock scrolling while open, close on Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const wasPaused = smoother?.paused() ?? false;
    smoother?.paused(true);
    document.documentElement.classList.add("menu-open");
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      smoother?.paused(wasPaused);
      document.documentElement.classList.remove("menu-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  // Layout effect: the smoother must exist before any ScrollTrigger (e.g. the
  // pinned Work section) is created further down the tree.
  useGSAP(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
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
    smoother.paused(true);

    // Tuck the header away while reading, bring it back on scroll up.
    let hidden = false;
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const shouldHide = self.direction === 1 && self.scroll() > 400;
        if (shouldHide === hidden) return;
        hidden = shouldHide;
        gsap.to([".site-header", ".header-fade"], {
          yPercent: hidden ? -110 : 0,
          duration: 0.6,
          ease: "power3.out",
          overwrite: "auto",
        });
      },
    });
    // Highlight the link of the section currently in view.
    links.forEach(({ href }) => {
      if (isRoute(href)) return;
      const section = document.querySelector(href);
      if (!section) return;
      const half = () => window.innerHeight / 2;
      ScrollTrigger.create({
        ...sectionRange(section, half, half),
        onToggle: (self) => {
          if (self.isActive) setActive(href);
          else setActive((cur) => (cur === href ? null : cur));
        },
      });
    });

    return () => {
      smoother = undefined;
    };
  });

  const handleClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (smoother) {
      e.preventDefault();
      smoother.scrollTo(href, true, "top top");
    }
  };

  /** Menu links close the overlay first, then scroll or navigate. */
  const handleMenuClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    window.setTimeout(() => {
      if (isRoute(href)) navigate(href);
      else smoother?.scrollTo(href, true, "top top");
    }, 350);
  };

  return (
    <>
      <header className="site-header">
        <a href="/#" className="site-header__brand" data-cursor="hide">
          {siteConfig.brand}
        </a>
        <a
          href={`mailto:${siteConfig.email}`}
          className="site-header__mail"
          data-cursor="hide"
        >
          {siteConfig.email}
        </a>
        <nav aria-label="Primary" className="site-nav">
          <ul className="site-nav__list">
            {links.map(({ label, href }) => (
              <li key={href} className="site-nav__item">
                {isRoute(href) ? (
                  <Link
                    to={href}
                    className="site-nav__link site-nav__link--page"
                  >
                    <RollLink label={label} />
                  </Link>
                ) : (
                  <a
                    href={href}
                    className={`site-nav__link${active === href ? " is-active" : ""}`}
                    aria-current={active === href ? "location" : undefined}
                    onClick={(e) => handleClick(e, href)}
                  >
                    <RollLink label={label} />
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <button
          type="button"
          className={`menu-toggle${menuOpen ? " is-open" : ""}`}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="menu-toggle-label">
            {menuOpen ? "Close" : "Menu"}
          </span>
          <span className="menu-toggle-icon" aria-hidden="true" />
        </button>
      </header>

      <div
        id="mobile-menu"
        className={`mobile-menu${menuOpen ? " is-open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <nav aria-label="Mobile" className="mobile-menu-links">
          {links.map(({ label, href }, i) => (
            <a
              key={href}
              href={href}
              tabIndex={menuOpen ? 0 : -1}
              style={{
                transitionDelay: menuOpen ? `${120 + i * 60}ms` : "0ms",
              }}
              onClick={(e) => handleMenuClick(e, href)}
            >
              <span className="mobile-menu-index">0{i + 1}</span>
              {label.charAt(0) + label.slice(1).toLowerCase()}
            </a>
          ))}
        </nav>
        <div className="mobile-menu-foot">
          <a href={`mailto:${siteConfig.email}`} tabIndex={menuOpen ? 0 : -1}>
            {siteConfig.email}
          </a>
          <div className="mobile-menu-socials">
            <a
              href={siteConfig.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={menuOpen ? 0 : -1}
            >
              GitHub
            </a>
            <a
              href={siteConfig.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={menuOpen ? 0 : -1}
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      <div className="ambient-glow ambient-glow--a" aria-hidden="true" />
      <div className="ambient-glow ambient-glow--b" aria-hidden="true" />
      <div className="header-fade" aria-hidden="true" />
    </>
  );
};

export default Navbar;
