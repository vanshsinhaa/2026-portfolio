"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRef } from "react";

export function HeroNavLinks() {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll to fade out the nav links
  const { scrollY } = useScroll();
  
  // Fade out after scrolling 200px
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);
  const y = useTransform(scrollY, [0, 200], [0, -50]);

  const links = [
    { href: "/", label: "HOME" },
    { href: "/work", label: "WORK" },
    { href: "/about", label: "ABOUT" },
    { href: "/contact", label: "CONTACT" },
  ];

  // Only show on homepage
  if (pathname !== "/") {
    return null;
  }

  return (
    <motion.div
      ref={containerRef}
      style={{ opacity, y }}
      className="fixed top-8 left-0 right-0 z-50 pointer-events-none px-8 sm:px-12 md:px-16"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <nav className="flex justify-between items-center max-w-7xl mx-auto pointer-events-auto">
        {links.map((link, index) => (
          <motion.div
            key={link.href}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
          >
            <Link
              href={link.href}
              className={cn(
                "text-sm sm:text-base font-medium tracking-wide transition-all duration-300 hover:text-white/100 relative group",
                pathname === link.href
                  ? "text-white"
                  : "text-white/70"
              )}
              style={{ fontFamily: 'var(--font-favorit-expanded)' }}
            >
              <span className="opacity-60 group-hover:opacity-100 transition-opacity">[</span>
              <span className="mx-1">{link.label}</span>
              <span className="opacity-60 group-hover:opacity-100 transition-opacity">]</span>
              
              {/* Subtle underline on hover */}
              <span
                className={cn(
                  "absolute -bottom-0.5 left-0 right-0 h-px bg-white transition-all duration-300",
                  pathname === link.href
                    ? "opacity-100 scale-x-100"
                    : "opacity-0 scale-x-0 group-hover:opacity-60 group-hover:scale-x-100"
                )}
              />
            </Link>
          </motion.div>
        ))}
      </nav>
    </motion.div>
  );
}

