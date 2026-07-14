"use client";

import { Button } from "@/components/ui/button";
import { NowRow } from "@/components/now-row";
import { ProjectCard } from "@/components/project-card";
import { UnicornScene } from "@/components/unicorn-scene";
import { MagneticText } from "@/components/ui/magnetic-text";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { BlogCard } from "@/components/blog-card";
import { projects } from "@/lib/projects-data";
import { blogPosts } from "@/lib/blog-data";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { TechCarousel } from "@/components/tech-carousel";
import { useRef } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

function SectionHeader({
  overline,
  title,
  description,
  cta,
}: {
  overline: string;
  title: string;
  description: string;
  cta?: { href: string; label: string };
}) {
  return (
    <div className="flex items-end justify-between gap-6">
      <div>
        <div className="flex items-center gap-3">
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
            className="h-px w-10 origin-left bg-[#3b0dd4]"
          />
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#3b0dd4]">
            {overline}
          </span>
        </div>
        <h2 className="mt-5 font-favorit text-4xl font-normal tracking-tight md:text-5xl lg:text-6xl">
          {title}
        </h2>
        <p className="mt-3 text-lg text-muted-foreground">{description}</p>
      </div>
      {cta && (
        <Button
          asChild
          variant="ghost"
          className="hidden shrink-0 hover:text-[#3b0dd4] transition-colors md:flex"
        >
          <Link href={cta.href}>
            {cta.label}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      )}
    </div>
  );
}

export default function HomePage() {
  const featuredProjects = projects.filter((p) => p.featured);
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 0.5, 0]);

  return (
    <>
      {/* Hero Section with Gradient Animation */}
      <section
        ref={heroRef}
        id="hero-section"
        className="relative overflow-hidden border-b border-border/40 min-h-screen flex items-center bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700"
        style={{ overflow: "hidden" }}
      >
        {/* Fallback gradient (shows while Unicorn loads) — pure CSS, with parallax */}
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 20% 20%, rgba(139, 92, 246, 0.9) 0%, rgba(139, 92, 246, 0) 55%), radial-gradient(90% 80% at 85% 15%, rgba(59, 130, 246, 0.8) 0%, rgba(59, 130, 246, 0) 55%), radial-gradient(110% 110% at 70% 90%, rgba(59, 13, 212, 0.95) 0%, rgba(59, 13, 212, 0) 65%), linear-gradient(135deg, #1e0b3d 0%, #12104a 100%)",
            y,
          }}
        />

        {/* Unicorn gradient animation background - with parallax */}
        <motion.div
          className="absolute inset-0 -m-4 overflow-hidden"
          style={{
            y,
            clipPath: "inset(0 0 0 0)", // Force clipping
          }}
        >
          <UnicornScene
            projectId="5m4NwpaMZIbtykKVZJ8L"
            width={1920}
            height={1200}
            dpi={0.6}
            lazy={true}
            production={true}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] min-w-full min-h-[115%] object-cover"
          />
        </motion.div>

        {/* Hero content - text over gradient - with fade on scroll */}
        <motion.div
          className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-20"
          style={{ opacity }}
        >
          <div className="max-w-5xl">
            {/* Creative role badge - fades in from top */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.1 }}
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-[#3b0dd4]/30 bg-[#3b0dd4]/10 backdrop-blur-sm"
            >
              <div className="h-2 w-2 rounded-full bg-white animate-pulse shadow-lg shadow-white/80" />
              <span className="text-sm font-medium text-white tracking-wide">
                Available for opportunities
              </span>
            </motion.div>

            {/* Name with magnetic hover effect - slides in from left */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease, delay: 0.3 }}
              className="mb-8"
            >
              <MagneticText
                text="Vansh Sinha"
                hoverText="Let's Build"
                textClassName="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-normal tracking-tight leading-[0.9]"
                className="cursor-pointer"
                style={{ fontFamily: "var(--font-favorit)" }}
              />
            </motion.div>

            {/* Subtitle - slides in from right */}
            <motion.p
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.6 }}
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/70 font-light max-w-3xl leading-relaxed"
            >
              Data engineer & full-stack developer building scalable systems
              that process millions of events.
            </motion.p>

            {/* CTAs - slide up from bottom */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.9 }}
              className="mt-12 flex flex-wrap gap-4"
            >
              <MagneticButton strength={0.25} range={30}>
                <Button
                  asChild
                  size="lg"
                  className="bg-[#3b0dd4] text-white hover:bg-[#2a0ba0] pl-8 pr-6 sm:pl-12 sm:pr-8 py-4 sm:py-6 text-base sm:text-lg font-medium rounded-full shadow-2xl shadow-[#3b0dd4]/30 hover:shadow-[#3b0dd4]/50 hover:scale-105 transition-all"
                >
                  <Link
                    href="/work"
                    className="flex items-center justify-center"
                  >
                    View Work
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </MagneticButton>
              <MagneticButton strength={0.25} range={30}>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-2 border-white/60 bg-white/10 text-white hover:bg-white/20 hover:border-white/80 px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-medium rounded-full backdrop-blur-sm hover:scale-105 transition-transform"
                >
                  <Link href="/contact">Contact</Link>
                </Button>
              </MagneticButton>
            </motion.div>

            {/* Now row - fades in from bottom */}
            <motion.div
              className="mt-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease, delay: 1.2 }}
            >
              <NowRow />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Selected Work */}
      <section className="border-b border-border/40 py-20 sm:py-28 bg-background">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <SectionHeader
              overline={`${String(featuredProjects.length).padStart(2, "0")} Projects — 2026`}
              title="Selected Work"
              description="From data pipelines at scale to brand-first product design"
              cta={{ href: "/work", label: "View all" }}
            />

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {featuredProjects.map((project, index) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  index={index}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Writing */}
      <section className="border-b border-border/40 py-20 sm:py-28">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <SectionHeader
              overline="From the Blog"
              title="Writing"
              description="Notes on retrieval, memory, and building with AI"
              cta={{ href: "/blog", label: "All writing" }}
            />

            <div className="mt-12">
              <BlogCard post={blogPosts[0]} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Technologies */}
      <section className="border-b border-border/40 py-20 sm:py-28">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <SectionHeader
              overline="Toolbox"
              title="Technologies"
              description="Tools and frameworks I work with"
            />

            <div className="mt-12">
              <TechCarousel />
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
