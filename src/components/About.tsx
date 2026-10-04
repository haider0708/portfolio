import { useRef } from "react";
import { gsap, revealAt, useGSAP } from "../lib/gsap";
import { about, contributions, values } from "../data/content";
import "./styles/About.css";

const About = () => {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reveal = (targets: string, trigger: string) =>
        gsap.fromTo(
          targets,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: revealAt(trigger, "top 90%"),
          },
        );
      reveal(".about__value", ".about__values");
      reveal(".figure", ".about__figures");

      // Count each figure up once it scrolls into view.
      gsap.utils.toArray<HTMLElement>(".figure__value").forEach((el) => {
        const counter = { v: 0 };
        gsap.to(counter, {
          v: Number(el.dataset.value),
          duration: 2,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = String(Math.round(counter.v));
          },
          scrollTrigger: revealAt(el, "top 92%"),
        });
      });
    },
    { scope: rootRef },
  );

  return (
    <section className="about" id="about">
      <div className="about__body" ref={rootRef}>
        <h3 className="about__title reveal-chars">About Me</h3>
        <p className="about__statement reveal-words">{about}</p>

        <ul className="about__values">
          {values.map((v) => (
            <li className="about__value" key={v.title}>
              <h4>{v.title}</h4>
              <p>{v.text}</p>
            </li>
          ))}
        </ul>

        <div className="about__figures" aria-label="At a glance">
          {contributions.map((stat) => (
            <div className="figure" key={stat.label}>
              <div className="figure__num">
                <span className="figure__value" data-value={stat.value}>
                  {stat.value}
                </span>
                <span className="figure__suffix">{stat.suffix}</span>
              </div>
              <div className="figure__label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
