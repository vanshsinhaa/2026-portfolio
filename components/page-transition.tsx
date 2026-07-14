"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useContext, useRef, type ReactNode } from "react";

/**
 * Freezes the router context so the outgoing page keeps rendering its old
 * content while AnimatePresence plays the exit animation. Without this, the
 * App Router swaps content immediately and exit animations never happen.
 */
function FrozenRouter({ children }: { children: ReactNode }) {
  const context = useContext(LayoutRouterContext);
  const frozen = useRef(context).current;

  if (!frozen) {
    return <>{children}</>;
  }

  return (
    <LayoutRouterContext.Provider value={frozen}>
      {children}
    </LayoutRouterContext.Provider>
  );
}

const transition = {
  duration: 0.5,
  ease: [0.22, 1, 0.36, 1] as const,
};

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence
      mode="wait"
      initial={false}
      onExitComplete={() => window.scrollTo({ top: 0, left: 0, behavior: "instant" })}
    >
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{
          opacity: 0,
          y: -16,
          filter: "blur(6px)",
          transition: { ...transition, duration: 0.3 },
        }}
        transition={transition}
      >
        <FrozenRouter>{children}</FrozenRouter>
      </motion.div>
    </AnimatePresence>
  );
}
