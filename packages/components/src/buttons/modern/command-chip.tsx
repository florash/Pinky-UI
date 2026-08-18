"use client";

import { usePressSpring } from "@pinky-ui/primitives";
import { motion, useTransform } from "motion/react";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

import { cn } from "../../utils/cn";
import { DISABLED, FOCUS_RING, useEngagement } from "../tactile/internal";

export type CommandChipProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onAnimationStart" | "onAnimationEnd" | "onDrag" | "onDragStart" | "onDragEnd"
> & {
  children: ReactNode;
  /** Rendered as a small keycap chamber on the right. */
  shortcut?: string;
};

/**
 * Construction: a label and a **keycap chamber** sharing one shell, divided by
 * a hairline. The chamber is genuinely recessed while the label side is flush,
 * so the two halves sit at different depths inside a single pill.
 *
 * Motion signature — **the keycap answers first**. On hover the chamber
 * brightens and rises toward flush while the label side barely moves; on press
 * the keycap depresses like a real key and the shell follows. It is the current
 * idiom for "this action also has a shortcut" and it needs the depth split to
 * read as a key rather than a badge.
 */
export const CommandChip = forwardRef<HTMLButtonElement, CommandChipProps>(function CommandChip(
  { children, shortcut = "⌘K", className, disabled, type = "button", ...props },
  ref,
) {
  const engagement = useEngagement();
  const press = usePressSpring({ scale: 1, disabled });
  const shellY = useTransform([engagement.value, press.pressed], ([h, p]: number[]) =>
    (h ?? 0) * -1.5 + (p ?? 0) * 2,
  );
  const capY = useTransform([engagement.value, press.pressed], ([h, p]: number[]) =>
    (h ?? 0) * -1 + (p ?? 0) * 2.5,
  );

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled}
      style={{ y: shellY }}
      className={cn(
        "inline-flex h-11 items-center gap-3 rounded-pill border border-[color:var(--color-line)] bg-white py-1 pr-1.5 pl-5 text-sm font-medium text-ink-900",
        "[box-shadow:var(--depth-raised-sm),var(--edge-light)] hover:[box-shadow:var(--depth-raised-md),var(--edge-light)]",
        "hover:border-[color:var(--color-line-strong)]",
        "transition-[box-shadow,border-color] duration-200 ease-[var(--ease-press)] motion-reduce:transition-none",
        FOCUS_RING,
        DISABLED,
        className,
      )}
      {...engagement.handlers}
      {...press.handlers}
      {...props}
    >
      {children}
      <motion.span
        aria-hidden
        style={{ y: capY }}
        className="grid h-8 min-w-9 place-items-center rounded-pill bg-cloud-50 px-2 font-mono text-[0.7rem] text-ink-700 [box-shadow:var(--depth-inset)]"
      >
        {shortcut}
      </motion.span>
    </motion.button>
  );
});
