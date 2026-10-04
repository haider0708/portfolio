import { CSSProperties, useState } from "react";
import { whatIDo } from "../data/content";
import "./styles/Services.css";

/**
 * "What I do": two service cards inside a dashed frame. Skills reveal on
 * hover (pointer devices), on keyboard focus, or with a tap on touch screens.
 */
const Services = () => {
  const [open, setOpen] = useState<number | null>(null);
  const toggle = (index: number) =>
    setOpen((current) => (current === index ? null : index));

  return (
    <section className="services">
      <div className="services__col">
        <h2 className="services__title reveal-chars">
          W<span className="services__title-italic">HAT</span>
          <br />I<span className="services__title-gold"> DO</span>
        </h2>
      </div>

      <div className="services__col">
        <div className="services__stack">
          <div className="services__frame" aria-hidden="true" />
          {whatIDo.map((item, index) => (
            <article
              key={item.title}
              className={`service${index === 0 ? " service--first" : ""}${
                open === index ? " is-open" : ""
              }`}
              role="button"
              tabIndex={0}
              aria-expanded={open === index}
              aria-label={`${item.kicker}: ${item.title} — show skills and tools`}
              onClick={() => toggle(index)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggle(index);
                }
              }}
            >
              <div className="service__rule" aria-hidden="true" />
              <div className="service__corners" aria-hidden="true" />

              <p className="service__kicker">{item.kicker}</p>
              <h3 className="service__title">{item.title}</h3>
              <p className="service__text">{item.description}</p>
              {"flow" in item && item.flow && (
                <ol className="service__flow">
                  {item.flow.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              )}

              <p className="service__toggle">
                Skills &amp; tools
                <span className="service__count">{item.tags.length}</span>
                <span className="service__plus" aria-hidden="true" />
              </p>
              <div className="service__skills">
                <ul className="service__tags">
                  {item.tags.map((tag, i) => (
                    <li
                      className="service__tag"
                      key={tag}
                      style={{ "--i": i } as CSSProperties}
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
