import { useEffect } from "react";
import { absoluteUrl, type PageMeta } from "./meta";

const ROBOTS_INDEX = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

/** Finds (or creates) a head element and sets one attribute on it. */
const setHead = (selector: string, create: () => HTMLElement, attr: string, value: string) => {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
};

const named = (name: string, content: string) =>
  setHead(
    `meta[name="${name}"]`,
    () => Object.assign(document.createElement("meta"), { name }),
    "content",
    content,
  );

const property = (prop: string, content: string) =>
  setHead(
    `meta[property="${prop}"]`,
    () => {
      const el = document.createElement("meta");
      el.setAttribute("property", prop);
      return el;
    },
    "content",
    content,
  );

/**
 * Keeps the document head in step with client-side navigation. Each route's
 * static HTML already carries the same tags (built from the same PageMeta),
 * so this only matters once the visitor moves around inside the app.
 */
export const useSeo = (page: PageMeta) => {
  const { path, title, description, noindex } = page;

  useEffect(() => {
    const url = absoluteUrl(path);
    document.title = title;
    named("description", description);
    named("robots", noindex ? "noindex, follow" : ROBOTS_INDEX);
    named("twitter:title", title);
    named("twitter:description", description);
    property("og:title", title);
    property("og:description", description);
    property("og:url", url);
    const canonical = document.head.querySelector('link[rel="canonical"]');
    if (noindex) canonical?.remove();
    else
      setHead(
        'link[rel="canonical"]',
        () => Object.assign(document.createElement("link"), { rel: "canonical" }),
        "href",
        url,
      );
  }, [path, title, description, noindex]);
};
