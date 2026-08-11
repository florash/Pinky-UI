"use client";

import { useMotionEnabled } from "@pinky/primitives";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

import { cn } from "../internal/cn";
import { useCompactLayout } from "../internal/use-compact-layout";

export type FloatingColumn = { id: string; label?: string; items: ReactNode[]; direction?: "up" | "down"; speed?: number };
export type FloatingColumnsProps = { columns: FloatingColumn[]; gap?: number; className?: string; disabled?: boolean };

/** Editorial columns drift at different scroll rates and flatten on touch/reduced motion. */
export function FloatingColumns({ columns, gap = 16, className, disabled = false }: FloatingColumnsProps) {
  const motionEnabled = useMotionEnabled();
  const compact = useCompactLayout();
  const section = useRef<HTMLElement>(null);
  const enabled = motionEnabled && !disabled && !compact;
  const columnCount = compact ? 1 : Math.max(columns.length, 1);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start end", "end start"] });

  return <section ref={section} aria-label="Floating editorial columns" className={cn("grid items-start", className)} style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`, gap }}>
    {columns.map((column, index) => <FloatingColumnView key={column.id} column={column} index={index} progress={scrollYProgress} enabled={enabled} gap={gap} />)}
  </section>;
}

function FloatingColumnView({ column, index, progress, enabled, gap }: { column: FloatingColumn; index: number; progress: ReturnType<typeof useScroll>["scrollYProgress"]; enabled: boolean; gap: number }) {
  const amount = (column.speed ?? 1) * (column.direction === "down" ? 1 : -1) * (18 + index * 7);
  const y = useTransform(progress, [0, 1], enabled ? [amount, -amount] : [0, 0]);
  return <motion.div style={{ y }} className={cn("flex flex-col", index % 2 === 1 && "pt-10 sm:pt-20")} transition={{ type: "spring" }}>
    {column.label ? <p className="mb-4 font-mono text-[0.65rem] tracking-[0.16em] text-ink-500 uppercase">{column.label}</p> : null}
    <div className="flex flex-col" style={{ gap }}>{column.items.map((item, itemIndex) => <div key={itemIndex} className="group overflow-hidden rounded-2xl border border-line bg-white shadow-soft transition-shadow duration-300 hover:shadow-lift">{item}</div>)}</div>
  </motion.div>;
}
