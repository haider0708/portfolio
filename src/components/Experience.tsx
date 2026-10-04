import { Link } from "react-router-dom";
import { career } from "../data/content";
import { getProject } from "../data/projects";
import "./styles/Experience.css";

/** Career timeline: a gold line grows down through each role. */
const Experience = () => (
  <section className="experience wrap" id="experience">
    <div className="experience__inner">
      <h2 className="experience__title">
        My career <span>&amp;</span>
        <br /> experience
      </h2>

      <div className="timeline">
        <div className="timeline__line" aria-hidden="true">
          <div className="timeline__dot" />
        </div>

        {career.map((item) => (
          <article className="role" key={item.role + item.period}>
            <header className="role__head">
              <div className="role__who">
                <h4 className="role__title">{item.role}</h4>
                <h5 className="role__company">{item.company}</h5>
                <span className="role__period">{item.period}</span>
              </div>
              <h3 className="role__mark">{item.mark}</h3>
            </header>

            <div className="role__body">
              <p>{item.description}</p>
              {item.related && (
                <div className="role__links">
                  {item.related.map((slug) => {
                    const project = getProject(slug);
                    return project ? (
                      <Link
                        key={slug}
                        to={`/projects/${slug}`}
                        data-cursor="hide"
                      >
                        {project.title}
                      </Link>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default Experience;
