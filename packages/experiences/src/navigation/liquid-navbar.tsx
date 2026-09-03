"use client";

import { motion } from "motion/react";
import { springs, useMotionEnabled } from "@pinky-ui/primitives";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";

import { cn } from "../internal/cn";
import { useControllable } from "../internal/use-controllable";

export type LiquidNavbarItem = {
  id: string;
  label: ReactNode;
  href?: string;
  disabled?: boolean;
  onSelect?: () => void;
};

export type LiquidNavbarProps = {
  items: LiquidNavbarItem[];
  activeId?: string;
  defaultActiveId?: string;
  onActiveChange?: (id: string) => void;
  /** Directional stretch while the active surface travels. */
  stretch?: number;
  "aria-label"?: string;
  className?: string;
};

type Slot = { left: number; width: number };

/** A semantic navbar with a softly stretching active surface. */
export function LiquidNavbar({
  items,
  activeId,
  defaultActiveId,
  onActiveChange,
  stretch = 0.08,
  className,
  "aria-label": ariaLabel = "Primary",
}: LiquidNavbarProps) {
  const first = items.find((item) => !item.disabled)?.id ?? items[0]?.id ?? "";
  const [selected, setSelected] = useControllable(
    activeId,
    defaultActiveId ?? first,
    onActiveChange,
  );
  const motionEnabled = useMotionEnabled();
  const listRef = useRef<HTMLUListElement>(null);
  const nodes = useRef(new Map<string, HTMLElement>());
  const previousCenter = useRef(0);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [direction, setDirection] = useState(0);
  const [travelling, setTravelling] = useState(false);

  const measure = useCallback(() => {
    const list = listRef.current;
    const node = nodes.current.get(selected);
    if (!list || !node) return;
    const listBox = list.getBoundingClientRect();
    const box = node.getBoundingClientRect();
    const next = { left: box.left - listBox.left, width: box.width };
    const center = next.left + next.width / 2;
    if (previousCenter.current) setDirection(Math.sign(center - previousCenter.current));
    previousCenter.current = center;
    setSlot(next);
  }, [selected]);

  useLayoutEffect(measure, [measure]);

  useEffect(() => {
    const observer =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    if (listRef.current) observer?.observe(listRef.current);
    window.addEventListener("resize", measure, { passive: true });
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  useEffect(() => {
    if (!motionEnabled) return;
    setTravelling(true);
    const timer = window.setTimeout(() => setTravelling(false), 300);
    return () => window.clearTimeout(timer);
  }, [motionEnabled, selected]);

  const enabled = items.filter((item) => !item.disabled);

  const move = (event: ReactKeyboardEvent, id: string, delta: number | "first" | "last") => {
    if (enabled.length === 0) return;
    const index = enabled.findIndex((item) => item.id === id);
    let next = index;
    if (delta === "first") next = 0;
    else if (delta === "last") next = enabled.length - 1;
    else next = (Math.max(index, 0) + delta + enabled.length) % enabled.length;
    const item = enabled[next];
    if (!item) return;
    event.preventDefault();
    setSelected(item.id);
    nodes.current.get(item.id)?.focus();
  };

  return (
    <nav aria-label={ariaLabel} className={cn("max-w-full", className)}>
      <ul
        ref={listRef}
        className="relative flex max-w-full items-center gap-1 overflow-x-auto rounded-[999px] border border-[color:var(--color-line,rgba(70,90,115,.1))] bg-[color:color-mix(in_oklab,var(--color-white,#fff)_82%,transparent)] p-1.5"
      >
        {/*
          width still animates to real per-item pixel widths (labels vary in
          length) — scaleX already carries the elastic travel stretch, and
          stacking the base sizing onto scaleX too would compound into visible
          corner distortion on this rounded-[999px] pill instead of a clean
          resize. x/scaleX/skewX are transform already.
        */}
        {slot ? (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute top-1.5 bottom-1.5 left-0 rounded-[999px] bg-[color:var(--color-ink-900,#252933)] shadow-[0_8px_24px_rgba(37,41,51,.12)]"
            initial={false}
            animate={{
              x: slot.left,
              width: slot.width,
              scaleX: travelling ? 1 + Math.min(Math.max(stretch, 0), 0.2) : 1,
              skewX: travelling ? direction * 2.5 : 0,
            }}
            transition={motionEnabled ? { type: "spring", ...springs.responsive } : { duration: 0 }}
          />
        ) : null}

        {items.map((item) => {
          const active = item.id === selected;
          const itemClass = cn(
            "relative z-10 block rounded-[999px] px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors",
            active ? "text-[color:var(--color-milk,#fcfbf8)]" : "text-[color:var(--color-ink-700,#505865)]",
            item.disabled && "pointer-events-none opacity-40",
          );
          const common = {
            ref: (node: HTMLAnchorElement | HTMLButtonElement | null) => {
              if (node) nodes.current.set(item.id, node);
              else nodes.current.delete(item.id);
            },
            onKeyDown: (event: ReactKeyboardEvent) => {
              if (event.key === "ArrowRight") move(event, item.id, 1);
              else if (event.key === "ArrowLeft") move(event, item.id, -1);
              else if (event.key === "Home") move(event, item.id, "first");
              else if (event.key === "End") move(event, item.id, "last");
            },
          };

          return (
            <li key={item.id}>
              {item.href ? (
                <a
                  {...common}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => {
                    setSelected(item.id);
                    item.onSelect?.();
                  }}
                  className={itemClass}
                >
                  {item.label}
                </a>
              ) : (
                <button
                  {...common}
                  type="button"
                  disabled={item.disabled}
                  aria-pressed={active}
                  onClick={() => {
                    setSelected(item.id);
                    item.onSelect?.();
                  }}
                  className={itemClass}
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
