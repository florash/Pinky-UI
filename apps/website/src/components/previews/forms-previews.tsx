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

const previewCommands: InlineCommand[] = [
  { id: "date", label: "date", description: "Add a due date" },
  { id: "person", label: "person", description: "Mention someone" },
  { id: "status", label: "status", description: "Set a state" },
];

const previewProperties: PropertyRailItem[] = [
  { id: "status", label: "Status", value: "Review", options: ["Draft", "Review", "Ready"] },
  { id: "owner", label: "Owner", value: "Flora" },
];

const previewConditions: MultiValueCondition[] = [{ id: "one", field: "Status", operator: "is", value: "Active" }];

function PreviewFrame({ children }: { children: ReactNode }) {
  return <div className="flex min-h-44 w-full items-center justify-center overflow-hidden rounded-[18px] bg-white/65 p-3">{children}</div>;
}

function MorphingInputPreview() {
  const [value, setValue] = useState("Add a release note");
  return <PreviewFrame><MorphingInput label="Release note" value={value} onValueChange={setValue} /></PreviewFrame>;
}

function ComposerPreview() {
  const [value, setValue] = useState("");
  return <PreviewFrame><ExpandableComposer label="Project note" value={value} onValueChange={setValue} onSubmit={() => setValue("")} /></PreviewFrame>;
}

function TokenPreview() {
  const [tokens, setTokens] = useState(["Design", "Motion"]);
  return <PreviewFrame><TokenField label="Topics" tokens={tokens} onTokensChange={setTokens} /></PreviewFrame>;
}

function BuilderPreview() {
  const [conditions, setConditions] = useState(previewConditions);
  return <PreviewFrame><MultiValueBuilder conditions={conditions} onConditionsChange={setConditions} /></PreviewFrame>;
}

function SuggestionPreview() {
  const [value, setValue] = useState("");
  return <PreviewFrame><SmartSuggestionField label="City" options={["Canberra", "Cairns", "Melbourne", "Sydney"]} value={value} onValueChange={setValue} onSelect={setValue} /></PreviewFrame>;
}

function CommandPreview() {
  const [tokens, setTokens] = useState<InlineCommand[]>([]);
  return <PreviewFrame><InlineCommandField label="Brief" commands={previewCommands} tokens={tokens} onTokensChange={setTokens} /></PreviewFrame>;
}

function DisclosurePreview() {
  return <PreviewFrame><ProgressiveDisclosureField label="Delivery" defaultMode="pickup" /></PreviewFrame>;
}

function PropertyPreview() {
  const [items, setItems] = useState(previewProperties);
  return <PreviewFrame><EditablePropertyRail items={items} onItemsChange={setItems} /></PreviewFrame>;
}

function FormattingPreview() {
  return <PreviewFrame><ContextualFormattingBar label="Handoff note" defaultContent="Select a phrase to format." /></PreviewFrame>;
}

function ScrubberPreview() {
  const [value, setValue] = useState(24);
  return <PreviewFrame><UnitScrubber label="Radius" value={value} onValueChange={setValue} max={64} unit="px" /></PreviewFrame>;
}

function RangePreview() {
  const [range, setRange] = useState({ start: 10, end: 40 });
  return <PreviewFrame><RangeComposer label="Range" start={range.start} end={range.end} onRangeChange={setRange} unit="px" /></PreviewFrame>;
}

function SegmentedPreview() {
  const [segments, setSegments] = useState(["2026", "08", "15"]);
  return <PreviewFrame><SegmentedInputComposer label="Release date" segments={segments} onSegmentsChange={setSegments} /></PreviewFrame>;
}

export const FORM_PREVIEWS: Record<string, ReactNode> = {
  "morphing-input": <MorphingInputPreview />,
  "expandable-composer": <ComposerPreview />,
  "token-field": <TokenPreview />,
  "multi-value-builder": <BuilderPreview />,
  "smart-suggestion-field": <SuggestionPreview />,
  "inline-command-field": <CommandPreview />,
  "progressive-disclosure-field": <DisclosurePreview />,
  "editable-property-rail": <PropertyPreview />,
  "contextual-formatting-bar": <FormattingPreview />,
  "unit-scrubber": <ScrubberPreview />,
  "range-composer": <RangePreview />,
  "segmented-input-composer": <SegmentedPreview />,
};
