export type Category =
  | "AI & ML"
  | "Data & Scraping"
  | "Web & Mobile"
  | "Cloud & Data Platforms"
  | "QA & Security"
  | "Software Engineering";

export const categories: Category[] = [
  "AI & ML",
  "Data & Scraping",
  "Web & Mobile",
  "Cloud & Data Platforms",
  "QA & Security",
  "Software Engineering",
];

export type Status =
  | "Live"
  | "Production"
  | "Production-oriented"
  | "In development"
  | "Internship"
  | "Academic"
  | "Built";

export interface Metric {
  value: string;
  label: string;
}

export interface Section {
  title: string;
  text?: string;
  bullets?: string[];
  /** Rendered as a left-to-right flow (pipelines, architectures). */
  steps?: string[];
  /** Rendered as a grid of small cards (roles, layers, stages). */
  cards?: { title: string; text?: string; bullets?: string[] }[];
}

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  status: Status;
  categories: Category[];
  period?: string;
  /** Company, client or school the work was done for. */
  context?: string;
  role?: string;
  /** Shown on the home page Work section, in this order. */
  featured?: boolean;
  /** Smaller labs and exercises — listed compactly in the archive. */
  archive?: boolean;
  /** The headline figure printed on the generated cover. */
  cover?: Metric;
  /** Optional screenshot in /public — replaces the generated cover. */
  image?: string;
  metrics?: Metric[];
  sections: Section[];
  stack: string[];
  links?: { label: string; url: string }[];
}

export const projects: Project[] = [
  /* ───────────────────────────── Featured ───────────────────────────── */
  {
    slug: "1111-tundata",
    title: "1111 · TunData",
    tagline: "Product intelligence & price comparison platform for Tunisia",
    summary:
      "A live platform that collects product data from hundreds of Tunisian shops, normalises it, matches identical products across retailers and turns the result into consumer price comparison and B2B market intelligence.",
    status: "Live",
    categories: ["Web & Mobile", "Data & Scraping", "AI & ML"],
    context: "Galylio AI",
    role: "Architect & lead engineer — designed the application architecture",
    featured: true,
    cover: { value: "4M+", label: "Daily price points" },
    metrics: [
      { value: "10+", label: "Microservices behind an API gateway" },
      { value: "~300k", label: "Product & data records" },
      { value: "4M+", label: "Daily price points" },
      { value: "100+", label: "Shops collected" },
    ],
    sections: [
      {
        title: "Objective",
        text: "Build a Tunisian product intelligence platform able to collect product information from many shops, normalise it, match identical products across retailers and put the resulting dataset to work for both consumers and businesses.",
      },
      {
        title: "Products",
        cards: [
          {
            title: "B2C",
            bullets: [
              "Product search, filters and product pages",
              "Multi-shop price comparison",
              "Favorites, price alerts and price history",
              "Parapharmacy and supermarket verticals",
              "SEO with structured JSON-LD",
            ],
          },
          {
            title: "B2B",
            bullets: [
              "Market monitoring",
              "Competitor intelligence and benchmarking",
              "Rankings and market indexes",
              "Promotion monitoring",
            ],
          },
        ],
      },
      {
        title: "Architecture",
        text: "10+ services behind an API gateway. The backend started in Go and was later consolidated on TypeScript / Node.js / Express; the frontend is Next.js, React and TypeScript.",
        bullets: [
          "API gateway, authentication and user services",
          "Product catalogue, parapharmacy, retail and food services",
          "Benchmark service for B2B analytics",
          "Mailing service and scraper-related operational services",
        ],
      },
      {
        title: "Asynchronous messaging",
        text: "RabbitMQ decouples slow or failure-prone work from user requests. The mailing service consumes a queue, so email sending never blocks the main request and temporary email failures never break the business flow.",
        steps: [
          "User request",
          "API service",
          "RabbitMQ queue",
          "Mailing service",
          "Email provider",
        ],
      },
      {
        title: "Data layer",
        text: "A large relational PostgreSQL architecture handles continuously changing product data, scraper outputs, historical prices, catalogue and operational data, and search-related data.",
      },
      {
        title: "Data pipeline",
        text: "Powered by a dedicated scraping engine and a cross-shop entity-resolution engine — each documented as its own case study.",
        steps: [
          "1111 Scraping Engine",
          "Normalisation",
          "Product Matcher v3",
          "PostgreSQL",
          "1111.tn",
        ],
      },
      {
        title: "SEO",
        text: "Full technical SEO: server-rendered pages, structured JSON-LD for products and offers, clean metadata and crawlable product and comparison pages.",
      },
    ],
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Node.js",
      "Express.js",
      "Go",
      "PostgreSQL",
      "RabbitMQ",
      "Redis",
      "Docker",
      "Nginx",
      "JWT",
      "Argon2id",
      "Prometheus",
      "Grafana",
      "GitHub Actions",
    ],
    links: [
      { label: "1111.tn", url: "https://1111.tn" },
      { label: "API · backend.1111.tn", url: "https://backend.1111.tn" },
    ],
  },
  {
    slug: "product-matcher-v3",
    title: "Product Matcher v3",
    tagline: "Cross-shop product entity resolution at scale",
    summary:
      "An entity-resolution engine that decides which listings across 102 shops are the same physical product — combining embeddings, hybrid retrieval, a cross-encoder, LightGBM and capped LLM arbitration, finished by clustering and human review.",
    status: "Production-oriented",
    categories: ["AI & ML", "Data & Scraping"],
    context: "Galylio AI · 1111",
    featured: true,
    cover: { value: "300k", label: "Products resolved" },
    metrics: [
      { value: "~300k", label: "Products" },
      { value: "102", label: "Source shops" },
      { value: "~40 min", label: "GPU embedding generation" },
      { value: "≈ $20", label: "LLM budget cap per run" },
    ],
    sections: [
      {
        title: "The problem",
        text: "Shops describe the same product differently — “iPhone 15 128GB Black”, “Apple iPhone15 128 Go Noir” and “iPhone 15 (128GB) — Black” are one product. Scraping alone can't tell that Shop A's X, Shop B's Y and Shop C's Z are the same real-world item. The matcher solves this entity-resolution problem, which is what makes price comparison possible.",
      },
      {
        title: "Phase 1 — Ingestion & normalisation",
        text: "Deterministic, no AI required.",
        bullets: [
          "Ingests legacy data and DESAK output",
          "Duplicate removal and brand normalisation",
          "Invalid / junk product detection",
          "Questionable records preserved for human review",
        ],
      },
      {
        title: "Phase 2 — Candidate retrieval",
        text: "Comparing every product with every other one at ~300k products is impractical, so candidates are retrieved first. Products are embedded with BAAI/bge-m3, then searched two complementary ways and constrained by blocking.",
        cards: [
          {
            title: "FAISS",
            text: "Semantic similarity over bge-m3 embeddings.",
          },
          {
            title: "BM25",
            text: "Lexical similarity for model numbers and exact terms.",
          },
          {
            title: "Blocking",
            text: "Brand, category and attribute constraints shrink the search space.",
          },
        ],
      },
      {
        title: "Matching cascade",
        text: "Every pair is not sent to an LLM. Each stage only forwards the cases it can't settle — optimising cost, latency, scalability and accuracy.",
        steps: [
          "Rules",
          "Cross-encoder · bge-reranker-v2-m3",
          "LightGBM on human decisions",
          "LLM adjudication (capped)",
        ],
      },
      {
        title: "Clustering & recall",
        text: "Pairwise matches aren't enough: if A = B and B = C, then A, B and C are one product.",
        bullets: [
          "Union-find clustering of matched pairs",
          "Recall audit — a second pass hunts for matches missed the first time",
          "Low-confidence, conflicting-spec or suspicious clusters are flagged",
        ],
      },
      {
        title: "Human in the loop",
        text: "A review interface lets a human confirm or reject matches. Every decision becomes training data for LightGBM and ground truth for evaluating the system; final clusters are exported to the production database behind 1111.tn.",
      },
      {
        title: "Reliability",
        bullets: [
          "Structured logs",
          "Progress and budget tracking",
          "Checkpoints and resumable processing",
        ],
      },
    ],
    stack: [
      "Python",
      "BAAI/bge-m3",
      "FAISS",
      "BM25",
      "bge-reranker-v2-m3",
      "LightGBM",
      "LLM APIs",
      "PostgreSQL",
      "CUDA",
    ],
  },
  {
    slug: "biobalance",
    title: "BioBalance",
    tagline: "Offline-first parapharmacy network management — Android & iOS",
    summary:
      "A French-language Flutter app with a NestJS / PostgreSQL backend that runs a skincare and parapharmacy network end to end: stock, orders, deliveries, sales, returns, loyalty, quality, pricing, wholesalers, stores and staff.",
    status: "Production",
    categories: ["Web & Mobile"],
    role: "Full-stack & mobile engineer",
    featured: true,
    cover: { value: "520+", label: "Automated checks passing" },
    metrics: [
      { value: "113", label: "API integration tests" },
      { value: "71", label: "Contract checks" },
      { value: "336", label: "Flutter tests" },
      { value: "4", label: "Business roles" },
    ],
    sections: [
      {
        title: "Four business roles",
        cards: [
          {
            title: "Admin",
            bullets: [
              "Catalogue and prices",
              "Assigns orders, validates receptions",
              "Loyalty points, rewards and quality reports",
              "Invites accounts, oversees the network",
            ],
          },
          {
            title: "Responsable",
            bullets: [
              "Manages a group of stores",
              "Prices, thresholds and employees",
              "Orders, deliveries and returns",
              "Guided setup",
            ],
          },
          {
            title: "Vendeur",
            bullets: [
              "Barcode scanning and product search",
              "Records sales and earns loyalty points",
              "Cannot modify prices",
            ],
          },
          {
            title: "Grossiste",
            bullets: [
              "Manages one depot's stock",
              "Prepares and ships orders with QR tickets",
              "Sets store purchase prices",
              "No direct consumer sales",
            ],
          },
        ],
      },
      {
        title: "Pricing hierarchy",
        text: "Each level has its own price, and history is preserved — past sales and orders keep their original prices.",
        steps: [
          "BioBalance → wholesaler",
          "Wholesaler → store",
          "BioBalance → direct store",
          "Store → consumer",
        ],
      },
      {
        title: "Order lifecycle",
        steps: [
          "Store creates order",
          "Fulfilled or assigned to wholesaler",
          "Supplier pricing applied",
          "Prepared & shipped",
          "Lots & expiry recorded",
          "Store receives",
        ],
      },
      {
        title: "QR reception & stock integrity",
        text: "The shipping QR ticket proves quantities, lots and expiry dates; the receiver scans it and can still report damaged or refused units. Without a QR, BioBalance validates the reception before any stock moves. Opening stock is declared once — afterwards stock only changes through deliveries, sales, returns and quality decisions. There is no arbitrary manual adjustment.",
      },
      {
        title: "Returns, loyalty & quality",
        bullets: [
          "Returns classified as sellable or damaged",
          "Points per unit and rewards defined centrally; sellers claim rewards",
          "Managers report damaged products and expired lots — BioBalance makes the final call",
        ],
      },
      {
        title: "Engineering",
        cards: [
          {
            title: "Offline-first",
            text: "Sales and receipts are stored on the device and synchronised when connectivity returns — the app keeps working when disconnected.",
          },
          {
            title: "Security",
            text: "Database-level isolation per store, immutable history, 48-hour sessions, a second authentication step for admins, and critical pricing rules enforced server-side so a modified client can't bypass them.",
          },
          {
            title: "Reliability",
            text: "Retry-safe operations, daily server backups, backup before any database reset, managed migrations, API integration, contract and Flutter test suites.",
          },
        ],
      },
      {
        title: "Current stage",
        text: "Backend deployed at api.galylio.com and healthy, migrations applied, mobile app v1.5.0 with the admin app running on device. A seeded environment exercises the real flows: 5 accounts, a 51-product catalogue, the PARAHOUSE group with PARAHOUSE and PHARMAHOUSE stores, a wholesaler in Nabeul, 172 sales over 14 days (≈ 33,800 TND), 7 returns, 6 orders, rewards and quality reports — seed validation reports no failures.",
      },
      {
        title: "Roadmap",
        bullets: [
          "Build the Responsable, Vendeur and Grossiste apps and publish to Play Store / App Store (current builds are signed internal-test builds)",
          "Verify the camera fix on real devices and measure device-level performance",
          "Per-store wholesaler pricing and blocking below-purchase-price sales (warning-only today)",
          "Off-site backups and proven production-scale load capacity",
        ],
      },
    ],
    stack: [
      "Flutter",
      "Dart",
      "NestJS",
      "Node.js",
      "TypeScript",
      "PostgreSQL",
      "Docker",
      "REST",
    ],
  },
  {
    slug: "tdiscount",
    title: "TDiscount",
    tagline: "Production multi-vendor marketplace — re-engineered",
    summary:
      "A live multi-vendor marketplace rebuilt around custom vendor, ambassador and admin workflows: KYC, contracts, structured product entry, a versioned commission engine, seller levels and Aramex logistics — on hardened infrastructure.",
    status: "Live",
    categories: ["Web & Mobile", "QA & Security"],
    period: "Sep – Nov 2025",
    context: "Galylio AI · Freelance",
    role: "Full-stack & marketplace engineer",
    featured: true,
    cover: { value: "Live", label: "Marketplace in production" },
    metrics: [
      { value: "3", label: "Custom portals: vendor, ambassador, admin" },
      { value: "Aramex", label: "Shipping, labels & tracking" },
      { value: "CWV", label: "Measurable Core Web Vitals gains" },
    ],
    sections: [
      {
        title: "Starting point",
        text: "An existing Dokan marketplace held back by architectural limits, performance problems, bot traffic, an exposed server IP, weak vendor workflows and the constraints of the standard Dokan experience.",
      },
      {
        title: "Infrastructure redesign",
        text: "Migrated to a new VPS after the original IP was exposed, then hardened it.",
        bullets: [
          "Linux, Nginx, PHP-FPM and Redis",
          "Cloudflare in front, with rate limiting",
          "IP and user-agent controls against bot traffic",
          "Fail2ban and automated backups",
        ],
      },
      {
        title: "Onboarding workflows",
        cards: [
          {
            title: "Ambassadors",
            bullets: [
              "Authenticate and receive referral codes",
              "Invite vendors and submit their information",
              "Upload documentation and follow onboarding",
              "Dashboard access gated by validation",
            ],
          },
          {
            title: "Vendors",
            bullets: [
              "Register with an ambassador referral code",
              "Submit documents and pass KYC validation",
              "Access the dashboard after approval",
              "Create products and manage inventory",
            ],
          },
          {
            title: "Administrators",
            bullets: [
              "KYC and contracts",
              "Product validation",
              "Commissions and logistics",
            ],
          },
        ],
      },
      {
        title: "Structured product entry",
        text: "A spreadsheet-style product editor in Next.js with standardised, category-specific schemas — a computer has CPU, RAM, GPU, display and Windows-version fields.",
        steps: [
          "Fill structured fields",
          "Upload images",
          "Submit",
          "Admin validation",
          "Published",
        ],
      },
      {
        title: "Commission engine",
        bullets: [
          "Category-based, fixed or percentage rates",
          "TDiscount and ambassador commissions on separate ledgers",
          "Effective-date versioning and historical relationships",
          "Seller levels tied to revenue — better performance, lower commission",
        ],
      },
      {
        title: "Logistics",
        text: "Aramex API integration for shipment creation, pickup, labels, PDFs and tracking — with a manual fallback.",
      },
      {
        title: "Result",
        text: "Deployed and operational, with measurable improvements in technical SEO and Core Web Vitals.",
      },
    ],
    stack: [
      "WordPress",
      "WooCommerce",
      "Dokan",
      "PHP",
      "Next.js",
      "Express.js",
      "Nginx",
      "PHP-FPM",
      "Redis",
      "Cloudflare",
      "Fail2ban",
      "Aramex API",
      "Linux",
    ],
    links: [{ label: "tdiscount.tn", url: "https://tdiscount.tn" }],
  },
  {
    slug: "fiducia",
    title: "FIDUCIA · DueDill Crypto Watch",
    tagline: "AI-powered due diligence for crypto projects",
    summary:
      "A due-diligence platform for financial institutions and professionals: it aggregates everything public about a crypto project, lets analysts interrogate it through RAG, audits smart contracts for risk and generates PowerPoint reports through a custom MCP server.",
    status: "Production-oriented",
    categories: ["AI & ML", "Web & Mobile"],
    period: "2025",
    featured: true,
    cover: { value: "RAG", label: "+ smart-contract risk analysis" },
    sections: [
      {
        title: "Questions it answers",
        bullets: [
          "Is the project legitimate and legally structured — is there an actual project?",
          "Is there a credible whitepaper and an active Git repository? When was it last updated?",
          "Does it have a website? Where is the team, and who are they?",
          "What public information exists about it?",
        ],
      },
      {
        title: "How it works",
        steps: [
          "Data aggregation",
          "Document store · ChromaDB",
          "RAG Q&A",
          "Risk scoring",
          "PowerPoint report via MCP",
        ],
      },
      {
        title: "Smart-contract analysis",
        text: "Contracts are analysed for security and business risk.",
        bullets: [
          "Can holders sell after buying?",
          "Can the owner dilute holders?",
          "Suspicious owner privileges",
          "Potentially dangerous contract behaviours",
        ],
      },
      {
        title: "AI reporting",
        text: "The LLM talks to a custom PowerPoint MCP server to produce reports, presentations, findings and structured due-diligence output.",
      },
      {
        title: "Features",
        bullets: [
          "Dashboard and authentication",
          "Coin analysis, volatility analysis (ARIMA, GARCH) and news analysis",
          "Document RAG and AI Q&A — cloud (Gemini) or local LLM (Ollama)",
          "Risk scoring and automatic PowerPoint reports",
        ],
      },
    ],
    stack: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "Tailwind",
      "Radix",
      "shadcn/ui",
      "Recharts",
      "Zod",
      "FastAPI",
      "Streamlit",
      "Gemini",
      "LangChain",
      "Ollama",
      "ChromaDB",
      "CoinGecko",
      "CryptoCompare",
      "python-pptx",
      "ARIMA",
      "GARCH",
      "TensorFlow",
    ],
    links: [
      { label: "GitHub", url: "https://github.com/haider0708/DueDill_project" },
    ],
  },
  {
    slug: "dronia",
    title: "Dronia",
    tagline: "Drone imagery and deep learning for crop health",
    summary:
      "A platform that lets farmers fly drones over their land, see their fields and detect insects and plant diseases automatically — powered by a YOLOv8 model trained on a dataset of crop diseases and insects.",
    status: "Built",
    categories: ["AI & ML", "Web & Mobile"],
    context: "Galylio AI",
    featured: true,
    cover: { value: "YOLOv8", label: "Insect & disease detection" },
    sections: [
      {
        title: "The problem",
        text: "Pests and diseases are often spotted too late, when walking every row of a field is impossible. Drones can see the whole farm in minutes — the challenge is turning that imagery into answers a farmer can act on.",
      },
      {
        title: "How it works",
        steps: [
          "Drone flight over the field",
          "Aerial imagery",
          "YOLOv8 detection",
          "Insects & diseases located",
          "Farmer dashboard",
        ],
      },
      {
        title: "For farmers",
        cards: [
          {
            title: "See the land",
            text: "Drone imagery gives farmers a clear, up-to-date view of their fields.",
          },
          {
            title: "Detect threats",
            text: "The model identifies insects and plant diseases directly in the imagery.",
          },
          {
            title: "Act early",
            text: "Detections point farmers to the affected areas so treatment can start sooner.",
          },
        ],
      },
      {
        title: "The model",
        text: "A YOLOv8 object-detection model trained on a database of crop diseases and insects, so detections come with a location in the image — not just a label for the whole photo.",
      },
    ],
    stack: [
      "Python",
      "YOLOv8",
      "PyTorch",
      "Computer Vision",
      "Deep Learning",
      "Drone imagery",
    ],
  },
  {
    slug: "ai-news-video-automation",
    title: "AI News → Video → Social",
    tagline: "Autonomous content pipeline with a human in the loop",
    summary:
      "A pipeline that discovers news, lets an editor pick the story, then uses CrewAI agents to write, generate a thumbnail and a short video, and publish it to Facebook, Instagram and YouTube automatically.",
    status: "In development",
    categories: ["AI & ML", "Data & Scraping"],

    cover: { value: "7 steps", label: "News to published video, automated" },
    sections: [
      {
        title: "Lifecycle",
        steps: [
          "News scrapers",
          "News store",
          "Admin review",
          "CrewAI orchestrator",
          "Thumbnail",
          "Script & scenes",
          "Video generation",
          "Social publishing",
        ],
      },
      {
        title: "1 · Collection",
        text: "Automated workflows scrape free news websites and push topics into an administration interface.",
      },
      {
        title: "2 · Human selection",
        text: "An editor chooses what gets published — the system never blindly publishes everything it scrapes.",
      },
      {
        title: "3 · Agent orchestration",
        text: "The selected topic enters a CrewAI workflow that coordinates the content agents.",
      },
      {
        title: "4 · Generation",
        bullets: [
          "Thumbnail for the topic",
          "Script, scenario and scene structure",
          "Visual instructions and a video-generation prompt",
          "A ~10-second short-form video produced automatically",
        ],
      },
      {
        title: "5 · Publishing",
        text: "Final content is published automatically to Facebook, Instagram and YouTube.",
      },
      {
        title: "Roadmap",
        bullets: [
          "Duplicate-news detection, source ranking and fact extraction",
          "Summaries, multilingual output and automatic captions",
          "Platform-specific formatting and content moderation",
          "Publishing retry queues, scheduling and failure handling",
          "Analytics, performance feedback, agent evaluation and token-cost monitoring",
        ],
      },
    ],
    stack: [
      "Python",
      "CrewAI",
      "LLMs",
      "Image generation",
      "Video generation",
      "Web scraping",
      "Social media APIs",
    ],
  },

  /* ─────────────────────────── More projects ─────────────────────────── */
  {
    slug: "desak",
    title: "DESAK",
    tagline: "Contract-based, queue-driven scraping platform",
    summary:
      "The evolution of the scraping architecture into a production-oriented platform — PostgreSQL work queues, shop contracts, crawl state machines, incremental crawls and anti-bot escalation. It cut a full Mytek crawl from about 8 hours to tens of minutes.",
    status: "Production-oriented",
    categories: ["Data & Scraping"],
    context: "Galylio AI",
    cover: { value: "8h → min", label: "Full crawl time" },
    metrics: [
      { value: "20+", label: "Tunisian shops" },
      { value: "30k", label: "Products benchmarked" },
      { value: "~8h → tens of min", label: "Mytek crawl" },
    ],
    sections: [
      {
        title: "Releases",
        steps: [
          "R1 · Monolithic scraper",
          "R2/R3 · FastAPI + Redis Streams",
          "R4 · Contract-based, queue-driven",
        ],
      },
      {
        title: "Architecture",
        cards: [
          {
            title: "Work queues",
            bullets: [
              "PostgreSQL queues with FOR UPDATE SKIP LOCKED",
              "Retries and dead-letter handling",
            ],
          },
          {
            title: "Shop contracts",
            bullets: ["Shop packages", "ShopDefinition contracts"],
          },
          {
            title: "Crawl control",
            bullets: [
              "Crawl state machines",
              "Pause / resume / abandon",
              "Incremental and full crawls",
            ],
          },
          {
            title: "Data",
            bullets: [
              "Price history",
              "Availability tracking",
              "Selector drift detection",
            ],
          },
          {
            title: "Access",
            bullets: ["Proxy rotation (Oxylabs)", "Anti-bot escalation"],
          },
        ],
      },
    ],
    stack: [
      "Python 3.11",
      "asyncio",
      "uv",
      "Pydantic",
      "PostgreSQL",
      "asyncpg",
      "Redis",
      "aiohttp",
      "curl-cffi",
      "Playwright",
      "Patchright",
      "lxml",
      "Docker Compose",
      "structlog",
      "pytest",
      "Ruff",
      "Oxylabs",
    ],
  },
  {
    slug: "1111-scraping-engine",
    title: "1111 Scraping Engine",
    tagline: "One reusable engine, hundreds of shop workers",
    summary:
      "A generic scraping engine that spins up lightweight, shop-specific Docker workers from adapters and configuration — with three extraction layers, smart proxy cooldowns, incremental scraping, selector-change detection and preflight checks.",
    status: "Production",
    categories: ["Data & Scraping"],
    context: "Galylio AI · 1111",
    cover: { value: "~10 MB", label: "Idle memory per shop worker" },
    metrics: [
      { value: "~102", label: "Shops at an earlier stage" },
      { value: "~300k", label: "Product / data records later" },
      { value: "4M+", label: "Daily price points" },
    ],
    sections: [
      {
        title: "Engine, not scrapers",
        text: "Instead of isolated scripts, a generic engine instantiates dedicated shop workers from Docker images, adapters, configuration and shop definitions. Targeting ~10 MB idle memory per container lets many shops run concurrently.",
      },
      {
        title: "Extraction layers",
        cards: [
          {
            title: "Layer 1 · SSR",
            text: "Direct HTTP retrieval and HTML extraction.",
          },
          {
            title: "Layer 2 · CSR",
            text: "Playwright rendering for JavaScript-heavy sites.",
          },
          {
            title: "Layer 3 · Protected",
            text: "User-agent rotation, Patchright, Camofox, human-like interaction and proxy rotation.",
          },
        ],
      },
      {
        title: "Proxy management",
        text: "When a proxy gets blocked only that proxy enters cooldown and another valid one is selected — proxy health is shared with other services, so one failure never takes the system offline.",
      },
      {
        title: "Incremental scraping",
        text: "Known data is reused, unchanged content skipped and only changes processed — with every price change recorded.",
      },
      {
        title: "Self-protection",
        cards: [
          {
            title: "Selector change detection",
            text: "Compares a site before and after a change, proposes new selectors and flags the shop for an admin to validate or override.",
          },
          {
            title: "Preflight",
            text: "A test crawl runs before production; if the shop fails validation the crawl stops and the admin is notified — bad deployments can't corrupt data.",
          },
          {
            title: "Monitoring",
            text: "Dashboard for service health, heartbeats, configurations, shop health, crawl state and failures.",
          },
        ],
      },
    ],
    stack: [
      "Python",
      "Docker",
      "Playwright",
      "Patchright",
      "Camofox",
      "Proxy rotation",
      "PostgreSQL",
      "Redis",
    ],
  },
  {
    slug: "parahouse",
    title: "Parahouse",
    tagline: "E-commerce turnaround — UX, SEO, data and ERP",
    summary:
      "Took over a struggling PrestaShop parapharmacy store and rebuilt it: new UI/UX, SEO-ready templates, a full SEO and Web Vitals audit, an engineered product catalogue, competitive pricing, a direct ERP link and a fresh deployment.",
    status: "Live",
    categories: ["Web & Mobile"],
    role: "Full-stack, SEO & e-commerce engineer",
    cover: { value: "SEO", label: "Full audit & rebuild" },
    sections: [
      {
        title: "Starting point",
        text: "The store was in poor shape — dated UX, weak product data and templates that held search performance back.",
      },
      {
        title: "What I did",
        cards: [
          {
            title: "New UI / UX",
            text: "Redesigned the storefront experience and reworked the PrestaShop templates so they are clean, fast and SEO-ready.",
          },
          {
            title: "SEO & Web Vitals audit",
            text: "Full audit of technical SEO and Core Web Vitals, then fixes across templates, metadata and page performance.",
          },
          {
            title: "Product data engineering",
            text: "Built product data from images to complete specifications and descriptions, with engineered titles and meta tags for every product.",
          },
          {
            title: "Competitive pricing",
            text: "Compared prices against competitors and shaped the best offers.",
          },
          {
            title: "ERP integration",
            text: "Connected the store directly to the ERP.",
          },
          {
            title: "Deployment",
            text: "Deployed the new website to production.",
          },
        ],
      },
    ],
    stack: [
      "PrestaShop",
      "PHP",
      "Smarty templates",
      "Technical SEO",
      "Core Web Vitals",
      "ERP integration",
    ],
    links: [{ label: "parahouse.tn", url: "https://parahouse.tn" }],
  },
  {
    slug: "fantasy-tunisie",
    title: "Fantasy Tunisie",
    tagline: "A European-style fantasy football league for Tunisian football",
    summary:
      "A fantasy football app built on the full ruleset of the big European fantasy leagues — adapted to the Tunisian championship — with a Java backend and a Flutter app.",
    status: "Built",
    categories: ["Web & Mobile"],
    cover: { value: "Gameweek", label: "Full fantasy-league ruleset" },
    sections: [
      {
        title: "Concept",
        text: "Bring the fantasy-league experience fans know from Europe to Tunisian football, with the same depth of rules.",
      },
      {
        title: "Game rules",
        bullets: [
          "Squad building within a budget and per-club limits",
          "Starting line-up, formation, captain and vice-captain",
          "Gameweek deadlines, transfers and transfer costs",
          "Points from real match events",
          "Leagues and rankings to compete with friends",
        ],
      },
      {
        title: "Architecture",
        steps: [
          "Flutter app",
          "Java backend API",
          "Scoring engine",
          "Leagues & rankings",
        ],
      },
    ],
    stack: ["Java", "Flutter", "Dart", "REST API"],
  },
  {
    slug: "sports-fan-app",
    title: "Sports Club Fan App",
    tagline: "One app for everything a supporter needs",
    summary:
      "A fan app for a sports club bringing news, live updates, an official store, ticketing, digital fan IDs and streaming together in one place.",
    status: "Built",
    categories: ["Web & Mobile"],
    cover: { value: "6-in-1", label: "News · Store · Tickets · Stream" },
    sections: [
      {
        title: "Features",
        cards: [
          { title: "News", text: "Club news and announcements." },
          {
            title: "Latest",
            text: "A feed of the latest updates and results.",
          },
          { title: "Store", text: "The official club merchandise store." },
          { title: "Tickets", text: "Match ticketing inside the app." },
          { title: "Fan IDs", text: "Digital supporter identity cards." },
          { title: "Stream", text: "Live and on-demand streaming." },
        ],
      },
    ],
    stack: [],
  },
  {
    slug: "ride-hailing-tunisia",
    title: "Tunisian Ride-Hailing Platform",
    tagline: "An Uber-like mobility platform built for Tunisia",
    summary:
      "A real-time mobility platform connecting passengers and drivers — designed around the realities of the Tunisian market. Currently in development.",
    status: "In development",
    categories: ["Web & Mobile"],
    cover: { value: "Real-time", label: "Mobility platform" },
    sections: [
      {
        title: "Product direction",
        text: "A real-time platform connecting passengers, drivers, rides, locations, pricing, the trip lifecycle, notifications and operational administration.",
      },
      {
        title: "Planned scope",
        text: "The architecture being built toward as the project matures:",
        cards: [
          {
            title: "Apps",
            bullets: [
              "Passenger app",
              "Driver app",
              "Admin / operations dashboard",
            ],
          },
          {
            title: "Core",
            bullets: [
              "Authentication",
              "Trip management and history",
              "Driver availability",
              "Ride matching and pricing",
            ],
          },
          {
            title: "Real-time",
            bullets: [
              "Geolocation and trip tracking",
              "Notifications",
              "Ratings",
            ],
          },
          {
            title: "Trust",
            bullets: ["Payment and settlement", "Fraud and safety controls"],
          },
        ],
      },
      {
        title: "Engineering topics",
        bullets: [
          "WebSockets for live driver locations",
          "Geospatial PostgreSQL / PostGIS",
          "Redis and event-driven architecture",
          "Matching algorithms, rate limiting and background jobs",
          "Push notifications and observability",
        ],
      },
    ],
    stack: [],
  },
  {
    slug: "bitcoin-drl",
    title: "Bitcoin Deep RL Trading",
    tagline: "Reinforcement-learning agents that learn trading strategies",
    summary:
      "Deep reinforcement-learning agents trained and evaluated on Bitcoin market data, with temporal feature extractors, a production-oriented MLOps pipeline and a real-time monitoring dashboard.",
    status: "Internship",
    categories: ["AI & ML"],
    period: "Jul – Sep 2025",
    context: "PwC Tunisie",
    cover: { value: "PPO · SAC · TD3", label: "Deep RL agents" },
    sections: [
      {
        title: "Agents",
        cards: [
          { title: "PPO", text: "Proximal Policy Optimization." },
          { title: "SAC", text: "Soft Actor-Critic." },
          { title: "TD3", text: "Twin Delayed DDPG." },
        ],
      },
      {
        title: "Temporal modelling",
        text: "LSTM and CNN feature extractors turn raw market sequences into state representations for the agents.",
      },
      {
        title: "MLOps & dashboard",
        bullets: [
          "Dockerised pipeline with CI/CD",
          "Grafana monitoring",
          "Next.js dashboard for real-time monitoring, strategy performance, reporting and visualisation",
        ],
      },
    ],
    stack: [
      "Python",
      "PyTorch",
      "PPO",
      "SAC",
      "TD3",
      "LSTM",
      "CNN",
      "Docker",
      "CI/CD",
      "Grafana",
      "Next.js",
    ],
  },
  {
    slug: "intrusion-detection",
    title: "Intrusion Detection System",
    tagline: "Real-time network threat detection + FSOCIETY scanner",
    summary:
      "Network traffic is turned into flow features, scored by ML models behind FastAPI and streamed to a near real-time security dashboard — paired with a web security scanner.",
    status: "Production-oriented",
    categories: ["AI & ML", "QA & Security"],
    period: "Jul – Aug 2024",
    context: "Beehive Enterprise",
    cover: { value: "Real-time", label: "Threat detection" },
    sections: [
      {
        title: "Pipeline",
        steps: [
          "Network traffic",
          "CicFlowMeter",
          "FastAPI ML inference",
          "PostgreSQL / Elasticsearch",
          "Next.js dashboard",
        ],
      },
      {
        title: "Models",
        text: "XGBoost and Random Forest trained on CICIDS2017 to detect anomalies, malicious traffic and network threats — served with monitoring, CI/CD, observability and alerting.",
      },
      {
        title: "Security dashboard",
        text: "Displays network events, predictions, security information and monitoring data in near real time.",
      },
      {
        title: "FSOCIETY scanner",
        bullets: [
          "SSL checks and reputation lookups",
          "Phishing and malware-related checks",
          "Security scoring and bulk scanning",
          "Scan history",
        ],
      },
    ],
    stack: [
      "Python",
      "XGBoost",
      "Random Forest",
      "CICIDS2017",
      "CicFlowMeter",
      "FastAPI",
      "PostgreSQL",
      "Elasticsearch",
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind",
      "Radix",
      "shadcn/ui",
      "Recharts",
    ],
    links: [
      {
        label: "IDS on GitHub",
        url: "https://github.com/haider0708/Intrusion-detection-system",
      },
      {
        label: "CICIDS2017 modeling",
        url: "https://github.com/haider0708/Cicids2017-Modeling-",
      },
      {
        label: "CicFlowMeter (my way)",
        url: "https://github.com/haider0708/CicFlowMeter-MyWay-",
      },
    ],
  },
  {
    slug: "mlops-churn",
    title: "MLOps Churn Prediction",
    tagline: "A production-oriented ML platform, end to end",
    summary:
      "A churn-prediction platform covering the full ML lifecycle — training, tracking, orchestration, serving, logging and containerised delivery to Docker Hub.",
    status: "Production-oriented",
    categories: ["AI & ML", "Cloud & Data Platforms"],
    cover: { value: "97%", label: "Test accuracy" },
    metrics: [
      { value: "97%", label: "Test accuracy" },
      { value: "0.88", label: "F1 (churn)" },
      { value: "0.90", label: "Precision" },
      { value: "0.86", label: "Recall" },
    ],
    sections: [
      {
        title: "Modelling",
        text: "Gradient Boosting and Random Forest on the BigML churn dataset, with SMOTEENN to handle class imbalance.",
      },
      {
        title: "Platform",
        steps: [
          "Prefect orchestration",
          "Training",
          "MLflow tracking",
          "FastAPI serving",
          "Elasticsearch + Kibana logs",
          "Docker Hub",
        ],
      },
    ],
    stack: [
      "Python",
      "scikit-learn",
      "SMOTEENN",
      "MLflow",
      "Prefect",
      "FastAPI",
      "Uvicorn",
      "SQLAlchemy",
      "PostgreSQL",
      "Elasticsearch",
      "Kibana",
      "Docker",
      "Docker Compose",
      "Docker Hub",
    ],
    links: [
      { label: "GitHub", url: "https://github.com/haider0708/MLops_final" },
      {
        label: "Docker Hub",
        url: "https://hub.docker.com/r/haydar0708/4ds8-mlops",
      },
    ],
  },
  {
    slug: "haidertts",
    title: "HaiderTTS",
    tagline: "Text-to-speech for Tunisian Arabic (Derja)",
    summary:
      "A speech-synthesis system for Tunisian Derja — from collecting and cleaning a monospeaker dataset to training Tacotron2 with a Parallel WaveGAN vocoder via transfer learning, and packaging it for inference.",
    status: "Academic",
    categories: ["AI & ML"],
    period: "2023 – 2024",
    cover: { value: "~3h", label: "Derja speech dataset" },
    sections: [
      {
        title: "Dataset",
        text: "About 3 hours of monospeaker Tunisian Arabic audio sourced from Derja.Ninja.",
      },
      {
        title: "Pipeline",
        steps: [
          "Collection",
          "Cleaning & noise reduction",
          "Silence trimming · MP3 → WAV",
          "Transcripts · Arabic / Buckwalter / phonemes",
          "ESPnet training",
          "Inference & packaging",
        ],
      },
      {
        title: "Models",
        text: "Tacotron2 acoustic model with a Parallel WaveGAN vocoder, using transfer learning from English LJSpeech, organised in Kaldi-style ESPnet directories.",
      },
    ],
    stack: [
      "Python",
      "ESPnet",
      "PyTorch",
      "CUDA",
      "Tacotron2",
      "Parallel WaveGAN",
      "Selenium",
      "FFmpeg",
      "Docker",
      "Docker Compose",
      "Make",
      "pytest",
    ],
    links: [
      { label: "GitHub", url: "https://github.com/haider0708/HaiderTTS" },
    ],
  },

  /* ───────────────────────── AI & data platforms ───────────────────────── */
  {
    slug: "hybrid-rag-platform",
    archive: true,
    title: "Hybrid RAG Knowledge Platform",
    tagline: "Enterprise knowledge retrieval with hybrid search",
    summary:
      "A production-oriented RAG platform combining semantic and lexical retrieval with reranking and evaluation, served through FastAPI with cloud or local LLMs.",
    status: "In development",
    categories: ["AI & ML"],
    cover: { value: "Hybrid", label: "Semantic + lexical retrieval" },
    sections: [
      {
        title: "Retrieval flow",
        steps: [
          "Documents",
          "Chunking & embeddings",
          "pgvector / Qdrant + Elasticsearch / OpenSearch",
          "Reranking",
          "LLM answer",
          "Evaluation",
        ],
      },
      {
        title: "Concepts",
        bullets: [
          "Hybrid retrieval — semantic and lexical search combined",
          "Reranking for precision",
          "Retrieval evaluation (Recall@K, MRR, nDCG)",
          "Enterprise knowledge retrieval with Redis caching",
        ],
      },
    ],
    stack: [
      "Python",
      "FastAPI",
      "pgvector",
      "Qdrant",
      "Elasticsearch",
      "OpenSearch",
      "Redis",
      "Docker",
      "LLM APIs",
      "Ollama",
    ],
  },
  {
    slug: "fintech-fraud-engine",
    archive: true,
    title: "AI FinTech Fraud & Risk Engine",
    tagline: "Transaction fraud detection with explainable risk scores",
    summary:
      "A fraud-detection and risk-scoring engine for transaction streams, with gradient-boosted models, SHAP explanations, experiment tracking and monitoring.",
    status: "In development",
    categories: ["AI & ML"],
    cover: { value: "SHAP", label: "Explainable risk scoring" },
    sections: [
      {
        title: "Flow",
        steps: [
          "Transactions · Kafka",
          "Feature pipeline",
          "XGBoost / LightGBM",
          "Risk score + SHAP",
          "FastAPI",
          "Grafana / Power BI",
        ],
      },
      {
        title: "Objectives",
        bullets: [
          "Transaction fraud detection",
          "Risk scoring",
          "Explainability for analysts",
        ],
      },
    ],
    stack: [
      "Python",
      "FastAPI",
      "Kafka",
      "XGBoost",
      "LightGBM",
      "SHAP",
      "MLflow",
      "Grafana",
      "Power BI",
    ],
  },
  {
    slug: "predictive-analytics-platform",
    archive: true,
    title: "Predictive Analytics & ML Platform",
    tagline: "Churn prediction and sales forecasting as a service",
    summary:
      "A reusable ML platform for business forecasting use cases — churn prediction and sales forecasting — with tracked experiments, an API and BI reporting.",
    status: "In development",
    categories: ["AI & ML"],
    cover: { value: "Forecast", label: "Churn & sales models" },
    sections: [
      {
        title: "Use cases",
        cards: [
          {
            title: "Churn prediction",
            text: "Identify customers at risk of leaving.",
          },
          {
            title: "Sales forecasting",
            text: "Anticipate demand and revenue.",
          },
        ],
      },
      {
        title: "Flow",
        steps: [
          "PostgreSQL",
          "Pandas features",
          "scikit-learn / XGBoost / LightGBM",
          "MLflow",
          "FastAPI",
          "Power BI",
        ],
      },
    ],
    stack: [
      "Python",
      "Pandas",
      "scikit-learn",
      "XGBoost",
      "LightGBM",
      "MLflow",
      "FastAPI",
      "PostgreSQL",
      "Docker",
      "Power BI",
    ],
  },
  {
    slug: "data-engineering-platform",
    archive: true,
    title: "Batch & Real-Time Data Platform",
    tagline: "From any source to analytics and ML",
    summary:
      "A scalable data-engineering platform that ingests APIs, CSVs, databases and streams through Kafka, transforms them with ETL/ELT and lands them in a lake and warehouse for analytics and ML.",
    status: "In development",
    categories: ["Cloud & Data Platforms", "Data & Scraping"],
    cover: { value: "Kafka", label: "Batch + streaming" },
    sections: [
      {
        title: "Architecture",
        steps: [
          "APIs / CSV / DBs / streams",
          "Kafka",
          "ETL / ELT · Spark + dbt",
          "Data lake",
          "Data warehouse",
          "Analytics & ML",
        ],
      },
      {
        title: "Orchestration",
        text: "Airflow schedules batch pipelines while Kafka carries the real-time path.",
      },
    ],
    stack: [
      "Python",
      "SQL",
      "Airflow",
      "Kafka",
      "Spark",
      "dbt",
      "PostgreSQL",
      "Docker",
      "Power BI",
    ],
  },
  {
    slug: "esg-data-platform",
    title: "ESG Data Intelligence Platform",
    tagline: "Sustainability data, collected, validated and traceable",
    summary:
      "An end-to-end ESG data platform that automates the collection, scraping, extraction, cleaning, normalisation and validation of sustainability data from corporate websites, annual reports and ESG documents — feeding a PostgreSQL warehouse and Power BI dashboards.",
    status: "Built",
    categories: ["Data & Scraping", "Cloud & Data Platforms"],
    cover: { value: "E · S · G", label: "Indicators with source traceability" },
    sections: [
      {
        title: "Pipeline",
        steps: [
          "Corporate websites, annual reports & ESG documents",
          "Scraping & extraction",
          "Cleaning & normalisation",
          "Validation & quality controls",
          "PostgreSQL warehouse",
          "Power BI dashboards",
        ],
      },
      {
        title: "Collection & extraction",
        text: "Automated collection and scraping of sustainability data from company websites, plus extraction from annual reports and ESG documents — turning unstructured disclosures into structured indicators.",
      },
      {
        title: "Data warehouse",
        text: "ETL pipelines load a structured PostgreSQL data warehouse covering environmental, social and governance indicators across companies and reporting periods.",
        cards: [
          { title: "Environmental", text: "Emissions and energy consumption." },
          { title: "Social", text: "Workforce and diversity indicators." },
          { title: "Governance", text: "Board and governance metrics." },
        ],
      },
      {
        title: "Trust in the numbers",
        bullets: [
          "Source traceability — every value links back to where it came from",
          "Data-quality controls during cleaning, normalisation and validation",
          "Comparable indicators across companies and reporting periods",
        ],
      },
      {
        title: "Dashboards",
        text: "Power BI dashboards monitor ESG KPIs — emissions, diversity, energy consumption and governance metrics — by company and reporting period.",
      },
    ],
    stack: [
      "Web scraping",
      "Document extraction",
      "ETL",
      "PostgreSQL",
      "Data warehouse",
      "Data quality",
      "Power BI",
    ],
  },
  {
    slug: "employee-rating-system",
    title: "Internal Performance & Rating Platform",
    tagline:
      "Structured, auditable performance assessment with an AI assistant",
    summary:
      "An internal evaluation platform for structured employee and team assessment — configurable frameworks, weighted scoring, evidence-based ratings and history — with an LLM assistant that writes insights and development plans while the scoring engine stays deterministic and auditable.",
    status: "Built",
    categories: ["Web & Mobile", "AI & ML"],
    cover: {
      value: "Auditable",
      label: "Deterministic scoring + LLM insights",
    },
    sections: [
      {
        title: "Evaluation engine",
        cards: [
          {
            title: "Configurable frameworks",
            text: "Evaluation frameworks are configured rather than hard-coded, for employees and for teams.",
          },
          {
            title: "Weighted scoring",
            text: "Criteria carry weights; the scoring engine is deterministic, so every result can be reproduced and audited.",
          },
          {
            title: "Evidence-based ratings",
            text: "Ratings are backed by evidence and accompanied by feedback.",
          },
          {
            title: "History",
            text: "Historical performance tracking across evaluation cycles.",
          },
        ],
      },
      {
        title: "Access & roles",
        text: "Role-based access control separates what employees, managers and HR can see and do.",
      },
      {
        title: "Analytics",
        text: "Dashboards for managers and HR to identify performance trends and skill gaps.",
      },
      {
        title: "LLM assistant",
        text: "An LLM-powered assistant generates evaluation insights, personalised recommendations and development plans. It advises — it never scores: ratings come only from the deterministic engine, keeping results fair and auditable.",
        steps: [
          "Evidence & ratings",
          "Deterministic scoring engine",
          "Auditable results",
          "LLM insights & development plans",
        ],
      },
    ],
    stack: [
      "Python",
      "FastAPI",
      "PostgreSQL",
      "React",
      "Next.js",
      "Docker",
      "LLMs",
      "RBAC",
      "Power BI",
    ],
  },

  /* ───────────────────────────── QA & security ───────────────────────────── */
  {
    slug: "payment-simulator-qa",
    archive: true,
    title: "Payment Simulator QA Platform",
    tagline: "End-to-end testing of a payment state machine",
    summary:
      "A QA platform around a simulated payment lifecycle, covering every state transition and the edge cases that break real payment systems.",
    status: "Built",
    categories: ["QA & Security"],
    cover: { value: "6 states", label: "Payment lifecycle covered" },
    sections: [
      {
        title: "Payment states",
        steps: [
          "PENDING",
          "AUTHORIZED",
          "CAPTURED",
          "FAILED",
          "CANCELLED",
          "REFUNDED",
        ],
      },
      {
        title: "Test scenarios",
        bullets: [
          "Invalid and expired cards",
          "Insufficient balance",
          "Idempotency",
          "Cancellation and refunds",
        ],
      },
    ],
    stack: [
      "Playwright",
      "TypeScript",
      "PostgreSQL",
      "Postman",
      "GitHub Actions",
    ],
  },
  {
    slug: "api-db-quality-framework",
    archive: true,
    title: "API & Database Quality Framework",
    tagline: "Contract, API and data-integrity testing",
    summary:
      "A test framework that validates APIs and the data they write — combining Playwright API tests, Postman/Newman collections, pytest and SQL assertions against PostgreSQL.",
    status: "Built",
    categories: ["QA & Security"],
    cover: { value: "API + SQL", label: "Quality gates" },
    sections: [
      {
        title: "Layers",
        cards: [
          {
            title: "API",
            text: "Playwright API tests and Postman collections run with Newman.",
          },
          {
            title: "Data",
            text: "pytest and SQL checks against PostgreSQL for integrity and correctness.",
          },
        ],
      },
    ],
    stack: ["Playwright", "Postman", "Newman", "pytest", "SQL", "PostgreSQL"],
  },
  {
    slug: "ai-assisted-testing",
    archive: true,
    title: "AI-Assisted Testing",
    tagline: "LLMs that write tests and explain failures",
    summary:
      "Uses LLMs alongside Playwright and API testing to generate test cases and analyse failures.",
    status: "Built",
    categories: ["QA & Security", "AI & ML"],
    cover: { value: "LLM × QA", label: "Generated tests" },
    sections: [
      {
        title: "Capabilities",
        bullets: ["Test-case generation", "Failure analysis"],
      },
    ],
    stack: ["Python", "LLMs", "Playwright", "API testing"],
  },
  {
    slug: "appsec-pentest",
    archive: true,
    title: "Application Security & Pen Testing",
    tagline: "Testing web apps against the OWASP Top 10",
    summary:
      "Security testing of web applications built with FastAPI and Next.js, guided by OWASP and informed by network-attack data from CICIDS2017.",
    status: "Built",
    categories: ["QA & Security"],
    cover: { value: "OWASP", label: "Top 10 coverage" },
    sections: [
      {
        title: "Scope",
        bullets: [
          "OWASP-driven application testing",
          "FastAPI and Next.js targets",
          "Attack patterns from CICIDS2017",
        ],
      },
    ],
    stack: ["Python", "FastAPI", "Next.js", "CICIDS2017", "OWASP"],
  },

  /* ─────────────────────── Cloud & data engineering ─────────────────────── */
  {
    slug: "azure-data-platform",
    archive: true,
    title: "Azure Data Platform",
    tagline: "Lakehouse pipelines on Azure",
    summary:
      "Data pipelines orchestrated with Azure Data Factory, processed in Databricks and stored as Delta Lake on ADLS Gen2, serving Azure SQL.",
    status: "Academic",
    categories: ["Cloud & Data Platforms"],
    cover: { value: "Delta", label: "Azure lakehouse" },
    sections: [
      {
        title: "Flow",
        steps: [
          "Azure Data Factory",
          "ADLS Gen2",
          "Databricks",
          "Delta Lake",
          "Azure SQL",
        ],
      },
    ],
    stack: [
      "Azure Data Factory",
      "Databricks",
      "Delta Lake",
      "ADLS Gen2",
      "Azure SQL",
    ],
  },
  {
    slug: "azure-realtime-streaming",
    archive: true,
    title: "Real-Time Streaming on Azure",
    tagline: "Event streams into Delta Lake",
    summary:
      "Real-time ingestion with Azure Event Hubs processed by Spark Structured Streaming into Delta Lake.",
    status: "Academic",
    categories: ["Cloud & Data Platforms"],
    cover: { value: "Streaming", label: "Event Hubs → Delta" },
    sections: [
      {
        title: "Flow",
        steps: ["Azure Event Hubs", "Spark Structured Streaming", "Delta Lake"],
      },
    ],
    stack: ["Azure Event Hubs", "Spark Structured Streaming", "Delta Lake"],
  },
  {
    slug: "azure-data-warehouse",
    archive: true,
    title: "Data Warehouse",
    tagline: "Star-schema warehouse and BI",
    summary:
      "A star-schema data warehouse on Azure SQL / SQL Server, loaded with SSIS and reported in Power BI.",
    status: "Academic",
    categories: ["Cloud & Data Platforms"],
    cover: { value: "Star", label: "Schema warehouse" },
    sections: [
      {
        title: "Flow",
        steps: [
          "Sources",
          "SSIS",
          "SQL Server / Azure SQL · star schema",
          "Power BI",
        ],
      },
    ],
    stack: ["Azure SQL", "SQL Server", "Star Schema", "SSIS", "Power BI"],
  },
  {
    slug: "microsoft-fabric-lakehouse",
    archive: true,
    title: "Microsoft Fabric Lakehouse",
    tagline: "Unified analytics on OneLake",
    summary:
      "A lakehouse built on Microsoft Fabric and OneLake with Power BI on top.",
    status: "Academic",
    categories: ["Cloud & Data Platforms"],
    cover: { value: "OneLake", label: "Fabric lakehouse" },
    sections: [{ title: "Flow", steps: ["OneLake", "Lakehouse", "Power BI"] }],
    stack: ["Microsoft Fabric", "OneLake", "Lakehouse", "Power BI"],
  },
  {
    slug: "data-quality-governance",
    archive: true,
    title: "Data Quality & Governance",
    tagline: "Trustworthy data, measured",
    summary:
      "Data-quality checks and governance practices — validation, lineage and documentation — across ADF pipelines with Power BI reporting.",
    status: "Academic",
    categories: ["Cloud & Data Platforms"],
    cover: { value: "Quality", label: "Validated data flows" },
    sections: [
      {
        title: "Practices",
        bullets: [
          "Source-to-destination validation",
          "Deduplication and referential integrity",
          "Data lineage, documentation and KPI accuracy",
        ],
      },
    ],
    stack: ["Python", "SQL", "Azure Data Factory", "Power BI"],
  },
  {
    slug: "dataops-cicd",
    archive: true,
    title: "DataOps CI/CD",
    tagline: "Infrastructure and pipelines as code",
    summary:
      "CI/CD for data platforms with Azure DevOps and GitHub Actions, containerised workloads and Terraform-provisioned infrastructure.",
    status: "Academic",
    categories: ["Cloud & Data Platforms"],
    cover: { value: "IaC", label: "Terraform + CI/CD" },
    sections: [
      {
        title: "Flow",
        steps: [
          "Commit",
          "Azure DevOps / GitHub Actions",
          "Docker build",
          "Terraform apply",
        ],
      },
    ],
    stack: ["Azure DevOps", "GitHub Actions", "Docker", "Terraform"],
  },
  {
    slug: "big-data-platform",
    archive: true,
    title: "Big Data Platform",
    tagline: "Spark, Kafka and Airflow, containerised",
    summary:
      "A big-data processing stack combining Spark and Kafka, orchestrated by Airflow and persisted in PostgreSQL.",
    status: "Academic",
    categories: ["Cloud & Data Platforms"],
    cover: { value: "Spark", label: "Big data processing" },
    sections: [
      { title: "Flow", steps: ["Kafka", "Spark", "Airflow", "PostgreSQL"] },
    ],
    stack: ["Python", "Spark", "Kafka", "Airflow", "PostgreSQL", "Docker"],
  },
  {
    slug: "azure-ai-platform",
    archive: true,
    title: "Azure AI Platform",
    tagline: "AI services on Azure",
    summary:
      "AI workloads on Azure AI Foundry and Azure ML with serverless Azure Functions, Azure OpenAI and Blob Storage.",
    status: "Academic",
    categories: ["Cloud & Data Platforms", "AI & ML"],
    cover: { value: "Azure AI", label: "Foundry · ML · OpenAI" },
    sections: [
      {
        title: "Flow",
        steps: [
          "Blob Storage",
          "Azure ML / AI Foundry",
          "Azure OpenAI",
          "Azure Functions",
        ],
      },
    ],
    stack: [
      "Azure AI Foundry",
      "Azure ML",
      "Azure Functions",
      "Azure OpenAI",
      "Blob Storage",
    ],
  },

  /* ─────────────────────────── Software engineering ─────────────────────────── */
  {
    slug: "dotnet-cpp-platform",
    archive: true,
    title: "ASP.NET Core & C++ Platform",
    tagline: "Geospatial enterprise application",
    summary:
      "An enterprise application with an ASP.NET Core / C# backend, C++ components, an Angular frontend and a PostGIS-enabled PostgreSQL database, delivered through Docker and Jenkins.",
    status: "Academic",
    categories: ["Software Engineering"],
    cover: { value: "C# · C++", label: "Enterprise & geospatial" },
    sections: [
      {
        title: "Architecture",
        steps: [
          "Angular / TypeScript",
          "ASP.NET Core · C#",
          "C++ modules",
          "NHibernate",
          "PostgreSQL + PostGIS",
        ],
      },
      {
        title: "Delivery",
        text: "Containerised with Docker and built through Jenkins pipelines.",
      },
    ],
    stack: [
      "C#",
      "ASP.NET Core",
      "C++",
      "Angular",
      "TypeScript",
      "PostgreSQL",
      "PostGIS",
      "NHibernate",
      "Docker",
      "Jenkins",
    ],
  },
  {
    slug: "angular-web-app",
    archive: true,
    title: "Angular Web Application",
    tagline: "Reactive SPA with secured REST APIs",
    summary:
      "A single-page application in Angular and TypeScript using RxJS, consuming REST APIs secured with JWT.",
    status: "Academic",
    categories: ["Software Engineering"],
    cover: { value: "RxJS", label: "Reactive Angular SPA" },
    sections: [
      { title: "Stack", steps: ["Angular + RxJS", "REST APIs", "JWT auth"] },
    ],
    stack: [
      "Angular",
      "TypeScript",
      "RxJS",
      "HTML5",
      "CSS3",
      "REST APIs",
      "JWT",
    ],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export const getProject = (slug: string) =>
  projects.find((p) => p.slug === slug);
