"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import { useMotionEnabled } from "@pinky/primitives";
import { useFinePointer, usePointerSource, type PointerSource } from "@pinky/effects/internal/pointer-motion";
import { useInView } from "@pinky/effects/internal/in-view";
import { useRect, type TrackedRect } from "@pinky/effects/internal/use-rect";
import { useRef, type ReactNode, type RefObject } from "react";

import { cn } from "../internal/cn";
import { useMediaQuery } from "../internal/use-media-query";

export type BubbleFieldProps = {
  children?: ReactNode;
  count?: number;
  colors?: string[];
  intensity?: number;
  pointerResponse?: boolean;
  className?: string;
  disabled?: boolean;
};

type BubbleSpec = { left: number; top: number; size: number; drift: number; color: string };

/** A deterministic, capped ambient orb field — deliberately not a particle engine. */
export function BubbleField({
  children,
  count = 10,
  colors = ["rgba(255,255,255,.7)", "var(--color-blush-100)", "var(--color-cloud-100)"],
  intensity = 0.72,
  pointerResponse = false,
  className,
  disabled = false,
}: BubbleFieldProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rect = useRect(ref);
  const visible = useInView(ref, { amount: 0.01, margin: "20%", once: false });
  const compact = useMediaQuery("(max-width: 767px)");
  const motionEnabled = useMotionEnabled();
  const fine = useFinePointer();
  const requested = Math.min(Math.max(Math.floor(count), 0), 18);
  const density = compact ? Math.ceil(requested * 0.6) : requested;
  const active = motionEnabled && visible && !disabled;
  const pointer = usePointerSource(active && fine && pointerResponse);
  const palette = colors.length > 0 ? colors : ["rgba(255,255,255,.55)"];
  const specs = Array.from({ length: density }, (_, index): BubbleSpec => ({
    left: 7 + ((index * 37 + 11) % 87),
    top: 6 + ((index * 53 + 17) % 82),
    size: 28 + ((index * 29) % 72),
    drift: 8 + (index % 5) * 3,
    color: palette[index % palette.length] ?? palette[0] ?? "transparent",
  }));

  return (
    <div ref={ref} className={cn("relative isolate overflow-hidden", className)}>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {specs.map((spec, index) => (
          <Bubble
            key={index}
            spec={spec}
            index={index}
            active={active}
            respond={active && fine && pointerResponse}
            pointer={pointer}
            rect={rect}
            opacity={Math.min(Math.max(intensity, 0), 1)}
          />
        ))}
      </div>
      {children}
    </div>
  );
}

function Bubble({
  spec,
  index,
  active,
  respond,
  pointer,
  rect,
  opacity,
}: {
  spec: BubbleSpec;
  index: number;
  active: boolean;
  respond: boolean;
  pointer: PointerSource;
  rect: RefObject<TrackedRect | null>;
  opacity: number;
}) {
  const repelX = useTransform(
    [pointer.x, pointer.y, pointer.presence],
    ([pointerX, pointerY, presence]: number[]) =>
      respond ? repulsion(pointerX ?? 0, pointerY ?? 0, presence ?? 0, spec, rect.current).x : 0,
  );
  const repelY = useTransform(
    [pointer.x, pointer.y, pointer.presence],
    ([pointerX, pointerY, presence]: number[]) =>
      respond ? repulsion(pointerX ?? 0, pointerY ?? 0, presence ?? 0, spec, rect.current).y : 0,
  );

  return (
    <motion.span
      style={{
        position: "absolute",
        left: `${spec.left}%`,
        top: `${spec.top}%`,
        width: spec.size,
        height: spec.size,
      }}
      animate={active ? { x: [0, spec.drift, -spec.drift * 0.45, 0], y: [0, -spec.drift, spec.drift * 0.6, 0] } : { x: 0, y: 0 }}
      transition={active ? { duration: 14 + index * 1.7, repeat: Infinity, ease: "easeInOut" } : { duration: 0 }}
    >
      <motion.span
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          background: spec.color,
          border: "1px solid rgba(255,255,255,.44)",
          boxShadow: "0 12px 36px rgba(70,90,115,.08)",
          opacity,
          x: repelX as MotionValue<number>,
          y: repelY as MotionValue<number>,
        }}
      />
    </motion.span>
  );
}

function repulsion(
  pointerX: number,
  pointerY: number,
  presence: number,
  spec: BubbleSpec,
  rect: TrackedRect | null,
) {
  if (!presence || !rect) return { x: 0, y: 0 };
  const centerX = rect.left + (spec.left / 100) * rect.width + spec.size / 2;
  const centerY = rect.top + (spec.top / 100) * rect.height + spec.size / 2;
  const dx = centerX - pointerX;
  const dy = centerY - pointerY;
  const distance = Math.max(Math.hypot(dx, dy), 1);
  const reach = 170;
  if (distance >= reach) return { x: 0, y: 0 };
  const force = (1 - distance / reach) * 12;
  return { x: (dx / distance) * force, y: (dy / distance) * force };
}
