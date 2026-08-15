"use client";

import { CardFan, GalleryListMorph } from "@pinky/layouts";
import {
  AnchoredInspector,
  BottomSearchSheet,
  CommandPalette,
  CompletionMorph,
  DetentSheet,
  LongPressSelection,
  MorphingInput,
  MorphLightbox,
  MorphingBottomNavigation,
  SearchMorphHeader,
  SwipeActions,
  useCommandShortcut,
} from "@pinky/systems";
import { useState, type ReactNode } from "react";

import { SoftSurface } from "@/components/previews/soft-surface";
import { Container } from "@/components/site/layout";

/**
 * The dense beat of the homepage.
 *
 * A small set of interactions, chosen because each one moves in a different
 * way — browsing, spatial separation, media, editing, feedback, context,
 * mobile search and command. They are live instances, laid out asymmetrically
 * so the page never reads as a card grid. Everything else lives in Explore;
 * this is a first impression, not a catalogue.
 */
export function SignatureInteractions() {
  return (
    <section id="signature" className="relative pt-4 pb-20 sm:pt-8 sm:pb-28">
      <Container>
        <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-ink-500 uppercase">
          Signature interactions
        </p>

        {/*
          Two stacked columns rather than a row grid: the pieces have very
          different natural heights, and a row grid would leave a band of dead
          space under every short one.
        */}
        <div className="mt-8 grid items-start gap-x-8 gap-y-12 lg:grid-cols-12">
          {/* The anchor: one collection, read two ways. Widest footprint on the
              page, so the eye lands here before anything else. */}
          <div className="flex flex-col gap-12 lg:col-span-7">
            <Piece label="Gallery ↔ List">
              <GalleryListMorph
                items={COLLECTION}
                columns={4}
                label="Featured collection"
                className="min-h-44"
              />
            </Piece>

            <Piece label="Card Fan">
              <div className="flex justify-center rounded-[20px] bg-white/60 px-4 py-6 sm:px-6">
                <CardFan label="Curated studio deck" spread={22} rotation={7} className="min-h-[11rem]">
                  {COLLECTION.map((card, index) => (
                    <div
                      key={card.id}
                      className="w-36 overflow-hidden rounded-[18px] border border-line bg-white shadow-lift sm:w-40"
                    >
                      <SoftSurface index={index} className="h-20 w-full rounded-none" />
                      <div className="p-3">
                        <p className="text-sm font-semibold">{card.title}</p>
                        <p className="mt-1 font-mono text-[0.58rem] text-ink-500">{card.meta}</p>
                      </div>
                    </div>
                  ))}
                </CardFan>
              </div>
            </Piece>
          </div>

          <div className="flex flex-col gap-12 lg:col-span-5">
            <Piece label="Morph Lightbox">
              <MorphLightbox
                label="Featured media collection"
                className="grid-cols-3 gap-2"
                itemClassName="rounded-xl"
                items={COLLECTION.slice(0, 3).map((item, index) => ({
                  id: `signature-media-${item.id}`,
                  label: item.title,
                  thumbnail: <SoftSurface index={index} className="h-24 w-full" />,
                  media: <SoftSurface index={index} className="h-64 w-full" />,
                  caption: item.meta,
                }))}
              />
            </Piece>

            <div className="grid gap-12 sm:grid-cols-2">
              <Piece label="Morphing Input">
                <MorphingInputDemo />
              </Piece>

              <Piece label="Completion Morph">
                <CompletionMorphDemo />
              </Piece>
            </div>

            <Piece label="Anchored Inspector">
              <AnchoredInspectorDemo />
            </Piece>

            <Piece label="Search Morph Header">
              <SearchMorphDemo />
            </Piece>

            <Piece label="Command Palette">
              <CommandPaletteDemo />
            </Piece>

            <Piece label="Mobile touch signatures">
              <div className="grid gap-4 rounded-[20px] bg-cloud-50 p-4 sm:grid-cols-2 xl:grid-cols-5">
                <MobileSignatureMini label="Morphing nav"><MorphingBottomNavigation /></MobileSignatureMini>
                <MobileSignatureMini label="Bottom search"><BottomSearchSheet /></MobileSignatureMini>
                <MobileSignatureMini label="Detent sheet"><DetentSheet /></MobileSignatureMini>
                <MobileSignatureMini label="Swipe actions"><SwipeActions /></MobileSignatureMini>
                <MobileSignatureMini label="Long-press select"><LongPressSelection items={[{ id: "note", label: "North star", meta: "Hold or tap" }, { id: "brief", label: "Release brief", meta: "Ready" }]} /></MobileSignatureMini>
              </div>
            </Piece>
          </div>
        </div>
      </Container>
    </section>
  );
}

const COLLECTION = [
  { id: "one", title: "Arrival", meta: "soft light", media: <SoftSurface index={0} className="size-full" /> },
  { id: "two", title: "Commons", meta: "shared space", media: <SoftSurface index={1} className="size-full" /> },
  { id: "three", title: "Threshold", meta: "quiet edge", media: <SoftSurface index={2} className="size-full" /> },
  { id: "four", title: "Work table", meta: "clear focus", media: <SoftSurface index={3} className="size-full" /> },
];

/**
 * No card, no border, no shadow: a hairline and a small label, then the real
 * component. The interaction is the exhibit, so nothing is allowed to frame it.
 */
function Piece({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`min-w-0 ${className}`}>
      <p className="border-t border-line pt-3 font-mono text-[0.625rem] tracking-[0.15em] text-ink-500 uppercase">
        {label}
      </p>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function CommandPaletteDemo() {
  const [open, setOpen] = useState(false);
  useCommandShortcut(() => setOpen(true));

  return (
    <div className="flex flex-col items-start gap-4 rounded-[20px] bg-cloud-50 px-6 py-7">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex w-fit items-center gap-3 rounded-pill bg-ink-900 px-4 py-2.5 text-sm text-milk"
      >
        Open commands
        <kbd className="rounded border border-white/20 px-1.5 py-0.5 font-mono text-[0.625rem] text-milk/75">
          ⌘K
        </kbd>
      </button>
      <p className="max-w-sm text-sm leading-relaxed text-ink-700">
        Or press ⌘K. The surface owns focus, filtering and Escape.
      </p>
      {open ? (
        <CommandPalette
          open={open}
          onOpenChange={setOpen}
          items={[
            {
              id: "explore",
              label: "Explore interactions",
              group: "Navigate",
              onSelect: () => {
                window.location.href = "/explore";
              },
            },
            {
              id: "components",
              label: "Browse components",
              group: "Navigate",
              onSelect: () => {
                window.location.href = "/components";
              },
            },
            {
              id: "fluid-tabs",
              label: "Fluid Tabs",
              group: "Components · navigation",
              keywords: ["tabs", "segmented", "navigation"],
              onSelect: () => {
                window.location.href = "/components/fluid-tabs";
              },
            },
            {
              id: "progressive-workflow",
              label: "Progressive Step Workflow",
              group: "Systems · workflow",
              keywords: ["step", "workflow", "progress"],
              onSelect: () => {
                window.location.href = "/workflows/progressive-step-workflow";
              },
            },
            {
              id: "morph-lightbox",
              label: "Morph Lightbox",
              group: "Systems · media",
              keywords: ["lightbox", "gallery", "media"],
              onSelect: () => {
                window.location.href = "/systems/morph-lightbox";
              },
            },
            { id: "copy", label: "Copy the current pattern", group: "Action", onSelect: () => undefined },
          ]}
        />
      ) : null}
    </div>
  );
}

function MobileSignatureMini({ label, children }: { label: string; children: ReactNode }) {
  return <div className="min-w-0"><p className="font-mono text-[0.56rem] tracking-[0.12em] text-ink-500 uppercase">{label}</p><div className="mt-3 min-w-0">{children}</div></div>;
}

function MorphingInputDemo() {
  const [value, setValue] = useState("North star note");

  return (
    <MorphingInput
      label="Release note"
      value={value}
      onValueChange={setValue}
      description="The value keeps its place while it becomes an editor."
    />
  );
}

function CompletionMorphDemo() {
  return (
    <CompletionMorph
      label="Save draft"
      resultLabel="Draft saved"
      onComplete={() => new Promise<void>((resolve) => window.setTimeout(resolve, 420))}
    />
  );
}

const INSPECTOR_ITEMS = [
  { id: "source", label: "Source surface", meta: "Canvas / 01", value: "Selected", description: "The inspector stays next to the source." },
  { id: "caption", label: "Caption layer", meta: "Content / 02", value: "Attached", description: "A short context value without a route change." },
  { id: "frame", label: "Frame study", meta: "Media / 03", value: "Ready", description: "The selected frame owns its nearby context." },
] as const;

function AnchoredInspectorDemo() {
  return <AnchoredInspector items={INSPECTOR_ITEMS} />;
}

const SEARCH_ITEMS = [
  ["A room for work", "Editorial study · 04 min"],
  ["Surface notes", "Product rhythm · 08 min"],
  ["Motion review", "Interaction study · 06 min"],
] as const;

function SearchMorphDemo() {
  const [query, setQuery] = useState("");
  const filtered = SEARCH_ITEMS.filter(([label, detail]) => `${label} ${detail}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="rounded-[20px] bg-cloud-50 px-4 sm:px-5">
      <SearchMorphHeader title="Browse" query={query} onQueryChange={setQuery} placeholder="Search notes" />
      <div className="space-y-2 py-4" aria-live="polite">
        {filtered.length ? filtered.map(([label, detail]) => (
          <div key={label} className="rounded-xl bg-white px-3 py-2.5">
            <p className="text-sm font-medium text-ink-900">{label}</p>
            <p className="mt-1 text-xs text-ink-500">{detail}</p>
          </div>
        )) : <p className="py-2 text-xs text-ink-500">No matching notes.</p>}
      </div>
    </div>
  );
}
