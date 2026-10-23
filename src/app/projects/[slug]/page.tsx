import type { Metadata } from "next";
import type React from "react";
import { notFound } from "next/navigation";
import projects from "@/data/projects.json";
import { CaseBlocks, type Block } from "@/components/CaseBlocks";

// Standalone case-study page for each project: /projects/<slug>.
// Hero = the project's interactive figure (an .html entry in `carousel`);
// any screenshots in `carousel` become a grid under the intro.

type Project = {
  num: string;
  slug: string;
  title: string;
  caseTitle?: string;
  year?: string;
  meta?: string[];
  locked?: boolean;
  noCaseStudy?: boolean;
  carousel?: string[];
  blocks?: Block[];
};

const all = projects as unknown as Project[];
const visible = all.filter((p) => !p.locked && !p.noCaseStudy);
const bySlug = (slug: string) => visible.find((p) => p.slug === slug);
const CID = { "data-scope-main": "" };

export const dynamicParams = false;

export function generateStaticParams() {
  return visible.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = bySlug(slug);
  if (!p) return {};
  const intro = (p.blocks?.[0]?.paragraphs?.[0] || "").replace(/<[^>]+>/g, "");
  const title = `${p.caseTitle || p.title} · Vansh Sinha`;
  return { title, description: intro, openGraph: { title, description: intro } };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = bySlug(slug);
  if (!p) notFound();

  const figure = (p.carousel || []).find((src) => src.endsWith(".html"));
  const shots = (p.carousel || []).filter((src) => !src.endsWith(".html"));
  const blocks = [...(p.blocks || [])];
  if (shots.length) blocks.splice(1, 0, { type: "gallery", layout: "grid", columns: 2, images: shots });

  const i = visible.findIndex((x) => x.slug === p.slug);
  const next = visible[(i + 1) % visible.length];

  return (
    <main className="case-page" {...CID}>
      <nav className="case-page__bar">
        <a className="pill-btn case-page__back" href="/" {...CID}>
          <span aria-hidden="true">←</span>&nbsp;Index
        </a>
        <span className="case-page__num">{p.num}.</span>
      </nav>

      {figure && (
        <section className="case-page__hero" aria-label="Interactive figure">
          <iframe
            src={`${figure}?compact`}
            title={`Interactive figure: ${p.caseTitle || p.title}`}
            scrolling="no"
          />
        </section>
      )}

      <div className="case" id="case" {...CID}>
        <header className="case__head" {...CID}>
          <h1 className="case__title" {...CID}>
            {p.caseTitle || p.title}
          </h1>
          <p className="case__year" {...CID}>
            {p.year}
          </p>
          <div className="case__meta" {...CID}>
            {(p.meta || []).map((m, j) => (
              <p key={j}>{m}</p>
            ))}
          </div>
        </header>
        <CaseBlocks blocks={blocks} />
      </div>

      {next && next.slug !== p.slug && (
        <footer className="case-page__next">
          <span>Next project</span>
          <a href={`/projects/${next.slug}`}>
            {next.caseTitle || next.title} <span aria-hidden="true">→</span>
          </a>
        </footer>
      )}
    </main>
  );
}
