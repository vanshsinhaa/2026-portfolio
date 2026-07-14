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
      "radial-gradient(120% 90% at 15% 20%, rgba(59, 13, 212, 0.95) 0%, rgba(59, 13, 212, 0) 55%), radial-gradient(90% 80% at 85% 12%, rgba(34, 211, 238, 0.7) 0%, rgba(34, 211, 238, 0) 55%), radial-gradient(100% 100% at 78% 88%, rgba(99, 102, 241, 0.85) 0%, rgba(99, 102, 241, 0) 60%), radial-gradient(70% 70% at 28% 92%, rgba(14, 165, 233, 0.55) 0%, rgba(14, 165, 233, 0) 60%), linear-gradient(135deg, #07071d 0%, #12104a 100%)",
    glow: "rgba(79, 70, 229, 0.35)",
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
      "radial-gradient(110% 90% at 18% 22%, rgba(139, 92, 246, 0.9) 0%, rgba(139, 92, 246, 0) 55%), radial-gradient(90% 80% at 85% 15%, rgba(236, 72, 153, 0.6) 0%, rgba(236, 72, 153, 0) 55%), radial-gradient(110% 110% at 72% 90%, rgba(59, 13, 212, 0.9) 0%, rgba(59, 13, 212, 0) 62%), linear-gradient(135deg, #120724 0%, #1e0b3d 100%)",
    glow: "rgba(139, 92, 246, 0.35)",
  },
];

export const caseStudies: Record<string, CaseStudy> = {
  "bigquery-rerun-manager": {
    ...projects[0],
    deck: "A production-oriented, metadata-driven system for executing and re-running grouped BigQuery queries using Docker and Kubernetes.",
    role: "Lead Data Engineer",
    timeline: "4 months",
    team: "Solo project",
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
