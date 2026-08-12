"use client";

import {
  ExpandableDataRow,
  ExpandingSearch,
  FilterRail,
  InlineEditField,
  ProgressiveForm,
  ProgressiveStepWorkflow,
  SelectionTray,
  SortableDataRows,
  StatusPipeline,
  ValidationField,
  type SortableDataRow,
} from "@pinky/systems";
import { useState, type ReactNode } from "react";

const PREVIEW_FILTERS = [{ id: "status", label: "Status", options: [{ id: "ready", label: "Ready", count: 12 }, { id: "review", label: "Review", count: 4 }] }, { id: "owner", label: "Owner", options: [{ id: "flora", label: "Flora", count: 7 }, { id: "team", label: "Team", count: 9 }] }];
const PREVIEW_COLUMNS = [{ id: "owner", label: "Owner" }, { id: "status", label: "Status" }];

export const PRODUCT_EXPANSION_PREVIEWS: Record<string, ReactNode> = {
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
