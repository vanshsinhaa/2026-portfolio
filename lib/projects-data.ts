export interface Project {
  slug: string;
  title: string;
  problem: string;
  stack: string[];
  metric?: string;
  featured?: boolean;
  category: "data-engineering" | "full-stack" | "infrastructure";
  year: string;
  /** CSS background for the card cover — layered radial gradients, no images to load */
  gradient: string;
  /** Accent color used for hover glows and shadows */
  glow: string;
}

export interface CaseStudy extends Project {
  deck: string;
  role: string;
  timeline: string;
  team: string;
  /** Optional repository link rendered as a GitHub button on the case study */
  github?: string;
  metrics: { label: string; value: string }[];
  overview: string;
  problemDetails: string;
  approach: string;
  architecture: string;
  architectureDiagrams?: { title: string; src: string; alt: string }[];
  decisions: { title: string; content: string }[];
  results: string;
  learnings: string;
  nextSteps: string;
}

export const projects: Project[] = [
  {
    slug: "savemygrade",
    title: "SaveMyGrade",
    problem:
      "Local-first, multimodal RAG study system that turns a semester of notes into a searchable second brain",
    stack: ["FastAPI", "Next.js", "ChromaDB", "SQLite", "Gemini"],
    metric: "6 source types",
    featured: true,
    category: "full-stack",
    year: "2026",
    gradient:
      "radial-gradient(110% 90% at 15% 20%, rgba(110, 231, 183, 0.85) 0%, rgba(110, 231, 183, 0) 55%), radial-gradient(90% 80% at 85% 14%, rgba(94, 234, 212, 0.7) 0%, rgba(94, 234, 212, 0) 55%), radial-gradient(110% 110% at 75% 90%, rgba(196, 181, 253, 0.6) 0%, rgba(196, 181, 253, 0) 62%), linear-gradient(135deg, #ecfdf5 0%, #f0fdfa 100%)",
    glow: "rgba(52, 211, 153, 0.28)",
  },
  {
    slug: "bigquery-rerun-manager",
    title: "BigQuery Query Rerun Manager",
    problem:
      "Metadata-driven query execution system for reliable batch analytics",
    stack: ["BigQuery", "Kubernetes", "Docker", "Python", "GCP IAM"],
    metric: "500+ queries/day",
    featured: true,
    category: "data-engineering",
    year: "2025",
    gradient:
      "radial-gradient(120% 90% at 15% 20%, rgba(165, 180, 252, 0.9) 0%, rgba(165, 180, 252, 0) 55%), radial-gradient(90% 80% at 85% 12%, rgba(125, 211, 252, 0.8) 0%, rgba(125, 211, 252, 0) 55%), radial-gradient(100% 100% at 78% 88%, rgba(196, 181, 253, 0.85) 0%, rgba(196, 181, 253, 0) 60%), radial-gradient(70% 70% at 28% 92%, rgba(147, 197, 253, 0.6) 0%, rgba(147, 197, 253, 0) 60%), linear-gradient(135deg, #eef2ff 0%, #e0f2fe 100%)",
    glow: "rgba(129, 140, 248, 0.25)",
  },
  {
    slug: "2026-portfolio",
    title: "2026 Portfolio",
    problem:
      "Modern portfolio with fluid page transitions and brand-first design",
    stack: ["Next.js", "Framer Motion", "TypeScript", "Tailwind"],
    metric: "98/100 Performance",
    featured: true,
    category: "full-stack",
    year: "2026",
    gradient:
      "radial-gradient(110% 90% at 18% 22%, rgba(216, 180, 254, 0.9) 0%, rgba(216, 180, 254, 0) 55%), radial-gradient(90% 80% at 85% 15%, rgba(249, 168, 212, 0.7) 0%, rgba(249, 168, 212, 0) 55%), radial-gradient(110% 110% at 72% 90%, rgba(165, 180, 252, 0.8) 0%, rgba(165, 180, 252, 0) 62%), linear-gradient(135deg, #faf5ff 0%, #fdf2f8 100%)",
    glow: "rgba(216, 180, 254, 0.3)",
  },
];

export const caseStudies: Record<string, CaseStudy> = {
  savemygrade: {
    ...projects.find((p) => p.slug === "savemygrade")!,
    deck: "A local-first, multimodal RAG study system: capture everything you learn in a semester, then search it, chat with it, drill it, and see where it's thin.",
    role: "Full-Stack Engineer & Architect",
    timeline: "7 days (study layer)",
    team: "Solo project",
    github: "https://github.com/vanshsinhaa/savemygrade",
    metrics: [
      { label: "Lines of code", value: "~9,300" },
      { label: "API endpoints", value: "40+" },
      { label: "Test suite", value: "25 tests · ~3s" },
      { label: "Source types", value: "6" },
    ],
    overview:
      "SaveMyGrade is a single-user, localhost-only study system built by a student for students. During a semester you braindump everything you learn — typed notes, PDFs, lecture slides, whiteboard photos, screen recordings, YouTube lectures — into per-semester workspaces organized by course. Gemini's multimodal embeddings index all of it into ChromaDB, and the system then offers five ways to study from it: semantic search, RAG chat that answers only from your own material with citations that open the exact source, one-click flashcards tracked as auditable runs, topic-organized digests with real LaTeX rendering, and a gap view that flags which topics are thin before an exam. A live knowledge graph ties the corpus together, drawing extracted concepts and relations as an interactive map with per-capture provenance.",
    problemDetails:
      "Students don't have a note-taking problem — they have a fragmentation problem. By mid-semester, course material is scattered across lecture slides, PDFs, recorded lectures, screenshots, YouTube videos, and ChatGPT conversations whose context evaporates when the tab closes. Finding information becomes harder than understanding it, and the same context gets re-explained to a chatbot every session. The success criterion was written down before any code: you stop going to ChatGPT, Google, or your raw notes to answer a question about material you already captured. Two insights shaped everything downstream — retrieval is the product, since the quality of an answer is largely determined before the model generates a single token; and memory compounds, since every capture permanently improves future retrieval.",
    approach:
      "Rather than starting from zero, the project forks an existing multimodal indexing tool after a written keep/change/remove analysis — inheriting a working, already-debugged Gemini embedding pipeline on day one and spending the effort on the study layer, the actual differentiator. A discovery document and implementation spec predate the code, recording scope, non-goals, and resolved decisions. Capture is deliberate, never automatic: everything enters via an explicit action, because auto-scanning a laptop indexes a semester's worth of noise. Workspaces are semesters and form a hard isolation boundary; courses are a fixed list set at onboarding. Midway through, a formal architecture self-review produced thirteen prioritized findings — and the code shows the critical ones were then systematically fixed rather than filed away.",
    architecture:
      "A Next.js 15 / React 19 frontend proxies /api/* to a FastAPI backend, so everything runs on one origin. The load-bearing decision is a two-store split: ChromaDB holds embedded chunks (768-dim Gemini vectors, cosine space) and answers exactly one kind of question — similarity — while SQLite holds everything relational: workspaces, courses, ingestion jobs, generation runs, flashcards, conversations, and the knowledge graph. Ingestion runs on background threads as real state machines (queued → running → complete | failed | cancelled) with cooperative cancellation, and a startup orphan sweep fails anything interrupted by a restart. Workspace isolation is enforced at exactly two choke points — one metadata stamp on every vector write, one scope filter on every read — the one invariant the system will not break, verified live by the test suite.",
    decisions: [
      {
        title: "Two Stores, Each for What It's Good At",
        content:
          "ChromaDB answers similarity; SQLite answers everything relational. Rows link to vectors via lists of chunk IDs. The spec explicitly warned against the tempting shortcut of stuffing structured entities into vector-store metadata — questions like 'what's the latest run for this course?' or 'is this deck stale?' are relational queries. Because data lives in the right store, every later feature — staleness detection, auditable runs, provenance, the knowledge graph — became a natural query instead of a hack.",
      },
      {
        title: "Isolation at Choke Points, Not by Convention",
        content:
          "Every chunk written to the vector store is stamped with workspace and course metadata in one function; every query passes through one scope filter that builds the where-clause. One choke point per direction means no new route can silently forget the filter. The contributing guide elevates this to 'the one invariant you must not break,' and a test proves it: cross-workspace searches return nothing.",
      },
      {
        title: "Media Understood, Not Just Embedded",
        content:
          "The biggest quality win in the project's history wasn't a better prompt. Early on, an image was findable via its multimodal embedding, but its chunk text was just a filename placeholder — so a whiteboard photo contributed literally nothing to chat, flashcards, or digests. One additional Gemini vision call at ingest transcribes visible text, equations, and diagram annotations into dense captions that become the chunk text. Every downstream feature became truly multimodal at zero architectural cost.",
      },
      {
        title: "A Layered Relevance Floor",
        content:
          "Empirically, unrelated academic prose sits at cosine 0.4–0.55 and real matches at 0.55–0.8 — the bands overlap, so no single absolute cut separates them. The fix is two layers: an absolute floor below which a hit is noise regardless of context, and a relative floor at 0.72× the top hit that drops the off-course tag-along while keeping uniformly strong result sets. When nothing survives, chat refuses honestly — 'capture some notes on it first' — without spending a generation call.",
      },
      {
        title: "Generation as Auditable Runs",
        content:
          "Flashcard generation is a tracked run with a state machine, timestamps, chunk counts, and error messages — not a fire-and-forget call. Model output is validated as JSON before anything is written, a failed run never touches the previous deck, and staleness is a pure data comparison: cards are stale when material changed after the last complete run. The UI renders five designed states — empty, generating, ready, stale, failed — each specified before implementation.",
      },
      {
        title: "Living on the Free Tier",
        content:
          "The whole product must run on Gemini's free tier, because the target user is a student. That constraint produced real engineering: a self-imposed rate limiter deliberately under the upstream caps that raises instead of exiting when quota runs out, selective retries that skip unrecoverable failures, moves that re-tag chunks in place with zero re-embedding, and oversized media that skips caption calls guaranteed to fail. Scarcity shaped the architecture in ways an unlimited key never would have.",
      },
      {
        title: "Fake the Expensive Dependency, Keep Everything Else Real",
        content:
          "The test harness boots the real FastAPI app against real SQLite and real ChromaDB in a temp directory, with every Gemini call replaced by deterministic fakes — so 25 tests run offline in about three seconds while exercising actual storage, scoping, and state machines. The cleverest fake: embeddings are bag-of-words hash vectors calibrated so their score bands mirror the real model's, meaning relevance-floor tests exercise the actual filtering logic rather than a mock of it.",
      },
    ],
    results:
      "The study layer shipped in about a week: roughly 3,300 lines of Python across ten modules and 6,000 lines of TypeScript across 27 components, exposing 40+ REST endpoints over six source types. YouTube lectures are analyzed from their URL without downloading, and citations round-trip to an embedded player that seeks directly to the cited moment. The knowledge graph prunes exactly a capture's contribution on delete and re-colors on move with zero writes, because provenance is stored per-capture. CI runs the offline suite, a type check, and a production build on every push. The project is MIT-licensed with its remaining findings published as a contribution backlog.",
    learnings:
      "Decide where data lives before writing features — the two-store split made everything downstream a natural query. Enforce invariants at choke points, not by convention. Model work as records with state machines and you get progress UI, cancellation, crash recovery, and auditability almost for free. In RAG systems the unglamorous half is the product: relevance floors, honest refusals, and citation provenance did more than any generation-side tuning. And when AI writes more of the code, architecture and conceptual integrity become the scarce skill — implementation is becoming cheaper; architecture isn't.",
    nextSteps:
      "Real SSE streaming for chat (the frontend already renders progressive text). Page-aware PDF citations so the viewer jumps to the cited page. A visible 'built from N of M chunks' indicator instead of silent context truncation. One-command export/backup of a semester. Gemini-named gap-view clusters in place of keyword labels. Focus traps and full keyboard navigation for accessibility. Docker packaging.",
  },
  "bigquery-rerun-manager": {
    ...projects.find((p) => p.slug === "bigquery-rerun-manager")!,
    deck: "A production-oriented, metadata-driven system for executing and re-running grouped BigQuery queries using Docker and Kubernetes.",
    role: "Lead Data Engineer",
    timeline: "4 months",
    team: "Solo project",
    github: "https://github.com/vanshsinhaa/bigquery_rerun_manager",
    metrics: [
      { label: "Queries/day", value: "500+" },
      { label: "Avg execution time", value: "<30s" },
      { label: "Success rate", value: "98.5%" },
    ],
    overview:
      "Built a production-grade system for managing BigQuery query execution and re-runs. Queries are stored as metadata in BigQuery, executed via Dockerized Python applications, and orchestrated using Kubernetes Jobs. All executions are logged back to BigQuery for full observability and auditability.",
    problemDetails:
      "In production analytics pipelines, BigQuery queries often fail due to upstream data issues, schema changes, or transient errors. Re-running queries manually was error-prone, hard to audit, and difficult to scale across multiple query groups. There was no lightweight, metadata-driven mechanism to safely re-execute grouped queries with proper logging and traceability.",
    approach:
      "Designed a cloud-native system that executes grouped BigQuery queries using metadata stored in BigQuery. Built as a Dockerized Python application deployed via Kubernetes Jobs/CronJobs. All execution status, errors, and timestamps are logged back to BigQuery for full observability. Queries are defined dynamically via metadata tables, allowing updates without code changes.",
    architecture:
      "Kubernetes Jobs trigger Docker containers running Python apps → Read query metadata from BigQuery → Execute SQL queries sequentially → Log all results (success/failure, timestamps, errors) back to BigQuery execution log table. Service account authentication ensures security.",
    decisions: [
      {
        title: "Metadata-Driven Execution",
        content:
          "Stored queries in BigQuery instead of code to allow dynamic updates without redeployments. This enabled data teams to modify queries without waiting for infrastructure changes, significantly improving iteration speed.",
      },
      {
        title: "Kubernetes Jobs over Long-Running Services",
        content:
          "Chose Jobs over persistent services for isolation, retry semantics, and cost efficiency. Batch workloads don't need always-running infrastructure, and K8s Jobs provide automatic cleanup and resource management.",
      },
      {
        title: "BigQuery as Single Source of Truth",
        content:
          "Both query definitions and execution logs live in BigQuery for consistency and auditability. This eliminated the need for external databases and made debugging significantly easier with SQL-based analysis of execution history.",
      },
      {
        title: "Idempotency by Design",
        content:
          "Ensured queries can be safely re-run without corrupting metadata or creating duplicates. Added execution timestamps and query fingerprints to track reruns while maintaining data integrity.",
      },
    ],
    results:
      "Eliminated manual query re-runs saving ~10 hours/week of engineering time. Achieved 98.5% success rate with automatic error logging. Reduced mean time to recovery from 2 hours to 15 minutes through better visibility. Query groups now scale independently via separate Kubernetes jobs.",
    learnings:
      "Metadata-driven systems provide incredible flexibility but require careful schema design. Kubernetes Jobs are perfect for batch workloads—simpler than full orchestration frameworks for focused use cases. Logging everything to BigQuery made debugging trivial and enabled data-driven optimization of query patterns.",
    nextSteps:
      "Add Slack alerting on failures, implement retry policies per query, enable parallel execution for large query groups, build a simple UI dashboard for execution history, and integrate with Airflow for complex DAG dependencies.",
  },
  "2026-portfolio": {
    ...projects.find((p) => p.slug === "2026-portfolio")!,
    deck: "A modern, brand-first portfolio featuring fluid page transitions, gradient-driven visuals, and a bold blue identity.",
    role: "Full-Stack Developer & Designer",
    timeline: "3 weeks",
    team: "Solo project",
    metrics: [
      { label: "Performance", value: "98/100" },
      { label: "Accessibility", value: "100/100" },
      { label: "Best Practices", value: "96/100" },
      { label: "SEO", value: "100/100" },
    ],
    overview:
      "Built a high-impact portfolio that showcases technical skills while emphasizing design craft. Every interaction, from the magnetic text effects to the fluid page transitions, demonstrates attention to detail and modern web capabilities.",
    problemDetails:
      "Standard developer portfolios often look generic or overly technical. Needed a site that would stand out visually while maintaining credibility as a data engineer and full-stack developer. The challenge was balancing personality with professionalism.",
    approach:
      "Started with brand identity—chose a bold blue as the signature color that would carry throughout the experience. Built the site iteratively, adding layers of polish with each pass. Focused on interactions that feel natural and purposeful, not flashy for the sake of it.",
    architecture:
      "Modern React-based stack with static generation for optimal performance. Animation library handles smooth transitions with spring physics. Gradient covers are generated entirely in CSS so nothing waits on image downloads. Deployed with edge functions and analytics.",
    decisions: [
      {
        title: "Brand-First Design",
        content:
          "Chose a signature color and applied it consistently across every touchpoint—buttons, hover states, selections, and accents. This creates a cohesive identity that's memorable and professional.",
      },
      {
        title: "Fluid Page Transitions",
        content:
          "Routes cross-fade with subtle motion instead of hard cuts, so moving through the site feels continuous. Exit and enter states are choreographed with the same easing curve for a natural, app-like flow.",
      },
      {
        title: "CSS Gradients over Images",
        content:
          "Replaced photographic card covers with layered CSS gradients and an inline grain texture. Cards render instantly with zero network requests, and each project gets its own generated palette.",
      },
      {
        title: "Interactive Elements",
        content:
          "Added subtle hover effects to buttons and cards that make the site feel alive without being distracting. Each interaction uses physics-based motion for a natural feel.",
      },
      {
        title: "Mobile-First Navigation",
        content:
          "Designed a navigation system that works elegantly on any screen size. The approach prevents text collision while maintaining a unique, branded experience.",
      },
      {
        title: "Typography System",
        content:
          "Chose custom fonts that balance personality with legibility. Headings feel modern and confident, while body text prioritizes readability for longer case studies.",
      },
    ],
    results:
      "Created a portfolio that gets noticed. The site delivers smooth animations and excellent performance scores. Instant-loading gradient covers make it memorable without sacrificing speed. The blue brand identity is consistent across every touchpoint.",
    learnings:
      "Small details compound into big impressions. Fluid transitions, thoughtful animations, and consistent color usage transform a standard portfolio into something memorable. Performance and aesthetics aren't trade-offs—with proper optimization, you can have both.",
    nextSteps:
      "Grow the blog with more engineering write-ups. Implement view transitions API when it's more widely supported. Create more case studies with interactive demos. Consider adding a 'uses' page showing tools and setup.",
  },
};
