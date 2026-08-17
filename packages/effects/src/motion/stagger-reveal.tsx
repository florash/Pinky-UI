"use client";

import { motion } from "motion/react";
import { useMotionEnabled } from "@pinky-ui/primitives";
import { Children, useRef, type ReactNode } from "react";

import { useInView } from "../internal/in-view";

export type StaggerRevealProps = {
  children: ReactNode;
  stagger?: number;
  delay?: number;
  distance?: number;
  amount?: number;
  margin?: string;
  once?: boolean;
  className?: string;
  disabled?: boolean;
};

/** Reveals semantic child content in order without hand-authored delays. */
export function StaggerReveal({
  children,
  stagger = 0.065,
  delay = 0,
  distance = 16,
  amount = 0.2,
  margin = "0px 0px -8% 0px",
  once = true,
  className,
  disabled = false,
}: StaggerRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const motionEnabled = useMotionEnabled();
  const visible = useInView(ref, { amount, margin, once });
  const items = Children.toArray(children);
  const animate = !motionEnabled || disabled || visible;

  return (
    <motion.div ref={ref} className={className} initial={false}>
      {items.map((child, index) => (
        <motion.div
          key={index}
          data-pinky-stagger-item
          initial={motionEnabled && !disabled ? { opacity: 0, y: distance } : false}
          animate={animate ? { opacity: 1, y: 0 } : undefined}
          transition={{
            type: "spring",
            stiffness: 210,
            damping: 30,
            mass: 1,
            delay: motionEnabled && !disabled ? delay + index * stagger : 0,
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
