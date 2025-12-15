"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

export function CinematicTransition() {
  const ref = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  // Letterbox bars grow from 0 to 50vh (covering top and bottom)
  const letterboxHeight = useTransform(scrollYProgress, [0.2, 0.5], ["0vh", "50vh"])
  
  // Fade out letterbox bars after the transition
  const letterboxOpacity = useTransform(scrollYProgress, [0.5, 0.7], [1, 0])
  
  // Scale and fade the transition text
  const textOpacity = useTransform(scrollYProgress, [0.3, 0.5, 0.6], [0, 1, 0])
  const textScale = useTransform(scrollYProgress, [0.3, 0.5, 0.6], [0.8, 1, 1.1])

  return (
    <div ref={ref} className="relative h-[200vh]">
      {/* Fixed container for the cinematic effect */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        
        {/* Top letterbox bar */}
        <motion.div
          className="absolute top-0 left-0 right-0 bg-black z-50"
          style={{
            height: letterboxHeight,
            opacity: letterboxOpacity,
          }}
        />
        
        {/* Bottom letterbox bar */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-black z-50"
          style={{
            height: letterboxHeight,
            opacity: letterboxOpacity,
          }}
        />

        {/* Cinematic text in the middle */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none"
          style={{
            opacity: textOpacity,
            scale: textScale,
          }}
        >
          <div className="text-center">
            <h2 
              className="text-4xl md:text-6xl lg:text-7xl font-normal text-white tracking-tight"
              style={{ fontFamily: 'var(--font-favorit)' }}
            >
              Selected Work
            </h2>
            <div className="mt-4 flex items-center justify-center gap-3">
              <div className="h-px w-12 bg-white/40" />
              <span className="text-sm text-white/60 uppercase tracking-widest">2025</span>
              <div className="h-px w-12 bg-white/40" />
            </div>
          </div>
        </motion.div>

        {/* Background gradient that darkens during transition */}
        <motion.div
          className="absolute inset-0 bg-black z-30"
          style={{
            opacity: useTransform(scrollYProgress, [0.2, 0.5, 0.7], [0, 1, 0]),
          }}
        />
      </div>
    </div>
  )
}

