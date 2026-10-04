// Single place to edit personal details used across the site.
export const siteConfig = {
  firstName: "Haydar",
  lastName: "Boudhrioua",
  get name() {
    return `${this.firstName} ${this.lastName}`;
  },
  /** Text shown top-left. Leave empty to use your full name. */
  logo: "",
  get brand() {
    return this.logo || this.name;
  },
  /** Public address of the site (no trailing slash) — used for the sitemap. */
  url: "https://boudhriwa-haider.vercel.app",
  /** Used in the browser tab and search results. */
  headline: "Software Architect & AI Engineer",
  /** Hero: "<roleIntro>" above a role that flips through `roleWords`. */
  roleIntro: "Software & AI",
  roleWords: ["Architect", "Engineer"],
  /** Small line under the hero role. */
  roleFocus: ["Data", "MLOps", "Cloud", "Security"],
  /** Words scrolling on the loading screen. */
  loadingWords: [
    "Software Architect",
    "AI Engineer",
    "Data Engineer",
    "MLOps",
    "Cloud & Security",
  ],
  /** Path to your photo in /public (e.g. "/images/me.webp"). Leave empty to show your initials. */
  portrait: "/images/portrait.webp",
  /** Shows the "Available for work" badge under the portrait. */
  available: true,
  email: "boudhriwa.haydar@gmail.com",
  phone: "+216 55 137 773",
  phoneHref: "tel:+21655137773",
  location: "Tunis, Tunisia",
  /** Link to a PDF in /public (e.g. "/cv.pdf"). Leave empty to hide the button. */
  resumeUrl: "",
  year: new Date().getFullYear(),
  socials: {
    github: "https://github.com/haider0708",
    linkedin: "https://www.linkedin.com/in/haydar-boudhrioua",
  },
  languages: [
    { name: "Arabic", level: "Native" },
    { name: "French", level: "B2 · Professional" },
    { name: "English", level: "B2 · Professional" },
  ],
  mobility: ["Tunisia", "Remote / International"],
  contracts: ["CDI", "SIVP", "Freelance"],
};
