import { useRef } from "react";
import { Link } from "react-router-dom";
import { MdArrowOutward } from "react-icons/md";
import { gsap, useGSAP } from "../lib/gsap";
import {
  featuredProjects as projects,
  projects as allProjects,
} from "../data/projects";
import ProjectCover from "./ProjectCover";
import "./styles/Work.css";

const pad = (n: number) => String(n).padStart(2, "0");

/** Vertical scroll distance per horizontal pixel — higher = slower, calmer. */
const SCROLL_RATIO = 2.6;

/**
 * Featured projects. Desktop: the section pins and the cards slide sideways
 * with the scroll. Phones & tablets: a native swipe carousel.
 */
const Work = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current!;
      const inner = section.querySelector<HTMLElement>(".work__inner")!;
      const rail = section.querySelector<HTMLElement>(".work__rail")!;
      const cards = gsap.utils.toArray<HTMLElement>(".work-card", section);

      // Counter + progress bar. The last card is "all projects", not a project.
      let shown = 1;
      const setProgress = (progress: number) => {
        barRef.current!.style.transform = `scaleX(${progress})`;
        const index = Math.min(
          projects.length,
          Math.max(1, Math.round(progress * (cards.length - 1)) + 1),
        );
        if (index !== shown) {
          shown = index;
          countRef.current!.textContent = pad(index);
        }
      };

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1025px)", () => {
        // Slide until the last card's right edge sits as far from the
        // viewport's right edge as the content column is from the left.
        const travel = () => {
          const gutter = inner.getBoundingClientRect().left;
          const lastRight =
            cards[cards.length - 1].getBoundingClientRect().right;
          const currentX = Number(gsap.getProperty(rail, "x")) || 0;
          return Math.max(
            0,
            lastRight - currentX - (window.innerWidth - gutter),
          );
        };

        const slide = gsap.to(rail, {
          x: () => -travel(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${travel() * SCROLL_RATIO}`,
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
            id: "work",
            onUpdate: (self) => setProgress(self.progress),
          },
        });

        // Each card settles in as it slides into view.
        cards.forEach((card) => {
          gsap.fromTo(
            card.querySelectorAll(".work-card__info, .work-card__cover"),
            { autoAlpha: 0.15, y: 40 },
            {
              autoAlpha: 1,
              y: 0,
              ease: "power2.out",
              stagger: 0.1,
              scrollTrigger: {
                trigger: card,
                containerAnimation: slide,
                start: "left 95%",
                end: "left 55%",
                scrub: true,
              },
            },
          );
        });
      });

      mm.add("(max-width: 1024px)", () => {
        const onScroll = () => {
          const max = rail.scrollWidth - rail.clientWidth;
          setProgress(max > 0 ? rail.scrollLeft / max : 0);
        };
        onScroll();
        rail.addEventListener("scroll", onScroll, { passive: true });
        return () => rail.removeEventListener("scroll", onScroll);
      });
    },
    { scope: sectionRef },
  );

  return (
    <section className="work" id="work" ref={sectionRef}>
      <div className="work__inner wrap">
        <header className="work__head">
          <h2 className="work__title">
            My <span>Work</span>
          </h2>
          <div className="work__progress" aria-hidden="true">
            <span className="work__count">
              <span ref={countRef}>01</span> / {pad(projects.length)}
            </span>
            <span className="work__hint">Swipe</span>
            <div className="work__track">
              <div className="work__bar" ref={barRef} />
            </div>
          </div>
        </header>

        <div className="work__rail">
          {projects.map((project, index) => (
            <article className="work-card" key={project.slug}>
              <div className="work-card__info">
                <div className="work-card__head">
                  <span className="work-card__num">{pad(index + 1)}</span>
                  <div className="work-card__meta">
                    <h3 className="work-card__name">{project.title}</h3>
                    <p className="work-card__cat">{project.categories[0]}</p>
                  </div>
                </div>
                <p className="work-card__tagline">{project.tagline}</p>
                <ul className="work-card__tags">
                  {project.stack.slice(0, 5).map((tool) => (
                    <li key={tool}>{tool}</li>
                  ))}
                </ul>
              </div>
              <Link
                to={`/projects/${project.slug}`}
                className="work-card__cover"
                data-cursor="view"
                aria-label={`${project.title} — case study`}
              >
                <ProjectCover project={project} />
              </Link>
            </article>
          ))}

          <div className="work-card work-card--cta">
            <Link to="/projects" className="all-link" data-cursor="hide">
              <span className="all-link__count">{allProjects.length}</span>
              <span className="all-link__text">
                View all <span className="serif-accent">projects</span>
              </span>
              <span className="all-link__icon">
                <MdArrowOutward />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Work;
