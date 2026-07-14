"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { ProjectCard } from "@/components/project-card"
import { FilterBar } from "@/components/filter-bar"
import { projects } from "@/lib/projects-data"

export default function WorkPage() {
  const [activeFilter, setActiveFilter] = useState("all")

  const filteredProjects = useMemo(() => {
    let filtered = [...projects]

    // Apply category filter
    if (activeFilter !== "all") {
      filtered = filtered.filter((p) => p.category === activeFilter)
    }

    return filtered
  }, [activeFilter])

  return (
    <div className="container mx-auto max-w-6xl px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-3">
          <span className="h-px w-10 bg-[#3b0dd4]" />
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#3b0dd4]">
            Selected Work — 2026
          </span>
        </div>
        <h1 className="mt-5 font-favorit text-5xl font-normal tracking-tight md:text-6xl">Work</h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Projects spanning data engineering, infrastructure, and full-stack development
        </p>
      </motion.div>

      <div className="mt-12">
        <FilterBar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </div>

      <motion.div layout className="mt-8 grid gap-6 md:grid-cols-2">
        {filteredProjects.map((project, index) => (
          <ProjectCard key={project.slug} project={project} index={index} />
        ))}
      </motion.div>

      {filteredProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-12 text-center text-muted-foreground"
        >
          No projects found for this filter.
        </motion.div>
      )}
    </div>
  )
}
