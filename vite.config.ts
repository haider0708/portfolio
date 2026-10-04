import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { projects } from "./src/data/projects";
import { siteConfig } from "./src/data/siteConfig";

/** Emits sitemap.xml at build time, so new projects are listed automatically. */
const sitemap = (): Plugin => ({
  name: "sitemap",
  apply: "build",
  generateBundle() {
    const paths = ["/", "/projects", ...projects.map((p) => `/projects/${p.slug}`)];
    const urls = paths
      .map((path) => `  <url><loc>${siteConfig.url}${path}</loc></url>`)
      .join("\n");
    this.emitFile({
      type: "asset",
      fileName: "sitemap.xml",
      source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), sitemap()],
});
