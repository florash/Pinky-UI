"use client";

import { useId, useState, type KeyboardEvent, type PointerEvent } from "react";

import { cn } from "../internal/cn";
import { clamp, extent, indexFromClientX, linePath, projectPoints, VIZ_HEIGHT, VIZ_PADDING, VIZ_WIDTH } from "./viz-utils";
import type { VizPoint } from "./viz-utils";

export type ThresholdBand = { id: string; label: string; min: number; max: number; description?: string };
export type ThresholdBandChartProps = { data: VizPoint[]; bands: ThresholdBand[]; label: string; formatValue?: (value: number) => string; className?: string };

export function ThresholdBandChart({ data, bands, label, formatValue = String, className }: ThresholdBandChartProps) {
  const id = useId();
  const [active, setActive] = useState(Math.max(data.length - 1, 0));
  const values = data.map((item) => item.value);
  const range = extent([...values, ...bands.flatMap((band) => [band.min, band.max])], true);
  const points = projectPoints(data, { min: range.min, max: range.max });
  const activeIndex = clamp(active, 0, Math.max(data.length - 1, 0));
  const selected = data[activeIndex];
  const band = bands.find((item) => selected && selected.value >= item.min && selected.value <= item.max) ?? bands.at(-1);
  const yForValue = (value: number) => VIZ_HEIGHT - VIZ_PADDING.bottom - ((value - range.min) / Math.max(range.max - range.min, 1)) * (VIZ_HEIGHT - VIZ_PADDING.top - VIZ_PADDING.bottom);

  const seek = (event: PointerEvent<SVGSVGElement>) => setActive(indexFromClientX(event.clientX, event.currentTarget.getBoundingClientRect(), data.length));
  const keys = (event: KeyboardEvent<SVGSVGElement>) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    setActive((current) => event.key === "Home" ? 0 : event.key === "End" ? Math.max(data.length - 1, 0) : clamp(current + (event.key === "ArrowRight" ? 1 : -1), 0, Math.max(data.length - 1, 0)));
  };

  return (
    <div className={cn("min-w-0", className)} data-viz-pattern="threshold-band-chart">
      <div role="status" aria-live="polite" aria-atomic="true" className="mb-4 flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-3"><span className="font-mono text-[0.65rem] tracking-[0.16em] text-ink-500 uppercase">{selected?.label} · {band?.label ?? "Outside bands"}</span><strong className="font-display text-xl tabular-nums">{selected ? formatValue(selected.value) : "—"}</strong></div>
      <div className="overflow-hidden rounded-2xl bg-white/70 p-2 sm:p-3">
        <svg role="img" tabIndex={0} aria-labelledby={`${id}-title`} aria-describedby={`${id}-description`} viewBox={`0 0 ${VIZ_WIDTH} ${VIZ_HEIGHT}`} preserveAspectRatio="none" className="h-52 w-full overflow-visible rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/30 sm:h-60" onPointerMove={seek} onPointerDown={seek} onKeyDown={keys}>
          <title id={`${id}-title`}>{label}</title>
          <desc id={`${id}-description`}>A trend over labelled normal, warning and target bands. Focus the chart and use arrow keys to read each value and band state.</desc>
          <g aria-hidden="true">
            {bands.map((item) => { const top = yForValue(item.max); const bottom = yForValue(item.min); return <g key={item.id}><rect x={VIZ_PADDING.left} y={top} width={VIZ_WIDTH - VIZ_PADDING.left - VIZ_PADDING.right} height={Math.max(bottom - top, 1)} fill={item.id === "target" ? "var(--color-cloud-100,#eaf6fd)" : item.id === "warning" ? "var(--color-blush-50,#fff7fa)" : "var(--color-white,#fff)"} opacity="0.9" /><line x1={VIZ_PADDING.left} x2={VIZ_WIDTH - VIZ_PADDING.right} y1={top} y2={top} stroke="var(--color-ink-500,#7b8492)" strokeOpacity="0.28" strokeDasharray="5 5" /><text x={VIZ_PADDING.left + 8} y={top + 14} fill="var(--color-ink-500,#7b8492)" fontSize="10">{item.label}</text></g>; })}
            <path d={linePath(points)} fill="none" stroke="var(--color-ink-900,#252933)" strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
            {points[activeIndex] ? <><line x1={points[activeIndex].x} x2={points[activeIndex].x} y1={VIZ_PADDING.top} y2={VIZ_HEIGHT - VIZ_PADDING.bottom} stroke="var(--color-ink-900,#252933)" strokeOpacity="0.22" strokeDasharray="4 5" /><path d={`M ${points[activeIndex].x - 6} ${points[activeIndex].y} L ${points[activeIndex].x} ${points[activeIndex].y - 6} L ${points[activeIndex].x + 6} ${points[activeIndex].y} L ${points[activeIndex].x} ${points[activeIndex].y + 6} Z`} fill="var(--color-blush-200,#f4c7d7)" stroke="var(--color-ink-900,#252933)" strokeWidth="2" /></> : null}
          </g>
          <g aria-hidden="true" className="fill-ink-500 font-mono text-[10px]"><text x={VIZ_PADDING.left} y={VIZ_HEIGHT - 6} textAnchor="start">{data[0]?.label}</text><text x={VIZ_WIDTH - VIZ_PADDING.right} y={VIZ_HEIGHT - 6} textAnchor="end">{data.at(-1)?.label}</text></g>
        </svg>
      </div>
      <ul aria-label="Threshold bands" className="mt-4 grid gap-2 sm:grid-cols-3">{bands.map((item) => <li key={item.id} className="rounded-xl border border-line bg-white/70 px-3 py-2 text-xs"><span className="font-medium">{item.label}</span><span className="mt-1 block tabular-nums text-ink-500">{formatValue(item.min)}–{formatValue(item.max)}</span></li>)}</ul>
      <p className="mt-3 text-xs leading-relaxed text-ink-500">Hairline thresholds, direct band labels and the diamond marker keep state legible without colour-only meaning.</p>
    </div>
  );
}
