"use client"

import { useEffect, useRef } from "react"
import { ArrowUpRight } from "lucide-react"

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const requestRef = useRef<number>()

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    let mouseX = 0
    let mouseY = 0

    const updateCursor = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const render = () => {
      if (cursor) {
        cursor.style.transform = `translate(${mouseX - 16}px, ${mouseY - 16}px)`
      }
      requestRef.current = requestAnimationFrame(render)
    }

    const handleMouseEnter = () => {
      if (cursor) cursor.style.opacity = "1"
    }

    const handleMouseLeave = () => {
      if (cursor) cursor.style.opacity = "0"
    }

    window.addEventListener("mousemove", updateCursor)
    document.addEventListener("mouseenter", handleMouseEnter)
    document.addEventListener("mouseleave", handleMouseLeave)
    
    requestRef.current = requestAnimationFrame(render)

    return () => {
      window.removeEventListener("mousemove", updateCursor)
      document.removeEventListener("mouseenter", handleMouseEnter)
      document.removeEventListener("mouseleave", handleMouseLeave)
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed left-0 top-0 z-[9999] mix-blend-difference opacity-0"
      style={{ 
        transform: "translate(-100px, -100px)",
        transition: "none", // Explicitly disable ALL transitions on cursor position
        willChange: "transform", // GPU acceleration hint
        backfaceVisibility: "hidden", // Prevents flickering
      }}
    >
      <ArrowUpRight className="h-8 w-8 text-white" strokeWidth={2.5} />
    </div>
  )
}

