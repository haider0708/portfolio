import type { Project } from "../data/projects";
import { siteConfig } from "../data/siteConfig";

/** Head metadata for one route. Shared by the build (static HTML per page)
 *  and the app (kept in sync on client-side navigation). */
export interface PageMeta {
  /** Path from the site root, e.g. "/projects/biobalance". */
  path: string;
  title: string;
  description: string;
  /** Absolute or root-relative image for social previews. */
  image?: string;
  imageAlt?: string;
  /** Exclude from search results (404). */
  noindex?: boolean;
  type?: "website" | "profile" | "article";
}

export const OG_IMAGE = "/og-image.jpg";
export const OG_IMAGE_ALT = `${siteConfig.name} — ${siteConfig.headline}`;

/** Spellings people search for — also declared as alternateName in JSON-LD. */
export const NAME_VARIANTS = [
  "Haider Boudhrioua",
  "Haydar Boudhriwa",
  "Haider Boudhriwa",
  "Boudhrioua Haydar",
  "Boudhriwa Haider",
];

/** Search terms the site should be found for (meta keywords + JSON-LD). */
export const KEYWORDS = [
  siteConfig.name,
  ...NAME_VARIANTS,
  "Software Architect",
  "AI Engineer",
  "Software Architect Tunisia",
  "AI Engineer Tunisia",
  "Software Engineer Tunis",
  "Machine Learning Engineer",
  "ML Engineer Tunisia",
  "Data Engineer",
  "Data Scientist",
  "MLOps Engineer",
  "Full-Stack Developer",
  "Backend Engineer",
  "Cloud Engineer",
  "DevOps Engineer",
  "LLM Engineer",
  "Generative AI",
  "RAG",
  "AI Agents",
  "Computer Vision",
  "Microservices",
  "Distributed Systems",
  "System Design",
  "Data Pipelines",
  "Python",
  "Java",
  "Spring Boot",
  "C# .NET",
  "TypeScript",
  "React",
  "FastAPI",
  "Kubernetes",
  "Docker",
  "AWS",
  "Azure",
  "Cybersecurity",
  "Freelance Software Engineer",
  "Hire AI Engineer",
  "ESPRIT Engineer",
  "Portfolio",
];

const url = (path: string) => `${siteConfig.url}${path === "/" ? "/" : path}`;
export const absoluteUrl = url;

const clip = (text: string, max = 158) =>
  text.length <= max ? text : `${text.slice(0, max - 1).replace(/[\s,.;:—-]+\S*$/, "")}…`;

export const homeMeta = (): PageMeta => ({
  path: "/",
  title: `${siteConfig.name} — Software Architect & AI Engineer, Tunisia`,
  description:
    "Software Architect & AI Engineer in Tunis, Tunisia — microservices, data engineering, machine learning, LLMs & RAG, MLOps, cloud and security. Open to work.",
  type: "profile",
});

export const projectsMeta = (): PageMeta => ({
  path: "/projects",
  title: `Projects & Case Studies — ${siteConfig.name} | AI, Data & Software`,
  description:
    "Projects by Haydar Boudhrioua: AI & ML systems, LLM and RAG platforms, data pipelines, scraping engines, microservices, web & mobile apps, cloud and security.",
});

/** The most descriptive title that still fits in a search result (~65 chars). */
const projectTitle = ({ title, categories: [field] }: Project) =>
  [
    `${title} — ${field} Case Study | ${siteConfig.name}`,
    `${title} — ${field} | ${siteConfig.name}`,
    `${title} | ${siteConfig.name}`,
  ].find((t) => t.length <= 65) ?? title;

export const projectMeta = (project: Project): PageMeta => ({
  path: `/projects/${project.slug}`,
  title: projectTitle(project),
  description: clip(`${project.tagline}. ${project.summary}`),
  type: "article",
});

export const notFoundMeta = (): PageMeta => ({
  path: "/404",
  title: `Page not found — ${siteConfig.name}`,
  description: "This page doesn't exist. Browse Haydar Boudhrioua's projects instead.",
  noindex: true,
});
