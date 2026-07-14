"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollProgress } from "@/components/scroll-progress";
import { noiseTexture } from "@/lib/utils";
import { formatPostDate, type BlogBlock, type BlogPost } from "@/lib/blog-data";

const ease = [0.22, 1, 0.36, 1] as const;

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Block({ block }: { block: BlogBlock }) {
  switch (block.type) {
    case "heading":
      return (
        <Reveal className="mt-16">
          <h2 className="flex items-baseline gap-3 font-favorit text-3xl font-normal tracking-tight md:text-4xl">
            <span className="h-2 w-2 shrink-0 translate-y-[-0.35rem] rounded-full bg-[#3b0dd4]" />
            {block.text}
          </h2>
        </Reveal>
      );
    case "paragraph":
      return (
        <Reveal className="mt-6">
          <p className="text-base leading-relaxed text-foreground/80 text-pretty md:text-lg">
            {block.text}
          </p>
        </Reveal>
      );
    case "list":
      return (
        <Reveal className="mt-6">
          {block.ordered ? (
            <ol className="space-y-3">
              {block.items.map((item, i) => (
                <li key={i} className="flex items-baseline gap-4">
                  <span className="font-mono text-sm text-[#3b0dd4]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-base leading-relaxed text-foreground/80 md:text-lg">
                    {item}
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <ul className="space-y-3">
              {block.items.map((item, i) => (
                <li key={i} className="flex items-baseline gap-4">
                  <span className="text-[#3b0dd4]">—</span>
                  <span className="text-base leading-relaxed text-foreground/80 md:text-lg">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Reveal>
      );
    case "code":
      return (
        <Reveal className="mt-8">
          <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0b0b1a] shadow-2xl shadow-[#3b0dd4]/10">
            <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            </div>
            <pre className="overflow-x-auto p-6 font-mono text-sm leading-loose text-white/90">
              {block.code}
            </pre>
          </div>
        </Reveal>
      );
    case "quote":
      return (
        <Reveal className="my-12">
          <blockquote className="border-l-2 border-[#3b0dd4] pl-6 md:pl-8">
            <p className="font-favorit text-2xl font-normal leading-snug text-foreground md:text-3xl">
              {block.text}
            </p>
          </blockquote>
        </Reveal>
      );
  }
}

export function BlogArticle({ post }: { post: BlogPost }) {
  return (
    <>
      <ScrollProgress />

      {/* Hero */}
      <header className="border-b border-border/40">
        <div className="container mx-auto max-w-3xl px-6 pb-14 pt-16 md:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
              All writing
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <span className="rounded-full border border-[#3b0dd4]/25 bg-[#3b0dd4]/10 px-3 py-1 text-xs font-medium text-[#3b0dd4]">
              {post.category}
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              {formatPostDate(post.date)}
            </span>
            <span className="h-1 w-1 rounded-full bg-[#3b0dd4]" />
            <span className="font-mono text-xs text-muted-foreground">
              {post.readingTime}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16, ease }}
            className="mt-6 font-favorit text-4xl font-normal leading-[1.05] tracking-tight text-balance md:text-6xl"
          >
            {post.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24, ease }}
            className="mt-5 text-lg italic text-muted-foreground md:text-xl"
          >
            {post.subtitle}
          </motion.p>
        </div>
      </header>

      {/* Gradient banner — pure CSS, breathes slowly */}
      <div className="container mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease }}
          className="relative mt-10 h-52 overflow-hidden rounded-3xl border border-border/60 md:h-72"
        >
          <motion.div
            className="absolute inset-0"
            style={{ background: post.gradient }}
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-25 mix-blend-overlay"
            style={{ backgroundImage: noiseTexture }}
          />
          <span
            className="pointer-events-none absolute -bottom-8 left-6 select-none text-[9rem] leading-none text-white/15 md:text-[12rem]"
            style={{ fontFamily: "var(--font-favorit)" }}
          >
            ✳
          </span>
        </motion.div>
      </div>

      {/* Body */}
      <article className="container mx-auto max-w-2xl px-6 py-16 md:py-20">
        {post.content.map((block, i) => (
          <Block key={i} block={block} />
        ))}

        {/* Author / footer */}
        <Reveal className="mt-20">
          <div className="border-t border-border pt-10">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Written by
            </p>
            <p className="mt-2 font-favorit text-xl">Vansh Sinha</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Data engineer & full-stack developer — Tempe, AZ
            </p>
          </div>
        </Reveal>

        <Reveal className="mt-12">
          <Link
            href="/work"
            className="group flex items-center justify-between rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-[#3b0dd4]/40 hover:shadow-lg hover:shadow-[#3b0dd4]/10"
          >
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Keep exploring
              </p>
              <h3 className="mt-2 font-favorit text-2xl font-normal">
                See the work behind the writing
              </h3>
            </div>
            <ArrowRight className="h-6 w-6 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#3b0dd4]" />
          </Link>
        </Reveal>
      </article>
    </>
  );
}
