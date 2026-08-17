"use client";

import { springs, useMotionEnabled, usePointerCapability } from "@pinky-ui/primitives";
import { motion } from "motion/react";
import { useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";

import { cn } from "../internal/cn";
import { useCompactLayout } from "../internal/use-compact-layout";

export type PerspectiveBentoItem = { id: string; label: string; content: ReactNode; span?: 1 | 2; className?: string };
export type PerspectiveBentoProps = { items: PerspectiveBentoItem[]; columns?: 2 | 3 | 4; gap?: number; label?: string; className?: string; disabled?: boolean };

/** One shallow spatial plane for the whole bento; cells do not independently tilt. */
export function PerspectiveBento({ items, columns = 3, gap = 14, label = "Perspective bento", className, disabled = false }: PerspectiveBentoProps) {
  const motionEnabled = useMotionEnabled();
  const compact = useCompactLayout();
  const { hasHover } = usePointerCapability();
  const [active, setActive] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const enabled = motionEnabled && !disabled && hasHover;
  const columnCount = compact ? Math.min(columns, 2) : columns;

  const move = (event: PointerEvent<HTMLUListElement>) => {
    if (!enabled || event.pointerType === "touch" || event.pointerType === "pen" || !root.current) return;
    const box = root.current.getBoundingClientRect();
    root.current.style.setProperty("--bento-rx", `${((event.clientY - box.top) / box.height - 0.5) * -3}deg`);
    root.current.style.setProperty("--bento-ry", `${((event.clientX - box.left) / box.width - 0.5) * 3}deg`);
  };

  return <div ref={root} className={cn("[perspective:1200px]", className)} style={{ "--bento-rx": "0deg", "--bento-ry": "0deg" } as CSSProperties}><motion.ul aria-label={label} className="grid list-none p-0" style={{ gap, transform: "rotateX(var(--bento-rx)) rotateY(var(--bento-ry))", transformStyle: "preserve-3d" }} onPointerMove={move} onPointerLeave={() => { root.current?.style.setProperty("--bento-rx", "0deg"); root.current?.style.setProperty("--bento-ry", "0deg"); }}>
    {items.map((item) => { const focused = item.id === active; const neighbour = active !== null && !focused; return <motion.li key={item.id} className={cn("group min-h-32 overflow-hidden rounded-2xl", item.className)} style={{ gridColumn: `span ${Math.min(item.span ?? 1, columnCount)}`, transformStyle: "preserve-3d" }} animate={enabled ? { z: focused ? 18 : neighbour ? -4 : 0, scale: focused ? 1.02 : neighbour ? .99 : 1 } : { z: 0, scale: 1 }} transition={enabled ? { type: "spring", ...springs.soft } : { duration: 0 }} onPointerEnter={(event) => { if (event.pointerType !== "touch" && event.pointerType !== "pen") setActive(item.id); }} onPointerLeave={() => setActive(null)} onFocusCapture={() => setActive(item.id)} onBlurCapture={(event) => { if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) setActive(null); }}>{item.content}<span className={cn("pointer-events-none absolute right-3 bottom-3 rounded-pill bg-white/85 px-3 py-1.5 text-xs text-ink-700 shadow-soft transition-opacity", focused || compact ? "opacity-100" : "opacity-0")}>{item.label}</span></motion.li>; })}
  </motion.ul></div>;
}
