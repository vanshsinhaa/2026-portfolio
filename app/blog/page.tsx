"use client";

import { motion } from "framer-motion";
import { BlogCard } from "@/components/blog-card";
import { blogPosts } from "@/lib/blog-data";

export default function BlogPage() {
  return (
    <div className="container mx-auto max-w-5xl px-6 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-3">
          <span className="h-px w-10 bg-[#3b0dd4]" />
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#3b0dd4]">
            Writing — 2026
          </span>
        </div>
        <h1 className="mt-5 font-favorit text-5xl font-normal tracking-tight md:text-6xl">
          Writing
        </h1>
        <p className="mt-4 max-w-2xl text-xl text-muted-foreground">
          Notes on retrieval, memory, local-first AI, and whatever I'm building
          next.
        </p>
      </motion.div>

      <div className="mt-14 flex flex-col gap-8">
        {blogPosts.map((post, index) => (
          <BlogCard key={post.slug} post={post} index={index} />
        ))}
      </div>
    </div>
  );
}
