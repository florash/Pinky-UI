"use client";

import { usePointerGlow, usePressSpring } from "@pinky/primitives";
import { motion, useTransform } from "motion/react";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

import { cn } from "../../utils/cn";
import { DISABLED, FOCUS_RING, useEngagement } from "../tactile/internal";

export type SpotlightBorderButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onAnimationStart" | "onAnimationEnd" | "onDrag" | "onDragStart" | "onDragEnd"
> & { children: ReactNode };

/**
 * Construction: a white pill on a gradient underlayer that is masked down to a
 * 1px border. The gradient is a radial pool of blush that follows the pointer,
 * so the border brightens only where your cursor is.
 *
 * Motion signature — **light follows the pointer along the edge**. Unlike the
 * beam, nothing travels on its own: the lit spot is wherever you are, so the
 * button feels tracked rather than animated. Built on the existing
 * `usePointerGlow`, which writes position straight into CSS variables — the
 * whole effect costs one style write per frame and zero React renders.
 */
export const SpotlightBorderButton = forwardRef<HTMLButtonElement, SpotlightBorderButtonProps>(
  function SpotlightBorderButton({ children, className, disabled, type = "button", ...props }, ref) {
    const glowRef = usePointerGlow<HTMLButtonElement>({ disabled });
    const engagement = useEngagement();
    const press = usePressSpring({ scale: 1, disabled });
    const y = useTransform([engagement.value, press.pressed], ([hover, pressed]: number[]) =>
      (hover ?? 0) * -1.5 + (pressed ?? 0) * 2,
    );

    return (
      <motion.button
        ref={(node) => {
          glowRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        type={type}
        disabled={disabled}
        style={{ y }}
        className={cn(
          "group relative isolate inline-flex h-11 items-center justify-center rounded-pill p-px",
          FOCUS_RING,
          DISABLED,
          className,
        )}
        {...engagement.handlers}
        {...press.handlers}
        {...props}
      >
        <span aria-hidden className="absolute inset-0 rounded-pill bg-[color:var(--color-line)]" />
        <span
          aria-hidden
          className="absolute inset-0 rounded-pill opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
          style={{
            background:
              "radial-gradient(120px circle at var(--pinky-glow-x, 50%) var(--pinky-glow-y, 50%), var(--color-blush-300), var(--color-cloud-300) 45%, transparent 70%)",
          }}
        />
        <span className="relative z-10 inline-flex h-full w-full items-center justify-center rounded-pill bg-white px-6 text-sm font-medium text-ink-900">
          {children}
        </span>
      </motion.button>
    );
  },
);
