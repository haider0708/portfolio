import { Link, useParams } from "react-router-dom";
import { MdArrowBack, MdArrowForward, MdArrowOutward } from "react-icons/md";
import { getProject, projects, Section } from "../data/projects";
import ProjectCover from "../components/ProjectCover";
import StatusPill from "../components/StatusPill";
import NotFound from "./NotFound";
import SubpageLayout from "./SubpageLayout";

const pad = (n: number) => String(n).padStart(2, "0");

const SectionBlock = ({
  section,
  index,
}: {
  section: Section;
  index: number;
}) => (
  <section className="pp-section" data-reveal>
    <h2>
      <span className="pp-index">{pad(index + 1)}</span>
      {section.title}
    </h2>
    {section.text && <p>{section.text}</p>}
    {section.steps && (
      <ol className="pp-flow">
        {section.steps.map((step, i) => (
          <li key={step}>
            <span className="pp-flow-n">{pad(i + 1)}</span>
            {step}
          </li>
        ))}
      </ol>
    )}
    {section.bullets && (
      <ul className="pp-bullets">
        {section.bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    )}
    {section.cards && (
      <div className="pp-cards">
        {section.cards.map((card) => (
          <div className="pp-card" key={card.title}>
            <h3>{card.title}</h3>
            {card.text && <p>{card.text}</p>}
            {card.bullets && (
              <ul className="pp-bullets">
                {card.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    )}
  </section>
);

const ProjectPage = () => {
  const { slug = "" } = useParams();
  const project = getProject(slug);
  if (!project) return <NotFound />;

  const index = projects.indexOf(project);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  return (
    <SubpageLayout title={project.title} revealKey={project.slug}>
      <article className="pp" key={project.slug}>
        <header className="wrap pp-hero">
          <Link to="/projects" className="pp-back" data-cursor="hide">
            <MdArrowBack aria-hidden="true" /> All projects
          </Link>
          <div className="pp-meta" data-reveal>
            <StatusPill status={project.status} />
            {project.period && <span>{project.period}</span>}
            {project.context && <span>{project.context}</span>}
          </div>
          <h1 data-reveal>{project.title}</h1>
          <p className="pp-tagline" data-reveal>
            {project.tagline}
          </p>
        </header>

        <div className="wrap pp-cover" data-reveal>
          <ProjectCover project={project} size="lg" />
        </div>

        <div className="wrap pp-intro">
          <p className="pp-summary" data-reveal>
            {project.summary}
          </p>
          <dl className="pp-facts" data-reveal>
            {project.role && (
              <div>
                <dt>Role</dt>
                <dd>{project.role}</dd>
              </div>
            )}
            <div>
              <dt>Domain</dt>
              <dd>{project.categories.join(" · ")}</dd>
            </div>
            {project.links && project.links.length > 0 && (
              <div>
                <dt>Links</dt>
                <dd className="pp-links">
                  {project.links.map((l) => (
                    <a
                      key={l.url}
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="hide"
                    >
                      {l.label} <MdArrowOutward aria-hidden="true" />
                    </a>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </div>

        {project.metrics && project.metrics.length > 0 && (
          <div className="wrap">
            <div className="pp-metrics">
              {project.metrics.map((m) => (
                <div className="pp-metric" key={m.label} data-reveal>
                  <span className="pp-metric-value">{m.value}</span>
                  <span className="pp-metric-label">{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="wrap pp-body">
          <div className="pp-content">
            {project.sections.map((section, i) => (
              <SectionBlock key={section.title} section={section} index={i} />
            ))}
          </div>
          {project.stack.length > 0 && (
            <aside className="pp-aside" aria-label="Tech stack">
              <h2>Stack</h2>
              <ul className="chip-row">
                {project.stack.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </aside>
          )}
        </div>

        <nav className="wrap pp-pager" aria-label="More projects">
          <Link
            to={`/projects/${prev.slug}`}
            className="pp-pager-link"
            data-cursor="hide"
          >
            <span className="pp-pager-dir">
              <MdArrowBack aria-hidden="true" /> Previous
            </span>
            <span className="pp-pager-title">{prev.title}</span>
          </Link>
          <Link
            to={`/projects/${next.slug}`}
            className="pp-pager-link pp-pager-next"
            data-cursor="hide"
          >
            <span className="pp-pager-dir">
              Next <MdArrowForward aria-hidden="true" />
            </span>
            <span className="pp-pager-title">{next.title}</span>
          </Link>
        </nav>
      </article>
    </SubpageLayout>
  );
};

export default ProjectPage;
