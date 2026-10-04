import { projects } from "./projects";
import { skillGroups } from "./profile";

export const about =
  "I design, architect and build scalable systems — distributed backends and microservices, the data pipelines that feed them and the AI layer on top — then take them to production with the operations they need: CI/CD, MLOps for the models, cloud infrastructure and security.";

/** Three capability pillars shown under the About statement. */
export const values = [
  {
    title: "Architecture & backend",
    text: "Scalable, secure systems — microservices, APIs, event-driven messaging and well-modelled data stores, designed to grow.",
  },
  {
    title: "Data & AI",
    text: "Pipelines from raw data to insight, models trained and evaluated, and AI — ML, computer vision, LLMs — built into real products.",
  },
  {
    title: "Production & operations",
    text: "CI/CD and DevOps, MLOps where models run, cloud infrastructure, observability and security hardening.",
  },
];

const delivered = projects.filter((p) => p.status !== "In development").length;
const inProduction = projects.filter(
  (p) => p.status === "Live" || p.status === "Production",
).length;
const technologies = new Set(
  skillGroups
    .filter((g) => !["Soft skills", "Methodologies"].includes(g.title))
    .flatMap((g) => g.items),
).size;

/** Profile-wide figures under About — computed from the data, counted up on scroll. */
export const contributions: {
  value: number;
  suffix?: string;
  label: string;
}[] = [
  { value: delivered, label: "Projects delivered" },
  { value: inProduction, label: "Platforms in production" },
  { value: 4, label: "Industry roles" },
  {
    value: Math.floor(technologies / 50) * 50,
    suffix: "+",
    label: "Technologies & tools",
  },
];

export const whatIDo = [
  {
    kicker: "Software",
    title: "ARCHITECT",
    description:
      "I design and build distributed, production-grade systems — microservices behind API gateways, event-driven messaging, secure APIs and data stores — and ship them with CI/CD, observability and cloud infrastructure.",
    tags: [
      "System design",
      "Microservices",
      "Event-driven",
      "Java",
      "C# / .NET",
      "Go",
      "TypeScript",
      "Spring Boot",
      "NestJS",
      "FastAPI",
      "PostgreSQL",
      "RabbitMQ",
      "Kafka",
      "Kubernetes",
      "Jenkins",
      "Security",
    ],
  },
  {
    kicker: "AI & Data",
    title: "DATA → AI",
    description:
      "From raw data to decisions: I engineer the pipelines, analyse the data, train and evaluate the models, then deploy data-driven solutions with MLOps — from classic ML and computer vision to LLMs, RAG and agents.",
    flow: ["Engineer", "Analyse", "Train", "Deploy"],
    tags: [
      "Data Engineering",
      "ETL / ELT",
      "Spark",
      "Airflow",
      "Analytics",
      "Power BI",
      "PyTorch",
      "TensorFlow",
      "YOLOv8",
      "LLMs",
      "RAG",
      "AI Agents",
      "MLflow",
      "MLOps",
    ],
  },
];

export interface CareerEntry {
  role: string;
  company: string;
  period: string;
  /** Short label shown large on the timeline. */
  mark: string;
  description: string;
  /** Slugs of projects built in this role. */
  related?: string[];
}

export const career: CareerEntry[] = [
  {
    role: "AI / ML Engineer · Full-Stack",
    company: "Galylio AI · Tunis / Sousse",
    period: "Dec 2025 – Present",
    mark: "NOW",
    description:
      "Architecting and shipping the company's data and AI products: a 10+ microservice platform behind an API gateway, a scraping engine across 100+ shops, AI product matching over 300k products, an offline-first mobile platform, e-commerce rebuilds and a drone-based crop-health system.",
    related: [
      "1111-tundata",
      "product-matcher-v3",
      "1111-scraping-engine",
      "desak",
      "biobalance",
      "parahouse",
      "dronia",
    ],
  },
  {
    role: "Full-Stack · Marketplace Engineer",
    company: "Galylio AI / TDiscount · Freelance",
    period: "Sep – Nov 2025",
    mark: "2025",
    description:
      "Re-engineered a live multi-vendor marketplace: hardened infrastructure, KYC and onboarding workflows, a versioned commission engine, Aramex logistics and measurable Core Web Vitals gains.",
    related: ["tdiscount"],
  },
  {
    role: "AI / Machine Learning Engineer Intern",
    company: "PwC Tunisie",
    period: "Jul – Sep 2025",
    mark: "2025",
    description:
      "Deep reinforcement-learning agents (PPO, SAC, TD3) for Bitcoin trading with LSTM/CNN feature extractors, a Dockerised MLOps pipeline and a real-time Next.js dashboard.",
    related: ["bitcoin-drl"],
  },
  {
    role: "Data Science / ML Engineer Intern",
    company: "Beehive Enterprise (ex Digital Power Consulting)",
    period: "Jul – Aug 2024",
    mark: "2024",
    description:
      "Network threat detection on CICIDS2017: ML inference behind FastAPI, monitoring and alerting, and a near real-time security dashboard.",
    related: ["intrusion-detection"],
  },
  {
    role: "Ingénieur Informatique — Computer Engineering",
    company: "ESPRIT · Data Science & AI specialisation",
    period: "2021 – 2026",
    mark: "2021",
    description:
      "Diplôme d'Ingénieur en Informatique (Master level), specialising in Data Science & AI. Final-year project: industrialising an AI solution — containerisation, deployment, monitoring and AI platform engineering.",
  },
];
