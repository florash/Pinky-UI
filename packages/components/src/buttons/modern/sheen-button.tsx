"use client";

import { useMotionEnabled, usePressSpring } from "@pinky-ui/primitives";
import { motion } from "motion/react";
import { forwardRef, useEffect, useRef, useState, type ButtonHTMLAttributes, type PointerEvent as RPE, type ReactNode } from "react";

import { cn } from "../../utils/cn";
import { DISABLED, FOCUS_RING } from "../tactile/internal";

export type SheenButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onAnimationStart" | "onAnimationEnd" | "onDrag" | "onDragStart" | "onDragEnd"
> & { children: ReactNode };

/**
 * Construction: an ink pill with a narrow, steeply-angled band of light parked
 * off its left edge, clipped by the pill.
 *
 * Motion signature — **a single pass of light across the face**. Not a
 * background fade and not a colour change: a highlight physically crosses the
 * surface once per hover and exits. It reads as a material catching the light,
 * which is why it survives on a dark primary where a brightness change would
 * just look like a state bug.
 */
export const SheenButton = forwardRef<HTMLButtonElement, SheenButtonProps>(function SheenButton(
  { children, className, disabled, type = "button", ...props },
  ref,
) {
  const [pass, setPass] = useState(0);
  const motionEnabled = useMotionEnabled();
  const press = usePressSpring({ scale: 1, travel: 2, disabled });

  // Measured so the sheen travels the button's actual width via a single
  // `transform: translateX`, instead of animating `left` as a percentage —
  // `left`/`right`/`width`/`height` all force a layout recompute every
  // frame, where `transform` runs on the compositor. The starting -30% stays
  // a static offset (left-[-30%] below); only the additional travel is
  // animated, landing the sheen's left edge at exactly the same -30% / 115%
  // of the button's width the original percentage animation produced.
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [travel, setTravel] = useState(0);

  useEffect(() => {
    const node = buttonRef.current;
    if (!node) return;
    const measure = () => setTravel(node.offsetWidth * 1.45);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.button
      ref={(node) => {
        buttonRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      type={type}
      disabled={disabled}
      style={{ y: press.y }}
      className={cn(
        "relative isolate inline-flex h-11 items-center justify-center overflow-hidden rounded-pill bg-ink-900 px-6 text-sm font-medium text-milk",
        "[box-shadow:var(--depth-raised-sm)] hover:[box-shadow:var(--depth-raised-md)]",
        "transition-shadow duration-200 motion-reduce:transition-none",
        FOCUS_RING,
        DISABLED,
        className,
      )}
      onPointerEnter={(e: RPE<HTMLButtonElement>) => { if (e.pointerType !== "touch") setPass((n) => n + 1); }}
      onFocus={() => setPass((n) => n + 1)}
      {...press.handlers}
      {...props}
    >
      <motion.span
        aria-hidden
        key={pass}
        className="absolute inset-y-0 left-[-30%] w-16 skew-x-[-18deg]"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,.34), transparent)" }}
        initial={{ x: 0 }}
        animate={motionEnabled && pass > 0 ? { x: travel } : { x: 0 }}
        transition={motionEnabled ? { duration: 0.72, ease: [0.22, 1, 0.36, 1] } : { duration: 0 }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
});
