"use client";

import { motion } from "motion/react";
import { useMotionEnabled, usePointerCapability } from "@pinky-ui/primitives";
import { useRef, useState, type ReactNode } from "react";

import { useInView } from "../internal/in-view";

export type MaskRevealDirection = "left" | "right" | "up" | "down" | "center";

export type MaskRevealProps = {
  children: ReactNode;
  direction?: MaskRevealDirection;
  duration?: number;
  delay?: number;
  scale?: number;
  amount?: number;
  margin?: string;
  once?: boolean;
  className?: string;
  disabled?: boolean;
  trigger?: "view" | "hover" | "focus";
};

/** Reveals media or editorial content through a restrained clipping mask. */
export function MaskReveal({
  children,
  direction = "up",
  duration = 0.72,
  delay = 0,
  scale = 1.035,
  amount = 0.2,
  margin = "0px 0px -8% 0px",
  once = true,
  className,
  disabled = false,
  trigger = "view",
}: MaskRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [interacting, setInteracting] = useState(false);
  const motionEnabled = useMotionEnabled();
  const { hasHover } = usePointerCapability();
  const visible = useInView(ref, { amount, margin, once });
  // A "hover" or "focus" trigger with no hover-capable pointer has no way to
  // lift the mask before a first tap — and a tap that both reveals the mask
  // and lands on newly-exposed content is a double-tap trap, not a fallback.
  // Content stays fully visible there instead of ever masking in the first place.
  const active = trigger === "view" ? visible : hasHover ? interacting : true;
  const target = trigger === "view" ? (active ? { clipPath: "inset(0% 0% 0% 0%)", scale: 1 } : undefined) : active ? { clipPath: "inset(0% 0% 0% 0%)", scale: 1 } : { clipPath: maskFor(direction), scale };

  return (
    <div ref={ref} className={className} style={{ overflow: "hidden" }} onPointerEnter={() => trigger !== "view" && setInteracting(true)} onPointerLeave={() => trigger !== "view" && setInteracting(false)} onFocusCapture={() => trigger !== "view" && setInteracting(true)} onBlurCapture={() => trigger !== "view" && setInteracting(false)}>
      <motion.div
        initial={motionEnabled && !disabled ? { clipPath: maskFor(direction), scale } : false}
        animate={motionEnabled && !disabled ? target : { clipPath: "inset(0% 0% 0% 0%)", scale: 1 }}
        transition={{ duration: motionEnabled && !disabled ? duration : 0, delay: motionEnabled && !disabled ? delay : 0, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

function maskFor(direction: MaskRevealDirection) {
  if (direction === "left") return "inset(0% 0% 0% 100%)";
  if (direction === "right") return "inset(0% 100% 0% 0%)";
  if (direction === "down") return "inset(100% 0% 0% 0%)";
  if (direction === "center") return "inset(50% 50% 50% 50%)";
  return "inset(0% 0% 100% 0%)";
}
