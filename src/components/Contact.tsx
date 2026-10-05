import { MdArrowOutward, MdArrowUpward } from "react-icons/md";
import { siteConfig } from "../data/siteConfig";
import { scrollToTarget } from "../lib/scroll";
import "./styles/Contact.css";

const socials = [
  { label: "GitHub", href: siteConfig.socials.github },
  { label: "LinkedIn", href: siteConfig.socials.linkedin },
];

const Contact = () => (
  <section className="contact wrap" id="contact">
    <div className="contact__inner">
      <h3 className="contact__title" data-reveal>
        Let&apos;s <span className="serif-accent">talk</span>
      </h3>
      <p className="contact__lead" data-reveal>
        Available for {siteConfig.contracts.join(" · ")} — working from{" "}
        {siteConfig.mobility.join(" · ")}.
      </p>
      <a
        className="contact__cta"
        href={`mailto:${siteConfig.email}`}
        data-cursor="hide"
        data-reveal
      >
        <span className="contact__email">
          {/* allow a clean line break before the @ on narrow screens */}
          {siteConfig.email.split("@")[0]}
          <wbr />@{siteConfig.email.split("@")[1]}
        </span>
        <span className="contact__arrow">
          <MdArrowOutward />
        </span>
      </a>

      <div className="contact__grid">
        <div className="contact__col">
          <h4 className="contact__label">Phone</h4>
          <p className="contact__value">
            <a href={siteConfig.phoneHref} data-cursor="hide">
              {siteConfig.phone}
            </a>
          </p>
          <h4 className="contact__label">Based in</h4>
          <p className="contact__value">{siteConfig.location}</p>
        </div>
        <div className="contact__col">
          <h4 className="contact__label">Languages</h4>
          <ul className="contact__langs">
            {siteConfig.languages.map((l) => (
              <li key={l.name}>
                {l.name} <span>{l.level}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="contact__col">
          <h4 className="contact__label">Elsewhere</h4>
          {socials.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hide"
              className="contact__link"
            >
              {label} <MdArrowOutward />
            </a>
          ))}
        </div>
      </div>

      <footer className="contact__foot">
        <span>
          © {siteConfig.year} {siteConfig.name}
        </span>
        <button
          type="button"
          className="contact__top"
          onClick={() => scrollToTarget(0)}
          data-cursor="hide"
        >
          Back to top <MdArrowUpward />
        </button>
      </footer>
    </div>
  </section>
);

export default Contact;
