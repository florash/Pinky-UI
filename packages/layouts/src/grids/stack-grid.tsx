"use client";

import { springs, useMotionEnabled } from "@pinky-ui/primitives";
import { LayoutGroup, motion } from "motion/react";
import { Children, useId, useState, type ReactNode } from "react";

export type StackGridProps = {
  children: ReactNode;
  /** Controlled mode. Omit to let the component own its state. */
  mode?: "stack" | "grid";
  defaultMode?: "stack" | "grid";
  onModeChange?: (mode: "stack" | "grid") => void;
  columns?: number;
  /** Offset between cards while stacked, in px. */
  offset?: number;
  /** Rotation of stacked cards, in degrees. */
  rotation?: number;
  /** Renders the built-in toggle. Turn off to drive it from your own control. */
  controls?: boolean;
  label?: string;
  className?: string;
};

/**
 * One collection in two arrangements: a stack, and a grid.
 *
 * The cards are the same elements in both states — a shared layout animation
 * moves each one from where it was to where it belongs, so the pile visibly
 * unpacks itself. Nothing fades out and nothing is re-created, which is what
 * makes the change legible rather than merely animated.
 */
export function StackGrid({
  children,
  mode: controlledMode,
  defaultMode = "stack",
  onModeChange,
  columns = 3,
  offset = 14,
  rotation = 3,
  controls = true,
  label = "Collection",
  className,
}: StackGridProps) {
  const groupId = useId();
  const motionEnabled = useMotionEnabled();
  const [internal, setInternal] = useState(defaultMode);
  const mode = controlledMode ?? internal;
  const items = Children.toArray(children);

  const setMode = (next: "stack" | "grid") => {
    if (controlledMode === undefined) setInternal(next);
    onModeChange?.(next);
  };

  const transition = motionEnabled
    ? { type: "spring" as const, ...springs.soft }
    : { duration: 0 };

  return (
    <div className={className}>
      {controls ? (
        <div className="mb-6 flex items-center gap-3">
          <button
            type="button"
            aria-pressed={mode === "grid"}
            onClick={() => setMode(mode === "stack" ? "grid" : "stack")}
            className="rounded-pill bg-ink-900 px-4 py-2 text-sm font-medium text-milk transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25 focus-visible:ring-offset-2"
          >
            {mode === "stack" ? "Spread out" : "Stack up"}
          </button>
          <span className="font-mono text-xs text-ink-500">
            {items.length} items · {mode}
          </span>
        </div>
      ) : null}

      <LayoutGroup id={groupId}>
        {mode === "stack" ? (
          <ul
            aria-label={label}
            className="relative mx-auto list-none p-0"
            style={{ height: 320, maxWidth: 360 }}
          >
            {items.map((child, index) => {
              // Only the top few cards are visibly offset; the rest hide behind.
              const depth = Math.min(index, 4);
              return (
                <motion.li
                  key={index}
                  layout
                  layoutId={`${groupId}-item-${index}`}
                  transition={transition}
                  className="absolute inset-x-0 top-0"
                  style={{ zIndex: items.length - index }}
                  animate={{
                    y: depth * offset,
                    scale: 1 - depth * 0.035,
                    rotate: motionEnabled ? (index % 2 === 0 ? -1 : 1) * depth * rotation * 0.4 : 0,
                    opacity: index > 4 ? 0 : 1,
                  }}
                >
                  {child}
                </motion.li>
              );
            })}
          </ul>
        ) : (
          <ul
            aria-label={label}
            className="grid list-none gap-4 p-0"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          >
            {items.map((child, index) => (
              <motion.li
                key={index}
                layout
                layoutId={`${groupId}-item-${index}`}
                transition={transition}
                animate={{ y: 0, scale: 1, rotate: 0, opacity: 1 }}
              >
                {child}
              </motion.li>
            ))}
          </ul>
        )}
      </LayoutGroup>
    </div>
  );
}
