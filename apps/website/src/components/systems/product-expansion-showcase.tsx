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

const filterGroups = [
  { id: "status", label: "Status", options: [{ id: "ready", label: "Ready", count: 12 }, { id: "review", label: "In review", count: 4 }] },
  { id: "owner", label: "Owner", options: [{ id: "flora", label: "Flora", count: 7 }, { id: "team", label: "Team", count: 9 }] },
];
const searchItems = ["Interaction audit", "Product systems", "Pinky UI release notes"];
const dataColumns = [{ id: "owner", label: "Owner" }, { id: "status", label: "Status" }];

export function ProductSystemsExpansion({ family }: { family: "forms" | "data" | "workflows" }) {
  return family === "forms" ? <FormsExpansion /> : family === "data" ? <DataExpansion /> : <WorkflowExpansion />;
}

function FormsExpansion() {
  const [query, setQuery] = useState("");
  const [email, setEmail] = useState("");
  const [savedName, setSavedName] = useState("Pinky workspace");
  const results = searchItems.filter((item) => item.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="mt-8 grid gap-5 lg:grid-cols-2">
      <ExpansionDemo id="inline-edit-field" title="Inline Edit Field" copy="The value, help text and save path stay attached to one product field."><InlineEditField label="Workspace name" value={savedName} onValueChange={setSavedName} description="Shown to collaborators in the workspace switcher." validate={(value) => value.trim().length < 3 ? "Use at least three characters." : null} /></ExpansionDemo>
      <ExpansionDemo id="expanding-search" title="Expanding Search" copy="A compact intent trigger opens a focused query without sending the user to another page."><ExpandingSearch value={query} onValueChange={setQuery} results={<div className="space-y-1">{results.length ? results.map((item) => <button key={item} type="button" className="block w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-cloud-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20">{item}</button>) : <p className="px-3 py-2 text-xs text-ink-500">No matching workspace items.</p>}</div>} /></ExpansionDemo>
      <ExpansionDemo id="validation-field" title="Validation Field" copy="Invalid, correcting and valid are readable states with the field still in place."><ValidationField label="Project email" type="email" value={email} onValueChange={setEmail} placeholder="name@studio.com" description="A local example; no request is sent." validate={(value) => !value ? null : value.includes("@") ? { status: "valid", message: "Looks ready." } : { status: "invalid", message: "Add an @ and a domain." }} /></ExpansionDemo>
      <ExpansionDemo id="progressive-form" title="Progressive Form" copy="Completed sections condense into context while the next useful decision opens."><ProgressiveForm steps={[{ id: "identity", label: "Identity", description: "Name the project.", summary: "North star refresh", content: <label className="block text-sm">Project name<input className="mt-2 w-full rounded-xl border border-line bg-milk px-3 py-2.5" defaultValue="North star refresh" /></label> }, { id: "audience", label: "Audience", description: "Choose who sees it next.", content: <div className="flex flex-wrap gap-2"><button type="button" className="rounded-full bg-ink-900 px-3 py-2 text-xs text-milk">Design team</button><button type="button" className="rounded-full border border-line px-3 py-2 text-xs">Whole studio</button></div> }, { id: "review", label: "Review", description: "Check the handoff.", content: <p className="rounded-xl bg-cloud-50 p-3 text-sm text-ink-700">The project is ready for a final review.</p> }]} /></ExpansionDemo>
    </div>
  );
}

function DataExpansion() {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [rows, setRows] = useState<SortableDataRow[]>([
    { id: "brief", label: "Project brief", secondary: "Updated 4m ago", values: { owner: "Flora", status: "Ready" } },
    { id: "audit", label: "Interaction audit", secondary: "Updated yesterday", values: { owner: "Team", status: "Review" } },
    { id: "release", label: "Release notes", secondary: "Updated Friday", values: { owner: "Flora", status: "Draft" } },
  ]);
  const [action, setAction] = useState("No batch action yet");
  return (
    <div className="mt-8 grid gap-5">
      <ExpansionDemo id="filter-rail" title="Filter Rail" copy="Grouped choices, active chips and result count remain one navigable surface."><FilterRail groups={filterGroups} value={filters} onValueChange={setFilters} resultsCount={filters.status || filters.owner ? 4 : 16} /></ExpansionDemo>
      <ExpansionDemo id="sortable-data-rows" title="Sortable Data Rows" copy="A structured table keeps columns intact while pointer, keyboard and touch paths all reorder the same rows."><SortableDataRows columns={dataColumns} items={rows} onReorder={setRows} /></ExpansionDemo>
      <ExpansionDemo id="expandable-data-row" title="Expandable Data Row" copy="The row opens its detail context in place instead of breaking the scan with a modal."><ExpandableDataRow row={{ id: "handoff", label: "Handoff review", secondary: "Today · 3 attachments", values: ["Flora", "Ready"], detail: <div className="flex flex-wrap items-center justify-between gap-3"><p className="max-w-xl text-sm leading-relaxed text-ink-700">Keyboard path, reduced motion and touch fallback have all been checked for this handoff.</p><button type="button" className="rounded-full bg-ink-900 px-3 py-2 text-xs text-milk">Open review</button></div> }} columns={["Owner", "Status"]} /></ExpansionDemo>
      <ExpansionDemo id="selection-tray" title="Selection Tray" copy="Batch actions enter the flow only after there is something selected."><SelectionTray items={[{ id: "one", label: "Project brief", meta: "Ready · Flora" }, { id: "two", label: "Interaction audit", meta: "Review · Team" }, { id: "three", label: "Release notes", meta: "Draft · Flora" }]} actions={[{ id: "archive", label: "Archive", onAction: (selected) => setAction(`${selected.length} item${selected.length === 1 ? "" : "s"} archived`) }, { id: "export", label: "Export", onAction: (selected) => setAction(`${selected.length} item${selected.length === 1 ? "" : "s"} queued`) }]} /><p aria-live="polite" className="mt-3 text-xs text-ink-500">{action}</p></ExpansionDemo>
    </div>
  );
}

function WorkflowExpansion() {
  const [failed, setFailed] = useState(false);
  return (
    <div className="mt-8 grid gap-5 lg:grid-cols-2">
      <ExpansionDemo id="progressive-step-workflow" title="Progressive Step Workflow" copy="Completed decisions become compact context while the active task and next decision remain visible."><ProgressiveStepWorkflow steps={[{ id: "draft", label: "Draft", description: "Shape the interaction brief.", summary: "Brief ready", content: <p className="rounded-xl bg-cloud-50 p-3 text-sm text-ink-700">Define the one decision this screen needs to make.</p> }, { id: "review", label: "Review", description: "Check keyboard and touch paths.", content: <div className="flex flex-wrap gap-2"><span className="rounded-full bg-cloud-50 px-3 py-2 text-xs">Keyboard path</span><span className="rounded-full bg-cloud-50 px-3 py-2 text-xs">Touch fallback</span></div> }, { id: "release", label: "Release", description: "Make the next state visible.", content: <p className="rounded-xl bg-blush-50 p-3 text-sm text-ink-700">Ready to hand the pattern to the product.</p> }]} /></ExpansionDemo>
      <ExpansionDemo id="status-pipeline" title="Status Pipeline" copy="Queued, active, complete and failed states stay on one spatial track, including retry."><StatusPipeline stages={[{ id: "queued", label: "Queued", description: "Waiting for a slot." }, { id: "active", label: "Active", description: "Processing the brief." }, { id: "complete", label: "Complete", description: "Ready for review." }]} failedId={failed ? "active" : undefined} onRetry={() => setFailed(false)} /><button type="button" onClick={() => setFailed(true)} className="mt-3 rounded-full border border-line px-3 py-2 text-xs text-ink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20">Simulate active failure</button></ExpansionDemo>
    </div>
  );
}

function ExpansionDemo({ id, title, copy, children }: { id: string; title: string; copy: string; children: ReactNode }) {
  return <article id={id} className="min-w-0 scroll-mt-24 rounded-[26px] border border-line bg-white/75 p-5 shadow-soft sm:p-6"><h3 className="text-xl font-semibold">{title}</h3><p className="mt-2 mb-6 text-sm leading-relaxed text-ink-700">{copy}</p>{children}</article>;
}
