"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface FilterBarProps {
  activeFilter: string
  onFilterChange: (filter: string) => void
  activeSort: string
  onSortChange: (sort: string) => void
}

export function FilterBar({ activeFilter, onFilterChange, activeSort, onSortChange }: FilterBarProps) {
  const filters = [
    { value: "all", label: "All" },
    { value: "data-engineering", label: "Data Engineering" },
    { value: "full-stack", label: "Full Stack" },
    { value: "infrastructure", label: "Infrastructure" },
  ]

  const sorts = [
    { value: "featured", label: "Featured" },
    { value: "newest", label: "Newest" },
  ]

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={cn(
              "relative rounded-md px-4 py-2 text-sm font-medium transition-colors",
              activeFilter === filter.value ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {activeFilter === filter.value && (
              <motion.div
                layoutId="activeFilter"
                className="absolute inset-0 rounded-md border border-border bg-muted"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{filter.label}</span>
          </button>
        ))}
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Sort:</span>
        <select
          value={activeSort}
          onChange={(e) => onSortChange(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {sorts.map((sort) => (
            <option key={sort.value} value={sort.value}>
              {sort.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
