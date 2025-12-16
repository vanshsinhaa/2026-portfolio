"use client";

import { Button } from "@/components/ui/button";
import { NowRow } from "@/components/now-row";
import { ProjectCard } from "@/components/project-card";
import { UnicornScene } from "@/components/unicorn-scene";
import { MagneticText } from "@/components/ui/magnetic-text";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { CinematicTransition } from "@/components/cinematic-transition";
import { projects } from "@/lib/projects-data";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { TechCarousel } from "@/components/tech-carousel";
import Image from "next/image";
import { useRef } from "react";

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
        {/* Fallback gradient (shows while Unicorn loads) - with parallax */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url(/image-mesh-gradient.png)",
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
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.1,
              }}
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
              transition={{
                duration: 1,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.3,
              }}
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
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.6,
              }}
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/70 font-light max-w-3xl leading-relaxed"
            >
              Data engineer & full-stack developer building scalable systems
              that process millions of events.
            </motion.p>

            {/* CTAs - slide up from bottom */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.9,
              }}
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
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                delay: 1.2,
              }}
            >
              <NowRow />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Cinematic Transition */}
      <CinematicTransition />

      {/* Featured Work */}
      <section className="border-b border-border/40 py-16 sm:py-24 bg-background">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-end justify-between">
              <div>
                <h2 className="font-favorit text-4xl font-normal tracking-tight md:text-5xl lg:text-6xl">
                  Featured Work
                </h2>
                <p className="mt-3 text-lg text-muted-foreground">
                  Selected projects from data engineering to full-stack
                </p>
              </div>
              <Button
                asChild
                variant="ghost"
                className="hidden md:flex hover:text-[#3b0dd4] transition-colors"
              >
                <Link href="/work">
                  View all
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Bento Grid Layout */}
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {featuredProjects.map((project, index) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  index={index}
                  size={index === 0 ? "large" : "default"}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Writing */}
      <section className="border-b border-border/40 py-16 sm:py-24">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-favorit text-4xl font-normal tracking-tight md:text-5xl lg:text-6xl">
              Writing
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Technical notes on data engineering and infrastructure
            </p>

            <div className="mt-12 flex items-center justify-center">
              <div className="rounded-lg border border-border bg-muted/30 px-12 py-16 text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground">
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
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  Coming Soon
                </div>
                <p className="mt-4 text-muted-foreground max-w-md">
                  I'm working on technical articles about data engineering,
                  cloud infrastructure, and building scalable systems. Check
                  back soon!
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Technologies */}
      <section className="border-b border-border/40 py-16 sm:py-24">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-favorit text-4xl font-normal tracking-tight md:text-5xl lg:text-6xl">
              Technologies
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Tools and frameworks I work with
            </p>

            <div className="mt-12">
              <TechCarousel />
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
