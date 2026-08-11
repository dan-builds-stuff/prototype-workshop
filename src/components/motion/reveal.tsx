"use client";

// Plain CSS fade-up instead of framer-motion's `whileInView`/`useInView`.
// Lesson learned from the main site: scroll-triggered JS animation added
// TypeScript friction and, more importantly, was the first (wrong) suspect
// when a real bug (stale-cache ChunkLoadError) made the page look broken.
// A CSS keyframe animation has nothing to hydrate or fail silently on.

import * as React from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li";
};

export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const Tag = as;

  if (shouldReduceMotion) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Tag
      className={cn("animate-fade-up", className)}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </Tag>
  );
}
