"use client"

import Image from "next/image"
import { motion } from "framer-motion"

const technologies = [
  { name: "Python", logo: "/logos/python-svgrepo-com.svg" },
  { name: "JavaScript", logo: "/logos/java-script-svgrepo-com.svg" },
  { name: "React", logo: "/logos/react-svgrepo-com.svg" },
  { name: "Next.js", logo: "/logos/nextjs-icon-svgrepo-com.svg" },
  { name: "TypeScript", logo: "/logos/typescript-icon-svgrepo-com.svg" },
  { name: "Node.js", logo: "/logos/nodejs-icon-svgrepo-com.svg" },
  { name: "Docker", logo: "/logos/docker-svgrepo-com.svg" },
  { name: "Kubernetes", logo: "/logos/kubernetes-svgrepo-com.svg" },
  { name: "GCP", logo: "/logos/gcp-svgrepo-com.svg" },
  { name: "Tailwind CSS", logo: "/logos/tailwind-svgrepo-com.svg" },
]

export function TechCarousel() {
  return (
    <div className="relative overflow-hidden py-12">
      {/* Gradient fade on edges */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-background to-transparent" />

      {/* Infinite scrolling container */}
      <div className="flex">
        <motion.div
          className="flex gap-12 pr-12"
          animate={{
            x: [0, -1920], // Adjust based on number of logos
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 40,
              ease: "linear",
            },
          }}
        >
          {/* Duplicate the array twice for seamless loop */}
          {[...technologies, ...technologies, ...technologies].map((tech, index) => (
            <div
              key={`${tech.name}-${index}`}
              className="flex flex-shrink-0 items-center justify-center"
            >
              <div className="group relative flex h-20 w-20 items-center justify-center rounded-xl border border-border bg-card p-4 transition-all hover:border-foreground/20 hover:shadow-lg">
                <Image
                  src={tech.logo}
                  alt={tech.name}
                  width={64}
                  height={64}
                  className="h-12 w-12 object-contain opacity-70 transition-opacity group-hover:opacity-100"
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

