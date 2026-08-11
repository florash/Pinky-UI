"use client";

import { useId, useState, type KeyboardEvent, type PointerEvent } from "react";

import { cn } from "../internal/cn";

export type SparklinePoint = { label: string; value: number };
export type InteractiveSparklineProps = {
  data: SparklinePoint[];
  label: string;
  summary?: string;
  area?: boolean;
  formatValue?: (value: number) => string;
  className?: string;
};

export function InteractiveSparkline({ data, label, summary, area = true, formatValue = String, className }: InteractiveSparklineProps) {
  const id = useId();
  const [active, setActive] = useState(Math.max(data.length - 1, 0));
  const width = 320; const height = 120; const pad = 10;
  const values = data.map((item) => item.value); const min = Math.min(...values, 0); const max = Math.max(...values, 1);
  const points = data.map((item, index) => ({ x: pad + (index / Math.max(data.length - 1, 1)) * (width - pad * 2), y: height - pad - ((item.value - min) / Math.max(max - min, 1)) * (height - pad * 2) }));
  const line = points.map((point) => `${point.x},${point.y}`).join(" ");
  const selected = data[active]; const point = points[active];
  const seek = (event: PointerEvent<SVGSVGElement>) => { const box = event.currentTarget.getBoundingClientRect(); setActive(Math.round(Math.min(Math.max((event.clientX - box.left) / Math.max(box.width, 1), 0), 1) * Math.max(data.length - 1, 0))); };
  const keys = (event: KeyboardEvent<SVGSVGElement>) => { if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return; event.preventDefault(); if (event.key === "Home") setActive(0); else if (event.key === "End") setActive(Math.max(data.length - 1, 0)); else setActive(Math.min(Math.max(active + (event.key === "ArrowRight" ? 1 : -1), 0), Math.max(data.length - 1, 0))); };
  return <figure className={cn("relative", className)}><svg role="img" tabIndex={0} aria-labelledby={`${id}-title ${id}-summary`} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" onPointerMove={seek} onPointerDown={seek} onKeyDown={keys} className="h-36 w-full overflow-visible focus-visible:outline-2"><title id={`${id}-title`}>{label}</title><desc id={`${id}-summary`}>{summary ?? `${data.length} points from ${data[0]?.label ?? "start"} to ${data.at(-1)?.label ?? "end"}.`}</desc>{area && points.length ? <polygon points={`${pad},${height - pad} ${line} ${width - pad},${height - pad}`} fill="var(--color-cloud-100,#eaf6fd)" /> : null}<polyline points={line} fill="none" stroke="var(--color-ink-900,#252933)" strokeWidth="3" vectorEffect="non-scaling-stroke" />{point ? <><line x1={point.x} x2={point.x} y1={pad} y2={height - pad} stroke="rgba(70,90,115,.18)" strokeDasharray="4 4" /><circle cx={point.x} cy={point.y} r="5" fill="var(--color-blush-300,#f4c7d7)" stroke="white" strokeWidth="2" vectorEffect="non-scaling-stroke" /></> : null}</svg>{selected ? <figcaption aria-live="polite" className="mt-2 flex justify-between text-sm"><span>{selected.label}</span><strong>{formatValue(selected.value)}</strong></figcaption> : null}</figure>;
}
