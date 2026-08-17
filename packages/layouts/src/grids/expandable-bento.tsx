"use client";

import { springs, useMotionEnabled } from "@pinky-ui/primitives";
import { motion } from "motion/react";
import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";

export type BentoItem = {
  id: string;
  /** Collapsed content — becomes the trigger. */
  preview: ReactNode;
  /** Shown in place once expanded. */
  detail: ReactNode;
  /** Column span while collapsed. */
  span?: 1 | 2;
  /** Row span while collapsed. */
  rows?: 1 | 2;
  label: string;
};

export type ExpandableBentoProps = {
  items: BentoItem[];
  columns?: number;
  expanded?: string | null;
  onExpandedChange?: (id: string | null) => void;
  gap?: number;
  className?: string;
};

/**
 * A bento grid whose tiles expand where they are.
 *
 * The expanded tile takes the full row and its neighbours reflow around it —
 * no modal, no overlay, nothing removed from the page. Because the tile stays
 * in place in the DOM, reading order and focus order survive the change, which
 * is the part a modal usually gets wrong.
 */
export function ExpandableBento({
  items,
  columns = 3,
  expanded: controlled,
  onExpandedChange,
  gap = 12,
  className,
}: ExpandableBentoProps) {
  const baseId = useId();
  const motionEnabled = useMotionEnabled();
  const [internal, setInternal] = useState<string | null>(null);
  const expanded = controlled !== undefined ? controlled : internal;
  const triggers = useRef(new Map<string, HTMLButtonElement>());

  const setExpanded = useCallback(
    (id: string | null) => {
      if (controlled === undefined) setInternal(id);
      onExpandedChange?.(id);
    },
    [controlled, onExpandedChange],
  );

  // Escape collapses, and focus goes back to the tile that opened.
  useEffect(() => {
    if (!expanded) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const id = expanded;
      setExpanded(null);
      triggers.current.get(id)?.focus();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [expanded, setExpanded]);

  const transition = motionEnabled
    ? { type: "spring" as const, ...springs.soft }
    : { duration: 0 };

  return (
    <ul
      className={className}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap,
        listStyle: "none",
        margin: 0,
        padding: 0,
      }}
    >
      {items.map((item) => {
        const isExpanded = expanded === item.id;
        const panelId = `${baseId}-panel-${item.id}`;

        return (
          <motion.li
            key={item.id}
            layout={motionEnabled}
            transition={transition}
            style={{
              gridColumn: isExpanded ? "1 / -1" : `span ${item.span ?? 1}`,
              gridRow: isExpanded ? "auto" : `span ${item.rows ?? 1}`,
            }}
          >
            <motion.div
              layout={motionEnabled}
              transition={transition}
              className="h-full overflow-hidden rounded-xl bg-white shadow-soft ring-1 ring-line"
            >
              <button
                ref={(node) => {
                  if (node) triggers.current.set(item.id, node);
                  else triggers.current.delete(item.id);
                }}
                type="button"
                aria-expanded={isExpanded}
                aria-controls={isExpanded ? panelId : undefined}
                onClick={() => setExpanded(isExpanded ? null : item.id)}
                className="block w-full cursor-pointer p-5 text-left"
              >
                {item.preview}
              </button>

              {isExpanded ? (
                <motion.div
                  id={panelId}
                  initial={motionEnabled ? { opacity: 0 } : false}
                  animate={{ opacity: 1 }}
                  transition={{ duration: motionEnabled ? 0.25 : 0 }}
                  className="border-t border-line px-5 pt-4 pb-5"
                >
                  {item.detail}
                  <button
                    type="button"
                    onClick={() => {
                      setExpanded(null);
                      triggers.current.get(item.id)?.focus();
                    }}
                    className="mt-4 rounded-pill px-3 py-1.5 text-xs text-ink-500 ring-1 ring-line transition-colors hover:text-ink-900"
                  >
                    Collapse
                  </button>
                </motion.div>
              ) : null}
            </motion.div>
          </motion.li>
        );
      })}
    </ul>
  );
}
