"use client";

import {
  ContextualFormattingBar,
  EditablePropertyRail,
  ExpandableComposer,
  InlineCommandField,
  MorphingInput,
  MultiValueBuilder,
  ProgressiveDisclosureField,
  RangeComposer,
  SegmentedInputComposer,
  SmartSuggestionField,
  TokenField,
  UnitScrubber,
  type InlineCommand,
  type MultiValueCondition,
  type PropertyRailItem,
} from "@pinky-ui/systems";
import { useState, type ReactNode } from "react";

const commands: InlineCommand[] = [
  { id: "date", label: "date", description: "Insert a due date token" },
  { id: "person", label: "person", description: "Mention a collaborator" },
  { id: "status", label: "status", description: "Attach a workflow state" },
];

const defaultConditions: MultiValueCondition[] = [
  { id: "status", field: "Status", operator: "is", value: "Active" },
  { id: "owner", field: "Owner", operator: "is", value: "Flora" },
];

const defaultProperties: PropertyRailItem[] = [
  { id: "name", label: "Name", value: "North star" },
  { id: "status", label: "Status", value: "In review", options: ["Draft", "In review", "Ready"] },
  { id: "priority", label: "Priority", value: "High", options: ["Low", "Medium", "High"] },
];

export function FormsInteractionShowcase() {
  const [note, setNote] = useState("A short release note");
  const [composer, setComposer] = useState("");
  const [tokens, setTokens] = useState(["Design", "Motion"]);
  const [conditions, setConditions] = useState(defaultConditions);
  const [suggestion, setSuggestion] = useState("");
  const [inlineCommands, setInlineCommands] = useState<InlineCommand[]>([]);
  const [properties, setProperties] = useState(defaultProperties);
  const [radius, setRadius] = useState(24);
  const [range, setRange] = useState({ start: 320, end: 960 });
  const [segments, setSegments] = useState(["2026", "08", "15"]);

  return (
    <div className="mt-20">
      <div className="max-w-2xl">
        <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-ink-500 uppercase">04 · Composition & editing</p>
        <h2 className="mt-4 text-section text-balance-tight">Inputs that change shape as intent becomes clear.</h2>
        <p className="mt-5 text-lg leading-relaxed text-ink-700">These systems keep the original field, the next decision and the editing context close together.</p>
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        <FormExhibit id="morphing-input" title="Morphing Input" copy="A compact value surface becomes a focused editor without losing its source identity."><MorphingInput label="Release note" value={note} onValueChange={setNote} description="Shown in the handoff summary." /></FormExhibit>
        <FormExhibit id="expandable-composer" title="Expandable Composer" copy="A one-line prompt grows into a multiline editing surface with attached tools."><ExpandableComposer label="Project note" value={composer} onValueChange={setComposer} onSubmit={() => setComposer("")} /></FormExhibit>
        <FormExhibit id="token-field" title="Token Field" copy="Confirmed values wrap as real tokens while the next value remains ready to type."><TokenField label="Topics" tokens={tokens} onTokensChange={setTokens} /></FormExhibit>
        <FormExhibit id="multi-value-builder" title="Multi-Value Builder" copy="Property, operator and value stay coordinated as one compact condition authoring surface."><MultiValueBuilder conditions={conditions} onConditionsChange={setConditions} /></FormExhibit>
        <FormExhibit id="smart-suggestion-field" title="Smart Suggestion Field" copy="Typed text stays raw until a visible suggestion is explicitly accepted."><SmartSuggestionField label="City" options={["Canberra", "Cairns", "Melbourne", "Sydney", "Wellington"]} value={suggestion} onValueChange={setSuggestion} onSelect={setSuggestion} /></FormExhibit>
        <FormExhibit id="inline-command-field" title="Inline Command Field" copy="Slash commands become removable content tokens instead of opening a navigation palette."><InlineCommandField label="Brief" commands={commands} tokens={inlineCommands} onTokensChange={setInlineCommands} /></FormExhibit>
      </div>

      <div className="mt-24 max-w-2xl">
        <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-ink-500 uppercase">05 · Context & validation</p>
        <h2 className="mt-4 text-section text-balance-tight">Reveal only the context the next decision needs.</h2>
      </div>
      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        <FormExhibit id="progressive-disclosure-field" title="Progressive Disclosure Field" copy="Choosing shipping reveals the address fields in the same document flow."><ProgressiveDisclosureField label="Delivery" defaultMode="ship" /></FormExhibit>
        <FormExhibit id="editable-property-rail" title="Editable Property Rail" copy="One property at a time becomes an editor while the object context remains stable."><EditablePropertyRail items={properties} onItemsChange={setProperties} /></FormExhibit>
        <FormExhibit id="contextual-formatting-bar" title="Contextual Formatting Bar" copy="Select a phrase in the note to reveal formatting tools attached to that selection."><ContextualFormattingBar label="Handoff note" defaultContent="Select a phrase to shape its emphasis." /></FormExhibit>
      </div>

      <div className="mt-24 max-w-2xl">
        <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-ink-500 uppercase">06 · Adjustable values</p>
        <h2 className="mt-4 text-section text-balance-tight">Precision can still feel tactile.</h2>
      </div>
      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        <FormExhibit id="unit-scrubber" title="Unit Scrubber" copy="Drag the bounded surface or type a precise number; both paths update the same unit value."><UnitScrubber label="Corner radius" value={radius} onValueChange={setRadius} min={0} max={64} unit="px" /></FormExhibit>
        <FormExhibit id="range-composer" title="Range Composer" copy="Two endpoints share one track and remain ordered while either value changes."><RangeComposer label="Canvas width" start={range.start} end={range.end} onRangeChange={setRange} min={160} max={1280} unit="px" /></FormExhibit>
        <FormExhibit id="segmented-input-composer" title="Segmented Input Composer" copy="One date value is entered through three labelled, keyboard-connected segments."><SegmentedInputComposer label="Release date" segments={segments} onSegmentsChange={setSegments} /></FormExhibit>
      </div>
    </div>
  );
}

function FormExhibit({ id, title, copy, children }: { id: string; title: string; copy: string; children: ReactNode }) {
  return <article id={id} className="min-w-0 scroll-mt-24 rounded-[26px] border border-line bg-white/75 p-5 shadow-soft sm:p-6"><h3 className="text-xl font-semibold text-ink-900">{title}</h3><p className="mt-2 mb-6 text-sm leading-relaxed text-ink-700">{copy}</p>{children}</article>;
}
