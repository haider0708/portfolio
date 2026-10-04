import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MdArrowOutward } from "react-icons/md";
import { categories, Category, projects } from "../data/projects";
import { certifications, openSource, skillGroups } from "../data/profile";
import ProjectCover from "../components/ProjectCover";
import SubpageLayout from "./SubpageLayout";

type Filter = "All" | Category;

const selected = projects.filter((p) => !p.archive);
const archived = projects.filter((p) => p.archive);
const matches = (filter: Filter) => (p: (typeof projects)[number]) =>
  filter === "All" || p.categories.includes(filter);

const ProjectsPage = () => {
  const [filter, setFilter] = useState<Filter>("All");

  const counts = useMemo(() => {
    const map = new Map<Filter, number>([["All", projects.length]]);
    categories.forEach((c) => map.set(c, projects.filter(matches(c)).length));
    return map;
  }, []);

  const visible = useMemo(() => selected.filter(matches(filter)), [filter]);
  const visibleArchive = useMemo(
    () => archived.filter(matches(filter)),
    [filter],
  );

  return (
    <SubpageLayout title="Projects" revealKey={filter}>
      <section className="wrap sub-hero">
        <p className="sub-kicker" data-reveal>
          {selected.length} selected projects · {archived.length} in the archive
        </p>
        <h1 data-reveal>
          Selected <span className="serif-accent">work</span>
        </h1>
        <p className="sub-lead" data-reveal>
          Production platforms, AI systems, data pipelines and the labs behind
          them — from architecture and backend services to ML, mobile and
          production operations.
        </p>
      </section>

      <section className="wrap" aria-label="Projects">
        <div className="filter-bar" role="tablist" aria-label="Filter projects">
          {(["All", ...categories] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={filter === f}
              className={`filter-chip ${filter === f ? "is-active" : ""}`}
              onClick={() => setFilter(f)}
              data-cursor="hide"
            >
              {f}
              <span className="filter-count">{counts.get(f)}</span>
            </button>
          ))}
        </div>

        <div className="project-grid">
          {visible.map((project) => (
            <Link
              key={`${filter}-${project.slug}`}
              to={`/projects/${project.slug}`}
              className="project-card"
              data-reveal
              data-cursor="hide"
            >
              <ProjectCover project={project} />
              <div className="project-card-body">
                {(project.context || project.period) && (
                  <div className="project-card-meta">
                    {[project.context, project.period]
                      .filter(Boolean)
                      .join(" · ")}
                  </div>
                )}
                <h2>
                  {project.title}
                  <MdArrowOutward aria-hidden="true" />
                </h2>
                <p>{project.tagline}</p>
                {project.stack.length > 0 && (
                  <ul className="chip-row">
                    {project.stack.slice(0, 5).map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                    {project.stack.length > 5 && (
                      <li className="chip-more">+{project.stack.length - 5}</li>
                    )}
                  </ul>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {visibleArchive.length > 0 && (
        <section className="wrap sub-block" id="archive">
          <div className="sub-block-head" data-reveal>
            <h2>
              The <span className="serif-accent">archive</span>
            </h2>
            <p className="sub-lead">
              Labs, coursework and smaller builds — cloud data platforms, QA
              frameworks and early prototypes.
            </p>
          </div>
          <ul className="archive-list">
            {visibleArchive.map((project) => (
              <li key={`${filter}-${project.slug}`} data-reveal>
                <Link
                  to={`/projects/${project.slug}`}
                  className="archive-row"
                  data-cursor="hide"
                >
                  <span className="archive-title">{project.title}</span>
                  <span className="archive-tagline">{project.tagline}</span>
                  <span className="archive-cat">{project.categories[0]}</span>
                  <MdArrowOutward aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="wrap sub-block" id="skills">
        <div className="sub-block-head" data-reveal>
          <h2>
            Full <span className="serif-accent">skillset</span>
          </h2>
          <p className="sub-lead">
            Everything I&apos;ve worked with across production, projects and
            coursework.
          </p>
        </div>
        <div className="skill-groups">
          {skillGroups.map((group) => (
            <div className="skill-group" key={group.title} data-reveal>
              <h3>{group.title}</h3>
              <ul className="chip-row">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap sub-block sub-split">
        <div data-reveal>
          <h2>
            <span className="serif-accent">Certifications</span>
          </h2>
          <ul className="list-lines">
            {certifications.map((c) => (
              <li key={c.title}>
                <span>{c.title}</span>
                <span className="list-meta">{c.issuer}</span>
              </li>
            ))}
          </ul>
        </div>
        <div data-reveal>
          <h2>
            Open <span className="serif-accent">source</span>
          </h2>
          <ul className="list-lines">
            {openSource.map((repo) => (
              <li key={repo.url}>
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="hide"
                >
                  {repo.name} <MdArrowOutward aria-hidden="true" />
                </a>
                <span className="list-meta">{repo.description}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </SubpageLayout>
  );
};

export default ProjectsPage;
