"use client"

import { useEffect, useState } from "react"
import { motion, useScroll, useSpring } from "framer-motion"

export function ScrollProgress() {
  const [isVisible, setIsVisible] = useState(false)
  const { scrollYProgress } = useScroll()
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    setIsVisible(!prefersReducedMotion)
  }, [])

  if (!isVisible) return null

  return (
    <motion.div
      className="fixed right-6 top-20 z-50 h-[calc(100vh-6rem)] w-0.5 origin-top bg-border"
      style={{ scaleY }}
    />
  )
}
