"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { ProjectCard } from "@/components/project-card"
import { FilterBar } from "@/components/filter-bar"
import { projects } from "@/lib/projects-data"

export default function WorkPage() {
  const [activeFilter, setActiveFilter] = useState("all")
  const [activeSort, setActiveSort] = useState("featured")

  const filteredProjects = useMemo(() => {
    let filtered = [...projects]

    // Apply category filter
    if (activeFilter !== "all") {
      filtered = filtered.filter((p) => p.category === activeFilter)
    }

    // Apply sort
    if (activeSort === "newest") {
      filtered.sort((a, b) => b.year.localeCompare(a.year))
    } else {
      // Featured sort (default order with featured first)
      filtered.sort((a, b) => {
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        return 0
      })
    }

    return filtered
  }, [activeFilter, activeSort])

  return (
    <div className="container mx-auto max-w-6xl px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="font-favorit text-5xl font-normal tracking-tight md:text-6xl">Work</h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Projects spanning data engineering, infrastructure, and full-stack development
        </p>
      </motion.div>

      <div className="mt-12">
        <FilterBar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          activeSort={activeSort}
          onSortChange={setActiveSort}
        />
      </div>

      <motion.div layout className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
