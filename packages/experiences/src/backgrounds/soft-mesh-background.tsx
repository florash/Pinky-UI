"use client";

import { motion } from "motion/react";
import { useMotionEnabled } from "@pinky/primitives";
import { useInView } from "@pinky/effects/internal/in-view";
import { useRef, type ReactNode } from "react";

import { cn } from "../internal/cn";

export type SoftMeshBackgroundProps = {
  children?: ReactNode;
  colors?: string[];
  intensity?: number;
  duration?: number;
  className?: string;
  disabled?: boolean;
};

/** A three-stop ambient mesh that pauses when offscreen and is static under reduced motion. */
export function SoftMeshBackground({
  children,
  colors = ["var(--color-blush-200)", "var(--color-cloud-200)", "var(--color-white)"],
  intensity = 0.62,
  duration = 18,
  className,
  disabled = false,
}: SoftMeshBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { amount: 0.01, margin: "20%", once: false });
  const motionEnabled = useMotionEnabled();
  const active = motionEnabled && visible && !disabled;
  const opacity = Math.min(Math.max(intensity, 0), 1);
  const palette = colors.length > 0 ? colors : ["transparent"];

  return (
    <div ref={ref} className={cn("relative isolate overflow-hidden", className)}>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10" style={{ background: palette[2] ?? palette[0] }}>
        {[0, 1, 2].map((index) => (
          <motion.span
            key={index}
            style={{
              position: "absolute",
              width: index === 2 ? "48%" : "62%",
              aspectRatio: "1",
              left: index === 0 ? "-12%" : index === 1 ? "52%" : "30%",
              top: index === 0 ? "-24%" : index === 1 ? "20%" : "55%",
              borderRadius: "50%",
              background: palette[index % palette.length],
              opacity: opacity * (index === 2 ? 0.45 : 0.75),
              filter: "blur(54px)",
              willChange: active ? "transform" : undefined,
            }}
            animate={
              active
                ? {
                    x: index % 2 === 0 ? [0, 24, -8, 0] : [0, -20, 10, 0],
                    y: index % 2 === 0 ? [0, -12, 16, 0] : [0, 16, -10, 0],
                    scale: [1, 1.04, 0.98, 1],
                  }
                : { x: 0, y: 0, scale: 1 }
            }
            transition={active ? { duration: duration + index * 3, repeat: Infinity, ease: "easeInOut" } : { duration: 0 }}
          />
        ))}
      </div>
      {children}
    </div>
  );
}
