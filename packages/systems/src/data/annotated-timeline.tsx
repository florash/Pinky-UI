"use client";

import { useId, useState, type KeyboardEvent, type PointerEvent } from "react";

import { cn } from "../internal/cn";
import { areaPath, clamp, extent, indexFromClientX, linePath, projectPoints, VIZ_HEIGHT, VIZ_PADDING, VIZ_WIDTH } from "./viz-utils";
import type { VizPoint } from "./viz-utils";

export type TimelineAnnotation = { id: string; index: number; label: string; description: string };
export type AnnotatedTimelineProps = { data: VizPoint[]; annotations: TimelineAnnotation[]; label: string; formatValue?: (value: number) => string; className?: string };

export function AnnotatedTimeline({ data, annotations, label, formatValue = String, className }: AnnotatedTimelineProps) {
  const id = useId();
  const initialAnnotation = annotations[0];
  const [active, setActive] = useState(initialAnnotation ? clamp(initialAnnotation.index, 0, Math.max(data.length - 1, 0)) : Math.max(data.length - 1, 0));
  const [activeAnnotation, setActiveAnnotation] = useState<string | null>(initialAnnotation?.id ?? null);
  const values = data.map((item) => item.value);
  const range = extent(values);
  const points = projectPoints(data, { min: range.min, max: range.max });
  const activeIndex = clamp(active, 0, Math.max(data.length - 1, 0));
  const selected = data[activeIndex];
  const event = annotations.find((item) => item.id === activeAnnotation);

  const selectAnnotation = (annotation: TimelineAnnotation) => {
    setActiveAnnotation(annotation.id);
    setActive(clamp(annotation.index, 0, Math.max(data.length - 1, 0)));
  };
  const seek = (event: PointerEvent<SVGSVGElement>) => {
    setActive(indexFromClientX(event.clientX, event.currentTarget.getBoundingClientRect(), data.length));
    setActiveAnnotation(null);
  };
  const keys = (event: KeyboardEvent<SVGSVGElement>) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    setActive((current) => event.key === "Home" ? 0 : event.key === "End" ? Math.max(data.length - 1, 0) : clamp(current + (event.key === "ArrowRight" ? 1 : -1), 0, Math.max(data.length - 1, 0)));
    setActiveAnnotation(null);
  };

  return (
    <div className={cn("min-w-0", className)} data-viz-pattern="annotated-timeline">
      <div role="status" aria-live="polite" aria-atomic="true" className="mb-4 border-b border-line pb-3"><div className="flex flex-wrap items-baseline justify-between gap-3"><span className="font-mono text-[0.65rem] tracking-[0.16em] text-ink-500 uppercase">{selected?.label}</span><strong className="font-display text-xl tabular-nums">{selected ? formatValue(selected.value) : "—"}</strong></div>{event ? <p className="mt-2 text-sm leading-relaxed text-ink-700"><span className="font-medium">{event.label}.</span> {event.description}</p> : <p className="mt-2 text-xs text-ink-500">Arrow through the trend or focus an event marker to connect the change to its context.</p>}</div>
      <div className="relative overflow-hidden rounded-2xl bg-white/70 p-2 sm:p-3">
        <svg role="img" tabIndex={0} aria-labelledby={`${id}-title`} aria-describedby={`${id}-description`} viewBox={`0 0 ${VIZ_WIDTH} ${VIZ_HEIGHT}`} preserveAspectRatio="none" className="h-52 w-full overflow-visible rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/30 sm:h-60" onPointerMove={seek} onPointerDown={seek} onKeyDown={keys}>
          <title id={`${id}-title`}>{label}</title>
          <desc id={`${id}-description`}>A trend with {annotations.length} contextual event markers. Use arrow keys for data points or tab to an event marker.</desc>
          <g aria-hidden="true">
            {[0, 0.5, 1].map((step) => { const y = VIZ_PADDING.top + step * (VIZ_HEIGHT - VIZ_PADDING.top - VIZ_PADDING.bottom); return <line key={step} x1={VIZ_PADDING.left} x2={VIZ_WIDTH - VIZ_PADDING.right} y1={y} y2={y} stroke="var(--color-line,#e5e9ef)" strokeDasharray="2 6" />; })}
            <path d={areaPath(points)} fill="var(--color-cloud-100,#eaf6fd)" opacity="0.8" />
            <path d={linePath(points)} fill="none" stroke="var(--color-ink-900,#252933)" strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
            {annotations.map((annotation) => { const point = points[annotation.index]; if (!point) return null; const selectedEvent = annotation.id === activeAnnotation; return <g key={annotation.id}><line x1={point.x} x2={point.x} y1={VIZ_PADDING.top} y2={point.y} stroke={selectedEvent ? "var(--color-ink-900,#252933)" : "var(--color-ink-500,#7b8492)"} strokeDasharray="3 4" strokeOpacity={selectedEvent ? 0.6 : 0.35} vectorEffect="non-scaling-stroke" /><circle cx={point.x} cy={point.y} r={selectedEvent ? 6 : 4} fill={selectedEvent ? "var(--color-blush-200,#f4c7d7)" : "white"} stroke="var(--color-ink-900,#252933)" strokeWidth="2" /></g>; })}
            {points[activeIndex] ? <line x1={points[activeIndex].x} x2={points[activeIndex].x} y1={VIZ_PADDING.top} y2={VIZ_HEIGHT - VIZ_PADDING.bottom} stroke="var(--color-ink-900,#252933)" strokeOpacity="0.22" strokeDasharray="4 5" vectorEffect="non-scaling-stroke" /> : null}
          </g>
          <g aria-hidden="true" className="fill-ink-500 font-mono text-[10px]"><text x={VIZ_PADDING.left} y={VIZ_HEIGHT - 6} textAnchor="start">{data[0]?.label}</text><text x={VIZ_WIDTH - VIZ_PADDING.right} y={VIZ_HEIGHT - 6} textAnchor="end">{data.at(-1)?.label}</text></g>
        </svg>
        <div className="pointer-events-none absolute inset-x-2 top-2 h-10 sm:inset-x-3 sm:top-3">
          {annotations.map((annotation) => <button key={annotation.id} type="button" aria-label={`${annotation.label}: ${annotation.description}`} aria-pressed={annotation.id === activeAnnotation} onClick={() => selectAnnotation(annotation)} onFocus={() => selectAnnotation(annotation)} className="pointer-events-auto absolute grid min-h-9 min-w-9 -translate-x-1/2 place-items-center rounded-full border border-ink-900/30 bg-white text-[0.58rem] font-medium text-ink-900 shadow-soft transition-colors hover:bg-blush-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/30" style={{ left: `${percentForTimelineIndex(annotation.index, data.length)}%` }}>{annotation.index + 1}</button>)}
        </div>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">{annotations.map((annotation) => <button key={annotation.id} type="button" aria-pressed={annotation.id === activeAnnotation} onClick={() => selectAnnotation(annotation)} className={cn("rounded-xl border px-3 py-2 text-left text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/30", annotation.id === activeAnnotation ? "border-ink-900 bg-blush-50" : "border-line bg-white/70 hover:border-line-strong")}><span className="font-medium">{annotation.label}</span><span className="mt-1 block text-ink-500">{annotation.description}</span></button>)}</div>
    </div>
  );
}

function percentForTimelineIndex(index: number, length: number) {
  return (clamp(index, 0, Math.max(length - 1, 0)) / Math.max(length - 1, 1)) * 100;
}
