"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";
import { Home, Briefcase, User, Mail } from "lucide-react";
import { useState } from "react";

export function BottomNav() {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springX = useSpring(mouseX, { damping: 20, stiffness: 300 });
  const springY = useSpring(mouseY, { damping: 20, stiffness: 300 });

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/work", label: "Work", icon: Briefcase },
    { href: "/about", label: "About", icon: User },
    { href: "/contact", label: "Contact", icon: Mail },
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-md pointer-events-none"
    >
      <nav
        onMouseMove={handleMouseMove}
        className={cn(
          "relative overflow-hidden rounded-2xl backdrop-blur-xl border shadow-2xl pointer-events-auto",
          "bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-indigo-700/20",
          "border-white/20"
        )}
        style={{
          background: "linear-gradient(135deg, rgba(59, 13, 212, 0.15) 0%, rgba(99, 102, 241, 0.15) 50%, rgba(139, 92, 246, 0.15) 100%)",
        }}
      >
        {/* Cursor tracking highlight */}
        <motion.div
          className="absolute w-32 h-32 rounded-full pointer-events-none"
          style={{
            left: springX,
            top: springY,
            x: "-50%",
            y: "-50%",
            background: "radial-gradient(circle, rgba(59, 13, 212, 0.3) 0%, rgba(99, 102, 241, 0.15) 40%, transparent 70%)",
            filter: "blur(20px)",
          }}
        />

        {/* Liquid glass effect overlay */}
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        />

        {/* Glass shine effect */}
        <div
          className="absolute inset-0 rounded-2xl opacity-50"
          style={{
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%, rgba(255, 255, 255, 0.05) 100%)",
          }}
        />

        <div className="relative flex items-center justify-around px-4 py-3">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const isHovered = hoveredItem === link.href;
            const showHighlight = isHovered || (isActive && !hoveredItem);
            const Icon = link.icon;
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative group flex flex-col items-center gap-1 min-w-[60px] py-2"
                onMouseEnter={() => setHoveredItem(link.href)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {/* Active/Hover indicator background - animates between items */}
                {showHighlight && (
                  <motion.div
                    layoutId="navHighlight"
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: "linear-gradient(135deg, rgba(59, 13, 212, 0.3) 0%, rgba(99, 102, 241, 0.3) 100%)",
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}

                {/* Icon */}
                <div className="relative z-10">
                  <Icon
                    className={cn(
                      "w-5 h-5 transition-all duration-300",
                      showHighlight
                        ? "text-white scale-110" 
                        : "text-white/60 group-hover:text-white/90 group-hover:scale-105"
                    )}
                  />
                </div>

                {/* Label */}
                <span
                  className={cn(
                    "relative z-10 text-[10px] font-medium tracking-wide transition-all duration-300",
                    showHighlight
                      ? "text-white" 
                      : "text-white/60 group-hover:text-white/90"
                  )}
                  style={{ fontFamily: 'var(--font-favorit-expanded)' }}
                >
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Bottom edge highlight */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)",
          }}
        />
      </nav>
    </motion.div>
  );
}
