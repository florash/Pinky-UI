"use client";

import { useId, useState, type KeyboardEvent, type PointerEvent } from "react";

import { cn } from "../internal/cn";
import { clamp, extent, indexFromClientX, linePath, projectPoints } from "./viz-utils";
import type { VizPoint } from "./viz-utils";

export type SmallMultiple = { id: string; label: string; data: VizPoint[]; formatValue?: (value: number) => string };
export type LinkedSmallMultiplesProps = { charts: SmallMultiple[]; label: string; className?: string };

export function LinkedSmallMultiples({ charts, label, className }: LinkedSmallMultiplesProps) {
  const id = useId();
  const [active, setActive] = useState(Math.max((charts[0]?.data.length ?? 1) - 1, 0));
  const length = charts[0]?.data.length ?? 0;
  const activeIndex = clamp(active, 0, Math.max(length - 1, 0));

  const seek = (event: PointerEvent<SVGSVGElement>) => setActive(indexFromClientX(event.clientX, event.currentTarget.getBoundingClientRect(), length));
  const keys = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    setActive((current) => event.key === "Home" ? 0 : event.key === "End" ? Math.max(length - 1, 0) : clamp(current + (event.key === "ArrowRight" ? 1 : -1), 0, Math.max(length - 1, 0)));
  };

  return (
    <div className={cn("min-w-0", className)} data-viz-pattern="linked-small-multiples">
      <div role="status" aria-live="polite" aria-atomic="true" className="mb-4 border-b border-line pb-3"><div className="flex flex-wrap items-baseline justify-between gap-3"><span className="font-mono text-[0.65rem] tracking-[0.16em] text-ink-500 uppercase">{charts[0]?.data[activeIndex]?.label}</span><span className="text-xs text-ink-500">One reading position, {charts.length} metrics</span></div><div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4">{charts.map((chart) => { const point = chart.data[activeIndex]; return <span key={chart.id} className="flex min-w-0 items-baseline justify-between gap-2 text-xs"><span className="truncate text-ink-500">{chart.label}</span><strong className="tabular-nums">{point ? (chart.formatValue ?? String)(point.value) : "—"}</strong></span>; })}</div></div>
      <div tabIndex={0} role="group" aria-labelledby={`${id}-title`} aria-describedby={`${id}-description`} onKeyDown={keys} className="rounded-2xl bg-white/70 p-2 outline-none focus-visible:ring-2 focus-visible:ring-ink-900/30 sm:p-3">
        <span id={`${id}-title`} className="sr-only">{label}</span>
        <span id={`${id}-description`} className="sr-only">Focus the collection and use arrow keys to move one shared reading position across every mini chart.</span>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {charts.map((chart) => {
            const range = extent(chart.data.map((item) => item.value));
            const points = projectPoints(chart.data, { min: range.min, max: range.max, width: 280, height: 150, padding: { top: 18, right: 12, bottom: 22, left: 12 } });
            const point = points[activeIndex];
            return <div key={chart.id} className="min-w-0 rounded-xl border border-line bg-cloud-50/60 p-3"><div className="flex items-baseline justify-between gap-2"><h3 className="truncate text-sm font-medium">{chart.label}</h3><span className="font-mono text-[0.58rem] text-ink-500">{chart.data[activeIndex]?.label}</span></div><svg aria-hidden="true" viewBox="0 0 280 150" preserveAspectRatio="none" className="mt-2 h-28 w-full" onPointerMove={seek} onPointerDown={seek}><path d={linePath(points)} fill="none" stroke="var(--color-ink-900,#252933)" strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" /><line x1={point?.x} x2={point?.x} y1="18" y2="128" stroke="var(--color-ink-900,#252933)" strokeOpacity="0.24" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />{point ? <circle cx={point.x} cy={point.y} r="5" fill="var(--color-blush-200,#f4c7d7)" stroke="var(--color-ink-900,#252933)" strokeWidth="2" /> : null}</svg><p className="mt-2 text-right text-xs tabular-nums text-ink-700">{chart.data[activeIndex] ? (chart.formatValue ?? String)(chart.data[activeIndex]!.value) : "—"}</p></div>;
          })}
        </div>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-ink-500">Pointer, touch and keyboard move one shared crosshair; each metric keeps its own direct value label.</p>
    </div>
  );
}
