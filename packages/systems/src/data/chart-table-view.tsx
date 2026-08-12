"use client";

import { useId, useState, type KeyboardEvent, type PointerEvent } from "react";

import { cn } from "../internal/cn";
import { clamp, extent, indexFromClientX, linePath, projectPoints, VIZ_HEIGHT, VIZ_PADDING, VIZ_WIDTH } from "./viz-utils";
import type { VizPoint } from "./viz-utils";

export type ChartTableViewProps = { data: VizPoint[]; label: string; summary?: string; formatValue?: (value: number) => string; className?: string };

export function ChartTableView({ data, label, summary, formatValue = String, className }: ChartTableViewProps) {
  const id = useId();
  const [view, setView] = useState<"chart" | "table">("chart");
  const [active, setActive] = useState(Math.max(data.length - 1, 0));
  const values = data.map((item) => item.value);
  const range = extent(values);
  const points = projectPoints(data, { min: range.min, max: range.max });
  const activeIndex = clamp(active, 0, Math.max(data.length - 1, 0));
  const selected = data[activeIndex];

  const seek = (event: PointerEvent<SVGSVGElement>) => setActive(indexFromClientX(event.clientX, event.currentTarget.getBoundingClientRect(), data.length));
  const keys = (event: KeyboardEvent<SVGSVGElement>) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    setActive((current) => event.key === "Home" ? 0 : event.key === "End" ? Math.max(data.length - 1, 0) : clamp(current + (event.key === "ArrowRight" ? 1 : -1), 0, Math.max(data.length - 1, 0)));
  };
  const selectRow = (index: number) => setActive(index);
  const rowKeys = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? Math.max(data.length - 1, 0) : clamp(index + (event.key === "ArrowDown" ? 1 : -1), 0, Math.max(data.length - 1, 0));
    setActive(next);
    document.getElementById(`${id}-row-${next}`)?.focus();
  };

  return (
    <div className={cn("min-w-0", className)} data-viz-pattern="chart-table-view">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3"><div><p className="font-mono text-[0.65rem] tracking-[0.16em] text-ink-500 uppercase">Same data, two readings</p>{selected ? <p role="status" aria-live="polite" className="mt-1 text-sm text-ink-700">{selected.label} · <strong className="tabular-nums">{formatValue(selected.value)}</strong></p> : null}</div><div role="group" aria-label="Data view"><button type="button" aria-pressed={view === "chart"} onClick={() => setView("chart")} className={cn("rounded-l-pill border px-3 py-1.5 text-xs focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/30", view === "chart" ? "border-ink-900 bg-ink-900 text-milk" : "border-line bg-white text-ink-700")}>Chart</button><button type="button" aria-pressed={view === "table"} onClick={() => setView("table")} className={cn("rounded-r-pill border border-l-0 px-3 py-1.5 text-xs focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/30", view === "table" ? "border-ink-900 bg-ink-900 text-milk" : "border-line bg-white text-ink-700")}>Table</button></div></div>
      {view === "chart" ? <div className="mt-4 overflow-hidden rounded-2xl bg-white/70 p-2 sm:p-3"><svg role="img" tabIndex={0} aria-labelledby={`${id}-title`} aria-describedby={`${id}-description`} viewBox={`0 0 ${VIZ_WIDTH} ${VIZ_HEIGHT}`} preserveAspectRatio="none" className="h-52 w-full overflow-visible rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/30 sm:h-60" onPointerMove={seek} onPointerDown={seek} onKeyDown={keys}><title id={`${id}-title`}>{label}</title><desc id={`${id}-description`}>{summary ?? `A chart backed by a semantic table. Focus the chart and use arrow keys to read each row.`}</desc><g aria-hidden="true">{[0, 0.5, 1].map((step) => { const y = VIZ_PADDING.top + step * (VIZ_HEIGHT - VIZ_PADDING.top - VIZ_PADDING.bottom); return <line key={step} x1={VIZ_PADDING.left} x2={VIZ_WIDTH - VIZ_PADDING.right} y1={y} y2={y} stroke="var(--color-line,#e5e9ef)" strokeDasharray="2 6" />; })}<path d={linePath(points)} fill="none" stroke="var(--color-ink-900,#252933)" strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinecap="round" />{points[activeIndex] ? <><line x1={points[activeIndex].x} x2={points[activeIndex].x} y1={VIZ_PADDING.top} y2={VIZ_HEIGHT - VIZ_PADDING.bottom} stroke="var(--color-ink-900,#252933)" strokeOpacity="0.22" strokeDasharray="4 5" /><circle cx={points[activeIndex].x} cy={points[activeIndex].y} r="6" fill="var(--color-blush-200,#f4c7d7)" stroke="var(--color-ink-900,#252933)" strokeWidth="2" /></> : null}</g><g aria-hidden="true" className="fill-ink-500 font-mono text-[10px]"><text x={VIZ_PADDING.left} y={VIZ_HEIGHT - 6} textAnchor="start">{data[0]?.label}</text><text x={VIZ_WIDTH - VIZ_PADDING.right} y={VIZ_HEIGHT - 6} textAnchor="end">{data.at(-1)?.label}</text></g></svg><p className="mt-3 text-xs leading-relaxed text-ink-500">The table is the same data source, not a hidden accessibility-only duplicate.</p></div> : <div className="mt-4 overflow-x-auto rounded-2xl border border-line bg-white/70"><table className="w-full min-w-[18rem] text-left text-sm"><caption className="sr-only">{label} data table</caption><thead className="border-b border-line bg-cloud-50/70"><tr><th scope="col" className="px-4 py-3 font-mono text-[0.62rem] tracking-[0.14em] text-ink-500 uppercase">Period</th><th scope="col" className="px-4 py-3 text-right font-mono text-[0.62rem] tracking-[0.14em] text-ink-500 uppercase">Value</th><th scope="col" className="hidden px-4 py-3 font-mono text-[0.62rem] tracking-[0.14em] text-ink-500 uppercase sm:table-cell">Context</th></tr></thead><tbody>{data.map((item, index) => <tr key={item.id} aria-selected={index === activeIndex} className={cn("border-b border-line last:border-b-0", index === activeIndex && "bg-blush-50")}><th scope="row" className="px-2 py-2 font-medium"><button id={`${id}-row-${index}`} type="button" onClick={() => selectRow(index)} onKeyDown={(event) => rowKeys(event, index)} className="w-full rounded-lg px-2 py-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/30">{item.label}</button></th><td className="px-4 py-2 text-right tabular-nums">{formatValue(item.value)}</td><td className="hidden px-4 py-2 text-ink-500 sm:table-cell">{item.context ?? "—"}</td></tr>)}</tbody></table></div>}
    </div>
  );
}
