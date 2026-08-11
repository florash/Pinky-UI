"use client";

import { motion, useSpring, useTransform } from "motion/react";
import { springs, useMotionEnabled } from "@pinky/primitives";
import { useViewportProgress } from "@pinky/effects/internal/scroll-motion";
import { useRef, type ReactNode } from "react";

import { cn } from "../internal/cn";

export type MorphingHeroProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  media: ReactNode;
  actions?: ReactNode;
  compactLabel?: ReactNode;
  height?: string | number;
  stickyTop?: number;
  className?: string;
  disabled?: boolean;
};

/** A scroll-compressing hero whose media becomes a calmer persistent surface. */
export function MorphingHero({
  eyebrow,
  title,
  description,
  media,
  actions,
  compactLabel,
  height = "150vh",
  stickyTop = 20,
  className,
  disabled = false,
}: MorphingHeroProps) {
  const ref = useRef<HTMLElement>(null);
  const motionEnabled = useMotionEnabled();
  const active = motionEnabled && !disabled;
  const progress = useViewportProgress(ref, active);
  const smooth = useSpring(progress, springs.soft);
  const titleScale = useTransform(smooth, [0, 0.75], [1, 0.78], { clamp: true });
  const titleY = useTransform(smooth, [0, 0.75], [0, -18], { clamp: true });
  const titleOpacity = useTransform(smooth, [0, 0.68], [1, 0.22], { clamp: true });
  const mediaScale = useTransform(smooth, [0, 1], [1, 0.84], { clamp: true });
  const mediaY = useTransform(smooth, [0, 1], [0, -26], { clamp: true });
  const radius = useTransform(smooth, [0, 1], [24, 38], { clamp: true });
  const compactOpacity = useTransform(smooth, [0.58, 0.9], [0, 1], { clamp: true });

  return (
    <section
      ref={ref}
      className={cn("relative", className)}
      style={{ minHeight: active ? height : undefined }}
    >
      <div
        style={{
          position: active ? "sticky" : "relative",
          top: active ? stickyTop : undefined,
          minHeight: active ? `calc(100vh - ${stickyTop * 2}px)` : undefined,
          display: "grid",
          alignItems: "center",
        }}
      >
        <div style={{ display: "grid", gap: 28 }}>
          <motion.div
            style={active ? { scale: titleScale, y: titleY, opacity: titleOpacity, transformOrigin: "left top" } : undefined}
          >
            {eyebrow ? <div>{eyebrow}</div> : null}
            <h1>{title}</h1>
            {description ? <div>{description}</div> : null}
            {actions ? <div>{actions}</div> : null}
          </motion.div>

          <motion.div
            style={{
              position: "relative",
              overflow: "hidden",
              scale: active ? mediaScale : 1,
              y: active ? mediaY : 0,
              borderRadius: active ? radius : 24,
              transformOrigin: "center top",
            }}
          >
            {media}
            {compactLabel ? (
              <motion.div
                aria-hidden
                style={{
                  position: "absolute",
                  right: 18,
                  bottom: 18,
                  opacity: active ? compactOpacity : 0,
                }}
              >
                {compactLabel}
              </motion.div>
            ) : null}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
