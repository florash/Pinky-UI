"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react";
import { useCallback, useRef, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";

import { useMotionEnabled } from "../internal/use-motion-enabled";
import { springs, type SpringPreset } from "../spring/springs";

export type TiltProps = {
  children: ReactNode;
  /** Maximum rotation on each axis, in degrees. */
  max?: number;
  /** Perspective distance. Lower feels more dramatic. */
  perspective?: number;
  /** Lift toward the viewer while hovered, in px. */
  lift?: number;
  /** Adds a soft specular highlight that follows the pointer. */
  glare?: boolean;
  preset?: SpringPreset;
  className?: string;
  disabled?: boolean;
};

/**
 * Rigid perspective tilt — the surface behaves like a solid plane catching
 * light, where {@link Jelly} behaves like something soft.
 */
export function Tilt({
  children,
  max = 4,
  perspective = 1000,
  lift = 6,
  glare = false,
  preset = "soft",
  className,
  disabled = false,
}: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const motionEnabled = useMotionEnabled();
  const active = motionEnabled && !disabled;

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const hover = useMotionValue(0);

  const springX = useSpring(px, springs[preset]);
  const springY = useSpring(py, springs[preset]);
  const springHover = useSpring(hover, springs[preset]);

  const rotateY = useTransform(springX, (value) => value * max);
  const rotateX = useTransform(springY, (value) => -value * max);
  const z = useTransform(springHover, (value) => value * lift);
  const glareX = useTransform(springX, (value) => `${50 + value * 100}%`);
  const glareY = useTransform(springY, (value) => `${50 + value * 100}%`);
  const glareOpacity = useTransform(springHover, [0, 1], [0, 0.5]);
  const glareBackground = useMotionTemplate`radial-gradient(220px circle at ${glareX} ${glareY}, rgba(255,255,255,0.85), rgba(255,255,255,0) 65%)`;

  const track = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!active || event.pointerType !== "mouse") return;
      const element = ref.current;
      if (!element) return;
      const box = element.getBoundingClientRect();
      px.set((event.clientX - box.left) / box.width - 0.5);
      py.set((event.clientY - box.top) / box.height - 0.5);
    },
    [active, px, py],
  );

  const rest = useCallback(() => {
    px.set(0);
    py.set(0);
    hover.set(0);
  }, [hover, px, py]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        transformPerspective: perspective,
        rotateX: active ? rotateX : 0,
        rotateY: active ? rotateY : 0,
        z: active ? z : 0,
        position: "relative",
      }}
      onPointerMove={track}
      onPointerEnter={(event) => {
        if (!active || event.pointerType !== "mouse") return;
        hover.set(1);
      }}
      onPointerLeave={rest}
      onPointerCancel={rest}
    >
      {children}
      {glare && active ? (
        <motion.span
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            pointerEvents: "none",
            opacity: glareOpacity,
            background: glareBackground,
          }}
        />
      ) : null}
    </motion.div>
  );
}
