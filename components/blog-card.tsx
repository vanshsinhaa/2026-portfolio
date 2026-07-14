"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { noiseTexture } from "@/lib/utils";
import { formatPostDate, type BlogPost } from "@/lib/blog-data";

interface BlogCardProps {
  post: BlogPost;
  index?: number;
}

export function BlogCard({ post, index = 0 }: BlogCardProps) {
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
      style={{ "--glow": post.glow } as React.CSSProperties}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-[border-color,box-shadow] duration-500 hover:border-[#3b0dd4]/40 hover:shadow-[0_24px_80px_-24px_var(--glow)] md:flex-row"
      >
        {/* Gradient cover — pure CSS, renders instantly */}
        <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto md:w-[42%] md:shrink-0">
          <div
            className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
            style={{ background: post.gradient }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-25 mix-blend-overlay"
            style={{ backgroundImage: noiseTexture }}
          />
          <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full" />

          <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium tracking-wide text-white/90 backdrop-blur-sm">
            {post.category}
          </span>

          {/* Ghost glyph */}
          <span
            className="pointer-events-none absolute -bottom-6 left-4 select-none text-[7rem] leading-none text-white/15 transition-colors duration-500 group-hover:text-white/25"
            style={{ fontFamily: "var(--font-favorit)" }}
          >
            ✳
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-6 md:p-8">
          <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
            <span>{formatPostDate(post.date)}</span>
            <span className="h-1 w-1 rounded-full bg-[#3b0dd4]" />
            <span>{post.readingTime}</span>
          </div>

          <h3 className="mt-4 font-favorit text-2xl font-normal leading-tight text-balance md:text-3xl">
            {post.title}
          </h3>
          <p className="mt-2 text-sm italic text-muted-foreground md:text-base">
            {post.subtitle}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground text-pretty md:text-base">
            {post.excerpt}
          </p>

          <div className="mt-auto flex items-center gap-2 pt-6 text-sm font-medium text-[#3b0dd4]">
            <span className="relative">
              Read article
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#3b0dd4] transition-all duration-300 group-hover:w-full" />
            </span>
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
