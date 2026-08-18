"use client";

import { springs, useMotionEnabled } from "@pinky-ui/primitives";
import { AnimatePresence, motion, useMotionValue, useTransform } from "motion/react";
import { Children, useCallback, useState, type ReactNode } from "react";

export type DraggableCardStackProps = {
  children: ReactNode;
  /** Distance in px past which a drag dismisses the card. */
  threshold?: number;
  /** Maximum rotation while dragging, in degrees. */
  rotation?: number;
  /** Send dismissed cards to the back instead of removing them. */
  loop?: boolean;
  onDismiss?: (index: number) => void;
  /** Renders the built-in previous/next controls. */
  controls?: boolean;
  label?: string;
  className?: string;
};

/**
 * A stack of cards where the top one can be thrown away.
 *
 * Drag is an accelerator, never the only way through: the controls below the
 * stack do everything the gesture does, they are ordinary buttons, and they
 * work with a keyboard and a screen reader. A component that can only be
 * operated by dragging is a component some people simply cannot use.
 */
export function DraggableCardStack({
  children,
  threshold = 110,
  rotation = 12,
  loop = true,
  onDismiss,
  controls = true,
  label = "Card stack",
  className,
}: DraggableCardStackProps) {
  const motionEnabled = useMotionEnabled();
  const items = Children.toArray(children);
  const [order, setOrder] = useState(() => items.map((_, index) => index));
  const [live, setLive] = useState("");

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-rotation, 0, rotation]);
  const opacity = useTransform(x, [-320, -140, 0, 140, 320], [0, 1, 1, 1, 0]);

  const advance = useCallback(() => {
    setOrder((current) => {
      if (current.length === 0) return current;
      const [top, ...rest] = current;
      if (top === undefined) return current;
      onDismiss?.(top);
      const next = loop ? [...rest, top] : rest;
      setLive(
        next.length > 0
          ? `Card ${items.length - next.length + 1} of ${items.length} dismissed.`
          : "No cards left.",
      );
      return next;
    });
    x.set(0);
  }, [items.length, loop, onDismiss, x]);

  const rewind = useCallback(() => {
    setOrder((current) => {
      if (current.length === 0) return current;
      const last = current[current.length - 1];
      if (last === undefined) return current;
      return [last, ...current.slice(0, -1)];
    });
    x.set(0);
  }, [x]);

  const visible = order.slice(0, 3);

  return (
    <div className={className}>
      <div className="relative mx-auto" style={{ height: 300, maxWidth: 340 }}>
        <AnimatePresence initial={false}>
          {visible.map((itemIndex, depth) => {
            const isTop = depth === 0;

            return (
              <motion.div
                key={itemIndex}
                className="absolute inset-x-0 top-0"
                style={{
                  zIndex: visible.length - depth,
                  ...(isTop && motionEnabled ? { x, rotate, opacity } : {}),
                }}
                animate={{
                  // Cards underneath rise as the one above them leaves.
                  y: depth * 16,
                  scale: 1 - depth * 0.05,
                }}
                exit={motionEnabled ? { opacity: 0, scale: 0.95 } : { opacity: 0 }}
                transition={motionEnabled ? { type: "spring", ...springs.soft } : { duration: 0 }}
                drag={isTop && motionEnabled ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.55}
                onDragEnd={(_, info) => {
                  if (Math.abs(info.offset.x) > threshold) advance();
                  else x.set(0);
                }}
              >
                {items[itemIndex]}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {order.length === 0 ? (
          <p className="absolute inset-0 grid place-items-center text-sm text-ink-500">
            Nothing left in the stack.
          </p>
        ) : null}
      </div>

      {/* The gesture has a keyboard equivalent, always. */}
      {controls ? (
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={rewind}
            disabled={order.length === 0}
            className="rounded-pill bg-white px-4 py-2 text-sm text-ink-700 ring-1 ring-line transition-colors hover:text-ink-900 disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={advance}
            disabled={order.length === 0}
            className="rounded-pill bg-ink-900 px-4 py-2 text-sm font-medium text-milk transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      ) : null}

      <p aria-live="polite" className="sr-only">
        {live}
      </p>
      <p className="sr-only">{label}</p>
    </div>
  );
}
