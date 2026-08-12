"use client";

import { useId, useState, type KeyboardEvent, type PointerEvent } from "react";

import { cn } from "../internal/cn";
import { areaPath, clamp, extent, indexFromClientX, linePath, projectPoints, VIZ_HEIGHT, VIZ_PADDING, VIZ_WIDTH } from "./viz-utils";
import type { VizPoint } from "./viz-utils";

export type InteractiveLineChartProps = {
  data: VizPoint[];
  label: string;
  summary?: string;
  formatValue?: (value: number) => string;
  className?: string;
};

export function InteractiveLineChart({ data, label, summary, formatValue = String, className }: InteractiveLineChartProps) {
  const id = useId();
  const [active, setActive] = useState(Math.max(data.length - 1, 0));
  const values = data.map((item) => item.value);
  const range = extent(values);
  const points = projectPoints(data, { min: range.min, max: range.max });
  const activeIndex = clamp(active, 0, Math.max(data.length - 1, 0));
  const selected = data[activeIndex];
  const selectedPoint = points[activeIndex];

  const seek = (event: PointerEvent<SVGSVGElement>) => {
    setActive(indexFromClientX(event.clientX, event.currentTarget.getBoundingClientRect(), data.length));
  };

  const keys = (event: KeyboardEvent<SVGSVGElement>) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    setActive((current) => event.key === "Home" ? 0 : event.key === "End" ? Math.max(data.length - 1, 0) : clamp(current + (event.key === "ArrowRight" ? 1 : -1), 0, Math.max(data.length - 1, 0)));
  };

  if (!data.length) {
    return <div className={cn("rounded-2xl border border-line bg-cloud-50 p-5 text-sm text-ink-500", className)}>No data points.</div>;
  }

  return (
    <div className={cn("min-w-0", className)} data-viz-pattern="interactive-line-chart">
      {selected ? (
        <div role="status" aria-live="polite" aria-atomic="true" className="mb-4 flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-3">
          <span className="font-mono text-[0.65rem] tracking-[0.16em] text-ink-500 uppercase">{selected.label}</span>
          <strong className="font-display text-xl tabular-nums">{formatValue(selected.value)}</strong>
        </div>
      ) : null}
      <div className="overflow-hidden rounded-2xl bg-white/70 p-2 sm:p-3">
        <svg
          role="img"
          tabIndex={0}
          aria-labelledby={`${id}-title`}
          aria-describedby={`${id}-description`}
          viewBox={`0 0 ${VIZ_WIDTH} ${VIZ_HEIGHT}`}
          preserveAspectRatio="none"
          className="h-52 w-full overflow-visible rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/30 sm:h-60"
          onPointerMove={seek}
          onPointerDown={seek}
          onKeyDown={keys}
        >
          <title id={`${id}-title`}>{label}</title>
          <desc id={`${id}-description`}>{summary ?? `${data.length} data points. Focus the chart and use the arrow keys to read each point.`}</desc>
          <g aria-hidden="true">
            {[0, 0.5, 1].map((step) => {
              const y = VIZ_PADDING.top + step * (VIZ_HEIGHT - VIZ_PADDING.top - VIZ_PADDING.bottom);
              return <line key={step} x1={VIZ_PADDING.left} x2={VIZ_WIDTH - VIZ_PADDING.right} y1={y} y2={y} stroke="var(--color-line,#e5e9ef)" strokeDasharray="2 6" />;
            })}
            <path d={areaPath(points)} fill="var(--color-cloud-100,#eaf6fd)" opacity="0.8" />
            <path d={linePath(points)} fill="none" stroke="var(--color-ink-900,#252933)" strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
            {selectedPoint ? <>
              <line x1={selectedPoint.x} x2={selectedPoint.x} y1={VIZ_PADDING.top} y2={VIZ_HEIGHT - VIZ_PADDING.bottom} stroke="var(--color-ink-900,#252933)" strokeOpacity="0.25" strokeDasharray="4 5" vectorEffect="non-scaling-stroke" />
              <circle cx={selectedPoint.x} cy={selectedPoint.y} r="6" fill="var(--color-blush-200,#f4c7d7)" stroke="var(--color-ink-900,#252933)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            </> : null}
          </g>
          <g aria-hidden="true" className="fill-ink-500 font-mono text-[10px]">
            {data.filter((_, index) => index === 0 || index === data.length - 1 || index === activeIndex).map((item) => {
              const point = points[data.indexOf(item)];
              return point ? <text key={item.id} x={point.x} y={VIZ_HEIGHT - 6} textAnchor="middle">{item.label}</text> : null;
            })}
          </g>
        </svg>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-ink-500">Focus the plot, then use ← → to move through the reading points. Pointer and touch follow the same rail.</p>
    </div>
  );
}
