"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface CaseStudyNavProps {
  sections: { id: string; label: string }[]
}

export function CaseStudyNav({ sections }: CaseStudyNavProps) {
  const [activeSection, setActiveSection] = useState("")

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section.id)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id)
            break
          }
        }
      }
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [sections])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      element.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      })
    }
  }

  return (
    <nav className="border-b border-border bg-background">
      <div className="container mx-auto max-w-4xl px-6">
        <div className="flex gap-6 overflow-x-auto py-4">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={cn(
                "whitespace-nowrap text-sm font-medium transition-colors",
                activeSection === section.id ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
