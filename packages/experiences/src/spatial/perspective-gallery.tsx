"use client";

import { motion } from "motion/react";
import { useMotionEnabled } from "@pinky-ui/primitives";
import { useRef, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";

import { cn } from "../internal/cn";
import { useControllable } from "../internal/use-controllable";
import { useMediaQuery } from "../internal/use-media-query";

export type PerspectiveGalleryItem = { id: string; label: string; content: ReactNode };

export type PerspectiveGalleryProps = {
  items: PerspectiveGalleryItem[];
  activeId?: string;
  defaultActiveId?: string;
  onActiveChange?: (id: string) => void;
  perspective?: number;
  className?: string;
  disabled?: boolean;
  label?: string;
};

/**
 * A keyboard-selectable gallery with small, readable z-depth differences.
 *
 * Cards are absolutely positioned and self-centered (top-1/2 left-1/2 +
 * a translate(-50%, -50%) baked into the animated x/y), the same technique
 * SpatialCarousel uses — not flex-flowed. A flex row only centers itself as
 * a whole; whichever item happened to be "active" just sat wherever normal
 * flex flow put it, which was nowhere near center once the row's natural
 * width exceeded its container (the common case — this is a gallery, not a
 * one-screen-wide row). Callers must give this a height via `className`
 * (e.g. min-h-[...]) since absolutely positioned children no longer
 * contribute one.
 */
export function PerspectiveGallery({
  items,
  activeId,
  defaultActiveId,
  onActiveChange,
  perspective = 1100,
  className,
  disabled = false,
  label = "Gallery",
}: PerspectiveGalleryProps) {
  const [selected, setSelected] = useControllable(activeId, defaultActiveId ?? items[0]?.id ?? "", onActiveChange);
  const motionEnabled = useMotionEnabled();
  const compact = useMediaQuery("(max-width: 767px)");
  const flat = disabled || !motionEnabled || compact;
  const nodes = useRef(new Map<string, HTMLButtonElement>());
  const activeIndex = Math.max(items.findIndex((item) => item.id === selected), 0);

  const move = (event: ReactKeyboardEvent, delta: number | "first" | "last") => {
    if (items.length === 0) return;
    let next = activeIndex;
    if (delta === "first") next = 0;
    else if (delta === "last") next = items.length - 1;
    else next = (activeIndex + delta + items.length) % items.length;
    const item = items[next];
    if (!item) return;
    event.preventDefault();
    setSelected(item.id);
    nodes.current.get(item.id)?.focus();
  };

  return (
    <div
      role="listbox"
      aria-label={label}
      aria-activedescendant={selected ? `pinky-perspective-${selected}` : undefined}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") move(event, 1);
        else if (event.key === "ArrowLeft") move(event, -1);
        else if (event.key === "Home") move(event, "first");
        else if (event.key === "End") move(event, "last");
      }}
      className={cn("relative overflow-hidden py-8", className)}
      style={{ perspective: flat ? undefined : perspective }}
    >
      {items.map((item, index) => {
        const offset = index - activeIndex;
        const active = offset === 0;
        return (
          <motion.button
            key={item.id}
            id={`pinky-perspective-${item.id}`}
            ref={(node) => {
              if (node) nodes.current.set(item.id, node);
              else nodes.current.delete(item.id);
            }}
            type="button"
            role="option"
            aria-selected={active}
            aria-label={item.label}
            tabIndex={active ? 0 : -1}
            onClick={() => setSelected(item.id)}
            className="absolute top-1/2 left-1/2 overflow-hidden rounded-[22px] text-left"
            initial={false}
            animate={
              flat
                ? { x: `calc(-50% + ${offset * 76}%)`, y: "-50%", scale: active ? 1 : 0.94, opacity: Math.abs(offset) > 1 ? 0.35 : 1, rotateY: 0, z: 0 }
                : { x: `calc(-50% + ${offset * 64}%)`, y: "-50%", scale: 1 - Math.min(Math.abs(offset) * 0.07, 0.2), opacity: Math.abs(offset) > 2 ? 0.25 : 1, rotateY: offset * -5, z: Math.abs(offset) * -80 }
            }
            transition={{ type: "spring", stiffness: 210, damping: 30, mass: 1 }}
            style={{ zIndex: items.length - Math.abs(offset) }}
          >
            {item.content}
          </motion.button>
        );
      })}
    </div>
  );
}
