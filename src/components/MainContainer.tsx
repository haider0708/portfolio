import { useEffect } from "react";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { ScrollTrigger } from "../lib/gsap";
import { intro } from "../lib/intro";
import { siteConfig } from "../data/siteConfig";
import About from "./About";
import Experience from "./Experience";
import Contact from "./Contact";
import Cursor from "./Cursor";
import HeroPortrait from "./HeroPortrait";
import Hero from "./Hero";
import Navbar, { smoother } from "./Navbar";
import ScrollProgress from "./ScrollProgress";
import SideRail from "./SideRail";
import TechStack from "./TechStack";
import Services from "./Services";
import Work from "./Work";
import { initScrollAnimations } from "./utils/scrollAnimations";
import { initSplitText } from "./utils/splitText";

const MainContainer = () => {
  const isDesktop = useMediaQuery("(min-width: 1025px)");

  useEffect(() => {
    document.title = `${siteConfig.name} — ${siteConfig.headline}`;
    const cleanups = [initScrollAnimations(), initSplitText()];
    // Fonts change text metrics, so trigger positions must be re-measured.
    document.fonts.ready.then(() => ScrollTrigger.refresh());

    // Content can change height without a window resize (stack filters, the
    // skills reveal on mobile). Re-measure every trigger when it does, so
    // reveals and pins never work from stale positions.
    const content = document.querySelector<HTMLElement>("#smooth-content");
    let lastHeight = content?.offsetHeight ?? 0;
    let refreshTimer = 0;
    const resizeObserver = new ResizeObserver(() => {
      const height = content!.offsetHeight;
      if (Math.abs(height - lastHeight) < 2) return;
      lastHeight = height;
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 150);
    });
    if (content) resizeObserver.observe(content);

    // Returning from a sub-page: skip the loader, replay the reveal and
    // honour links such as "/#contact". (Deferred so StrictMode's double
    // mount in development doesn't run it twice.)
    const replay = window.setTimeout(async () => {
      if (!intro.played) return;
      const { initialFX } = await import("./utils/initialFX");
      initialFX();
      const { hash } = window.location;
      if (hash && document.querySelector(hash)) {
        window.setTimeout(() => smoother?.scrollTo(hash, true, "top top"), 500);
      }
    }, 0);

    return () => {
      resizeObserver.disconnect();
      window.clearTimeout(refreshTimer);
      window.clearTimeout(replay);
      cleanups.forEach((cleanup) => cleanup());
      // Stop the hero's looping animations when leaving the page.
      import("./utils/initialFX").then(({ revertIntro }) => revertIntro());
    };
  }, []);

  return (
    <div className="app-shell">
      <div className="grain" aria-hidden="true" />
      <Cursor />
      <Navbar />
      <SideRail />
      <ScrollProgress />
      {/* Desktop: pinned outside the smooth scroller so it can stay fixed. */}
      {isDesktop && <HeroPortrait />}
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <div className="app-shell">
            <Hero>{!isDesktop && <HeroPortrait />}</Hero>
            <About />
            <Services />
            <Experience />
            <Work />
            <TechStack />
            <Contact />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContainer;
