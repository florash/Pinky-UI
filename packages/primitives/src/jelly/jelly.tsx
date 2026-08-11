"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useCallback, useRef, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";

import { useMotionEnabled } from "../internal/use-motion-enabled";
import { elasticSpring } from "../spring/springs";

export type JellyProps = {
  children: ReactNode;
  /** 0 = damped and calm, 1 = visible wobble on settle. */
  elasticity?: number;
  /** Overall magnitude of the deformation. */
  intensity?: number;
  /** Scale applied while hovered. Kept low by Pinky's motion rules. */
  hoverScale?: number;
  /** Scale applied while pressed. */
  pressScale?: number;
  /**
   * Squash and stretch on press — the surface widens as it flattens, the way
   * something soft does. Set `false` for a purely rigid press.
   */
  squash?: boolean;
  className?: string;
  disabled?: boolean;
};

const MAX_ROTATION_DEG = 22;
const MAX_TRANSLATE_PX = 26;
/** Kept small: at the default intensity this is under 1% of the card's width. */
const SQUASH = 0.03;

/**
 * A soft elastic surface: the child leans toward the pointer, drifts slightly
 * with it, and settles back with spring physics.
 *
 * Pointer position is written straight into motion values, so tracking never
 * re-renders React — only compositor-friendly transforms change.
 */
export function Jelly({
  children,
  elasticity = 0.35,
  intensity = 0.18,
  hoverScale = 1.02,
  pressScale = 0.985,
  squash = true,
  className,
  disabled = false,
}: JellyProps) {
  const ref = useRef<HTMLDivElement>(null);
  const motionEnabled = useMotionEnabled();
  const active = motionEnabled && !disabled;

  const spring = elasticSpring(elasticity);

  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);
  const scaleTarget = useMotionValue(1);
  /** -1 while pressed, 0 at rest. Drives squash and stretch. */
  const squashTarget = useMotionValue(0);

  const springX = useSpring(offsetX, spring);
  const springY = useSpring(offsetY, spring);
  const scale = useSpring(scaleTarget, spring);
  const springSquash = useSpring(squashTarget, spring);

  const strength = Math.min(Math.max(intensity, 0), 1);
  const rotateY = useTransform(springX, (value) => value * MAX_ROTATION_DEG * strength);
  const rotateX = useTransform(springY, (value) => -value * MAX_ROTATION_DEG * strength);
  const translateX = useTransform(springX, (value) => value * MAX_TRANSLATE_PX * strength);
  const translateY = useTransform(springY, (value) => value * MAX_TRANSLATE_PX * strength);
  // Volume is roughly preserved: what the surface loses in height it gains in
  // width, which is what reads as "soft" rather than "smaller".
  const scaleX = useTransform(springSquash, (value) => 1 - value * SQUASH);
  const scaleY = useTransform(springSquash, (value) => 1 + value * SQUASH);

  const track = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!active || event.pointerType !== "mouse") return;
      const element = ref.current;
      if (!element) return;

      const box = element.getBoundingClientRect();
      // Normalised to -0.5…0.5 so the API's magnitudes stay size-independent.
      offsetX.set((event.clientX - box.left) / box.width - 0.5);
      offsetY.set((event.clientY - box.top) / box.height - 0.5);
    },
    [active, offsetX, offsetY],
  );

  const rest = useCallback(() => {
    offsetX.set(0);
    offsetY.set(0);
    scaleTarget.set(1);
    squashTarget.set(0);
  }, [offsetX, offsetY, scaleTarget, squashTarget]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        // `transformPerspective`, not `perspective`: the rotation happens on
        // this element, and `perspective` would only affect its children.
        transformPerspective: 900,
        rotateX: active ? rotateX : 0,
        rotateY: active ? rotateY : 0,
        x: active ? translateX : 0,
        y: active ? translateY : 0,
        scale: active ? scale : 1,
        scaleX: active && squash ? scaleX : undefined,
        scaleY: active && squash ? scaleY : undefined,
      }}
      onPointerMove={track}
      onPointerEnter={(event) => {
        if (!active || event.pointerType !== "mouse") return;
        scaleTarget.set(hoverScale);
      }}
      onPointerLeave={rest}
      onPointerDown={() => {
        if (!active) return;
        scaleTarget.set(pressScale);
        squashTarget.set(1);
      }}
      onPointerUp={() => {
        if (!active) return;
        scaleTarget.set(hoverScale);
        squashTarget.set(0);
      }}
      onPointerCancel={rest}
    >
      {children}
    </motion.div>
  );
}
