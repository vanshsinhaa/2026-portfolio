"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn, noiseTexture } from "@/lib/utils";
import type { Project } from "@/lib/projects-data";

interface ProjectCardProps {
  project: Project;
  index?: number;
  size?: "default" | "large";
}

const categoryLabels: Record<Project["category"], string> = {
  "data-engineering": "Data Engineering",
  "full-stack": "Full Stack",
  infrastructure: "Infrastructure",
};

export function ProjectCard({
  project,
  index = 0,
  size = "default",
}: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.99 }}
      className={cn("h-full", size === "large" && "md:col-span-2")}
      style={{ "--glow": project.glow } as React.CSSProperties}
    >
      <Link
        href={`/work/${project.slug}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-[border-color,box-shadow] duration-500 hover:border-[#3b0dd4]/40 hover:shadow-[0_24px_80px_-24px_var(--glow)]"
      >
        {/* Gradient cover — pure CSS, renders instantly */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <div
            className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
            style={{ background: project.gradient }}
          />
          {/* Grain */}
          <div
            className="pointer-events-none absolute inset-0 opacity-25 mix-blend-overlay"
            style={{ backgroundImage: noiseTexture }}
          />
          {/* Sheen sweep on hover */}
          <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full" />

          {/* Meta chips */}
          <div className="absolute left-4 top-4 flex items-center gap-2">
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium tracking-wide text-white/90 backdrop-blur-sm">
              {categoryLabels[project.category]}
            </span>
          </div>
          <span className="absolute right-4 top-4 font-mono text-xs text-white/60">
            {project.year}
          </span>

          {/* Ghost index numeral */}
          <span
            className="pointer-events-none absolute -bottom-4 left-4 select-none text-[7rem] leading-none text-white/15 transition-colors duration-500 group-hover:text-white/25"
            style={{ fontFamily: "var(--font-favorit)" }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>

          {/* Arrow bubble */}
          <div className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur-sm transition-all duration-500 group-hover:bg-white group-hover:text-[#3b0dd4]">
            <ArrowUpRight className="h-4 w-4 text-white transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#3b0dd4]" />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-6">
          <h3 className="font-favorit text-xl font-normal text-balance md:text-2xl">
            {project.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty md:text-base">
            {project.problem}
          </p>

          <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
            {project.stack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs font-medium text-foreground/80"
              >
                {tech}
              </span>
            ))}
            {project.metric && (
              <span className="ml-auto rounded-full border border-[#3b0dd4]/25 bg-[#3b0dd4]/10 px-3 py-1 text-xs font-medium text-[#3b0dd4] transition-colors duration-300 group-hover:border-[#3b0dd4]/50 group-hover:bg-[#3b0dd4]/15">
                {project.metric}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
