"use client";

import { ExpandButton, InsetButton, MagneticButton } from "@pinky/components";
import { ExpandableBottomNavigation, HoverExpandNavigation, MorphingMegaNavigation, type NavigationGroup, type NavigationLink } from "@pinky/experiences";
import { CardFan, GalleryListMorph } from "@pinky/layouts";
import { CommandPalette, MorphLightbox, useCommandShortcut } from "@pinky/systems";
import { useState, type ReactNode } from "react";

import { SoftSurface } from "@/components/previews/soft-surface";
import { Container } from "@/components/site/layout";

/**
 * The dense beat of the homepage.
 *
 * A small set of interactions, chosen because each one moves in a different
 * way — re-arrangement, expansion, attraction, compression, command and
 * wayfinding. They are live instances, laid out asymmetrically so the page
 * never reads as a card grid. Everything else lives in Explore; this is a first
 * impression, not a catalogue.
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

            {/* Small floating controls rather than a whole button wall — the
                full set lives on /controls. */}
            <Piece label="Tactile controls">
              <div className="flex flex-wrap items-center gap-4 rounded-[20px] bg-cloud-50 px-6 py-7">
                <MagneticButton strength={0.45} range={140}>
                  Move me
                </MagneticButton>
                <InsetButton>Press down</InsetButton>
                <ExpandButton
                  icon={
                    <span aria-hidden className="text-lg leading-none">
                      ↗
                    </span>
                  }
                  label="Open field"
                />
              </div>
            </Piece>

            <Piece label="Command Palette">
              <CommandPaletteDemo />
            </Piece>

            <Piece label="Navigation signatures">
              <NavigationSignatureDemo />
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
      {/*
        Mounted only while open. CommandPalette's exit animation never
        completes, so a closed palette otherwise leaves a transparent
        `fixed inset-0` overlay swallowing every click on the page. That is a
        bug inside @pinky/systems; unmounting is the homepage-side guard until
        it is fixed there.
      */}
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
          { id: "copy", label: "Copy the current pattern", group: "Action", onSelect: () => undefined },
        ]}
      />
      ) : null}
    </div>
  );
}

const NAVIGATION_SIGNATURE_ITEMS = [
  { id: "work", label: "Work", href: "#work", description: "Selected projects", meta: "01" },
  { id: "notes", label: "Notes", href: "#notes", description: "Writing and process", meta: "02" },
  { id: "about", label: "About", href: "#about", description: "The point of view", meta: "03" },
] satisfies NavigationLink[];

const NAVIGATION_SIGNATURE_GROUPS = [
  {
    id: "work",
    label: "Work",
    description: "A short index of selected work.",
    links: [{ id: "case-study", label: "Case studies", href: "#case-study" }],
  },
  {
    id: "notes",
    label: "Notes",
    description: "The reasoning behind the surfaces.",
    links: [{ id: "journal", label: "Read the journal", href: "#journal" }],
  },
] satisfies NavigationGroup[];

function NavigationSignatureDemo() {
  return (
    <div className="space-y-7 rounded-[20px] bg-cloud-50 px-5 py-6">
      <div>
        <p className="font-mono text-[0.58rem] tracking-[0.14em] text-ink-500 uppercase">Reflow</p>
        <div className="mt-3"><HoverExpandNavigation items={NAVIGATION_SIGNATURE_ITEMS} aria-label="Signature expanded navigation" /></div>
      </div>
      <div>
        <p className="font-mono text-[0.58rem] tracking-[0.14em] text-ink-500 uppercase">Continuity</p>
        <div className="mt-3"><MorphingMegaNavigation groups={NAVIGATION_SIGNATURE_GROUPS} aria-label="Signature morphing navigation" /></div>
      </div>
      <div>
        <p className="font-mono text-[0.58rem] tracking-[0.14em] text-ink-500 uppercase">Touch-first</p>
        <div className="mt-3 flex justify-center"><ExpandableBottomNavigation items={NAVIGATION_SIGNATURE_ITEMS} aria-label="Signature bottom navigation" /></div>
      </div>
    </div>
  );
}
