import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { projects } from "./src/data/projects";
import { homeMeta, notFoundMeta, projectMeta, projectsMeta } from "./src/seo/meta";
import {
  headTags,
  homeBody,
  homeKeywords,
  homeSchema,
  llmsTxt,
  notFoundBody,
  projectBody,
  projectKeywords,
  projectSchema,
  projectsBody,
  projectsKeywords,
  projectsSchema,
  sitemapXml,
} from "./src/seo/document";

const HEAD = /<!--seo:head-->[\s\S]*?<!--\/seo:head-->/;
const BODY = /<!--seo:body-->[\s\S]*?<!--\/seo:body-->/;
const head = (tags: string) => `<!--seo:head-->\n    ${tags}\n    <!--/seo:head-->`;
const body = (html: string) => `<!--seo:body-->\n    ${html}\n    <!--/seo:body-->`;

/**
 * SEO for a single-page app: every route is written out as its own HTML
 * file with its own title, description, canonical URL, social tags, JSON-LD
 * and a no-JS copy of its content — so crawlers and link previews see the
 * real page without running JavaScript. Also emits sitemap.xml and llms.txt.
 */
const seo = (): Plugin => ({
  name: "seo-pages",
  transformIndexHtml: (html) =>
    html
      .replace(
        "<!--seo-head-->",
        head(headTags(homeMeta(), homeSchema(), { keywords: homeKeywords, preloadPortrait: true })),
      )
      .replace("<!--seo-body-->", body(homeBody())),
  generateBundle() {
    this.emitFile({ type: "asset", fileName: "sitemap.xml", source: sitemapXml() });
    this.emitFile({ type: "asset", fileName: "llms.txt", source: llmsTxt() });
  },
  writeBundle({ dir = "dist" }) {
    const template = readFileSync(join(dir, "index.html"), "utf8");
    const page = (file: string, tags: string, html: string) => {
      const out = join(dir, file);
      mkdirSync(dirname(out), { recursive: true });
      writeFileSync(out, template.replace(HEAD, head(tags)).replace(BODY, body(html)));
    };

    page(
      "projects.html",
      headTags(projectsMeta(), projectsSchema(), { keywords: projectsKeywords }),
      projectsBody(),
    );
    for (const p of projects) {
      page(
        `projects/${p.slug}.html`,
        headTags(projectMeta(p), projectSchema(p), { keywords: projectKeywords(p) }),
        projectBody(p),
      );
    }
    page("404.html", headTags(notFoundMeta()), notFoundBody());
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), seo()],
});
