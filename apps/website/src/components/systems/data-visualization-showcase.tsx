"use client";

import {
  AnnotatedTimeline,
  ChartTableView,
  ComparisonChart,
  InteractiveBarRanking,
  InteractiveLineChart,
  LinkedSmallMultiples,
  RangeBrushChart,
  ThresholdBandChart,
} from "@pinky-ui/systems";
import type { ReactNode } from "react";

const DATA = [
  { id: "mon", label: "Mon", value: 12, context: "Quiet start" },
  { id: "tue", label: "Tue", value: 15, context: "First campaign" },
  { id: "wed", label: "Wed", value: 14, context: "Midweek dip" },
  { id: "thu", label: "Thu", value: 19, context: "Release note" },
  { id: "fri", label: "Fri", value: 23, context: "Launch day" },
  { id: "sat", label: "Sat", value: 21, context: "Weekend" },
  { id: "sun", label: "Sun", value: 26, context: "Catch-up" },
];

const EVENTS = [
  { id: "campaign", index: 1, label: "Campaign", description: "The first campaign widened the audience." },
  { id: "release", index: 4, label: "Release", description: "The release note made the new flow visible." },
  { id: "review", index: 6, label: "Review", description: "The team reviewed the weekend catch-up." },
];

const BANDS = [
  { id: "normal", label: "Normal", min: 0, max: 60 },
  { id: "warning", label: "Watch", min: 60, max: 80 },
  { id: "target", label: "Target", min: 80, max: 100 },
];

const MULTIPLES = [
  { id: "revenue", label: "Revenue", data: DATA.map((point, index) => ({ ...point, value: point.value * 1.8 + index * 2 })), formatValue: (value: number) => `$${Math.round(value)}k` },
  { id: "conversion", label: "Conversion", data: DATA.map((point, index) => ({ ...point, value: 3 + index * 0.4 + (index === 4 ? 1.2 : 0) })), formatValue: (value: number) => `${value.toFixed(1)}%` },
  { id: "retention", label: "Retention", data: DATA.map((point, index) => ({ ...point, value: 74 + index * 1.4 - (index === 2 ? 3 : 0) })), formatValue: (value: number) => `${Math.round(value)}%` },
  { id: "sessions", label: "Sessions", data: DATA.map((point, index) => ({ ...point, value: 18 + index * 3 + (index === 5 ? 4 : 0) })), formatValue: (value: number) => `${Math.round(value)}k` },
];

const HEALTH = [
  { ...DATA[0]!, value: 42 },
  { ...DATA[1]!, value: 58 },
  { ...DATA[2]!, value: 66 },
  { ...DATA[3]!, value: 74 },
  { ...DATA[4]!, value: 88 },
  { ...DATA[5]!, value: 79 },
  { ...DATA[6]!, value: 94 },
];

export function DataVisualizationShowcase({ compact = false }: { compact?: boolean }) {
  return (
    <section className="mx-auto max-w-[76rem] px-5 pt-24 sm:px-8 sm:pt-28" aria-labelledby="data-visualization-title">
      <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-ink-500 uppercase">04 · Data visualization</p>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-5">
        <div className="max-w-3xl"><h2 id="data-visualization-title" className="text-section text-balance-tight">Read the data without losing the surface.</h2><p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-700">A small chart language for reading, comparison, selection and context. Every surface has a direct value path, a keyboard path and a table-minded fallback.</p></div>
        <p className="max-w-[14rem] font-mono text-[0.625rem] leading-relaxed tracking-[0.12em] text-ink-500 uppercase">quiet / precise / inspectable</p>
      </div>
      <div className="mt-10 grid gap-4 lg:grid-cols-12">
        <VizExhibit title="Interactive Line Chart" copy="A hairline crosshair snaps to the nearest point and keeps the value in a reading rail." className="lg:col-span-7 bg-cloud-50/70"><InteractiveLineChart data={DATA} label="Weekly usage" formatValue={(value) => `${value}k`} /></VizExhibit>
        <VizExhibit title="Range Brush Chart" copy="Overview and focused reading share one selected window." className="lg:col-span-5 bg-white/75"><RangeBrushChart data={DATA} label="Usage history" formatValue={(value) => `${value}k`} defaultStartIndex={1} defaultEndIndex={5} /></VizExhibit>
        <VizExhibit title="Comparison Chart" copy="Two series expose the gap directly instead of relying on a floating tooltip." className="lg:col-span-6 bg-blush-50/55"><ComparisonChart labels={DATA.map((point) => point.label)} series={[{ id: "studio", label: "Studio", values: [52, 58, 56, 64, 72, 70, 78] }, { id: "team", label: "Team", values: [44, 51, 49, 60, 63, 66, 69], marker: "square" }]} label="Studio and team comparison" formatValue={(value) => `${value}`} /></VizExhibit>
        <VizExhibit title="Annotated Timeline" copy="Events explain the curve while remaining a small, traversable set of buttons." className="lg:col-span-6 bg-white/75"><AnnotatedTimeline data={DATA} annotations={EVENTS} label="Launch timeline" formatValue={(value) => `${value}k`} /></VizExhibit>
        <VizExhibit title="Threshold / Band Chart" copy="State is carried by labelled bands, hairlines and the active marker—not colour alone." className="lg:col-span-5 bg-cloud-50/70"><ThresholdBandChart data={HEALTH} bands={BANDS} label="Response time health" formatValue={(value) => `${value}ms`} /></VizExhibit>
        <VizExhibit title="Interactive Bar Ranking" copy="Metric changes and sorting preserve the identity of each row." className="lg:col-span-7 bg-white/75"><InteractiveBarRanking items={[{ id: "research", label: "Research", meta: "12 notes", values: { reach: 84, quality: 72 } }, { id: "prototype", label: "Prototype", meta: "9 notes", values: { reach: 68, quality: 91 } }, { id: "release", label: "Release", meta: "15 notes", values: { reach: 76, quality: 83 } }]} metrics={[{ id: "reach", label: "Reach", formatValue: (value) => `${value}%` }, { id: "quality", label: "Quality", formatValue: (value) => `${value}%` }]} label="Interaction ranking" /></VizExhibit>
        <VizExhibit title="Linked Small Multiples" copy="Four metrics share one reading position without becoming four independent tooltips." className="lg:col-span-8 bg-blush-50/45"><LinkedSmallMultiples charts={MULTIPLES} label="Weekly metric comparison" /></VizExhibit>
        <VizExhibit title="Chart ↔ Table View" copy="The same dataset remains available as a chart or a real semantic table." className="lg:col-span-4 bg-cloud-50/70"><ChartTableView data={DATA} label="Weekly usage" summary="The same weekly usage data is available as a chart and a table." formatValue={(value) => `${value}k`} /></VizExhibit>
      </div>
      {!compact ? <p className="mt-6 max-w-2xl text-xs leading-relaxed text-ink-500">Illustrative local data only. The point is the reading relationship, not a dashboard claim.</p> : null}
    </section>
  );
}

function VizExhibit({ title, copy, className, children }: { title: string; copy: string; className: string; children: ReactNode }) {
  return <article className={`min-w-0 rounded-[26px] border border-line p-5 sm:p-6 ${className}`}><h3 className="text-xl font-semibold tracking-tight">{title}</h3><p className="mt-2 mb-6 max-w-xl text-sm leading-relaxed text-ink-700">{copy}</p>{children}</article>;
}
