"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

import { cn } from "../internal/cn";
import { areaPath, clamp, extent, indexFromClientX, linePath, percentForIndex, projectPoints, VIZ_HEIGHT, VIZ_PADDING, VIZ_WIDTH } from "./viz-utils";
import type { VizPoint } from "./viz-utils";

export type RangeBrushChartProps = {
  data: VizPoint[];
  label: string;
  formatValue?: (value: number) => string;
  defaultStartIndex?: number;
  defaultEndIndex?: number;
  className?: string;
};

type BrushDrag = "start" | "end" | "window" | null;

const BRUSH_PADDING = { top: 14, right: 16, bottom: 20, left: 22 };

function brushPercentForIndex(index: number, length: number) {
  const plotStart = (BRUSH_PADDING.left / VIZ_WIDTH) * 100;
  const plotSpan = ((VIZ_WIDTH - BRUSH_PADDING.left - BRUSH_PADDING.right) / VIZ_WIDTH) * 100;
  return plotStart + (percentForIndex(index, length) / 100) * plotSpan;
}

export function RangeBrushChart({ data, label, formatValue = String, defaultStartIndex, defaultEndIndex, className }: RangeBrushChartProps) {
  const length = data.length;
  const lastIndex = Math.max(length - 1, 0);
  const initialStart = clamp(defaultStartIndex ?? Math.max(length - 5, 0), 0, Math.max(lastIndex - 1, 0));
  const initialEnd = clamp(defaultEndIndex ?? lastIndex, initialStart + 1, lastIndex);
  const [start, setStart] = useState(initialStart);
  const [end, setEnd] = useState(initialEnd);
  const [active, setActive] = useState(initialEnd);
  const [drag, setDrag] = useState<BrushDrag>(null);
  const dragOrigin = useRef({ index: 0, start: initialStart, end: initialEnd });

  const selected = data[clamp(active, start, end)];
  const values = data.map((item) => item.value);
  const range = extent(values);
  const overviewPoints = projectPoints(data, { min: range.min, max: range.max, height: 110, padding: BRUSH_PADDING });
  const focusData = data.slice(start, end + 1);
  const focusPoints = projectPoints(focusData, { min: range.min, max: range.max });
  const safeActive = clamp(active, start, end);
  const focusPoint = focusPoints[safeActive - start];
  const brushStartX = BRUSH_PADDING.left + (percentForIndex(start, length) / 100) * (VIZ_WIDTH - BRUSH_PADDING.left - BRUSH_PADDING.right);
  const brushEndX = BRUSH_PADDING.left + (percentForIndex(end, length) / 100) * (VIZ_WIDTH - BRUSH_PADDING.left - BRUSH_PADDING.right);

  const updateStart = (next: number) => {
    const bounded = clamp(next, 0, Math.max(end - 1, 0));
    setStart(bounded);
    setActive((current) => clamp(current, bounded, end));
  };
  const updateEnd = (next: number) => {
    const bounded = clamp(next, Math.min(start + 1, lastIndex), lastIndex);
    setEnd(bounded);
    setActive((current) => clamp(current, start, bounded));
  };
  const handleRangeKeyDown = (event: KeyboardEvent<HTMLInputElement>, update: (next: number) => void) => {
    const current = event.currentTarget.valueAsNumber;
    const min = Number(event.currentTarget.min);
    const max = Number(event.currentTarget.max);
    const next = event.key === "ArrowRight" || event.key === "ArrowUp"
      ? current + 1
      : event.key === "ArrowLeft" || event.key === "ArrowDown"
        ? current - 1
        : event.key === "Home"
          ? min
          : event.key === "End"
            ? max
            : null;
    if (next === null) return;
    event.preventDefault();
    update(clamp(next, min, max));
  };
  const reset = () => { setStart(initialStart); setEnd(initialEnd); setActive(initialEnd); };

  const brushIndex = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const plotLeft = rect.left + (BRUSH_PADDING.left / VIZ_WIDTH) * rect.width;
    const plotWidth = ((VIZ_WIDTH - BRUSH_PADDING.left - BRUSH_PADDING.right) / VIZ_WIDTH) * rect.width;
    return indexFromClientX(event.clientX, { left: plotLeft, width: plotWidth }, length);
  };
  const startBrush = (event: PointerEvent<HTMLDivElement>) => {
    if (length < 2) return;
    const index = brushIndex(event);
    const startDistance = Math.abs(index - start);
    const endDistance = Math.abs(index - end);
    const nextDrag: BrushDrag = startDistance <= endDistance && startDistance <= 1 ? "start" : endDistance < startDistance && endDistance <= 1 ? "end" : index >= start && index <= end ? "window" : index < start ? "start" : "end";
    dragOrigin.current = { index, start, end };
    setDrag(nextDrag);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };
  const moveBrush = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag) return;
    const index = brushIndex(event);
    const delta = index - dragOrigin.current.index;
    if (drag === "start") updateStart(index);
    if (drag === "end") updateEnd(index);
    if (drag === "window") {
      const width = dragOrigin.current.end - dragOrigin.current.start;
      const nextStart = clamp(dragOrigin.current.start + delta, 0, Math.max(lastIndex - width, 0));
      setStart(nextStart); setEnd(nextStart + width); setActive(clamp(active + (nextStart - start), nextStart, nextStart + width));
    }
  };
  const endBrush = (event: PointerEvent<HTMLDivElement>) => { setDrag(null); event.currentTarget.releasePointerCapture?.(event.pointerId); };

  if (!data.length) return <div className={cn("rounded-2xl border border-line bg-cloud-50 p-5 text-sm text-ink-500", className)}>No data points.</div>;

  return (
    <div className={cn("min-w-0", className)} data-viz-pattern="range-brush-chart">
      {selected ? <div role="status" aria-live="polite" aria-atomic="true" className="mb-4 flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-3"><span className="font-mono text-[0.65rem] tracking-[0.16em] text-ink-500 uppercase">{label} · {selected.label}</span><strong className="font-display text-xl tabular-nums">{formatValue(selected.value)}</strong></div> : null}
      <div className="overflow-hidden rounded-2xl bg-white/70 p-2 sm:p-3">
        <svg role="img" aria-label={`${label} focused range`} viewBox={`0 0 ${VIZ_WIDTH} ${VIZ_HEIGHT}`} preserveAspectRatio="none" className="h-52 w-full overflow-visible sm:h-60" onPointerMove={(event) => { const local = indexFromClientX(event.clientX, event.currentTarget.getBoundingClientRect(), focusData.length); setActive(start + local); }} onPointerDown={(event) => { const local = indexFromClientX(event.clientX, event.currentTarget.getBoundingClientRect(), focusData.length); setActive(start + local); }}>
          <g aria-hidden="true">
            {[0, 0.5, 1].map((step) => { const y = VIZ_PADDING.top + step * (VIZ_HEIGHT - VIZ_PADDING.top - VIZ_PADDING.bottom); return <line key={step} x1={VIZ_PADDING.left} x2={VIZ_WIDTH - VIZ_PADDING.right} y1={y} y2={y} stroke="var(--color-line,#e5e9ef)" strokeDasharray="2 6" />; })}
            <path d={areaPath(focusPoints)} fill="var(--color-blush-50,#fff7fa)" />
            <path d={linePath(focusPoints)} fill="none" stroke="var(--color-ink-900,#252933)" strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
            {focusPoint ? <><line x1={focusPoint.x} x2={focusPoint.x} y1={VIZ_PADDING.top} y2={VIZ_HEIGHT - VIZ_PADDING.bottom} stroke="var(--color-ink-900,#252933)" strokeOpacity="0.25" strokeDasharray="4 5" /><circle cx={focusPoint.x} cy={focusPoint.y} r="6" fill="var(--color-blush-200,#f4c7d7)" stroke="var(--color-ink-900,#252933)" strokeWidth="2" /></> : null}
          </g>
          <g aria-hidden="true" className="fill-ink-500 font-mono text-[10px]"><text x={VIZ_PADDING.left} y={VIZ_HEIGHT - 6} textAnchor="start">{data[start]?.label}</text><text x={VIZ_WIDTH - VIZ_PADDING.right} y={VIZ_HEIGHT - 6} textAnchor="end">{data[end]?.label}</text></g>
        </svg>
      </div>
      <div className="mt-5 rounded-2xl border border-line bg-cloud-50/75 p-3">
        <div className="flex items-center justify-between gap-3"><span className="font-mono text-[0.62rem] tracking-[0.14em] text-ink-500 uppercase">Selected window</span><button type="button" onClick={reset} className="rounded-pill border border-line bg-white px-3 py-1.5 text-xs text-ink-700 transition-colors hover:border-line-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25">Reset range</button></div>
        <div className="relative mt-4 h-16 touch-none" onPointerDown={startBrush} onPointerMove={moveBrush} onPointerUp={endBrush} onPointerCancel={endBrush}>
          <svg aria-hidden="true" viewBox="0 0 640 110" preserveAspectRatio="none" className="absolute inset-0 h-full w-full"><path d={linePath(overviewPoints)} fill="none" stroke="var(--color-ink-700,#505865)" strokeWidth="2" vectorEffect="non-scaling-stroke" /><path d={areaPath(overviewPoints, 110, 20)} fill="var(--color-cloud-200,#d9effa)" opacity="0.65" /><rect x={brushStartX} y="12" width={brushEndX - brushStartX} height="78" rx="12" fill="var(--color-blush-100,#fff0f5)" stroke="var(--color-ink-900,#252933)" strokeOpacity="0.25" /></svg>
          <label className="sr-only">Range start<input type="range" min={0} max={Math.max(end - 1, 0)} value={start} onChange={(event) => updateStart(event.currentTarget.valueAsNumber)} onKeyDown={(event) => handleRangeKeyDown(event, updateStart)} aria-label="Range start" aria-valuetext={data[start]?.label ?? ""} /></label>
          <label className="sr-only">Range end<input type="range" min={Math.min(start + 1, lastIndex)} max={lastIndex} value={end} onChange={(event) => updateEnd(event.currentTarget.valueAsNumber)} onKeyDown={(event) => handleRangeKeyDown(event, updateEnd)} aria-label="Range end" aria-valuetext={data[end]?.label ?? ""} /></label>
          <span aria-hidden="true" className="absolute top-1/2 size-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink-900 bg-white shadow-soft" style={{ left: `${brushPercentForIndex(start, length)}%` }} />
          <span aria-hidden="true" className="absolute top-1/2 size-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink-900 bg-white shadow-soft" style={{ left: `${brushPercentForIndex(end, length)}%` }} />
        </div>
        <div className="flex justify-between gap-3 text-xs text-ink-500"><span>{data[start]?.label}</span><span>{data[end]?.label}</span></div>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-ink-500">Drag the selected window or adjust either labelled handle. The focused chart keeps its reading position.</p>
    </div>
  );
}
