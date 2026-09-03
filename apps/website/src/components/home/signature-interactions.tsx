"use client";

import { cn } from "@pinky-ui/components";
import { CardFan, GalleryListMorph } from "@pinky-ui/layouts";
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
} from "@pinky-ui/systems";
import { useRouter } from "next/navigation";
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
        <h2 className="mt-4 max-w-2xl text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.06] tracking-[-0.03em] text-balance-tight">
          Nine pieces, each moving differently.
        </h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-700 sm:text-lg">
          Browsing, spatial separation, media, editing, feedback, context, mobile search and
          command — live instances, not screenshots. The complete catalogue is in Explore.
        </p>

        {/*
          Masonry keeps the editorial asymmetry without coupling the left and
          right columns to the height of their longest neighbour. Each piece
          remains a direct live surface, while the column fill prevents a
          short first column from leaving a dead band beside the longer one.
        */}
        <div className="mt-8 lg:columns-2 lg:gap-x-8">
          <Piece label="Gallery ↔ List" className="mb-12 break-inside-avoid">
            <GalleryListMorph
              items={COLLECTION}
              columns={4}
              label="Featured collection"
              className="min-h-44"
            />
          </Piece>

          <Piece label="Card Fan" className="mb-12 break-inside-avoid">
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

          <Piece label="Morph Lightbox" className="mb-12 break-inside-avoid">
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

          <div className="mb-12 break-inside-avoid grid gap-12 sm:grid-cols-2">
            <Piece label="Morphing Input">
              <MorphingInputDemo />
            </Piece>

            <Piece label="Completion Morph">
              <CompletionMorphDemo />
            </Piece>
          </div>

          <Piece label="Anchored Inspector" className="mb-12 break-inside-avoid">
            <AnchoredInspectorDemo />
          </Piece>

          <Piece label="Search Morph Header" className="mb-12 break-inside-avoid">
            <SearchMorphDemo />
          </Piece>

          <Piece label="Command Palette" className="mb-12 break-inside-avoid">
            <CommandPaletteDemo />
          </Piece>

          <Piece label="Mobile touch signatures" className="mb-12 break-inside-avoid">
            {/*
              This Piece lives inside a 2-column masonry (`lg:columns-2`
              above), so it only ever gets roughly half the page width — an
              inner grid that jumps to 5 columns at `xl` was cramming each
              card into ~110px and clipping every one of them. Two columns
              fits the real available width at every breakpoint instead.
            */}
            <div className="grid grid-cols-2 gap-4 rounded-[20px] bg-cloud-50 p-4">
              {/*
                MorphingBottomNavigation's active item grows to min-w-[6.5rem],
                so its natural row (~248px for 4 items) doesn't fit this
                tile's ~144px column — without the scale it overflowed the
                tile by 16px on each side, clipped by the wrapper below but
                still cutting the first item's icon off.
              */}
              <MobileSignatureMini label="Morphing nav"><div className="origin-center scale-[0.55]"><MorphingBottomNavigation /></div></MobileSignatureMini>
              <MobileSignatureMini label="Bottom search"><BottomSearchSheet /></MobileSignatureMini>
              <MobileSignatureMini label="Detent sheet"><DetentSheet /></MobileSignatureMini>
              <MobileSignatureMini label="Swipe actions"><SwipeActions /></MobileSignatureMini>
              <MobileSignatureMini label="Long-press select" className="col-span-2 sm:col-span-1"><LongPressSelection items={[{ id: "note", label: "North star", meta: "Hold or tap" }, { id: "brief", label: "Release brief", meta: "Ready" }]} /></MobileSignatureMini>
            </div>
          </Piece>
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
  const router = useRouter();
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
              onSelect: () => router.push("/explore"),
            },
            {
              id: "components",
              label: "Browse components",
              group: "Navigate",
              onSelect: () => router.push("/components"),
            },
            {
              id: "fluid-tabs",
              label: "Fluid Tabs",
              group: "Components · navigation",
              keywords: ["tabs", "segmented", "navigation"],
              onSelect: () => router.push("/components/fluid-tabs"),
            },
            {
              id: "progressive-workflow",
              label: "Progressive Step Workflow",
              group: "Systems · workflow",
              keywords: ["step", "workflow", "progress"],
              onSelect: () => router.push("/workflows/progressive-step-workflow"),
            },
            {
              id: "morph-lightbox",
              label: "Morph Lightbox",
              group: "Systems · media",
              keywords: ["lightbox", "gallery", "media"],
              onSelect: () => router.push("/systems/morph-lightbox"),
            },
            { id: "copy", label: "Copy the current pattern", group: "Action", onSelect: () => undefined },
          ]}
        />
      ) : null}
    </div>
  );
}

/**
 * These are the real production mobile components, not screenshots — some
 * of them (Bottom Search Sheet, Detent Sheet) open a genuine
 * `position: fixed` full-viewport modal when their trigger is pressed. Two
 * defenses, not one: `inert` stops the trigger from ever being reachable by
 * pointer or keyboard here (a live, functioning version already exists on
 * `/mobile` — this grid is a glance, not the interactive catalog entry),
 * and `translateZ(0)` + `overflow-hidden` contain anything that still
 * escapes instead of letting it spill across the page.
 */
function MobileSignatureMini({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("min-w-0", className)}>
      <p className="font-mono text-[0.56rem] tracking-[0.12em] text-ink-500 uppercase">{label}</p>
      <div className="relative mt-3 min-w-0 overflow-hidden rounded-2xl [transform:translateZ(0)]" inert>{children}</div>
    </div>
  );
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
