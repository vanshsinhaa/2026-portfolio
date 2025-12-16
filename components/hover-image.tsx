"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface HoverImageProps {
  text: string
  imageSrc: string
  imageAlt: string
}

export function HoverImage({ text, imageSrc, imageAlt }: HoverImageProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      <span className="underline decoration-[#3b0dd4] decoration-2 underline-offset-4 cursor-pointer hover:decoration-[#2a0ba0] transition-colors">
        {text}
      </span>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
            }}
            className="absolute z-50 pointer-events-none"
            style={{
              left: mousePosition.x + 20,
              top: mousePosition.y - 80,
            }}
          >
            <div className="relative w-48 h-48 rounded-xl overflow-hidden shadow-2xl border-4 border-[#3b0dd4]/20 bg-background">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover"
                sizes="192px"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  )
}

