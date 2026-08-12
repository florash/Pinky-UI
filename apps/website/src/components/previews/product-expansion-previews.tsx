"use client";

import {
  AnnotatedTimeline,
  ChartTableView,
  ComparisonChart,
  ExpandableDataRow,
  ExpandingSearch,
  FilterRail,
  InteractiveBarRanking,
  InteractiveLineChart,
  InlineEditField,
  LinkedSmallMultiples,
  ProgressiveForm,
  ProgressiveStepWorkflow,
  RangeBrushChart,
  SelectionTray,
  SortableDataRows,
  StatusPipeline,
  ThresholdBandChart,
  ValidationField,
  type SortableDataRow,
} from "@pinky/systems";
import { useState, type ReactNode } from "react";

const PREVIEW_FILTERS = [{ id: "status", label: "Status", options: [{ id: "ready", label: "Ready", count: 12 }, { id: "review", label: "Review", count: 4 }] }, { id: "owner", label: "Owner", options: [{ id: "flora", label: "Flora", count: 7 }, { id: "team", label: "Team", count: 9 }] }];
const PREVIEW_COLUMNS = [{ id: "owner", label: "Owner" }, { id: "status", label: "Status" }];
const PREVIEW_VIZ_DATA = [
  { id: "mon", label: "Mon", value: 12, context: "Quiet start" },
  { id: "tue", label: "Tue", value: 15, context: "First campaign" },
  { id: "wed", label: "Wed", value: 14, context: "Midweek dip" },
  { id: "thu", label: "Thu", value: 19, context: "Release note" },
  { id: "fri", label: "Fri", value: 23, context: "Launch day" },
  { id: "sat", label: "Sat", value: 21, context: "Weekend" },
  { id: "sun", label: "Sun", value: 26, context: "Catch-up" },
];
const PREVIEW_TIMELINE_EVENTS = [
  { id: "campaign", index: 1, label: "Campaign", description: "The first campaign widened the audience." },
  { id: "release", index: 4, label: "Release", description: "The release note made the new flow visible." },
  { id: "review", index: 6, label: "Review", description: "The team reviewed the weekend catch-up." },
];
const PREVIEW_BANDS = [
  { id: "normal", label: "Normal", min: 0, max: 60 },
  { id: "warning", label: "Watch", min: 60, max: 80 },
  { id: "target", label: "Target", min: 80, max: 100 },
];
const PREVIEW_MULTIPLES = [
  { id: "revenue", label: "Revenue", data: PREVIEW_VIZ_DATA.map((point, index) => ({ ...point, value: point.value * 1.8 + index * 2 })), formatValue: (value: number) => `$${Math.round(value)}k` },
  { id: "conversion", label: "Conversion", data: PREVIEW_VIZ_DATA.map((point, index) => ({ ...point, value: 3 + index * 0.4 + (index === 4 ? 1.2 : 0) })), formatValue: (value: number) => `${value.toFixed(1)}%` },
  { id: "retention", label: "Retention", data: PREVIEW_VIZ_DATA.map((point, index) => ({ ...point, value: 74 + index * 1.4 - (index === 2 ? 3 : 0) })), formatValue: (value: number) => `${Math.round(value)}%` },
  { id: "sessions", label: "Sessions", data: PREVIEW_VIZ_DATA.map((point, index) => ({ ...point, value: 18 + index * 3 + (index === 5 ? 4 : 0) })), formatValue: (value: number) => `${Math.round(value)}k` },
];

export const PRODUCT_EXPANSION_PREVIEWS: Record<string, ReactNode> = {
  "interactive-line-chart": <InteractiveLineChart data={PREVIEW_VIZ_DATA} label="Weekly usage" formatValue={(value) => `${value}k`} />,
  "range-brush-chart": <RangeBrushChart data={PREVIEW_VIZ_DATA} label="Usage history" formatValue={(value) => `${value}k`} defaultStartIndex={1} defaultEndIndex={5} />,
  "comparison-chart": <ComparisonChart labels={PREVIEW_VIZ_DATA.map((point) => point.label)} series={[{ id: "a", label: "Studio", values: [52, 58, 56, 64, 72, 70, 78], marker: "circle" }, { id: "b", label: "Team", values: [44, 51, 49, 60, 63, 66, 69], marker: "square" }]} label="Studio and team comparison" formatValue={(value) => `${value}`} />,
  "annotated-timeline": <AnnotatedTimeline data={PREVIEW_VIZ_DATA} annotations={PREVIEW_TIMELINE_EVENTS} label="Launch timeline" formatValue={(value) => `${value}k`} />,
  "threshold-band-chart": <ThresholdBandChart data={[{ ...PREVIEW_VIZ_DATA[0]!, value: 42 }, { ...PREVIEW_VIZ_DATA[1]!, value: 58 }, { ...PREVIEW_VIZ_DATA[2]!, value: 66 }, { ...PREVIEW_VIZ_DATA[3]!, value: 74 }, { ...PREVIEW_VIZ_DATA[4]!, value: 88 }, { ...PREVIEW_VIZ_DATA[5]!, value: 79 }, { ...PREVIEW_VIZ_DATA[6]!, value: 94 }]} bands={PREVIEW_BANDS} label="Response time health" formatValue={(value) => `${value}ms`} />,
  "interactive-bar-ranking": <InteractiveBarRanking items={[{ id: "a", label: "Research", meta: "12 notes", values: { reach: 84, quality: 72 } }, { id: "b", label: "Prototype", meta: "9 notes", values: { reach: 68, quality: 91 } }, { id: "c", label: "Release", meta: "15 notes", values: { reach: 76, quality: 83 } }]} metrics={[{ id: "reach", label: "Reach", formatValue: (value) => `${value}%` }, { id: "quality", label: "Quality", formatValue: (value) => `${value}%` }]} label="Interaction ranking" />,
  "linked-small-multiples": <LinkedSmallMultiples charts={PREVIEW_MULTIPLES} label="Weekly metric comparison" />,
  "chart-table-view": <ChartTableView data={PREVIEW_VIZ_DATA} label="Weekly usage" summary="The same weekly usage data is available as a chart and a table." formatValue={(value) => `${value}k`} />,
  "inline-edit-field": <InlineEditField label="Workspace name" defaultValue="Pinky studio" description="Click the value to edit." />,
  "expanding-search": <ExpandingSearch placeholder="Search workspace" results={<p className="px-3 py-2 text-xs text-ink-500">Type to filter workspace items.</p>} />,
  "validation-field": <ValidationPreview />,
  "progressive-form": <ProgressiveFormPreview />,
  "filter-rail": <FilterRail groups={PREVIEW_FILTERS} resultsCount={16} />,
  "sortable-data-rows": <SortableDataRowsPreview />,
  "expandable-data-row": <ExpandableDataRow row={{ id: "preview-row", label: "Interaction audit", secondary: "Updated today", values: ["Flora", "Review"], detail: <p className="text-xs leading-relaxed text-ink-700">Detail stays attached to the row identity and can contain a next action.</p> }} columns={["Owner", "Status"]} />,
  "selection-tray": <SelectionTray items={[{ id: "brief", label: "Project brief", meta: "Ready" }, { id: "audit", label: "Interaction audit", meta: "Review" }, { id: "notes", label: "Release notes", meta: "Draft" }]} actions={[{ id: "archive", label: "Archive" }]} />,
};

export const WORKFLOW_EXPANSION_PREVIEWS: Record<string, ReactNode> = {
  "progressive-step-workflow": <ProgressiveStepWorkflowPreview />,
  "status-pipeline": <StatusPipelinePreview />,
};

function ValidationPreview() {
  const [value, setValue] = useState("");
  return <ValidationField label="Project email" value={value} onValueChange={setValue} placeholder="name@studio.com" validate={(current) => !current ? null : current.includes("@") ? { status: "valid", message: "Looks ready." } : { status: "invalid", message: "Add an @ and a domain." }} />;
}

function ProgressiveFormPreview() {
  return <ProgressiveForm steps={[{ id: "one", label: "Brief", description: "Name the work.", summary: "Pinky refresh", content: <p className="rounded-xl bg-cloud-50 p-3 text-xs text-ink-700">The first decision remains visible after you continue.</p> }, { id: "two", label: "Audience", description: "Choose the next reader.", content: <p className="rounded-xl bg-blush-50 p-3 text-xs text-ink-700">Design team · selected</p> }, { id: "three", label: "Review", description: "Check the handoff.", content: <p className="rounded-xl bg-cloud-50 p-3 text-xs text-ink-700">Ready for a final review.</p> }]} />;
}

function SortableDataRowsPreview() {
  const [items, setItems] = useState<SortableDataRow[]>([
    { id: "brief", label: "Project brief", secondary: "Updated today", values: { owner: "Flora", status: "Ready" } },
    { id: "audit", label: "Interaction audit", secondary: "Updated yesterday", values: { owner: "Team", status: "Review" } },
    { id: "notes", label: "Release notes", secondary: "Updated Friday", values: { owner: "Flora", status: "Draft" } },
  ]);
  return <SortableDataRows columns={PREVIEW_COLUMNS} items={items} onReorder={setItems} />;
}

function ProgressiveStepWorkflowPreview() {
  return <ProgressiveStepWorkflow steps={[{ id: "draft", label: "Draft", description: "Shape the brief.", summary: "Brief ready", content: <p className="rounded-xl bg-cloud-50 p-3 text-xs text-ink-700">One decision, kept in context.</p> }, { id: "review", label: "Review", description: "Check the path.", content: <p className="rounded-xl bg-blush-50 p-3 text-xs text-ink-700">Keyboard and touch checked.</p> }, { id: "release", label: "Release", description: "Hand it off.", content: <p className="rounded-xl bg-cloud-50 p-3 text-xs text-ink-700">Ready to ship.</p> }]} />;
}

function StatusPipelinePreview() {
  const [failed, setFailed] = useState(false);
  return <div className="w-full"><StatusPipeline stages={[{ id: "queued", label: "Queued", description: "Waiting" }, { id: "active", label: "Active", description: "Working" }, { id: "done", label: "Complete", description: "Ready" }]} failedId={failed ? "active" : undefined} onRetry={() => setFailed(false)} /><button type="button" onClick={() => setFailed(true)} className="mt-3 rounded-full border border-line px-3 py-2 text-xs text-ink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20">Simulate active failure</button></div>;
}
