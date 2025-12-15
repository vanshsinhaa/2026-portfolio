"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/projects-data";
import { useRef } from "react";

interface ProjectCardProps {
  project: Project;
  index?: number;
  size?: "default" | "large";
}

export function ProjectCard({
  project,
  index = 0,
  size = "default",
}: ProjectCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 200, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 200, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Varied entrance directions based on index
  const getInitialAnimation = () => {
    const variants = [
      { opacity: 0, x: -50, y: 0 }, // From left
      { opacity: 0, x: 50, y: 0 }, // From right
      { opacity: 0, x: 0, y: 50 }, // From bottom
      { opacity: 0, scale: 0.8 }, // Scale up
    ];
    return variants[index % variants.length];
  };

  return (
    <motion.div
      ref={ref}
      initial={getInitialAnimation()}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(size === "large" && "md:col-span-2")}
    >
      <Link
        href={`/work/${project.slug}`}
        className="group relative block overflow-hidden rounded-xl border border-[#3b0dd4]/20 bg-card transition-all hover:border-[#3b0dd4]/60 hover:shadow-2xl hover:shadow-[#3b0dd4]/20 hover:scale-[1.02]"
      >
        {/* Project Image with Gradient Overlay */}
        {project.image && (
          <div className="relative aspect-16/10 overflow-hidden bg-background">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="transition-transform duration-700 group-hover:scale-110 object-cover"
            />
            {/* Subtle dark overlay on hover only */}
            <div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
        )}

        {/* Content with glassmorphism */}
        <div className="relative p-6 backdrop-blur-sm bg-background/80">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-xl md:text-2xl font-normal text-balance transition-colors group-hover:text-foreground">
                {project.title}
              </h3>
              <p className="mt-2 text-sm md:text-base leading-relaxed text-muted-foreground text-pretty">
                {project.problem}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {project.stack.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full bg-muted/50 backdrop-blur-sm px-3 py-1 text-xs font-medium text-foreground border border-border/40"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {project.metric && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#3b0dd4]/30 bg-[#3b0dd4]/10 backdrop-blur-sm px-4 py-1.5 text-xs font-medium text-[#3b0dd4] group-hover:border-[#3b0dd4]/50 group-hover:bg-[#3b0dd4]/20 transition-colors">
                  {project.metric}
                </div>
              )}
            </div>

            <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[#3b0dd4]" />
          </div>
        </div>

        {/* Accent border glow on hover - brand blue */}
        <div className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none bg-[#3b0dd4]/20 blur-xl -z-10" />
      </Link>
    </motion.div>
  );
}
