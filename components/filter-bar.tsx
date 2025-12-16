"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface FilterBarProps {
  activeFilter: string
  onFilterChange: (filter: string) => void
}

export function FilterBar({ activeFilter, onFilterChange }: FilterBarProps) {
  const filters = [
    { value: "all", label: "All" },
    { value: "data-engineering", label: "Data Engineering" },
    { value: "full-stack", label: "Full Stack" },
    { value: "infrastructure", label: "Infrastructure" },
  ]

  return (
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
  )
}
