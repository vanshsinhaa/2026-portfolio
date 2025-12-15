"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function SiteHeader() {
  const pathname = usePathname()
  const [isOverLight, setIsOverLight] = useState(false)
  const [isOverFooter, setIsOverFooter] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const links = [
    { href: "/", label: "Home" },
    { href: "/work", label: "Work" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      
      // Check if we're near the footer (last 800px of the page)
      const isNearFooter = scrollPosition + windowHeight > documentHeight - 800
      setIsOverFooter(isNearFooter)

      // If on homepage, detect scroll position
      if (pathname === "/") {
        const heroHeight = window.innerHeight
        setIsOverLight(scrollPosition > heroHeight * 0.8 && !isNearFooter)
      } else {
        // On other pages (work, about, contact), always use dark blue on light background unless over footer
        setIsOverLight(!isNearFooter)
      }
    }

    handleScroll() // Check on mount
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [pathname])

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
  }, [isMenuOpen])

  return (
    <>
      {/* Burger Menu Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="fixed top-8 right-8 z-[60] flex flex-col gap-1.5 w-8 h-8 group"
        aria-label="Toggle menu"
      >
        <span
          className={cn(
            "block h-0.5 w-full transition-all duration-300",
            isMenuOpen ? "rotate-45 translate-y-2" : "",
            // White over footer or dark sections, blue over light sections
            isOverLight && !isOverFooter ? "bg-[#3b0dd4]" : "bg-white"
          )}
        />
        <span
          className={cn(
            "block h-0.5 w-full transition-all duration-300",
            isMenuOpen ? "opacity-0" : "opacity-100",
            isOverLight && !isOverFooter ? "bg-[#3b0dd4]" : "bg-white"
          )}
        />
        <span
          className={cn(
            "block h-0.5 w-full transition-all duration-300",
            isMenuOpen ? "-rotate-45 -translate-y-2" : "",
            isOverLight && !isOverFooter ? "bg-[#3b0dd4]" : "bg-white"
          )}
        />
      </button>

      {/* Vertical Sidebar Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55]"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Sidebar */}
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-screen w-80 bg-background border-l border-border z-[60] shadow-2xl"
            >
              <div className="flex flex-col items-start justify-center h-full px-12 gap-8">
                {links.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "group relative text-4xl tracking-tight transition-all duration-300 hover:opacity-100",
                        pathname === link.href ? "opacity-100" : "opacity-60"
                      )}
                      style={{ 
                        fontFamily: 'var(--font-favorit)',
                        color: '#3b0dd4'
                      }}
                    >
                      {link.label}
                      {/* Animated underline */}
                      <span 
                        className={cn(
                          "absolute -bottom-1 left-0 h-0.5 bg-[#3b0dd4] transition-all duration-300 ease-out",
                          pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                        )}
                      />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
