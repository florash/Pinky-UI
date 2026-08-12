"use client";

import { useId, useState, type KeyboardEvent, type PointerEvent } from "react";

import { cn } from "../internal/cn";
import { clamp, extent, formatSigned, indexFromClientX, linePath, projectPoints, VIZ_HEIGHT, VIZ_PADDING, VIZ_WIDTH } from "./viz-utils";

export type ComparisonChartSeries = { id: string; label: string; values: number[]; marker?: "circle" | "square" };
export type ComparisonChartProps = { labels: string[]; series: [ComparisonChartSeries, ComparisonChartSeries]; label: string; formatValue?: (value: number) => string; className?: string };

export function ComparisonChart({ labels, series, label, formatValue = String, className }: ComparisonChartProps) {
  const id = useId();
  const [active, setActive] = useState(Math.max(labels.length - 1, 0));
  const values = series.flatMap((item) => item.values);
  const range = extent(values);
  const points = series.map((item) => projectPoints(item.values.map((value, index) => ({ value, id: `${item.id}-${index}`, label: labels[index] ?? String(index) })), { min: range.min, max: range.max }));
  const activeIndex = clamp(active, 0, Math.max(labels.length - 1, 0));
  const first = series[0].values[activeIndex] ?? 0;
  const second = series[1].values[activeIndex] ?? 0;
  const difference = second - first;

  const seek = (event: PointerEvent<SVGSVGElement>) => setActive(indexFromClientX(event.clientX, event.currentTarget.getBoundingClientRect(), labels.length));
  const keys = (event: KeyboardEvent<SVGSVGElement>) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    setActive((current) => event.key === "Home" ? 0 : event.key === "End" ? Math.max(labels.length - 1, 0) : clamp(current + (event.key === "ArrowRight" ? 1 : -1), 0, Math.max(labels.length - 1, 0)));
  };

  return (
    <div className={cn("min-w-0", className)} data-viz-pattern="comparison-chart">
      <div role="status" aria-live="polite" aria-atomic="true" className="mb-4 grid gap-3 border-b border-line pb-3 sm:grid-cols-[auto_1fr_auto] sm:items-end"><span className="font-mono text-[0.65rem] tracking-[0.16em] text-ink-500 uppercase">{labels[activeIndex]}</span><div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-700"><span><i aria-hidden="true" className="mr-1.5 inline-block size-2.5 rounded-full bg-ink-900" />{series[0].label} {formatValue(first)}</span><span><i aria-hidden="true" className="mr-1.5 inline-block size-2.5 border border-ink-900" />{series[1].label} {formatValue(second)}</span></div><strong className="tabular-nums">Difference {formatSigned(difference, formatValue)}</strong></div>
      <div className="overflow-hidden rounded-2xl bg-white/70 p-2 sm:p-3">
        <svg role="img" tabIndex={0} aria-labelledby={`${id}-title`} aria-describedby={`${id}-description`} viewBox={`0 0 ${VIZ_WIDTH} ${VIZ_HEIGHT}`} preserveAspectRatio="none" className="h-52 w-full overflow-visible rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/30 sm:h-60" onPointerMove={seek} onPointerDown={seek} onKeyDown={keys}>
          <title id={`${id}-title`}>{label}</title>
          <desc id={`${id}-description`}>Two aligned series. Focus the chart and use arrow keys to compare values and their difference at each label.</desc>
          <g aria-hidden="true">
            {[0, 0.5, 1].map((step) => { const y = VIZ_PADDING.top + step * (VIZ_HEIGHT - VIZ_PADDING.top - VIZ_PADDING.bottom); return <line key={step} x1={VIZ_PADDING.left} x2={VIZ_WIDTH - VIZ_PADDING.right} y1={y} y2={y} stroke="var(--color-line,#e5e9ef)" strokeDasharray="2 6" />; })}
            <path d={linePath(points[0] ?? [])} fill="none" stroke="var(--color-ink-900,#252933)" strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
            <path d={linePath(points[1] ?? [])} fill="none" stroke="var(--color-ink-500,#7b8492)" strokeWidth="3" strokeDasharray="7 5" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
            <line x1={points[0]?.[activeIndex]?.x} x2={points[1]?.[activeIndex]?.x} y1={points[0]?.[activeIndex]?.y} y2={points[1]?.[activeIndex]?.y} stroke="var(--color-blush-300,#f4c7d7)" strokeWidth="4" vectorEffect="non-scaling-stroke" />
            <line x1={points[0]?.[activeIndex]?.x} x2={points[0]?.[activeIndex]?.x} y1={VIZ_PADDING.top} y2={VIZ_HEIGHT - VIZ_PADDING.bottom} stroke="var(--color-ink-900,#252933)" strokeOpacity="0.22" strokeDasharray="4 5" vectorEffect="non-scaling-stroke" />
            {points[0]?.[activeIndex] ? <circle cx={points[0][activeIndex].x} cy={points[0][activeIndex].y} r="6" fill="var(--color-ink-900,#252933)" stroke="white" strokeWidth="2" /> : null}
            {points[1]?.[activeIndex] ? <rect x={points[1][activeIndex].x - 5} y={points[1][activeIndex].y - 5} width="10" height="10" fill="white" stroke="var(--color-ink-900,#252933)" strokeWidth="2" /> : null}
          </g>
          <g aria-hidden="true" className="fill-ink-500 font-mono text-[10px]"><text x={VIZ_PADDING.left} y={VIZ_HEIGHT - 6} textAnchor="start">{labels[0]}</text><text x={VIZ_WIDTH - VIZ_PADDING.right} y={VIZ_HEIGHT - 6} textAnchor="end">{labels.at(-1)}</text></g>
        </svg>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-ink-500">The solid circle, outlined square and direct difference rail keep the comparison readable without relying on colour alone.</p>
    </div>
  );
}
