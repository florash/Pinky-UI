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
import { collectionSystems } from "@pinky/registry";
import Link from "next/link";
import { type ReactNode } from "react";

import { RegistryCatalogue } from "@/components/site/registry-catalogue";

const TONES = [
  "linear-gradient(145deg, var(--color-blush-100), var(--color-white) 58%, var(--color-cloud-100))",
  "linear-gradient(145deg, var(--color-cloud-100), var(--color-white) 58%, var(--color-blush-50))",
  "linear-gradient(145deg, var(--color-white), var(--color-blush-100) 52%, var(--color-cloud-200))",
  "linear-gradient(145deg, var(--color-blush-50), var(--color-cloud-100) 56%, var(--color-white))",
] as const;

function Surface({ index, label, className = "h-28" }: { index: number; label: string; className?: string }) {
  return <div className={`relative grid place-items-center overflow-hidden rounded-[18px] ${className}`} style={{ backgroundImage: TONES[index % TONES.length] }}><span className="rounded-pill bg-white/80 px-3 py-1.5 font-mono text-[0.6rem] tracking-[0.1em] text-ink-700 uppercase shadow-soft">{label}</span></div>;
}

function Note({ eyebrow, title, copy = "The active state stays attached to the collection." }: { eyebrow: string; title: string; copy?: string }) {
  return <div><p className="font-mono text-[0.6rem] tracking-[0.14em] text-ink-500 uppercase">{eyebrow}</p><p className="mt-2 font-display text-lg font-semibold tracking-tight">{title}</p><p className="mt-2 text-sm leading-relaxed text-ink-700">{copy}</p></div>;
}

const PREVIEW_LABELS = ["Quiet room", "Field notes", "Shared studio"];

function PreviewItems() {
  return PREVIEW_LABELS.map((label, index) => ({ id: label, label, description: "A small editorial collection entry.", preview: <Surface index={index} label={label} /> }));
}

function EditorialMediaItems() {
  return PREVIEW_LABELS.map((label, index) => ({ id: label, label, meta: `0${index + 1}`, description: "Text stays primary; media follows.", media: <Surface index={index + 1} label={label} className="aspect-[4/3] h-auto" /> }));
}

function StoryContent({ index, title }: { index: number; title: string }) {
  return <><Note eyebrow="Expanded context" title={title} copy="The row makes room in normal document flow instead of sending the reader to a detached surface." /><p className="mt-4 rounded-xl bg-white p-3 text-xs text-ink-600">Chapter {index + 1} · supporting metadata remains readable.</p></>;
}

function CollectionDemo({ id, title, copy, children }: { id: string; title: string; copy: string; children: ReactNode }) {
  return <article id={id} className="scroll-mt-24 min-w-0 rounded-[26px] border border-line bg-white/75 p-4 shadow-soft sm:p-6"><div className="mb-5"><h3 className="font-display text-xl font-semibold tracking-tight">{title}</h3><p className="mt-2 text-sm leading-relaxed text-ink-700">{copy}</p></div>{children}</article>;
}

export function CollectionsShowcase() {
  const stories = PREVIEW_LABELS.map((title, index) => ({ id: title, title, summary: "Select to carry this source into detail.", meta: `Study 0${index + 1}`, media: <Surface index={index} label={title} className="size-full min-h-36" />, detail: <StoryContent index={index} title="The source has become the detail." /> }));
  const rows = PREVIEW_LABELS.map((label, index) => ({ id: label, label, summary: "Expand for media and a supporting note.", meta: "Editorial", media: <Surface index={index} label="Media" />, content: <StoryContent index={index} title="The row stays in the reading flow." /> }));
  const gallery = PREVIEW_LABELS.map((title, index) => ({ id: title, title, meta: "Project chapter", description: "Open the media region.", media: <Surface index={index} label={title} className="min-h-44 rounded-none" />, content: <StoryContent index={index} title="Media and caption remain one object." /> }));
  const stripItems = PREVIEW_LABELS.map((label, index) => ({ id: label, label, meta: `0${index + 1}`, content: <Note eyebrow="Active item" title={`${label} receives actual width.`} /> }));

  return (
    <main className="relative overflow-hidden pb-32">
      <header className="border-b border-line bg-[linear-gradient(135deg,var(--color-blush-50),var(--color-cloud-50))]">
        <div className="mx-auto max-w-[76rem] px-5 py-14 sm:px-8 sm:py-20">
          <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-ink-500 uppercase">Collections · content browsing</p>
          <h1 className="mt-4 max-w-3xl text-section text-balance-tight">Let the collection explain itself.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-700">Lists, previews and detail states that keep content visible while the interaction changes the relationship between items.</p>
          <nav aria-label="Collection links" className="mt-8 flex flex-wrap gap-2"><a href="#preview-reveal" className="rounded-full border border-line bg-white/70 px-3 py-2 text-sm">Preview &amp; reveal</a><a href="#inline-detail" className="rounded-full border border-line bg-white/70 px-3 py-2 text-sm">Inline detail</a><a href="#focus-index" className="rounded-full border border-line bg-white/70 px-3 py-2 text-sm">Focus &amp; index</a><Link href="/systems" className="rounded-full border border-line bg-white/70 px-3 py-2 text-sm">All systems</Link><Link href="/explore" className="rounded-full bg-ink-900 px-3 py-2 text-sm text-milk">Explore registry</Link></nav>
        </div>
      </header>

      <section id="preview-reveal" className="mx-auto max-w-[76rem] scroll-mt-24 px-5 pt-20 sm:px-8 sm:pt-28">
        <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-ink-500 uppercase">01 · Preview &amp; reveal</p>
        <h2 className="mt-4 max-w-3xl text-section text-balance-tight">Let intent choose what comes forward.</h2>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <CollectionDemo id="cursor-preview-list" title="Cursor Preview List" copy="The list is the content. One bounded preview follows pointer intent and becomes inline on touch."><CursorPreviewList label="Project preview list" items={PreviewItems()} /></CollectionDemo>
          <CollectionDemo id="hover-image-reveal" title="Hover Image Reveal" copy="An editorial row stays textual while one fixed media viewport changes with focus."><HoverImageReveal label="Editorial image list" items={EditorialMediaItems()} /></CollectionDemo>
          <CollectionDemo id="scrub-preview" title="Scrub Preview" copy="A content frame sequence responds to bounded position, with visible markers for touch and keyboard users."><ScrubPreview label="Project frames" labels={["Opening", "Detail", "Texture", "Release"]} frames={["Opening", "Detail", "Texture", "Release"].map((label, index) => <Surface key={label} index={index} label={label} className="min-h-48 rounded-none" />)} /></CollectionDemo>
          <CollectionDemo id="directional-card-reveal" title="Directional Card Reveal" copy="The secondary card surface enters from the edge where the pointer arrived; focus and touch use a stable fallback."><DirectionalCardReveal label="Open project summary" reveal={<Note eyebrow="Entered with intent" title="The reveal follows the edge." copy="Direction is the signal, not a cosmetic variant." />}><Note eyebrow="Project surface" title="Approach from any side." /></DirectionalCardReveal></CollectionDemo>
        </div>
      </section>

      <section id="inline-detail" className="mx-auto max-w-[76rem] scroll-mt-24 px-5 pt-24 sm:px-8 sm:pt-32">
        <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-ink-500 uppercase">02 · Inline detail</p>
        <h2 className="mt-4 max-w-3xl text-section text-balance-tight">Give the selected item room without losing the source.</h2>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <CollectionDemo id="expandable-content-row" title="Expandable Content Row" copy="A content row expands in document flow with media, metadata and a supporting action surface."><ExpandableContentRow label="Content rows" items={rows} /></CollectionDemo>
          <CollectionDemo id="list-detail-morph" title="List Detail Morph" copy="The chosen item becomes detail while its title and media keep the same spatial identity."><ListDetailMorph label="Case study list" items={stories} /></CollectionDemo>
          <CollectionDemo id="peek-panel-collection" title="Peek Panel Collection" copy="The source collection remains visible beside its attached contextual detail panel."><PeekPanelCollection label="Peek collection" items={PREVIEW_LABELS.map((label, index) => ({ id: label, label, summary: "Attached detail", preview: <Surface index={index} label={label} className="min-h-36" />, detail: <Note eyebrow="Neighbouring context" title="The source list stays visible." /> }))} /></CollectionDemo>
          <CollectionDemo id="accordion-gallery" title="Accordion Gallery" copy="A title row opens a masked media region and caption layer as one editorial object."><AccordionGallery label="Gallery stories" items={gallery} /></CollectionDemo>
        </div>
      </section>

      <section id="focus-index" className="mx-auto max-w-[76rem] scroll-mt-24 px-5 pt-24 sm:px-8 sm:pt-32">
        <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-ink-500 uppercase">03 · Focus &amp; index</p>
        <h2 className="mt-4 max-w-3xl text-section text-balance-tight">Redistribute attention, not just pixels.</h2>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <CollectionDemo id="magazine-index" title="Magazine Index" copy="Numbered content rows and one shared preview create an editorial browsing rhythm without becoming navigation."><MagazineIndex label="Issue contents" items={PREVIEW_LABELS.map((title, index) => ({ id: title, title, number: `0${index + 1}`, meta: "Pinky / 2026", description: "Content selection, not page navigation.", preview: <Surface index={index} label={`Issue ${index + 1}`} className="h-full min-h-40" /> }))} /></CollectionDemo>
          <CollectionDemo id="progressive-collection" title="Progressive Collection" copy="The active item gets a real grid track and more context while inactive peers stay legible."><ProgressiveCollection label="Progressive collection" items={PREVIEW_LABELS.map((label, index) => ({ id: label, label, meta: `0${index + 1}`, summary: "Focus gives this item more space.", content: <Note eyebrow="Active context" title={`${label} leads the collection.`} /> }))} /></CollectionDemo>
          <CollectionDemo id="focus-strip-collection" title="Focus Strip Collection" copy="Flex basis, not scale, makes the selected content wider while the strip remains one collection."><FocusStripCollection label="Focus strip" items={stripItems} /></CollectionDemo>
          <CollectionDemo id="shared-preview-collection" title="Shared Preview Collection" copy="Compact entries control one larger preview, keeping expensive media on demand."><SharedPreviewCollection label="Shared preview" items={PREVIEW_LABELS.map((label, index) => ({ id: label, label, meta: "Selected work", description: "One preview, many entries.", preview: <Surface index={index} label={label} className="min-h-48 rounded-none" /> }))} /></CollectionDemo>
        </div>
      </section>

      <RegistryCatalogue id="browse-all" items={collectionSystems} hrefPrefix="/systems" label="collection systems" />
    </main>
  );
}
