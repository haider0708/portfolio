import { PropsWithChildren } from "react";
import { siteConfig } from "../data/siteConfig";
import "./styles/Hero.css";

/**
 * Opening screen: greeting + name on one side, the flipping role on the
 * other. On mobile the portrait is passed in as children and sits between.
 */
const Hero = ({ children }: PropsWithChildren) => (
  <section className="hero">
    {children}
    <div className="hero__inner">
      <div className="hero__intro">
        <h2 className="hero__hello">Hello! I'm</h2>
        <h1 className="hero__name">
          {siteConfig.firstName.toUpperCase()}
          <br />
          {siteConfig.lastName.toUpperCase()}
        </h1>
      </div>

      <div className="hero__role">
        <h3 className="hero__kicker">{siteConfig.roleIntro}</h3>
        <h2
          className="hero__line"
          aria-label={`${siteConfig.roleIntro} ${siteConfig.roleWords.join(" and ")}`}
        >
          {siteConfig.roleWords.map((word) => (
            <span className="hero__word" key={word} aria-hidden="true">
              {word}
            </span>
          ))}
        </h2>
        <p className="hero__focus">{siteConfig.roleFocus.join(" · ")}</p>
      </div>

      <div className="hero__cue" aria-hidden="true">
        <span>Scroll</span>
        <i />
      </div>
    </div>
  </section>
);

export default Hero;
