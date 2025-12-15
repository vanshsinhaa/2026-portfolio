"use client"

import type React from "react"

import { useEffect } from "react"

export function TimeThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    const updateTheme = () => {
      const hour = new Date().getHours()
      const root = document.documentElement

      // Morning: 6-11
      // Day: 12-17
      // Evening: 18-21
      // Night: 22-5

      let theme = "day"
      if (hour >= 6 && hour < 12) theme = "morning"
      else if (hour >= 12 && hour < 18) theme = "day"
      else if (hour >= 18 && hour < 22) theme = "evening"
      else theme = "night"

      root.setAttribute("data-time-theme", theme)

      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      if (prefersReducedMotion) {
        root.style.transition = "none"
      } else {
        root.style.transition = "background-color 2s ease, color 2s ease, border-color 2s ease"
      }
    }

    updateTheme()
    const interval = setInterval(updateTheme, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  return <>{children}</>
}
