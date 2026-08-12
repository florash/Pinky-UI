"use client";

import { useMotionEnabled, usePressSpring } from "@pinky/primitives";
import { motion } from "motion/react";
import { forwardRef, useEffect, useRef, useState, type ButtonHTMLAttributes, type PointerEvent as RPE, type ReactNode } from "react";

import { cn } from "../../utils/cn";
import { DISABLED, FOCUS_RING } from "../tactile/internal";

const BLOOM =
  "radial-gradient(circle, var(--color-blush-300), var(--color-blush-200) 38%, var(--color-cloud-300) 70%, transparent 76%)";

export type BloomButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onAnimationStart" | "onAnimationEnd" | "onDrag" | "onDragStart" | "onDragEnd"
> & { children: ReactNode };

/**
 * Construction: a plain hairline pill with **no colour of its own**. The
 * gradient exists only for the length of a press, blooming from the exact point
 * you touched and dissolving.
 *
 * Motion signature — **colour at the point of contact, then gone**. This is the
 * inverse of a filled primary button: instead of wearing its emphasis
 * permanently, it produces it on demand and returns to neutral. A page of these
 * stays completely quiet until something is actually pressed.
 *
 * Keyboard activation blooms from centre, so Space and Enter are not silently
 * duller than a tap.
 */
export const BloomButton = forwardRef<HTMLButtonElement, BloomButtonProps>(function BloomButton(
  { children, className, disabled, type = "button", ...props },
  ref,
) {
  const [bursts, setBursts] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const next = useRef(0);
  const burstTimers = useRef(new Set<ReturnType<typeof setTimeout>>());
  const motionEnabled = useMotionEnabled();
  const press = usePressSpring({ scale: 1, travel: 2, disabled });

  useEffect(() => () => {
    for (const timer of burstTimers.current) clearTimeout(timer);
    burstTimers.current.clear();
  }, []);

  const burst = (x: number, y: number) => {
    if (!motionEnabled || disabled) return;
    const id = next.current++;
    setBursts((list) => [...list, { id, x, y }]);
    // Timer rather than animation end: a button unmounted mid-press must not
    // leave a listener behind.
    const timer = setTimeout(() => {
      setBursts((list) => list.filter((b) => b.id !== id));
      burstTimers.current.delete(timer);
    }, 700);
    burstTimers.current.add(timer);
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled}
      style={{ y: press.y }}
      className={cn(
        "relative isolate inline-flex h-11 items-center justify-center overflow-hidden rounded-pill border border-[color:var(--color-line)] bg-white px-6 text-sm font-medium text-ink-900",
        "[box-shadow:var(--depth-raised-sm),var(--edge-light)] hover:[box-shadow:var(--depth-raised-md),var(--edge-light)]",
        "hover:border-[color:var(--color-line-strong)]",
        "transition-[box-shadow,border-color] duration-200 motion-reduce:transition-none",
        FOCUS_RING,
        DISABLED,
        className,
      )}
      onPointerDown={(event: RPE<HTMLButtonElement>) => {
        const box = event.currentTarget.getBoundingClientRect();
        burst(event.clientX - box.left, event.clientY - box.top);
        press.handlers.onPointerDown();
      }}
      onKeyDown={(event) => {
        if (event.key === " " || event.key === "Enter") {
          const box = event.currentTarget.getBoundingClientRect();
          burst(box.width / 2, box.height / 2);
        }
        press.handlers.onKeyDown(event);
      }}
      onPointerUp={press.handlers.onPointerUp}
      onPointerLeave={press.handlers.onPointerLeave}
      onPointerCancel={press.handlers.onPointerCancel}
      onKeyUp={press.handlers.onKeyUp}
      onBlur={press.handlers.onBlur}
      {...props}
    >
      {bursts.map((b) => (
        <motion.span
          key={b.id}
          aria-hidden
          className="pointer-events-none absolute size-10 rounded-full"
          style={{ background: BLOOM, left: b.x - 20, top: b.y - 20 }}
          initial={{ opacity: 0, scale: 0.15 }}
          animate={{ opacity: [0, 0.85, 0], scale: [0.15, 3, 4] }}
          transition={{ duration: 0.68, times: [0, 0.32, 1], ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
});
