"use client";

import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

import { useMotionEnabled } from "../internal/use-motion-enabled";
import { springs, type SpringPreset } from "../spring/springs";

type ParallaxContextValue = { x: MotionValue<number>; y: MotionValue<number> };

const ParallaxContext = createContext<ParallaxContextValue | null>(null);

export type ParallaxProps = {
  children: ReactNode;
  className?: string;
  preset?: SpringPreset;
  disabled?: boolean;
};

export type ParallaxLayerProps = {
  children: ReactNode;
  /** How far this layer moves. Negative values move against the pointer. */
  depth?: number;
  className?: string;
};

const MAX_SHIFT_PX = 20;

/**
 * Pointer-driven depth: layers inside move by different amounts.
 *
 * The container tracks the pointer once and every layer reads the same two
 * motion values, so a five-layer card still costs one handler and no React
 * renders while the pointer moves.
 */
export function Parallax({ children, className, preset = "soft", disabled = false }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const motionEnabled = useMotionEnabled();
  const active = motionEnabled && !disabled;

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, springs[preset]);
  const y = useSpring(rawY, springs[preset]);

  const value = useMemo(() => ({ x, y }), [x, y]);

  const track = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!active || event.pointerType !== "mouse") return;
      const element = ref.current;
      if (!element) return;
      const box = element.getBoundingClientRect();
      rawX.set((event.clientX - box.left) / box.width - 0.5);
      rawY.set((event.clientY - box.top) / box.height - 0.5);
    },
    [active, rawX, rawY],
  );

  const rest = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return (
    <ParallaxContext.Provider value={value}>
      <div
        ref={ref}
        className={className}
        onPointerMove={track}
        onPointerLeave={rest}
        onPointerCancel={rest}
      >
        {children}
      </div>
    </ParallaxContext.Provider>
  );
}

/**
 * One depth plane inside a {@link Parallax}.
 *
 * Outside a Parallax it simply renders its children unmoved, so a layer can be
 * lifted into another layout without breaking.
 */
export function ParallaxLayer({ children, depth = 0.5, className }: ParallaxLayerProps) {
  const context = useContext(ParallaxContext);
  const fallback = useMotionValue(0);
  const sourceX = context?.x ?? fallback;
  const sourceY = context?.y ?? fallback;

  const x = useTransform(sourceX, (value) => value * MAX_SHIFT_PX * depth);
  const y = useTransform(sourceY, (value) => value * MAX_SHIFT_PX * depth);

  return (
    <motion.div className={className} style={{ x, y }}>
      {children}
    </motion.div>
  );
}
