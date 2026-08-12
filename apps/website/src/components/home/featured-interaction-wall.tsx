"use client";

import { BentoMenu, ExpandButton, FloatingLines, InsetButton, JellyCard, LiquidCard, MagneticButton, MorphCard, TextMenu } from "@pinky/components";
import { StickyStory } from "@pinky/effects";
import { MorphingHero } from "@pinky/experiences";
import { CardFan, EditorialMosaic, GalleryListMorph, InfiniteSpatialCanvas, StackSpatial } from "@pinky/layouts";
import { CommandPalette, EdgeSwipePanel, MorphLightbox, PullToRefresh, useCommandShortcut } from "@pinky/systems";
import { useState, type ReactNode } from "react";

import { SoftSurface } from "@/components/previews/soft-surface";
import { Container } from "@/components/site/layout";

/**
 * The homepage's reference wall is deliberately composed from the real
 * primitives. The annotations are the frame; the component is the exhibit.
 * Large pieces get room to explain their motion, while the smaller controls
 * share a rhythm so the page feels editorial instead of like a card catalogue.
 */
export function FeaturedInteractionWall({ compact = false }: { compact?: boolean }) {
  return (
    <section id="featured-interactions" className={`relative overflow-x-clip ${compact ? "pt-5 pb-12 sm:pt-8 sm:pb-16" : "py-14 sm:py-20"}`}>
      <Container>
        {!compact ? (
          <header className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-ink-500 uppercase">Featured interactions</p>
              <h2 className="mt-4 text-section text-balance-tight">The UI is the reference.</h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-700 sm:text-lg">
                A small set of Pinky&apos;s strongest pieces, already running. Hover, press, switch views,
                open a surface, or scroll through the story — there is no screenshot to interpret first.
              </p>
            </div>
            <p className="max-w-[15rem] font-mono text-[0.625rem] leading-relaxed tracking-[0.12em] text-ink-500 uppercase">
              curated / tactile / inspectable
            </p>
          </header>
        ) : null}

        <div className={`${compact ? "mt-0" : "mt-10"} grid gap-3 lg:grid-cols-12 lg:auto-rows-[minmax(10rem,auto)]`}>
          <Exhibit label="Morphing Hero" note="scroll continuity" className="lg:col-span-7 lg:row-span-2">
            <MorphingHeroDemo compact={compact} />
          </Exhibit>

          <Exhibit label="Surfaces" note="jelly · liquid · morph" className="lg:col-span-5">
            <SurfaceSampler />
          </Exhibit>

          {!compact ? <Exhibit label="Magnetic" note="move close, then press" className="lg:col-span-5">
            <div className="flex min-h-36 items-center justify-center"><MagneticButton size="lg" strength={0.45} range={150}>Move me</MagneticButton></div>
          </Exhibit> : null}

          <Exhibit label="Gallery ↔ List Morph" note="same collection, two readings" className="lg:col-span-7">
            <GalleryListDemo />
          </Exhibit>

          <Exhibit label="Morph Lightbox" note="the thumbnail becomes the surface" className="lg:col-span-5">
            <MorphLightboxDemo />
          </Exhibit>

          <Exhibit label="Editorial Mosaic" note="rhythm / focus / whitespace" className="lg:col-span-7">
            <EditorialMosaicDemo />
          </Exhibit>

          {!compact ? <Exhibit label="Tactile Buttons" note="recess / silhouette" className="lg:col-span-5"><TactileButtonSampler /></Exhibit> : null}

          <Exhibit label="Command Palette" note="keyboard-first search" className={compact ? "lg:col-span-5" : "lg:col-span-4"}>
            <CommandPaletteDemo />
          </Exhibit>

          {!compact ? <Exhibit label="Stack → Spatial" note="one collection, more depth" className="lg:col-span-8"><StackSpatialDemo /></Exhibit> : null}

          {!compact ? <Exhibit label="Sticky Story" note="the visual follows the reading" clipContent={false} className="lg:col-span-7"><StickyStoryDemo compact={compact} /></Exhibit> : null}

          {!compact ? <Exhibit label="Menu Triggers" note="three close marks, one trigger vocabulary" className="lg:col-span-5 lg:self-start"><MenuTriggerSampler idPrefix="home-menu" /></Exhibit> : null}
        </div>
      </Container>
    </section>
  );
}

/**
 * A small review wall for the current redesign pass. These are intentionally
 * live instances of the four existing primitives, not thumbnails or links to
 * detail pages. Their different footprints make the motion signatures legible
 * next to one another: selection, spatial browsing, tension and reveal.
 */
export function InteractionStudyWall({ compact = false }: { compact?: boolean }) {
  return (
    <section className="mt-16 scroll-mt-20 border-y border-line py-10 sm:mt-20 sm:py-12" aria-labelledby="interaction-study-title">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="font-mono text-[0.625rem] tracking-[0.16em] text-ink-500 uppercase">Interaction studies / 04</p>
          <h2 id="interaction-study-title" className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">Four interactions, four different kinds of movement.</h2>
        </div>
        <p className="max-w-xs text-sm leading-relaxed text-ink-700">A compressed deck, a wider field, a held tension and a tracked edge — all inspectable before leaving the page.</p>
      </div>

      <div className="mt-8 grid gap-3 lg:grid-cols-12 lg:items-stretch">
        <ReviewExhibit label="Card Fan" note="layer separation / reflow" className="lg:col-span-4">
          <CardFanReview />
        </ReviewExhibit>

        <ReviewExhibit label="Infinite Spatial Canvas" note="pan / depth / momentum" className="lg:col-span-8 lg:row-span-2">
          <SpatialCanvasReview compact={compact} />
        </ReviewExhibit>

        <ReviewExhibit label="Pull to Refresh" note="resistance / threshold / release" className="lg:col-span-4">
          <PullToRefreshReview />
        </ReviewExhibit>

        <ReviewExhibit label="Edge Swipe Panel" note="progressive reveal / settlement" className="lg:col-span-4">
          <EdgeSwipeReview />
        </ReviewExhibit>
      </div>
    </section>
  );
}

function ReviewExhibit({ label, note, children, className = "" }: { label: string; note: string; children: ReactNode; className?: string }) {
  return (
    <article className={`relative overflow-hidden rounded-[26px] border border-line bg-white/70 p-4 shadow-soft sm:p-5 ${className}`}>
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-mono text-[0.58rem] tracking-[0.14em] text-ink-500 uppercase">{label}</p>
        <span className="font-mono text-[0.55rem] text-ink-500">{note}</span>
      </div>
      <div className="mt-4">{children}</div>
    </article>
  );
}

function CardFanReview() {
  const cards = [
    { title: "Arrival", meta: "01 / entry", tint: "bg-blush-100" },
    { title: "Commons", meta: "02 / shared", tint: "bg-cloud-100" },
    { title: "Threshold", meta: "03 / edge", tint: "bg-[color:var(--color-milk,#fffdfb)]" },
    { title: "Work table", meta: "04 / focus", tint: "bg-blush-50" },
  ];

  return (
    <CardFan label="Curated studio deck" spread={24} rotation={7} className="min-h-[16.5rem]">
      {cards.map((card) => (
        <div key={card.title} className="w-36 overflow-hidden rounded-[18px] border border-line bg-white shadow-lift sm:w-40">
          <div className={`grid h-24 place-items-end p-3 ${card.tint}`}>
            <span className="font-mono text-[0.55rem] tracking-[0.12em] text-ink-500 uppercase">collection</span>
          </div>
          <div className="p-3">
            <p className="text-sm font-semibold">{card.title}</p>
            <p className="mt-1 font-mono text-[0.58rem] text-ink-500">{card.meta}</p>
          </div>
        </div>
      ))}
    </CardFan>
  );
}

function SpatialCanvasReview({ compact }: { compact: boolean }) {
  return (
    <InfiniteSpatialCanvas
      label="Studio spatial index"
      height={compact ? 360 : 430}
      bounds={{ left: -90, right: 90, top: -70, bottom: 70 }}
      items={[
        { id: "arrival", label: "Arrival", meta: "near field", cluster: "near field", plane: "foreground", x: 28, y: 42, content: <SoftSurface index={0} className="h-28 w-full" /> },
        { id: "commons", label: "Commons", meta: "shared", cluster: "near field", plane: "working", x: 238, y: 68, content: <SoftSurface index={1} className="h-24 w-full" /> },
        { id: "threshold", label: "Threshold", meta: "edge study", cluster: "quiet edge", plane: "distant", x: 92, y: 240, content: <SoftSurface index={2} className="h-24 w-full" /> },
        { id: "work-table", label: "Work table", meta: "deep focus", cluster: "deep focus", plane: "foreground", x: 410, y: 278, content: <SoftSurface index={3} className="h-28 w-full" /> },
      ]}
    />
  );
}

function PullToRefreshReview() {
  const [refreshes, setRefreshes] = useState(0);
  return (
    <PullToRefresh
      label="Studio feed refresh"
      actionLabel="Refresh feed"
      onRefresh={() => setRefreshes((value) => value + 1)}
      className="h-52 overflow-auto rounded-[20px] border border-line bg-[color:var(--color-milk,#fffdfb)]"
    >
      <div className="space-y-2 px-4 py-4">
        {["Quiet launch notes", "Surface study / 04", "Motion review"].map((item, index) => (
          <div key={item} className="flex items-center justify-between rounded-xl border border-line/70 bg-white px-3 py-2.5">
            <span className="text-xs font-medium">{item}</span>
            <span className="font-mono text-[0.55rem] text-ink-500">0{index + 1}</span>
          </div>
        ))}
        <p className="pt-1 font-mono text-[0.55rem] tracking-[0.1em] text-ink-500 uppercase">Demo refreshes / {refreshes}</p>
      </div>
    </PullToRefresh>
  );
}

function EdgeSwipeReview() {
  return (
    <EdgeSwipePanel
      label="Quick filters"
      content={
        <div className="min-h-52 rounded-[20px] border border-line bg-cloud-50 p-4">
          <p className="font-mono text-[0.55rem] tracking-[0.14em] text-ink-500 uppercase">Working surface</p>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {["Now", "Next", "Saved"].map((item, index) => <div key={item} className="rounded-xl bg-white p-3"><span className="block text-xs font-medium">{item}</span><span className="mt-2 block font-mono text-[0.55rem] text-ink-500">0{index + 2}</span></div>)}
          </div>
          <p className="mt-5 max-w-[14rem] text-xs leading-relaxed text-ink-700">The surface yields a little as the edge panel enters the field.</p>
        </div>
      }
      className="min-h-52"
    >
      <div className="space-y-3">
        {[
          ["Only ready", "items with a settled state"],
          ["Assigned to me", "personal focus"],
          ["Quiet mode", "reduce ambient motion"],
        ].map(([title, detail]) => <label key={title} className="flex items-start gap-3 rounded-xl border border-line/70 bg-cloud-50 p-3 text-sm"><input type="checkbox" className="mt-0.5" /><span><span className="block font-medium">{title}</span><span className="mt-1 block text-xs text-ink-500">{detail}</span></span></label>)}
      </div>
    </EdgeSwipePanel>
  );
}

function Exhibit({ label, note, children, className = "", clipContent = true }: { label: string; note: string; children: ReactNode; className?: string; clipContent?: boolean }) {
  return (
    <div className={`relative rounded-[24px] border border-line bg-white/70 p-4 shadow-soft sm:rounded-[28px] sm:p-6 ${clipContent ? "overflow-hidden" : ""} ${className}`}>
      <div className="flex items-baseline justify-between gap-4">
        <p className="font-mono text-[0.625rem] tracking-[0.15em] text-ink-500 uppercase">{label}</p>
        <span className="font-mono text-[0.6rem] text-ink-500">{note}</span>
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function MorphingHeroDemo({ compact }: { compact: boolean }) {
  return (
    <MorphingHero
      height={compact ? "34rem" : "42rem"}
      titleAs="h2"
      className="min-h-[27rem] rounded-2xl bg-cloud-50 p-5 sm:p-7"
      eyebrow={<span className="font-mono text-[0.6rem] tracking-[0.14em] text-ink-500 uppercase">Independent practice</span>}
      title={<span className="mt-3 block max-w-xl text-3xl leading-[1.02] tracking-tight sm:text-5xl">Make the interface feel tangible.</span>}
      description={<p className="mt-4 max-w-md text-sm leading-relaxed text-ink-700">Scroll slowly. The statement compresses into a calmer surface instead of disappearing behind the next section.</p>}
      actions={<a href="#featured-interactions" className="mt-5 inline-flex rounded-pill border border-line bg-white px-4 py-2.5 text-sm text-ink-700">Stay with the motion</a>}
      media={<SoftSurface index={1} className="min-h-48 w-full sm:min-h-64" />}
      compactLabel={<span className="rounded-pill border border-line bg-white/85 px-3 py-1.5 text-xs shadow-soft">Studio / 01</span>}
    />
  );
}

function SurfaceSampler() {
  return (
    <div className="grid min-h-36 gap-3 sm:grid-cols-3">
      <JellyCard className="min-h-28" radius="xl" surfaceClassName="grid place-items-center p-4">
        <span className="text-sm font-medium">Jelly</span>
      </JellyCard>
      <LiquidCard tint="clear" intensity={0.24} className="min-h-28">
        <span className="text-sm font-medium">Liquid</span>
      </LiquidCard>
      <MorphCard
        label="Morph surface"
        maxWidth={520}
        className="min-h-28"
        expandedContent={<div className="p-8"><p className="font-mono text-xs tracking-[0.14em] text-ink-500 uppercase">Morph surface</p><p className="mt-3 text-xl font-medium">The same surface, opened into a little more context.</p></div>}
      >
        <div className="grid min-h-28 place-items-center p-4 text-sm font-medium">Morph</div>
      </MorphCard>
    </div>
  );
}

const COLLECTION_ITEMS = [
  { id: "one", title: "Arrival", meta: "soft light", media: <SoftSurface index={0} className="size-full" /> },
  { id: "two", title: "Commons", meta: "shared space", media: <SoftSurface index={1} className="size-full" /> },
  { id: "three", title: "Threshold", meta: "quiet edge", media: <SoftSurface index={2} className="size-full" /> },
  { id: "four", title: "Work table", meta: "clear focus", media: <SoftSurface index={3} className="size-full" /> },
];

function GalleryListDemo() {
  return (
    <GalleryListMorph
      items={COLLECTION_ITEMS}
      columns={4}
      label="Featured collection"
      className="min-h-44"
    />
  );
}

function MorphLightboxDemo() {
  return (
    <MorphLightbox
      label="Featured media collection"
      className="grid-cols-3 gap-2"
      itemClassName="rounded-xl"
      items={COLLECTION_ITEMS.slice(0, 3).map((item, index) => ({
        id: `featured-media-${item.id}`,
        label: item.title,
        thumbnail: <SoftSurface index={index} className="h-28 w-full" />,
        media: <SoftSurface index={index} className="h-64 w-full" />,
        caption: item.meta,
      }))}
    />
  );
}

const MOSAIC_ITEMS = [
  { id: "mosaic-one", label: "Arrival", meta: "01 / surface", featured: true, content: <SoftSurface index={0} className="h-full min-h-28 w-full" /> },
  { id: "mosaic-two", label: "Commons", meta: "02 / shared", content: <SoftSurface index={1} className="h-full min-h-28 w-full" /> },
  { id: "mosaic-three", label: "Threshold", meta: "03 / edge", content: <SoftSurface index={2} className="h-full min-h-28 w-full" /> },
  { id: "mosaic-four", label: "Work table", meta: "04 / focus", span: 2 as const, content: <SoftSurface index={3} className="h-full min-h-28 w-full" /> },
];

function EditorialMosaicDemo() {
  return <EditorialMosaic items={MOSAIC_ITEMS} columns={3} label="Featured editorial mosaic" className="w-full" />;
}

function TactileButtonSampler() {
  return (
    <div className="flex min-h-36 flex-wrap items-center justify-center gap-5 rounded-2xl bg-cloud-50 p-5 sm:gap-7">
      <InsetButton>Press down</InsetButton>
      <ExpandButton icon={<span aria-hidden className="text-lg leading-none">↗</span>} label="Open field" />
    </div>
  );
}

function CommandPaletteDemo() {
  const [open, setOpen] = useState(false);
  useCommandShortcut(() => setOpen(true));

  return (
    <div className="flex min-h-36 flex-col justify-between gap-5">
      <p className="max-w-xs text-sm leading-relaxed text-ink-700">Press the button or use ⌘K / Ctrl K. The command surface owns focus, filtering and Escape.</p>
      <button type="button" onClick={() => setOpen(true)} className="inline-flex w-fit items-center gap-3 rounded-pill bg-ink-900 px-4 py-2.5 text-sm text-milk">
        Open commands
        <kbd className="rounded border border-white/20 px-1.5 py-0.5 font-mono text-[0.625rem] text-milk/75">⌘K</kbd>
      </button>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        items={[
          { id: "explore", label: "Explore interactions", group: "Navigate", onSelect: () => { window.location.href = "/explore"; } },
          { id: "components", label: "Browse components", group: "Navigate", onSelect: () => { window.location.href = "/components"; } },
          { id: "copy", label: "Copy the current pattern", group: "Action", onSelect: () => undefined },
        ]}
      />
    </div>
  );
}

function StackSpatialDemo() {
  return <StackSpatial items={COLLECTION_ITEMS.map((item) => ({ id: item.id, label: item.title, meta: item.meta, content: <SoftSurface index={Number(item.id === "one" ? 0 : item.id === "two" ? 1 : item.id === "three" ? 2 : 3)} className="h-24 w-full" /> }))} className="min-h-44" />;
}

function StickyStoryDemo({ compact }: { compact: boolean }) {
  return (
    <StickyStory
      disabled={compact}
      top={96}
      className="min-h-[24rem]"
      visualClassName="min-h-48 md:min-h-[20rem]"
      steps={[
        { id: "arrive", eyebrow: <span className="font-mono text-[0.6rem] tracking-[0.14em] text-ink-500 uppercase">01 / Arrive</span>, title: <span className="mt-2 block text-xl">Start with a surface.</span>, description: <span className="mt-2 block text-sm leading-relaxed text-ink-700">A visual can hold the quiet while the story catches up.</span>, visual: <SoftSurface index={0} className="min-h-48 w-full rounded-2xl md:min-h-[20rem]" /> },
        { id: "settle", eyebrow: <span className="font-mono text-[0.6rem] tracking-[0.14em] text-ink-500 uppercase">02 / Settle</span>, title: <span className="mt-2 block text-xl">Then let the content lead.</span>, description: <span className="mt-2 block text-sm leading-relaxed text-ink-700">The visual changes in context, not on a timer disconnected from reading.</span>, visual: <SoftSurface index={2} className="min-h-48 w-full rounded-2xl md:min-h-[20rem]" /> },
      ]}
    />
  );
}

export function MenuTriggerSampler({ idPrefix = "menu-sampler" }: { idPrefix?: string }) {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const bind = (id: string) => ({
    open: open[id] ?? false,
    onOpenChange: (next: boolean) => setOpen((current) => ({ ...current, [id]: next })),
    controls: `${idPrefix}-${id}-surface`,
  });
  const entries = [
    { id: "floating", label: "Floating Lines", trigger: <FloatingLines {...bind("floating")} /> },
    { id: "bento", label: "Bento", trigger: <BentoMenu {...bind("bento")} /> },
    { id: "text", label: "Text", trigger: <TextMenu {...bind("text")} className="min-h-11 min-w-16 px-2" /> },
  ];

  return (
    <div>
      <div className="grid min-h-28 grid-cols-3 items-center gap-3 rounded-2xl bg-cloud-50 p-4">
        {entries.map((entry) => <div key={entry.id} className="flex flex-col items-center gap-2"><div>{entry.trigger}</div><span className="font-mono text-[0.575rem] tracking-[0.1em] text-ink-500 uppercase">{entry.label}</span></div>)}
      </div>
      <div className="mt-3 space-y-2">
        {entries.map((entry) => (
          <div key={entry.id} id={`${idPrefix}-${entry.id}-surface`} hidden={!open[entry.id]} className="rounded-xl border border-line bg-white p-3">
            <nav aria-label={`${entry.label} menu`} className="flex flex-wrap gap-3 text-sm text-ink-700">
              <a href="#featured-interactions" className="underline decoration-line-strong underline-offset-4">View interaction</a>
              <a href="/controls" className="underline decoration-line-strong underline-offset-4">Open trigger wall</a>
            </nav>
          </div>
        ))}
      </div>
    </div>
  );
}
