"use client";

import { springs, useMotionEnabled } from "@pinky/primitives";
import { motion } from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "../utils/cn";

export type GooeyMenuItem = {
  id: string;
  label: ReactNode;
  href?: string;
  disabled?: boolean;
};

export type GooeyMenuProps = {
  items: GooeyMenuItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** How far the trailing blob lags. 0 disables the goo entirely. */
  stickiness?: number;
  "aria-label"?: string;
  className?: string;
};

type Slot = { left: number; width: number };

/**
 * Navigation whose selection travels as a connected blob.
 *
 * Two shapes move to the selected item at different speeds; a blur-and-contrast
 * layer fuses them while they are apart, so the selection appears to stretch
 * and snap back together rather than slide. The filter is confined to one small
 * decorative layer — the labels above it stay perfectly crisp, which is what
 * usually goes wrong with gooey menus.
 */
export function GooeyMenu({
  items,
  value,
  defaultValue,
  onValueChange,
  stickiness = 1,
  className,
  "aria-label": ariaLabel = "Sections",
}: GooeyMenuProps) {
  const motionEnabled = useMotionEnabled();
  const listRef = useRef<HTMLUListElement>(null);
  const nodes = useRef(new Map<string, HTMLElement>());

  const firstEnabled = items.find((item) => !item.disabled)?.id ?? items[0]?.id ?? "";
  const [internal, setInternal] = useState(defaultValue ?? firstEnabled);
  const selected = value ?? internal;
  const [slot, setSlot] = useState<Slot | null>(null);

  const measure = useCallback(() => {
    const list = listRef.current;
    const node = nodes.current.get(selected);
    if (!list || !node) return;

    const listBox = list.getBoundingClientRect();
    const box = node.getBoundingClientRect();
    setSlot({ left: box.left - listBox.left, width: box.width });
  }, [selected]);

  // Layout effect so the blob is never painted at a stale position.
  useLayoutEffect(measure, [measure]);

  useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const select = (id: string) => {
    if (value === undefined) setInternal(id);
    onValueChange?.(id);
  };

  /**
   * The blur-and-contrast filter only exists while the selection is moving.
   * At rest it would leave a soft, slightly ragged edge on the pill — and it
   * would keep a filtered layer alive on a page that is doing nothing.
   */
  const [travelling, setTravelling] = useState(false);

  useEffect(() => {
    if (!motionEnabled || stickiness <= 0) return;
    setTravelling(true);
    const timer = setTimeout(() => setTravelling(false), 520);
    return () => clearTimeout(timer);
  }, [motionEnabled, selected, stickiness]);

  const goo = motionEnabled && stickiness > 0 && travelling;
  const transition = motionEnabled ? { type: "spring" as const, ...springs.responsive } : { duration: 0 };
  const trailing = motionEnabled
    ? {
        type: "spring" as const,
        stiffness: springs.responsive.stiffness - 150 * stickiness,
        damping: springs.responsive.damping - 6 * stickiness,
        mass: springs.responsive.mass + 0.25 * stickiness,
      }
    : { duration: 0 };

  return (
    <nav aria-label={ariaLabel} className={cn("inline-block", className)}>
      <ul ref={listRef} className="relative flex items-center gap-1 rounded-pill bg-blush-50/80 p-1.5 ring-1 ring-line/70">
        {slot ? (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={goo ? { filter: "blur(7px) contrast(14)" } : undefined}
          >
            <motion.span
              className="absolute top-1.5 bottom-1.5 rounded-pill bg-ink-900"
              animate={{ left: slot.left, width: slot.width }}
              transition={transition}
            />
            {goo ? (
              <motion.span
                className="absolute top-2.5 bottom-2.5 rounded-pill bg-ink-900"
                animate={{ left: slot.left + slot.width * 0.15, width: slot.width * 0.7 }}
                transition={trailing}
              />
            ) : null}
          </span>
        ) : null}

        {items.map((item) => {
          const isSelected = item.id === selected;
          const className = cn(
            "relative z-10 block rounded-pill px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25 focus-visible:ring-offset-2",
            item.disabled && "pointer-events-none opacity-40",
            isSelected ? "text-milk" : "text-ink-700 hover:text-ink-900",
          );

          return (
            <li
              key={item.id}
              ref={(node) => {
                if (node) nodes.current.set(item.id, node);
                else nodes.current.delete(item.id);
              }}
            >
              {item.href ? (
                <a
                  href={item.href}
                  aria-current={isSelected ? "page" : undefined}
                  onClick={() => select(item.id)}
                  className={className}
                >
                  {item.label}
                </a>
              ) : (
                <button
                  type="button"
                  aria-current={isSelected ? "true" : undefined}
                  disabled={item.disabled}
                  onClick={() => select(item.id)}
                  className={className}
                >
                  {item.label}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
