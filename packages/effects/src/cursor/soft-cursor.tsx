"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { springs, useMotionEnabled } from "@pinky-ui/primitives";
import { useEffect, useState } from "react";

import { useFinePointer, usePointerSource } from "../internal/pointer-motion";
import { useCursorTarget } from "./cursor-provider";

/** How closely the follower keeps up. */
export type CursorResponse = "soft" | "responsive" | "snappy";

export type SoftCursorProps = {
  /** Diameter of the solid core dot, in px. */
  size?: number;
  /** Diameter of the soft follower, in px. Past ~56 it starts to obscure. */
  followerSize?: number;
  response?: CursorResponse;
  /** Colour of the core dot. */
  color?: string;
  /** Colour of the follower ring. */
  followerColor?: string;
  /** Drop the core dot and keep only the follower — the least invasive option. */
  followerOnly?: boolean;
  /**
   * Hide the native cursor. Off by default, and off over form controls even
   * when on: a text field with no I-beam is a worse field.
   */
  hideNative?: boolean;
  /** Follower scale over links, buttons and cursor targets. */
  hoverScale?: number;
  zIndex?: number;
  disabled?: boolean;
};

const INTERACTIVE =
  'a[href], button, [role="button"], input, select, textarea, summary, [data-cursor-hover]';

const HIDE_NATIVE_CSS = `
:root[data-pinky-cursor="hidden"], :root[data-pinky-cursor="hidden"] * { cursor: none; }
:root[data-pinky-cursor="hidden"] input,
:root[data-pinky-cursor="hidden"] textarea,
:root[data-pinky-cursor="hidden"] select,
:root[data-pinky-cursor="hidden"] [contenteditable="true"] { cursor: auto; }
`;

/**
 * A refined custom cursor: a small core that tracks exactly, and a larger soft
 * follower that arrives a moment later.
 *
 * The lag is the whole effect. A follower pinned rigidly to the pointer reads
 * as a heavier mouse cursor; one that trails by a spring reads as weight and
 * makes the pointer feel physical.
 *
 * Renders nothing on the server, nothing on touch devices, and nothing under
 * reduced motion — the native cursor is always the fallback, and it is never
 * hidden unless you ask.
 */
export function SoftCursor({
  size = 8,
  followerSize = 36,
  response = "soft",
  color = "var(--color-ink-900)",
  followerColor = "var(--color-blush-300)",
  followerOnly = false,
  hideNative = false,
  hoverScale = 1.7,
  zIndex = 9999,
  disabled = false,
}: SoftCursorProps) {
  const motionEnabled = useMotionEnabled();
  const fine = useFinePointer();
  const active = motionEnabled && fine && !disabled;

  const pointer = usePointerSource(active);
  const target = useCursorTarget();
  const overInteractive = useInteractiveHover(active);

  const follower = springs[response];
  const followX = useSpring(pointer.x, follower);
  const followY = useSpring(pointer.y, follower);
  const presence = useSpring(pointer.presence, springs.soft);

  const requested = target?.scale ?? (overInteractive || target ? hoverScale : 1);
  const rawScale = useMotionValue(1);
  const scale = useSpring(rawScale, springs.snappy);

  useEffect(() => {
    rawScale.set(requested);
  }, [rawScale, requested]);

  const coreX = useTransform(pointer.x, (value) => value - size / 2);
  const coreY = useTransform(pointer.y, (value) => value - size / 2);
  const soft = useTransform(followX, (value) => value - followerSize / 2);
  const softY = useTransform(followY, (value) => value - followerSize / 2);

  useEffect(() => {
    if (!active || !hideNative) return;
    document.documentElement.dataset.pinkyCursor = "hidden";
    return () => {
      delete document.documentElement.dataset.pinkyCursor;
    };
  }, [active, hideNative]);

  if (!active) return null;

  return (
    <>
      {hideNative ? <style>{HIDE_NATIVE_CSS}</style> : null}

      <motion.div
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex,
          width: followerSize,
          height: followerSize,
          borderRadius: "50%",
          pointerEvents: "none",
          border: `1px solid ${followerColor}`,
          background: `color-mix(in oklab, ${followerColor} 22%, transparent)`,
          x: soft,
          y: softY,
          scale,
          opacity: presence,
        }}
      />

      {followerOnly ? null : (
        <motion.div
          aria-hidden
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex,
            width: size,
            height: size,
            borderRadius: "50%",
            pointerEvents: "none",
            background: color,
            x: coreX,
            y: coreY,
            opacity: presence,
          }}
        />
      )}
    </>
  );
}

/**
 * True while the pointer is over something clickable.
 *
 * Driven by `pointerover`/`pointerout`, not by testing the pointer position
 * every frame: the browser already knows what is under the pointer, and asking
 * it once per element crossing costs nothing.
 */
function useInteractiveHover(active: boolean): boolean {
  const [over, setOver] = useState(false);

  useEffect(() => {
    if (!active) return;

    const enter = (event: PointerEvent) => {
      const node = event.target;
      if (!(node instanceof Element)) return;
      if (node.closest(INTERACTIVE)) setOver(true);
    };

    const leave = (event: PointerEvent) => {
      const node = event.target;
      if (!(node instanceof Element)) return;
      if (node.closest(INTERACTIVE)) setOver(false);
    };

    document.addEventListener("pointerover", enter, { passive: true });
    document.addEventListener("pointerout", leave, { passive: true });

    return () => {
      document.removeEventListener("pointerover", enter);
      document.removeEventListener("pointerout", leave);
      setOver(false);
    };
  }, [active]);

  return over;
}
