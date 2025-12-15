export interface Project {
  slug: string;
  title: string;
  problem: string;
  stack: string[];
  metric?: string;
  featured?: boolean;
  category: "data-engineering" | "full-stack" | "infrastructure";
  year: string;
  image?: string;
  gradient?: string;
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
    image: "/image-mesh-gradient (1).png",
    gradient: "from-blue-600/20 via-indigo-500/20 to-purple-600/20",
  },
  {
    slug: "k8s-query-runner",
    title: "Kubernetes Query Runner",
    problem: "Automated BigQuery job orchestration",
    stack: ["Kubernetes", "BigQuery", "Python", "Docker"],
    metric: "99.9% uptime",
    featured: false,
    category: "infrastructure",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&q=80",
    gradient: "from-cyan-500/20 via-blue-500/20 to-indigo-500/20",
  },
  {
    slug: "2026-portfolio",
    title: "2026 Portfolio",
    problem:
      "Modern portfolio with cinematic animations and brand-first design",
    stack: ["Next.js", "Framer Motion", "TypeScript", "Tailwind"],
    metric: "95+ Lighthouse",
    featured: true,
    category: "full-stack",
    year: "2025",
    image: "/image-mesh-gradient.png",
    gradient: "from-violet-500/20 via-purple-500/20 to-fuchsia-500/20",
  },
  {
    slug: "deepdive",
    title: "DeepDive — In Progress",
    problem:
      "Full-stack monorepo with search, filtering, and production-ready deployment",
    stack: ["Next.js", "FastAPI", "Docker", "Railway", "Python"],
    metric: "Production-minded",
    featured: true,
    category: "full-stack",
    year: "2025",
    image: "/image-mesh-gradient (2).png",
    gradient: "from-emerald-500/20 via-teal-500/20 to-cyan-500/20",
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
  "pubsub-to-bigquery": {
    ...projects[0],
    deck: "Building a resilient real-time event pipeline to handle millions of daily events with sub-second latency.",
    role: "Lead Data Engineer",
    timeline: "3 months",
    team: "2 engineers, 1 PM",
    metrics: [
      { label: "Events/day", value: "10M+" },
      { label: "Latency", value: "<500ms" },
      { label: "Cost reduction", value: "40%" },
    ],
    overview:
      "Designed and implemented a real-time event streaming pipeline from Google Cloud Pub/Sub to BigQuery, processing over 10 million events daily with sub-second latency.",
    problemDetails:
      "The existing batch processing system had a 4-hour delay and couldn't scale to handle peak traffic. Analytics teams needed real-time insights for operational decisions.",
    approach:
      "Implemented a streaming architecture using Cloud Functions to consume Pub/Sub messages, transform data, and batch-write to BigQuery. Added dead-letter queues and retry logic for resilience.",
    architecture:
      "Event producers → Pub/Sub topics → Cloud Functions (processing layer) → BigQuery streaming inserts → Dashboard queries",
    decisions: [
      {
        title: "Why Cloud Functions over Dataflow?",
        content:
          "Cloud Functions provided simpler deployment, lower cost at our scale, and easier debugging. Dataflow would be overkill for our transformation logic.",
      },
      {
        title: "Batch insertion strategy",
        content:
          "Implemented micro-batching (100 events per insert) to balance latency and BigQuery streaming quota costs.",
      },
      {
        title: "Error handling approach",
        content:
          "Used dead-letter topics for failed events, with automated alerts and a retry mechanism that exponentially backs off.",
      },
    ],
    results:
      "Reduced data latency from 4 hours to under 500ms. Cut infrastructure costs by 40% compared to the previous system. Enabled 3 new real-time dashboards for operations.",
    learnings:
      "Stream processing requires different thinking than batch. Observability is crucial—we added extensive logging and monitoring early. Start simple and optimize based on actual traffic patterns.",
    nextSteps:
      "Add schema validation layer, implement data quality checks, and explore using BigQuery Storage Write API for even better performance.",
  },
  "k8s-query-runner": {
    ...projects[1],
    deck: "A Kubernetes-native job orchestration system for running scheduled BigQuery analytics at scale.",
    role: "Infrastructure Engineer",
    timeline: "4 months",
    team: "3 engineers",
    metrics: [
      { label: "Uptime", value: "99.9%" },
      { label: "Jobs/day", value: "500+" },
      { label: "Cost savings", value: "35%" },
    ],
    overview:
      "Built a robust Kubernetes-based system to schedule and execute BigQuery queries, replacing a fragile cron-based solution with proper orchestration, monitoring, and error handling.",
    problemDetails:
      "Legacy cron jobs were running on a single VM with no failover, no proper monitoring, and manual intervention required for failures. Scaling was difficult and costly.",
    approach:
      "Containerized query runners and deployed them to GKE using CronJobs. Implemented a controller pattern for job lifecycle management with automatic retries and alerting.",
    architecture:
      "Kubernetes CronJobs → Query Runner Pods → BigQuery API → Result storage (GCS) → Notification system",
    decisions: [
      {
        title: "Kubernetes over managed solutions",
        content:
          "Chose Kubernetes for flexibility and control over job execution. Managed solutions like Cloud Scheduler + Cloud Run couldn't handle our complex dependencies.",
      },
      {
        title: "Container optimization",
        content:
          "Used multi-stage Docker builds and cached dependencies to reduce image size from 1.2GB to 180MB, speeding up pod startup times.",
      },
      {
        title: "Monitoring strategy",
        content:
          "Integrated Prometheus for metrics and Grafana for visualization. Set up PagerDuty alerts for critical job failures.",
      },
    ],
    results:
      "Achieved 99.9% uptime with automatic failover. Reduced infrastructure costs by 35% through better resource utilization. Decreased manual intervention by 90%.",
    learnings:
      "Kubernetes adds complexity but pays off at scale. Invest in observability from day one. Make jobs idempotent—retries will happen.",
    nextSteps:
      "Add dynamic resource allocation based on query complexity, implement job priority queues, and explore using Argo Workflows for complex DAGs.",
  },
  "2026-portfolio": {
    ...projects.find((p) => p.slug === "2026-portfolio")!,
    deck: "A modern, brand-first portfolio featuring cinematic animations, custom cursor interactions, and a bold blue identity.",
    role: "Full-Stack Developer & Designer",
    timeline: "3 weeks",
    team: "Solo project",
    metrics: [
      { label: "Lighthouse", value: "95+" },
      { label: "Animations", value: "60fps" },
      { label: "Custom Features", value: "10+" },
    ],
    overview:
      "Built a high-impact portfolio that showcases technical skills while emphasizing design craft. Every interaction, from the magnetic text effects to the parallax hero, demonstrates attention to detail and modern web capabilities.",
    problemDetails:
      "Standard developer portfolios often look generic or overly technical. Needed a site that would stand out visually while maintaining credibility as a data engineer and full-stack developer. The challenge was balancing personality with professionalism.",
    approach:
      "Started with brand identity—chose a bold blue as the signature color that would carry throughout the experience. Built the site iteratively, adding layers of polish with each pass. Focused on interactions that feel natural and purposeful, not flashy for the sake of it.",
    architecture:
      "Modern React-based stack with static generation for optimal performance. Animation library handles smooth transitions with spring physics. Custom cursor implementation for unique identity. Deployed with edge functions and analytics.",
    decisions: [
      {
        title: "Brand-First Design",
        content:
          "Chose a signature color and applied it consistently across every touchpoint—buttons, hover states, selections, and accents. This creates a cohesive identity that's memorable and professional.",
      },
      {
        title: "Custom Cursor",
        content:
          "Replaced the default pointer with a custom design that reinforces the brand. This small detail makes the entire experience feel more polished and intentional.",
      },
      {
        title: "Interactive Elements",
        content:
          "Added subtle hover effects to buttons and cards that make the site feel alive without being distracting. Each interaction uses physics-based motion for a natural feel.",
      },
      {
        title: "Layered Depth",
        content:
          "Implemented depth effects throughout—the hero section creates a sense of space, and transitions between sections feel cinematic rather than abrupt.",
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
      "Created a portfolio that gets noticed. The site scores 95+ on Lighthouse while delivering smooth 60fps animations. Custom interactions make it memorable without sacrificing performance. The blue brand identity is consistent across every touchpoint.",
    learnings:
      "Small details compound into big impressions. A custom cursor, thoughtful animations, and consistent color usage transform a standard portfolio into something memorable. Performance and aesthetics aren't trade-offs—with proper optimization, you can have both.",
    nextSteps:
      "Add blog integration with MDX for technical writing. Implement view transitions API when it's more widely supported. Create more case studies with interactive demos. Consider adding a 'uses' page showing tools and setup.",
  },
  deepdive: {
    ...projects.find((p) => p.slug === "deepdive")!,
    deck: "A production-minded, full-stack monorepo platform with Next.js frontend and FastAPI backend, built for fast search, reliable filtering, and maintainable deployment.",
    role: "Full-Stack Engineer",
    timeline: "In Progress",
    team: "Solo Project",
    metrics: [
      { label: "Monorepo Structure", value: "Clean Separation" },
      { label: "Search Latency", value: "<200ms" },
      { label: "Deployment", value: "Railway + Docker" },
    ],
    overview:
      "DeepDive is a full-stack web platform built to provide fast, consistent search and browsing experience over a curated dataset. The project emphasizes production-quality code, clean architecture, and operational excellence from day one.",
    problemDetails:
      "Discovery and navigation across growing datasets becomes painful without consistent search, reliable filtering, a stable backend API, and proper deployment infrastructure. Most early-stage projects sacrifice production quality for speed, leading to technical debt and reliability issues.",
    approach:
      "Built as a monorepo with clear frontend/backend separation. Next.js provides the user interface with responsive design and optimal UX states. FastAPI powers the backend with typed endpoints, validation, and structured JSON responses. Docker ensures environment consistency, while Railway handles deployment.",
    architecture:
      "Next.js Frontend (apps/frontend) → FastAPI Backend (apps/api) → Database. The frontend communicates with the backend via HTTP REST API. Vercel Analytics tracks usage patterns for data-driven product decisions. All configuration is environment-based with no secrets in the repository.",
    architectureDiagrams: [
      {
        title: "High-Level Architecture",
        src: "/deepdive_prd/Next.js FastAPI Full Stack-2025-12-15-150632.svg",
        alt: "High-Level Architecture showing Next.js Frontend, FastAPI Backend, Database, and Vercel Analytics",
      },
      {
        title: "Search Flow",
        src: "/deepdive_prd/Next.js FastAPI Full Stack-2025-12-15-150649.svg",
        alt: "Sequence diagram showing user search flow from frontend through API to database",
      },
      {
        title: "Data Model",
        src: "/deepdive_prd/Next.js FastAPI Full Stack-2025-12-15-150757.svg",
        alt: "Entity relationship diagram showing the data model structure",
      },
      {
        title: "Deployment Architecture",
        src: "/deepdive_prd/Next.js FastAPI Full Stack-2025-12-15-150808.svg",
        alt: "Deployment architecture showing Docker and Railway setup",
      },
    ],
    decisions: [
      {
        title: "Monorepo Architecture",
        content:
          "Chose a monorepo structure for cohesive development and consistent CI/deploy flow. This allows sharing types between frontend and backend, unified linting, and coordinated deployments while maintaining clear boundaries.",
      },
      {
        title: "Next.js for Frontend",
        content:
          "Selected Next.js for its excellent performance patterns, built-in optimizations, and developer experience. Server components and app router provide optimal loading strategies while keeping the codebase maintainable.",
      },
      {
        title: "FastAPI for Backend",
        content:
          "FastAPI offers automatic API documentation, request validation with Pydantic, and excellent async support. Type hints throughout the codebase catch errors early and make refactoring safer.",
      },
      {
        title: "Docker + Railway Deployment",
        content:
          "Docker provides environment consistency across development and production. Railway simplifies deployment while maintaining control over infrastructure. This combination enables reliable, repeatable deploys.",
      },
      {
        title: "Analytics-First Approach",
        content:
          "Integrated Vercel Analytics from the start to make product decisions based on real usage data rather than assumptions. Understanding user behavior drives feature prioritization.",
      },
    ],
    results:
      "Built a production-ready platform with clean frontend/backend separation, fast search responses, and reliable deployment infrastructure. The codebase follows security best practices with environment-based configuration and no hardcoded secrets.",
    learnings:
      "Starting with production quality doesn't slow you down—it prevents painful rewrites later. Clear API contracts between frontend and backend enable parallel development. Docker adds minimal overhead but eliminates 'works on my machine' issues.",
    nextSteps:
      "Implement authentication and admin-only management features. Add advanced filtering with tags, categories, and facets. Improve search ranking algorithms. Set up monitoring and alerting for API errors and performance degradation.",
  },
};

export const writingPosts = [
  {
    slug: "bigquery-optimization",
    title: "BigQuery Cost Optimization Patterns",
    excerpt: "Five patterns that saved us $10K/month in BigQuery costs",
    date: "2024-03-15",
  },
  {
    slug: "k8s-reliability",
    title: "Building Reliable Kubernetes Jobs",
    excerpt: "Lessons from running 10,000+ production jobs",
    date: "2024-02-20",
  },
  {
    slug: "streaming-architectures",
    title: "When to Stream vs Batch",
    excerpt: "A practical guide to choosing the right data pipeline pattern",
    date: "2024-01-10",
  },
];
