"use client";

import { motion } from "motion/react";
import { useMotionEnabled } from "@pinky/primitives";
import { useState } from "react";

import { cn } from "../internal/cn";

export type BarRankingItem = { id: string; label: string; meta?: string; values: Record<string, number> };
export type BarRankingMetric = { id: string; label: string; formatValue?: (value: number) => string };
export type InteractiveBarRankingProps = { items: BarRankingItem[]; metrics: BarRankingMetric[]; label: string; defaultMetric?: string; className?: string };

export function InteractiveBarRanking({ items, metrics, label, defaultMetric, className }: InteractiveBarRankingProps) {
  const motionEnabled = useMotionEnabled();
  const [metricId, setMetricId] = useState(defaultMetric ?? metrics[0]?.id ?? "");
  const [direction, setDirection] = useState<"asc" | "desc">("desc");
  const [active, setActive] = useState(items[0]?.id ?? null);
  const metric = metrics.find((item) => item.id === metricId) ?? metrics[0];
  const formatValue = metric?.formatValue ?? String;
  const valueFor = (item: BarRankingItem) => item.values[metric?.id ?? ""] ?? 0;
  const ceiling = Math.max(...items.map(valueFor), 1);
  const ordered = [...items].sort((a, b) => direction === "desc" ? valueFor(b) - valueFor(a) : valueFor(a) - valueFor(b));

  return (
    <div className={cn("min-w-0", className)} data-viz-pattern="interactive-bar-ranking">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
        <div role="group" aria-label="Ranking metric" className="flex flex-wrap gap-2">{metrics.map((item) => <button key={item.id} type="button" aria-pressed={item.id === metric?.id} onClick={() => setMetricId(item.id)} className={cn("rounded-pill border px-3 py-1.5 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/30", item.id === metric?.id ? "border-ink-900 bg-ink-900 text-milk" : "border-line bg-white text-ink-700 hover:border-line-strong")}>{item.label}</button>)}</div>
        <button type="button" aria-label={`Sort ${direction === "desc" ? "ascending" : "descending"}`} onClick={() => setDirection((current) => current === "desc" ? "asc" : "desc")} className="rounded-pill border border-line bg-white px-3 py-1.5 text-xs text-ink-700 transition-colors hover:border-line-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/30">{direction === "desc" ? "Highest first ↓" : "Lowest first ↑"}</button>
      </div>
      <motion.ol layout={motionEnabled} aria-label={label} className="mt-4 space-y-2">
        {ordered.map((item, index) => { const value = valueFor(item); const selected = item.id === active; return <motion.li key={item.id} layout={motionEnabled} transition={motionEnabled ? { type: "spring", stiffness: 280, damping: 28 } : { duration: 0 }} tabIndex={0} aria-label={`${index + 1}. ${item.label}: ${formatValue(value)}`} onFocus={() => setActive(item.id)} onMouseEnter={() => setActive(item.id)} className={cn("grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border px-3 py-3 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ink-900/30", selected ? "border-ink-900/30 bg-blush-50" : "border-line bg-white/70")}>
          <span className="font-mono text-xs tabular-nums text-ink-500">{String(index + 1).padStart(2, "0")}</span>
          <div className="min-w-0"><div className="flex flex-wrap items-baseline justify-between gap-2"><span className="truncate text-sm font-medium">{item.label}</span>{item.meta ? <span className="text-xs text-ink-500">{item.meta}</span> : null}</div><div aria-hidden="true" className="mt-2 h-2 overflow-hidden rounded-pill bg-cloud-100"><span className="block h-full rounded-pill bg-ink-900 transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${Math.max((value / ceiling) * 100, 3)}%` }} /></div></div>
          <strong className="tabular-nums text-sm">{formatValue(value)}</strong>
        </motion.li>; })}
      </motion.ol>
      <p className="mt-3 text-xs leading-relaxed text-ink-500">Change the metric or sort order. Rows keep their identity while the ranking changes.</p>
    </div>
  );
}
