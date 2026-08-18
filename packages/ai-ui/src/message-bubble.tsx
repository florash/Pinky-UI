"use client";

import { springs, useMotionEnabled } from "@pinky-ui/primitives";
import { motion } from "motion/react";
import type { ReactNode } from "react";

import { cn } from "./internal/cn";

export type MessageBubbleProps = {
  role: "user" | "assistant";
  children: ReactNode;
  avatar?: ReactNode;
  /** Position in the message list — later bubbles enter with a small extra delay. */
  index?: number;
  className?: string;
};

export function MessageBubble({ role, children, avatar, index = 0, className }: MessageBubbleProps) {
  const motionEnabled = useMotionEnabled();
  // Capped so a long history doesn't leave the newest message waiting on a
  // growing queue of earlier delays.
  const delay = motionEnabled ? Math.min(index, 6) * 0.05 : 0;

  return (
    <motion.div
      initial={motionEnabled ? { opacity: 0, y: 10, scale: 0.98 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={motionEnabled ? { type: "spring", ...springs.elastic, delay } : { duration: 0 }}
      className={cn("flex items-end gap-2.5", role === "user" ? "flex-row-reverse" : "flex-row", className)}
    >
      {avatar ? (
        <span aria-hidden className="mb-0.5 shrink-0">
          {avatar}
        </span>
      ) : null}
      <div
        role="group"
        aria-label={role === "user" ? "Your message" : "Assistant message"}
        className={cn(
          "max-w-[36rem] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          role === "user" ? "bg-ink-900 text-milk" : "border border-line bg-white text-ink-900",
        )}
      >
        {children}
      </div>
    </motion.div>
  );
}
