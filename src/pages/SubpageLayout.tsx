import { PropsWithChildren, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { siteConfig } from "../data/siteConfig";
import type { PageMeta } from "../seo/meta";
import { useSeo } from "../seo/useSeo";
import { useReveal } from "../hooks/useReveal";
import Cursor from "../components/Cursor";
import "../components/styles/Subpage.css";

interface Props {
  /** Title, description and canonical path for this page. */
  meta: PageMeta;
  /** Re-run reveal observers when page content changes (e.g. filters). */
  revealKey?: unknown;
}

const SubpageLayout = ({
  meta,
  revealKey,
  children,
}: PropsWithChildren<Props>) => {
  const rootRef = useRef<HTMLDivElement>(null);
  useReveal(rootRef, [revealKey, meta.path]);
  useSeo(meta);

  useEffect(() => {
    // The home page locks scrolling until its intro finishes.
    document.body.style.overflowY = "auto";
    document.body.style.backgroundColor = "var(--c-bg)";
  }, []);

  return (
    <div className="subpage" ref={rootRef}>
      <div className="grain" aria-hidden="true" />
      <Cursor />
      <header className="sub-header">
        <Link to="/" className="sub-brand" data-cursor="hide">
          {siteConfig.brand}
        </Link>
        <nav aria-label="Primary" className="sub-nav">
          <Link to="/" data-cursor="hide">
            Home
          </Link>
          <NavLink to="/projects" end data-cursor="hide">
            Projects
          </NavLink>
          <Link to="/#contact" data-cursor="hide">
            Contact
          </Link>
        </nav>
      </header>
      <main className="sub-main">{children}</main>
      <footer className="sub-footer wrap">
        <span>
          © {siteConfig.year} {siteConfig.name}
        </span>
        <span className="sub-footer-links">
          <a href={`mailto:${siteConfig.email}`} data-cursor="hide">
            {siteConfig.email}
          </a>
          <a
            href={siteConfig.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="hide"
          >
            GitHub
          </a>
          <a
            href={siteConfig.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="hide"
          >
            LinkedIn
          </a>
        </span>
      </footer>
    </div>
  );
};

export default SubpageLayout;
