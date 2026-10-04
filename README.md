# Haydar Boudhrioua — Portfolio

Personal portfolio of **Haydar Boudhrioua**, Software Architect & AI Engineer.
A React + TypeScript single-page app with GSAP scroll choreography, a project
case-study section and a fully data-driven content layer.

## Stack

- **React 18 + TypeScript**, built with **Vite**
- **GSAP 3** — ScrollTrigger, ScrollSmoother, SplitText (all free since 3.13)
- **React Router** — `/`, `/projects`, `/projects/:slug`
- **react-icons** for brand and UI icons

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build into dist/
npm run preview   # serve the production build locally
npm run lint
```

## Editing content

All content lives in `src/data/` — no component changes needed.

| File            | What it controls                                                    |
| --------------- | ------------------------------------------------------------------- |
| `siteConfig.ts` | Name, hero roles, photo, contact details, languages, availability   |
| `content.ts`    | About statement, value pillars, "What I do" cards, career timeline  |
| `projects.ts`   | Every project and its case-study page (`featured`, `archive` flags) |
| `stack.ts`      | Stack tiles (gold = core strength) and expertise list               |
| `profile.ts`    | Full skillset, certifications, open-source links                    |

- **Photo:** put it in `public/images/` and set `portrait` in `siteConfig.ts`.
- **CV:** put a PDF in `public/` and set `resumeUrl` — the Resume button appears.
- **Project screenshot:** set `image` on a project — it replaces the generated cover.

## Project structure

```
src/
  components/        page sections (Hero, About, Services, Experience,
                     Work, TechStack, Contact) and shared UI
    utils/           scroll animations, hero intro, split-text reveals
    styles/          one stylesheet per component
  pages/             Projects index, project case study, 404
  data/              all site content (see above)
  lib/gsap.ts        single GSAP registration point + shared helpers
  hooks/             useMediaQuery, useReveal
```

### Animation principles

- **Motion** (positions, pins, the career line) is _scrubbed_ to the scroll.
- **Content reveals** play **once** when reached and never hide again
  (`revealAt` in `src/lib/gsap.ts`), so text can't be left invisible by fast
  scrolling, jumps or reloads.
- ScrollTriggers are re-sorted into DOM order on every refresh so pinned
  sections never offset the ones below them.
- Everything is cleaned up on unmount; `prefers-reduced-motion` is respected.

## Deployment

Any static host works. SPA fallbacks are included for **Vercel**
(`vercel.json`) and **Netlify** (`public/_redirects`) so deep links such as
`/projects/1111-tundata` resolve.

## License

© Haydar Boudhrioua — all rights reserved. See [`LICENSE`](LICENSE).
