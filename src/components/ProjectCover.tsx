import type { Project } from "../data/projects";
import StatusPill from "./StatusPill";
import "./styles/ProjectCover.css";

/**
 * A designed cover built from the project's headline figure. If a screenshot
 * is provided in the project data, it is shown instead.
 */
const ProjectCover = ({
  project,
  size = "md",
}: {
  project: Project;
  size?: "md" | "lg";
}) => {
  if (project.image) {
    return (
      <div className={`cover cover-${size} cover-image`}>
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  }
  const gold = project.featured || project.status === "Live";

  return (
    <div
      className={`cover cover-${size} ${gold ? "cover-gold" : "cover-silver"}`}
      aria-hidden="true"
    >
      <div className="cover-top">
        <StatusPill status={project.status} />
        <span className="cover-cat">{project.categories[0]}</span>
      </div>
      {project.cover && (
        <div className="cover-figure">
          <span className="cover-value">{project.cover.value}</span>
          <span className="cover-label">{project.cover.label}</span>
        </div>
      )}
      <div className="cover-title">{project.title}</div>
    </div>
  );
};

export default ProjectCover;
