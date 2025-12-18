"use client"

import { ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export function SiteFooter() {
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/work", label: "Work" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]

  const socialLinks = [
    { href: "https://github.com/vanshsinhaa", label: "GitHub" },
    { href: "https://www.linkedin.com/in/vanshsinha/", label: "LinkedIn" },
  ]

  return (
    <footer className="relative bg-gradient-to-br from-[#3b0dd4] via-[#2a0ba0] to-[#1a0770] text-white overflow-hidden mt-32">
      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />
      
      <div className="container mx-auto max-w-7xl px-6 py-16 md:py-24 relative">
        {/* Top Section - Description and Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-20"
        >
          {/* Left - Description */}
          <div className="md:col-span-5 space-y-6">
            <div>
              <p className="text-white/90 font-geist text-base md:text-lg leading-relaxed">
                Vansh is a data engineer and full-stack developer specializing in building scalable systems and cloud infrastructure.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-white/50 uppercase tracking-widest">Contact</p>
              <a 
                href="mailto:vanshsinhaacademics@gmail.com"
                className="block text-white/90 hover:text-white transition-colors text-lg md:text-xl font-geist group"
              >
                vanshsinhaacademics@gmail.com
                <ArrowUpRight className="inline-block ml-1 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Right - Navigation Links */}
          <div className="md:col-span-7 grid grid-cols-2 gap-12 md:gap-16">
            {/* Navigation Column */}
            <div className="space-y-4">
              <p className="text-xs text-white/50 uppercase tracking-widest">Navigation</p>
              <nav className="flex flex-col gap-3">
                {navLinks.map((link) => (
              <Link
                    key={link.href}
                    href={link.href}
                    className="text-white/80 hover:text-white transition-colors font-favorit text-lg group flex items-center"
              >
                    {link.label}
                    <ArrowUpRight className="inline-block ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </Link>
                ))}
              </nav>
            </div>

            {/* Follow Column */}
            <div className="space-y-4">
              <p className="text-xs text-white/50 uppercase tracking-widest">Follow</p>
              <nav className="flex flex-col gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                    className="text-white/80 hover:text-white transition-colors font-favorit text-lg group flex items-center"
              >
                    {link.label}
                    <ArrowUpRight className="inline-block ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </motion.div>

        {/* Large Stacked Text - Actually Cut Off at Edges */}
        <div className="relative my-16 md:my-24 overflow-hidden -mx-6">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* First VANSH - Larger, slightly transparent, actually overflows */}
            <div className="font-favorit font-normal text-[32vw] md:text-[26vw] lg:text-[22vw] leading-[0.8] tracking-tighter text-white/30 whitespace-nowrap -ml-[2vw]">
              VANSH SINHA
          </div>

            {/* Second VANSH - Offset, full opacity, also overflows */}
            <div className="font-favorit font-normal text-[32vw] md:text-[26vw] lg:text-[22vw] leading-[0.8] tracking-tighter text-white whitespace-nowrap -mt-[14vw] md:-mt-[12vw] lg:-mt-[10vw] ml-[1vw]">
              VANSH SINHA
            </div>
          </motion.div>
        </div>

        {/* Bottom Info Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="pt-12 border-t border-white/10"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs text-white/60">
            <div className="flex flex-col md:flex-row gap-2 md:gap-6">
            <p>© 2025 Vansh Sinha</p>
              <span className="hidden md:block text-white/30">•</span>
              <p>Computer Science @ Arizona State University</p>
            </div>

            <div className="flex items-center gap-2">
              <p>Built with Next.js, Framer Motion & Tailwind CSS</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Gradient Glow Effect at Bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </footer>
  )
}
