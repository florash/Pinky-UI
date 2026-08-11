"use client";

import { usePressSpring } from "@pinky/primitives";
import { motion } from "motion/react";
import { forwardRef, useCallback, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from "react";

import { buttonSurface, type MagneticButtonProps } from "./magnetic-button";

/** Motion owns these DOM events, and its signatures differ from React's. */
type ConflictingEvents = "onAnimationStart" | "onAnimationEnd" | "onDrag" | "onDragStart" | "onDragEnd";

export type RippleButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, ConflictingEvents> & {
  children: ReactNode;
  variant?: MagneticButtonProps["variant"];
  size?: MagneticButtonProps["size"];
  /** Scale at full press. */
  pressScale?: number;
  /** Colour of the expanding surface. */
  rippleColor?: string;
};

type Ripple = { id: number; x: number; y: number };

/**
 * A button that answers where it was pressed.
 *
 * Not the Material ripple: one soft surface expands from the press point and
 * fades within a few hundred milliseconds, under a whole-button compression
 * that rebounds on a spring. Keyboard activation gets the same response,
 * centred, so the two input methods feel like the same button.
 */
export const RippleButton = forwardRef<HTMLButtonElement, RippleButtonProps>(function RippleButton(
  {
    children,
    variant = "primary",
    size = "md",
    pressScale = 0.96,
    rippleColor = "rgba(255,255,255,0.5)",
    className,
    type = "button",
    disabled,
    onPointerDown,
    onKeyDown,
    ...props
  },
  ref,
) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const nextId = useRef(0);
  const press = usePressSpring({ scale: pressScale, disabled });

  const addRipple = useCallback(
    (x: number, y: number) => {
      if (!press.active) return;
      const id = nextId.current++;
      setRipples((current) => [...current, { id, x, y }]);
      // Removed on a timer rather than on animation end: a button unmounted
      // mid-press should not leave a listener behind.
      setTimeout(() => setRipples((current) => current.filter((r) => r.id !== id)), 620);
    },
    [press.active],
  );

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled}
      style={press.scale ? { scale: press.scale } : undefined}
      className={buttonSurface(variant, size, `relative isolate overflow-hidden ${className ?? ""}`)}
      onPointerDown={(event) => {
        const box = event.currentTarget.getBoundingClientRect();
        addRipple(event.clientX - box.left, event.clientY - box.top);
        press.handlers.onPointerDown();
        onPointerDown?.(event);
      }}
      onPointerUp={press.handlers.onPointerUp}
      onPointerLeave={press.handlers.onPointerLeave}
      onPointerCancel={press.handlers.onPointerCancel}
      onBlur={press.handlers.onBlur}
      onKeyDown={(event) => {
        if (event.key === " " || event.key === "Enter") {
          const box = event.currentTarget.getBoundingClientRect();
          addRipple(box.width / 2, box.height / 2);
        }
        press.handlers.onKeyDown(event);
        onKeyDown?.(event);
      }}
      onKeyUp={press.handlers.onKeyUp}
      {...props}
    >
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          aria-hidden
          initial={{ opacity: 0.5, scale: 0 }}
          animate={{ opacity: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute -z-10 size-[220px] rounded-pill"
          style={{
            left: ripple.x - 110,
            top: ripple.y - 110,
            background: `radial-gradient(circle, ${rippleColor}, transparent 68%)`,
          }}
        />
      ))}
      {children}
    </motion.button>
  );
});
