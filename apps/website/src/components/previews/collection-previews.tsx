"use client";

import {
  AccordionGallery,
  CursorPreviewList,
  DirectionalCardReveal,
  ExpandableContentRow,
  FocusStripCollection,
  HoverImageReveal,
  ListDetailMorph,
  MagazineIndex,
  PeekPanelCollection,
  ProgressiveCollection,
  ScrubPreview,
  SharedPreviewCollection,
} from "@pinky/systems";
import type { ReactNode } from "react";

const TONES = [
  "linear-gradient(145deg, var(--color-blush-100), var(--color-white) 58%, var(--color-cloud-100))",
  "linear-gradient(145deg, var(--color-cloud-100), var(--color-white) 58%, var(--color-blush-50))",
  "linear-gradient(145deg, var(--color-white), var(--color-blush-100) 52%, var(--color-cloud-200))",
  "linear-gradient(145deg, var(--color-blush-50), var(--color-cloud-100) 56%, var(--color-white))",
] as const;

function MiniSurface({ index, label, className = "h-28" }: { index: number; label: string; className?: string }) {
  return (
    <div className={`relative grid place-items-center overflow-hidden rounded-[18px] ${className}`} style={{ backgroundImage: TONES[index % TONES.length] }}>
      <span className="rounded-pill bg-white/80 px-3 py-1.5 font-mono text-[0.6rem] tracking-[0.1em] text-ink-700 uppercase shadow-soft">{label}</span>
    </div>
  );
}

function ContentNote({ label, copy }: { label: string; copy: string }) {
  return (
    <div>
      <p className="font-mono text-[0.6rem] tracking-[0.14em] text-ink-500 uppercase">{label}</p>
      <p className="mt-2 font-display text-lg font-semibold tracking-tight">{copy}</p>
      <p className="mt-2 text-xs leading-relaxed text-ink-600">One active surface, no hidden second page.</p>
    </div>
  );
}

const cursorItems = ["Quiet room", "Field notes", "Shared studio"].map((label, index) => ({
  id: label,
  label,
  description: "Move or focus the row",
  preview: <MiniSurface index={index} label={label} />,
}));

const editorialItems = ["North room", "Soft archive", "Working light"].map((label, index) => ({
  id: label,
  label,
  meta: `0${index + 1}`,
  description: "Text stays primary; media follows",
  media: <MiniSurface index={index + 1} label={label} className="aspect-[4/3] h-auto" />,
}));

const contentRows = [
  {
    id: "one",
    label: "A quieter index",
    summary: "Expand for the supporting note.",
    meta: "Editorial",
    media: <MiniSurface index={0} label="Media" />,
    content: <ContentNote label="Expanded context" copy="The row makes room in the document flow." />,
  },
  {
    id: "two",
    label: "A useful detail",
    summary: "The surrounding list stays in order.",
    meta: "Case study",
    media: <MiniSurface index={1} label="Context" />,
    content: <ContentNote label="Secondary content" copy="No overlay hides the next item." />,
  },
];

const detailItems = ["Quiet room", "Soft archive", "Shared studio"].map((title, index) => ({
  id: title,
  title,
  summary: "Select to carry this source into detail.",
  meta: `Study 0${index + 1}`,
  media: <MiniSurface index={index} label={title} className="size-full min-h-36" />,
  detail: <ContentNote label="Detail surface" copy="The same source now has room to breathe." />,
}));

const scrubLabels = ["Opening", "Detail", "Texture", "Release"];
const scrubFrames = scrubLabels.map((label, index) => (
  <MiniSurface key={label} index={index} label={label} className="min-h-48 rounded-none" />
));

const peekItems = ["Research", "Prototype", "Release"].map((label, index) => ({
  id: label,
  label,
  summary: "Attached detail",
  preview: <MiniSurface index={index} label={label} className="min-h-36" />,
  detail: <ContentNote label="Neighbouring context" copy="The source list stays visible beside this panel." />,
}));

const magazineItems = ["A soft beginning", "The useful middle", "A clear release"].map((title, index) => ({
  id: title,
  title,
  number: `0${index + 1}`,
  meta: "Pinky / 2026",
  description: "Content selection, not page navigation.",
  preview: <MiniSurface index={index} label={`Issue ${index + 1}`} className="h-full min-h-40" />,
}));

const progressiveItems = ["Signal", "Shape", "Release"].map((label, index) => ({
  id: label,
  label,
  meta: `0${index + 1}`,
  summary: "Focus gives this item more space.",
  content: <ContentNote label="Active context" copy={`The ${label.toLowerCase()} surface leads the collection.`} />,
}));

const focusItems = ["Soft", "Clear", "Tactile"].map((label, index) => ({
  id: label,
  label,
  meta: `0${index + 1}`,
  content: <ContentNote label="Active item" copy={`${label} receives actual layout width.`} />,
}));

const sharedItems = ["Study one", "Study two", "Study three"].map((label, index) => ({
  id: label,
  label,
  meta: "Selected work",
  description: "One preview, many entries.",
  preview: <MiniSurface index={index} label={label} className="min-h-48 rounded-none" />,
}));

const galleryItems = ["Chapter one", "Chapter two", "Chapter three"].map((title, index) => ({
  id: title,
  title,
  meta: "Project chapter",
  description: "Open the media region.",
  media: <MiniSurface index={index} label={title} className="min-h-44 rounded-none" />,
  content: <ContentNote label="Caption" copy="Media and metadata remain one object." />,
}));

const COLLECTION_PREVIEWS: Record<string, ReactNode> = {
  "cursor-preview-list": <CursorPreviewList label="Project preview list" items={cursorItems} />,
  "hover-image-reveal": <HoverImageReveal label="Editorial image list" items={editorialItems} />,
  "expandable-content-row": <ExpandableContentRow label="Content rows" items={contentRows} />,
  "list-detail-morph": <ListDetailMorph label="Case study list" items={detailItems} />,
  "scrub-preview": <ScrubPreview label="Project frames" labels={scrubLabels} frames={scrubFrames} />,
  "directional-card-reveal": (
    <DirectionalCardReveal
      label="Open project summary"
      reveal={
        <span>
          <span className="font-mono text-[0.6rem] tracking-[0.14em] text-white/60 uppercase">Entered with intent</span>
          <span className="mt-2 block font-display text-xl font-semibold">The reveal follows the edge.</span>
        </span>
      }
    >
      <span className="block">
        <span className="font-mono text-[0.6rem] tracking-[0.14em] text-ink-500 uppercase">Project surface</span>
        <span className="mt-2 block font-display text-lg font-semibold tracking-tight">Approach from any side.</span>
      </span>
    </DirectionalCardReveal>
  ),
  "peek-panel-collection": <PeekPanelCollection label="Peek collection" items={peekItems} />,
  "magazine-index": <MagazineIndex label="Issue contents" items={magazineItems} />,
  "progressive-collection": <ProgressiveCollection label="Progressive collection" items={progressiveItems} />,
  "focus-strip-collection": <FocusStripCollection label="Focus strip" items={focusItems} />,
  "shared-preview-collection": <SharedPreviewCollection label="Shared preview" items={sharedItems} />,
  "accordion-gallery": <AccordionGallery label="Gallery stories" items={galleryItems} />,
};

export { COLLECTION_PREVIEWS };
