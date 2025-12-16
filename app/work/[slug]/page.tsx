import { notFound } from "next/navigation";
import Image from "next/image";
import { caseStudies, projects } from "@/lib/projects-data";
import { MetricChip } from "@/components/metric-chip";
import { CaseStudyNav } from "@/components/case-study-nav";
import { ScrollProgress } from "@/components/scroll-progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const caseStudy = caseStudies[slug];

  if (!caseStudy) {
    notFound();
  }

  const sections = [
    { id: "overview", label: "Overview" },
    { id: "problem", label: "Problem" },
    { id: "approach", label: "Approach" },
    { id: "architecture", label: "Architecture" },
    { id: "decisions", label: "Decisions" },
    { id: "results", label: "Results" },
    { id: "learnings", label: "Learnings" },
  ];

  // Get next project
  const currentIndex = projects.findIndex((p) => p.slug === slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];

  return (
    <>
      <ScrollProgress />

      {/* Hero */}
      <div className="border-b border-border/40">
        <div className="container mx-auto max-w-4xl px-6 py-16 md:py-24">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/work" className="hover:text-foreground">
              Work
            </Link>
            <span>/</span>
            <span>{caseStudy.title}</span>
          </div>

          <h1 className="mt-6 text-5xl font-normal tracking-tight md:text-6xl lg:text-7xl">
            {caseStudy.title}
          </h1>
          <p className="mt-6 text-xl text-muted-foreground leading-relaxed">
            {caseStudy.deck}
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {caseStudy.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-md bg-muted px-3 py-1 text-sm font-medium text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>

          {slug === "bigquery-rerun-manager" && (
            <div className="mt-8">
              <a
                href="https://github.com/vanshsinhaa/bigquery_rerun_manager"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-[#3b0dd4]/30 bg-[#3b0dd4]/10 px-6 py-3 text-sm font-medium text-[#3b0dd4] transition-all hover:border-[#3b0dd4]/60 hover:bg-[#3b0dd4]/20 hover:shadow-lg hover:shadow-[#3b0dd4]/20"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
                View Repository on GitHub
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 7h10v10" />
                  <path d="M7 17 17 7" />
                </svg>
              </a>
            </div>
          )}
        </div>
      </div>

      <CaseStudyNav sections={sections} />

      {/* Content */}
      <article className="container mx-auto max-w-4xl px-6 py-16">
        {/* TL;DR Box */}
        <div className="rounded-lg border border-border bg-muted/30 p-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            TL;DR
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Role
              </p>
              <p className="mt-1 font-medium">{caseStudy.role}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Timeline
              </p>
              <p className="mt-1 font-medium">{caseStudy.timeline}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Team
              </p>
              <p className="mt-1 font-medium">{caseStudy.team}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Year
              </p>
              <p className="mt-1 font-medium">{caseStudy.year}</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {caseStudy.metrics.map((metric) => (
              <MetricChip
                key={metric.label}
                label={metric.label}
                value={metric.value}
                variant="accent"
              />
            ))}
          </div>
        </div>

        {/* Overview */}
        <section id="overview" className="mt-16">
          <h2 className="text-3xl font-normal md:text-4xl">Overview</h2>
          <p className="mt-4 text-base md:text-lg leading-relaxed text-muted-foreground">
            {caseStudy.overview}
          </p>
        </section>

        {/* Problem */}
        <section id="problem" className="mt-16">
          <h2 className="text-3xl font-normal md:text-4xl">Problem</h2>
          <p className="mt-4 text-base md:text-lg leading-relaxed text-muted-foreground">
            {caseStudy.problemDetails}
          </p>
        </section>

        {/* Approach */}
        <section id="approach" className="mt-16">
          <h2 className="text-3xl font-normal md:text-4xl">Approach</h2>
          <p className="mt-4 text-base md:text-lg leading-relaxed text-muted-foreground">
            {caseStudy.approach}
          </p>
        </section>

        {/* Architecture */}
        <section id="architecture" className="mt-16">
          <h2 className="text-3xl font-normal md:text-4xl">Architecture</h2>
          <div className="mt-6 rounded-lg border border-border bg-muted/20 p-8">
            <div className="text-base md:text-lg leading-relaxed text-muted-foreground">
              {caseStudy.architecture}
            </div>

            {slug === "bigquery-rerun-manager" && (
              <div className="mt-8 space-y-8">
                {/* High-Level Architecture */}
                <div>
                  <h3 className="text-lg font-normal mb-4 text-foreground">
                    High-Level Architecture
                  </h3>
                  <div className="rounded-lg border border-border bg-background p-6">
                    <Image
                      src="/bigquery-architecture.svg"
                      alt="BigQuery Rerun Manager Architecture"
                      width={800}
                      height={400}
                      className="w-full h-auto"
                    />
                  </div>
                </div>

                {/* Execution Flow */}
                <div>
                  <h3 className="text-lg font-normal mb-4 text-foreground">
                    Execution Flow
                  </h3>
                  <div className="rounded-lg border border-border bg-background p-6">
                    <Image
                      src="/bigquery-execution-flow.svg"
                      alt="BigQuery Execution Flow Diagram"
                      width={800}
                      height={600}
                      className="w-full h-auto"
                    />
                  </div>
                </div>

                {/* Data Model */}
                <div>
                  <h3 className="text-lg font-normal mb-4 text-foreground">
                    Data Model
                  </h3>
                  <div className="rounded-lg border border-border bg-background p-6">
                    <Image
                      src="/bigquery-data-model.svg"
                      alt="BigQuery Data Model"
                      width={800}
                      height={400}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Key Decisions */}
        <section id="decisions" className="mt-16">
          <h2 className="text-3xl font-normal md:text-4xl">Key Decisions</h2>
          <Accordion type="single" collapsible className="mt-6">
            {caseStudy.decisions.map((decision, index) => (
              <AccordionItem key={index} value={`decision-${index}`}>
                <AccordionTrigger className="text-lg font-semibold">
                  {decision.title}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {decision.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Results */}
        <section id="results" className="mt-16">
          <h2 className="text-3xl font-normal md:text-4xl">Results</h2>
          <p className="mt-4 text-base md:text-lg leading-relaxed text-muted-foreground">
            {caseStudy.results}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {caseStudy.metrics.map((metric) => (
              <MetricChip
                key={metric.label}
                label={metric.label}
                value={metric.value}
              />
            ))}
          </div>
        </section>

        {/* Learnings */}
        <section id="learnings" className="mt-16">
          <h2 className="text-3xl font-normal md:text-4xl">What I Learned</h2>
          <p className="mt-4 text-base md:text-lg leading-relaxed text-muted-foreground">
            {caseStudy.learnings}
          </p>

          <div className="mt-8 rounded-lg border border-border bg-accent/30 p-6">
            <h3 className="font-semibold">What I'd Do Next</h3>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              {caseStudy.nextSteps}
            </p>
          </div>
        </section>

        {/* Next Case Study */}
        <div className="mt-24 border-t border-border pt-12">
          <p className="text-sm uppercase tracking-wider text-muted-foreground">
            Next Case Study
          </p>
          <Link
            href={`/work/${nextProject.slug}`}
            className="group mt-4 flex items-center justify-between rounded-lg border border-border bg-card p-6 transition-all hover:border-foreground/20 hover:shadow-lg"
          >
            <div>
              <h3 className="text-2xl font-normal transition-colors group-hover:text-foreground">
                {nextProject.title}
              </h3>
              <p className="mt-2 text-muted-foreground">
                {nextProject.problem}
              </p>
            </div>
            <ArrowRight className="h-6 w-6 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </article>
    </>
  );
}
