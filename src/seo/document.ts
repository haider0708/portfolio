/**
 * Build-time SEO: per-page <head> tags, JSON-LD structured data, a no-JS
 * fallback of each page's content, the sitemap and llms.txt. Used only by
 * the Vite build (vite.config.ts) — never shipped to the browser.
 */
import { about, career, values, whatIDo } from "../data/content";
import { certifications, skillGroups } from "../data/profile";
import { projects, type Project } from "../data/projects";
import { siteConfig } from "../data/siteConfig";
import {
  absoluteUrl,
  homeMeta,
  KEYWORDS,
  NAME_VARIANTS,
  OG_IMAGE,
  OG_IMAGE_ALT,
  projectMeta,
  projectsMeta,
  type PageMeta,
} from "./meta";

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const abs = (path: string) => (path.startsWith("http") ? path : absoluteUrl(path));
const unique = <T,>(items: T[]) => [...new Set(items)];

const SITE = siteConfig.url;
const PERSON_ID = `${SITE}/#person`;
const WEBSITE_ID = `${SITE}/#website`;
const today = new Date().toISOString().slice(0, 10);

/* ───────────────────────────── Structured data ───────────────────────────── */

const KNOWS_ABOUT_GROUPS = [
  "Programming",
  "Backend",
  "Data Engineering",
  "AI / ML",
  "Generative AI",
  "DevOps / MLOps",
  "AWS",
  "Azure",
  "Security",
];

const knowsAbout = unique([
  "Software Architecture",
  "System Design",
  "Distributed Systems",
  "Artificial Intelligence",
  "Machine Learning",
  "Deep Learning",
  "Data Engineering",
  "Data Science",
  "MLOps",
  "Cloud Computing",
  "Cybersecurity",
  ...whatIDo.flatMap((w) => w.tags),
  ...skillGroups
    .filter((g) => KNOWS_ABOUT_GROUPS.includes(g.title))
    .flatMap((g) => g.items),
]);

const [current] = career;
const currentEmployer = current.company.split("·")[0].trim();

const person = () => ({
  "@type": "Person",
  "@id": PERSON_ID,
  name: siteConfig.name,
  givenName: siteConfig.firstName,
  familyName: siteConfig.lastName,
  alternateName: NAME_VARIANTS,
  jobTitle: siteConfig.headline,
  description: about,
  url: `${SITE}/`,
  image: {
    "@type": "ImageObject",
    url: abs(siteConfig.portrait),
    width: 1122,
    height: 1402,
    caption: siteConfig.name,
  },
  email: `mailto:${siteConfig.email}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Tunis",
    addressCountry: "TN",
  },
  nationality: { "@type": "Country", name: "Tunisia" },
  homeLocation: { "@type": "Place", name: siteConfig.location },
  worksFor: { "@type": "Organization", name: currentEmployer },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "ESPRIT — École Supérieure Privée d'Ingénierie et de Technologies",
    alternateName: "ESPRIT",
    url: "https://esprit.tn",
  },
  hasCredential: [
    {
      "@type": "EducationalOccupationalCredential",
      name: "Diplôme d'Ingénieur en Informatique — Data Science & AI",
      credentialCategory: "degree",
      educationalLevel: "Master's level engineering degree",
      recognizedBy: { "@type": "CollegeOrUniversity", name: "ESPRIT" },
    },
    ...certifications.map((c) => ({
      "@type": "EducationalOccupationalCredential",
      name: c.title,
      credentialCategory: "certificate",
      ...(c.issuer && { recognizedBy: { "@type": "Organization", name: c.issuer } }),
    })),
  ],
  hasOccupation: ["Software Architect", "AI Engineer", "Data Engineer", "MLOps Engineer"].map(
    (name) => ({
      "@type": "Occupation",
      name,
      occupationLocation: { "@type": "Country", name: "Tunisia" },
      skills: whatIDo.flatMap((w) => w.tags).join(", "),
    }),
  ),
  knowsAbout,
  knowsLanguage: siteConfig.languages.map((l) => ({
    "@type": "Language",
    name: l.name,
  })),
  sameAs: Object.values(siteConfig.socials),
});

const website = () => ({
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: `${SITE}/`,
  name: siteConfig.name,
  alternateName: [`${siteConfig.name} Portfolio`, ...NAME_VARIANTS],
  description: homeMeta().description,
  inLanguage: "en",
  author: { "@id": PERSON_ID },
  publisher: { "@id": PERSON_ID },
});

const breadcrumbs = (trail: { name: string; path: string }[]) => ({
  "@type": "BreadcrumbList",
  itemListElement: trail.map((t, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: t.name,
    item: abs(t.path),
  })),
});

const graph = (...nodes: object[]) => ({ "@context": "https://schema.org", "@graph": nodes });

export const homeSchema = () =>
  graph(
    {
      "@type": "ProfilePage",
      "@id": `${SITE}/#profile`,
      url: `${SITE}/`,
      name: homeMeta().title,
      description: homeMeta().description,
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": PERSON_ID },
      mainEntity: { "@id": PERSON_ID },
      primaryImageOfPage: abs(siteConfig.portrait),
      dateModified: today,
      inLanguage: "en",
    },
    person(),
    website(),
  );

export const projectsSchema = () =>
  graph(
    {
      "@type": "CollectionPage",
      "@id": `${SITE}/projects#page`,
      url: abs("/projects"),
      name: projectsMeta().title,
      description: projectsMeta().description,
      isPartOf: { "@id": WEBSITE_ID },
      author: { "@id": PERSON_ID },
      inLanguage: "en",
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: projects.length,
        itemListElement: projects.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: abs(`/projects/${p.slug}`),
          name: p.title,
        })),
      },
    },
    breadcrumbs([
      { name: "Home", path: "/" },
      { name: "Projects", path: "/projects" },
    ]),
    person(),
    website(),
  );

export const projectSchema = (p: Project) => {
  const meta = projectMeta(p);
  const repo = p.links?.find((l) => l.url.includes("github.com"));
  return graph(
    {
      "@type": repo ? "SoftwareSourceCode" : "CreativeWork",
      "@id": `${abs(meta.path)}#work`,
      url: abs(meta.path),
      name: p.title,
      headline: `${p.title} — ${p.tagline}`,
      description: p.summary,
      abstract: p.tagline,
      author: { "@id": PERSON_ID },
      creator: { "@id": PERSON_ID },
      ...(p.context && { sourceOrganization: { "@type": "Organization", name: p.context } }),
      ...(repo && { codeRepository: repo.url }),
      ...(p.period && { temporalCoverage: p.period }),
      genre: p.categories.join(", "),
      keywords: unique([...p.categories, ...p.stack]).join(", "),
      about: p.categories.map((c) => ({ "@type": "Thing", name: c })),
      image: abs(p.image ?? OG_IMAGE),
      inLanguage: "en",
      isPartOf: { "@id": `${SITE}/projects#page` },
    },
    breadcrumbs([
      { name: "Home", path: "/" },
      { name: "Projects", path: "/projects" },
      { name: p.title, path: meta.path },
    ]),
    { "@type": "Person", "@id": PERSON_ID, name: siteConfig.name, url: `${SITE}/` },
  );
};

/* ───────────────────────────── <head> ───────────────────────────── */

const ROBOTS_INDEX = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

export const headTags = (
  meta: PageMeta,
  schema?: object,
  extra: { keywords?: string[]; preloadPortrait?: boolean } = {},
) => {
  const image = abs(meta.image ?? OG_IMAGE);
  const imageAlt = meta.imageAlt ?? OG_IMAGE_ALT;
  const ogType = meta.type === "article" ? "article" : meta.type === "profile" ? "profile" : "website";
  const lines = [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
    extra.keywords && `<meta name="keywords" content="${esc(extra.keywords.join(", "))}" />`,
    `<meta name="robots" content="${meta.noindex ? "noindex, follow" : ROBOTS_INDEX}" />`,
    !meta.noindex && `<link rel="canonical" href="${abs(meta.path)}" />`,
    `<meta property="og:type" content="${ogType}" />`,
    `<meta property="og:url" content="${abs(meta.path)}" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:secure_url" content="${image}" />`,
    !meta.image && `<meta property="og:image:type" content="image/jpeg" />`,
    !meta.image && `<meta property="og:image:width" content="1200" />`,
    !meta.image && `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(imageAlt)}" />`,
    ogType === "profile" && `<meta property="profile:first_name" content="${siteConfig.firstName}" />`,
    ogType === "profile" && `<meta property="profile:last_name" content="${siteConfig.lastName}" />`,
    ogType === "article" && `<meta property="article:author" content="${SITE}/" />`,
    `<meta name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta name="twitter:description" content="${esc(meta.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<meta name="twitter:image:alt" content="${esc(imageAlt)}" />`,
    extra.preloadPortrait &&
      `<link rel="preload" as="image" href="${siteConfig.portrait}" type="image/webp" fetchpriority="high" />`,
    schema &&
      `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>`,
  ];
  return lines.filter(Boolean).join("\n    ");
};

/** Search terms for a project page: its own stack and fields plus the name. */
export const projectKeywords = (p: Project) =>
  unique([p.title, ...p.categories, ...p.stack, siteConfig.name, "Case Study"]);

export const homeKeywords = KEYWORDS;
export const projectsKeywords = unique([
  "Software Projects",
  "AI Projects",
  "Machine Learning Projects",
  "Data Engineering Projects",
  "Case Studies",
  ...KEYWORDS,
]);

/* ─────────────────── No-JavaScript fallback (crawlers & AI bots) ─────────────────── */

const link = (path: string, text: string) => `<a href="${path}">${esc(text)}</a>`;

const contactBlock = () => `
      <h2>Contact</h2>
      <ul>
        <li>Email: <a href="mailto:${siteConfig.email}">${siteConfig.email}</a></li>
        <li>GitHub: <a href="${siteConfig.socials.github}">${siteConfig.socials.github}</a></li>
        <li>LinkedIn: <a href="${siteConfig.socials.linkedin}">${siteConfig.socials.linkedin}</a></li>
        <li>Location: ${esc(siteConfig.location)} — ${esc(siteConfig.mobility.join(", "))}</li>
        <li>Open to: ${esc(siteConfig.contracts.join(", "))}</li>
      </ul>`;

const wrap = (inner: string) => `<noscript>
    <main class="seo-fallback">${inner}
      <p>${link("/", "Home")} · ${link("/projects", "All projects")}</p>
    </main>
    </noscript>`;

export const homeBody = () =>
  wrap(`
      <h1>${esc(siteConfig.name)} — ${esc(siteConfig.headline)}</h1>
      <p>${esc(about)}</p>
      <h2>What I do</h2>
      <ul>${values.map((v) => `<li><strong>${esc(v.title)}</strong> — ${esc(v.text)}</li>`).join("")}</ul>
      ${whatIDo.map((w) => `<h3>${esc(w.kicker)} — ${esc(w.title)}</h3><p>${esc(w.description)}</p>`).join("")}
      <h2>Career</h2>
      <ul>${career
        .map(
          (c) =>
            `<li><strong>${esc(c.role)}</strong>, ${esc(c.company)} (${esc(c.period)}) — ${esc(c.description)}</li>`,
        )
        .join("")}</ul>
      <h2>Selected work</h2>
      <ul>${projects
        .filter((p) => p.featured)
        .map((p) => `<li>${link(`/projects/${p.slug}`, p.title)} — ${esc(p.tagline)}</li>`)
        .join("")}</ul>
      ${contactBlock()}`);

export const projectsBody = () =>
  wrap(`
      <h1>Projects & case studies — ${esc(siteConfig.name)}</h1>
      <p>${esc(projectsMeta().description)}</p>
      <ul>${projects
        .map(
          (p) =>
            `<li>${link(`/projects/${p.slug}`, p.title)} — ${esc(p.tagline)} <em>(${esc(p.categories.join(", "))})</em></li>`,
        )
        .join("")}</ul>
      <h2>Skills</h2>
      ${skillGroups.map((g) => `<p><strong>${esc(g.title)}:</strong> ${esc(g.items.join(", "))}</p>`).join("")}`);

export const projectBody = (p: Project) =>
  wrap(`
      <h1>${esc(p.title)}</h1>
      <p><strong>${esc(p.tagline)}</strong></p>
      <p>${esc(p.summary)}</p>
      <p>${[p.role, p.context, p.period, p.status].filter(Boolean).map((s) => esc(s!)).join(" · ")}</p>
      ${(p.metrics ?? []).length ? `<ul>${p.metrics!.map((m) => `<li>${esc(m.value)} ${esc(m.label)}</li>`).join("")}</ul>` : ""}
      ${p.sections
        .map(
          (s) =>
            `<h2>${esc(s.title)}</h2>${s.text ? `<p>${esc(s.text)}</p>` : ""}${
              s.bullets ? `<ul>${s.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>` : ""
            }${s.steps ? `<ol>${s.steps.map((b) => `<li>${esc(b)}</li>`).join("")}</ol>` : ""}${
              s.cards
                ? `<ul>${s.cards.map((c) => `<li><strong>${esc(c.title)}</strong>${c.text ? ` — ${esc(c.text)}` : ""}</li>`).join("")}</ul>`
                : ""
            }`,
        )
        .join("")}
      <h2>Stack</h2>
      <p>${esc(p.stack.join(", "))}</p>
      <p>By ${link("/", siteConfig.name)}, ${esc(siteConfig.headline)}.</p>`);

export const notFoundBody = () =>
  wrap(`
      <h1>Page not found</h1>
      <p>This page doesn't exist. ${link("/projects", "Browse all projects")}.</p>`);

/* ───────────────────────────── Sitemap & llms.txt ───────────────────────────── */

export const sitemapXml = () => {
  const entry = (path: string, priority: string, changefreq: string, images: { loc: string; title: string }[] = []) =>
    `  <url>
    <loc>${abs(path)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${images
      .map(
        (img) => `
    <image:image>
      <image:loc>${abs(img.loc)}</image:loc>
      <image:title>${esc(img.title)}</image:title>
    </image:image>`,
      )
      .join("")}
  </url>`;

  const urls = [
    entry("/", "1.0", "weekly", [
      { loc: siteConfig.portrait, title: `${siteConfig.name} — ${siteConfig.headline}` },
      { loc: OG_IMAGE, title: OG_IMAGE_ALT },
    ]),
    entry("/projects", "0.9", "weekly"),
    ...projects.map((p) =>
      entry(
        `/projects/${p.slug}`,
        p.featured ? "0.8" : p.archive ? "0.5" : "0.7",
        "monthly",
        p.image ? [{ loc: p.image, title: p.title }] : [],
      ),
    ),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join("\n")}
</urlset>
`;
};

/** Plain-language summary for AI search engines (https://llmstxt.org). */
export const llmsTxt = () => `# ${siteConfig.name} — ${siteConfig.headline}

> ${about}

- Based in: ${siteConfig.location}
- Available for: ${siteConfig.mobility.join(" · ")}
- Contracts: ${siteConfig.contracts.join(", ")}
- Contact: ${siteConfig.email}

## Profile

- [Home](${SITE}/): portfolio, about, services, career and selected work
- [All projects](${SITE}/projects): every project and the full skillset
- [GitHub](${siteConfig.socials.github})
- [LinkedIn](${siteConfig.socials.linkedin})

## Career

${career.map((c) => `- ${c.role} — ${c.company} (${c.period}): ${c.description}`).join("\n")}

## Projects

${projects.map((p) => `- [${p.title}](${SITE}/projects/${p.slug}): ${p.tagline}`).join("\n")}

## Skills

${skillGroups.map((g) => `- ${g.title}: ${g.items.join(", ")}`).join("\n")}
`;
