"use client";

import { useContext, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useSelectedLayoutSegment } from "next/navigation";

function FrozenRouter({ children }: { children: React.ReactNode }) {
  const context = useContext(LayoutRouterContext);
  const prevContext = useRef(context);
  const segment = useSelectedLayoutSegment();
  const prevSegment = useRef(segment);
  const changed = segment !== prevSegment.current;

  if (changed) {
    // Keep previous context during exit animation
  } else {
    prevContext.current = context;
    prevSegment.current = segment;
  }

  return (
    <LayoutRouterContext.Provider
      value={changed ? prevContext.current! : context!}
    >
      {children}
    </LayoutRouterContext.Provider>
  );
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const segment = useSelectedLayoutSegment();
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={segment}
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -20 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <FrozenRouter>{children}</FrozenRouter>
      </motion.div>
    </AnimatePresence>
  );
}
