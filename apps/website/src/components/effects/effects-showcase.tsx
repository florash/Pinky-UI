"use client";

import {
  BorderTravel,
  BlurReveal,
  ContentSwapMotion,
  CharacterStagger,
  CursorBlend,
  CursorBlob,
  CursorProvider,
  CursorSpotlight,
  CursorTarget,
  CursorText,
  CursorTrail,
  DepthShift,
  EdgeHighlight,
  HoverImagePreview,
  HoverImagePreviewItem,
  HorizontalStory,
  HoverTextReveal,
  ImageTrail,
  KineticUnderline,
  LensCursor,
  LiquidCursor,
  LiquidLoader,
  MagneticCursorTarget,
  MaskReveal,
  ParallaxSection,
  ScrollProgress,
  ScrollReveal,
  SoftCursor,
  SpringReveal,
  SplitTextReveal,
  StaggerReveal,
  StickyStory,
  SurfaceCompression,
  TextScramble,
  WordStagger,
} from "@pinky-ui/effects";
import { allEffects } from "@pinky-ui/registry";
import { useState } from "react";

import { LazyMount } from "@/components/site/lazy-mount";
import { RegistryCatalogue } from "@/components/site/registry-catalogue";
import { SOFT_MEDIA_SOURCES } from "@/components/previews/soft-surface";

/**
 * Demo surfaces rather than stock photography.
 *
 * These effects operate on whatever node they are given; using architectural
 * photographs made the pictures the subject and the effect the frame, which is
 * the opposite of the argument this page is making.
 */
const IMAGES = [
  "linear-gradient(150deg, var(--color-blush-100), var(--color-blush-200) 55%, var(--color-cloud-100))",
  "linear-gradient(160deg, var(--color-cloud-100), var(--color-cloud-200) 60%, var(--color-white))",
  "linear-gradient(140deg, var(--color-white), var(--color-blush-100) 48%, var(--color-cloud-200))",
  "linear-gradient(170deg, var(--color-blush-50), var(--color-cloud-100) 52%, var(--color-blush-200))",
];

function Surface({ index, className }: { index: number; className?: string }) {
  return <span aria-hidden className={className} style={{ backgroundImage: IMAGES[index % IMAGES.length], display: "block" }} />;
}

const panelStyle = {
  minHeight: 220,
  borderRadius: 24,
  padding: 24,
  background: "color-mix(in oklab, var(--color-white) 76%, var(--pinky-page))",
  border: "1px solid var(--color-line)",
  boxShadow: "var(--shadow-soft)",
};

/**
 * The page-level cursor layers a visitor can have running.
 *
 * `cursor-etiquette` allows exactly one signature cursor per page, so this is a
 * single-choice control rather than a stack. `SoftCursor` and `CursorText` are
 * not alternatives to each other: the follower is the cursor, and CursorText is
 * how a `CursorTarget` labels it, so they ship together as the base layer.
 */
const CURSOR_LAYERS = [
  { id: "soft", label: "Soft Cursor" },
  { id: "trail", label: "Cursor Trail" },
  { id: "blob", label: "Cursor Blob" },
  { id: "blend", label: "Cursor Blend" },
  { id: "none", label: "None" },
] as const;

type CursorLayer = (typeof CURSOR_LAYERS)[number]["id"];

export function EffectsShowcase() {
  const [layer, setLayer] = useState<CursorLayer>("soft");

  return (
    <CursorProvider>
      {/*
        One cursor at a time. Mounting Soft Cursor, Trail and Blob together is
        what this page used to do, and it contradicted the guidance the page
        itself publishes.
      */}
      <SoftCursor followerOnly disabled={layer !== "soft"} />
      <CursorTrail count={10} size={8} lifetime={520} disabled={layer !== "trail"} />
      <CursorBlob opacity={0.22} size={260} disabled={layer !== "blob"} />
      <CursorBlend disabled={layer !== "blend"} />
      <CursorText />
      <ScrollProgress />

      <div className="relative overflow-hidden pb-32">
        <section className="mx-auto max-w-[76rem] px-5 pt-14 sm:px-8 sm:pt-16">
          <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-ink-500 uppercase">
            Effects
          </p>
          <h1 className="mt-4 max-w-3xl text-section text-balance-tight">
            A calmer way to make interfaces feel alive.
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-ink-700">
            Cursor, motion, text and scroll effects with a native, keyboard-safe fallback built in.
            Move through the page on a desktop pointer, then try the same content with reduced
            motion enabled.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <MagneticCursorTarget label="Explore" influence="both">
              <a className="rounded-pill bg-ink-900 px-5 py-3 text-sm text-milk" href="#cursor">
                Explore effects
              </a>
            </MagneticCursorTarget>
            <KineticUnderline as="a" href="#scroll" className="px-2 py-3 text-sm text-ink-700">
              Jump to scroll stories
            </KineticUnderline>
            <KineticUnderline as="a" href="/experiences" className="px-2 py-3 text-sm text-ink-700">
              Explore experience-level UI →
            </KineticUnderline>
            <KineticUnderline as="a" href="#browse-all" className="px-2 py-3 text-sm text-ink-700">
              Browse all {allEffects.length} effects →
            </KineticUnderline>
          </div>

          <fieldset className="mt-10 rounded-2xl border border-line bg-white/70 p-5">
            <legend className="px-2 font-mono text-[0.6875rem] tracking-[0.16em] text-ink-500 uppercase">
              Cursor layer
            </legend>
            <p className="text-sm leading-relaxed text-ink-700">
              A page gets one signature cursor. Switch the active layer rather than stacking them —
              running several at once is the most common way these effects turn into noise.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {CURSOR_LAYERS.map((option) => (
                <label
                  key={option.id}
                  className={`cursor-pointer rounded-pill border px-3.5 py-2 text-sm transition-colors ${
                    layer === option.id
                      ? "border-ink-900 bg-ink-900 text-milk"
                      : "border-line bg-white text-ink-700 hover:border-line-strong"
                  }`}
                >
                  <input
                    type="radio"
                    name="cursor-layer"
                    value={option.id}
                    checked={layer === option.id}
                    onChange={() => setLayer(option.id)}
                    className="sr-only"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>
        </section>

        <section id="cursor" className="mx-auto max-w-[76rem] px-5 pt-28 sm:px-8">
          <SectionLabel eyebrow="01 · Cursor" title="The pointer can have a vocabulary." />
          <CursorSpotlight radius={360} intensity={0.24} className="mt-10 rounded-[28px]">
            <div style={panelStyle}>
              <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
                <div>
                  <p className="font-mono text-xs tracking-[0.16em] text-ink-500 uppercase">
                    Project index
                  </p>
                  <h2 className="mt-3 text-3xl">Focus, not friction.</h2>
                  <p className="mt-4 max-w-lg leading-relaxed text-ink-700">
                    The follower is decorative. The links, labels and focus ring underneath are
                    the interaction.
                  </p>
                  <div className="mt-7 divide-y divide-line">
                    {["Soft Matter", "Quiet Systems", "Open Forms"].map((project, index) => (
                      <CursorTarget key={project} as="div" label={index === 1 ? "View" : "Open"}>
                        <a href={`#project-${index}`} className="block py-4 text-lg">
                          {project} <span className="float-right text-ink-500">↗</span>
                        </a>
                      </CursorTarget>
                    ))}
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-blush-100 p-5 text-sm text-ink-700">Cursor Text</div>
                  <div className="rounded-2xl bg-cloud-100 p-5 text-sm text-ink-700">Spotlight</div>
                  <div className="rounded-2xl bg-blush-50 p-5 text-sm text-ink-700">Trail</div>
                  <div className="rounded-2xl bg-cloud-50 p-5 text-sm text-ink-700">Magnetic Target</div>
                </div>
              </div>
            </div>
          </CursorSpotlight>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div style={panelStyle}>
              <p className="font-mono text-xs tracking-[0.16em] text-ink-500 uppercase">Image trail</p>
              <h3 className="mt-3 text-2xl">Sweep through the archive.</h3>
              <LazyMount minHeight={160} className="mt-6 rounded-2xl bg-cloud-50">
                <ImageTrail images={SOFT_MEDIA_SOURCES} threshold={120} className="overflow-hidden rounded-2xl">
                  <div className="flex min-h-40 items-end rounded-2xl border border-line bg-blush-50 p-5 text-ink-700">
                    Move quickly across this field
                  </div>
                </ImageTrail>
              </LazyMount>
            </div>
            <div style={panelStyle}>
              <p className="font-mono text-xs tracking-[0.16em] text-ink-500 uppercase">Preview + lens</p>
              <h3 className="mt-3 text-2xl">Media arrives when it helps.</h3>
              <HoverImagePreview className="mt-6 space-y-1">
                {IMAGES.slice(0, 3).map((image, index) => (
                  <HoverImagePreviewItem key={image} src={SOFT_MEDIA_SOURCES[index]!} as="div">
                    <a className="block rounded-xl px-4 py-3 text-ink-700 hover:bg-blush-50" href={`#image-${index}`}>
                      Case study {String(index + 1).padStart(2, "0")}
                    </a>
                  </HoverImagePreviewItem>
                ))}
              </HoverImagePreview>
              <LensCursor className="mt-4 overflow-hidden rounded-2xl" disabled>
                <Surface index={0} className="h-28 w-full" />
              </LensCursor>
              <div className="mt-3 flex gap-3 text-xs text-ink-500">
                <LiquidCursor disabled />
                <span>Liquid Cursor is available as a standalone layer.</span>
              </div>
            </div>
          </div>
        </section>

        <section id="motion" className="mx-auto max-w-[76rem] px-5 pt-32 sm:px-8">
          <SectionLabel eyebrow="02 · Motion" title="Entrance is a rhythm, not a gate." />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <BlurReveal>
              <div style={panelStyle}>
                <p className="font-mono text-xs tracking-[0.16em] text-ink-500 uppercase">Blur Reveal</p>
                <h3 className="mt-3 text-2xl">Sharp content, soft arrival.</h3>
                <p className="mt-4 leading-relaxed text-ink-700">The blur stays low enough that the message is never withheld.</p>
              </div>
            </BlurReveal>
            <SpringReveal direction="right">
              <div style={panelStyle}>
                <p className="font-mono text-xs tracking-[0.16em] text-ink-500 uppercase">Spring Reveal · Blur preset</p>
                <h3 className="mt-3 text-2xl">A small physical settle.</h3>
                <p className="mt-4 leading-relaxed text-ink-700">The same readable entrance with a spring settle; use Blur Reveal when the spring itself is not the point.</p>
              </div>
            </SpringReveal>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <MaskReveal direction="left">
              <div style={{ ...panelStyle, minHeight: 180 }}>
                <h3 className="text-xl">Mask Reveal</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-700">Useful for editorial images and hero surfaces.</p>
              </div>
            </MaskReveal>
            <StaggerReveal>
              {["One considered step", "Then a second", "Then the whole shape"].map((item) => (
                <p key={item} className="rounded-xl bg-cloud-100 px-4 py-3 text-sm text-ink-700">
                  {item}
                </p>
              ))}
            </StaggerReveal>
            <div style={panelStyle}>
              <p className="font-mono text-xs tracking-[0.16em] text-ink-500 uppercase">Liquid Loader</p>
              <div className="mt-8 flex items-center gap-5">
                <LiquidLoader label="Saving" />
                <LiquidLoader label="Uploading" variant="pill" progress={0.62} />
              </div>
            </div>
          </div>
          <div className="mt-6 overflow-hidden rounded-[28px]"><Surface index={1} className="h-72 w-full" /></div>
        </section>

        <section id="surface-effects" className="mx-auto max-w-[76rem] px-5 pt-28 sm:px-8">
          <SectionLabel eyebrow="02A · Surfaces" title="The edge, face and depth can answer together." />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <EdgeHighlight className="rounded-2xl bg-white p-4 ring-1 ring-line">
              <button type="button" className="block w-full rounded-xl bg-cloud-50 p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20">
                <p className="font-mono text-[0.625rem] tracking-[0.14em] text-ink-500 uppercase">Edge Highlight</p>
                <p className="mt-3 text-sm text-ink-700">Move close to one side.</p>
              </button>
            </EdgeHighlight>
            <SurfaceCompression className="rounded-2xl bg-white p-4 ring-1 ring-line">
              <button type="button" className="block w-full rounded-xl bg-ink-900 p-5 text-left text-sm text-milk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25">
                <span className="font-mono text-[0.625rem] tracking-[0.14em] text-milk/60 uppercase">Surface Compression</span>
                <span className="mt-3 block">Press with pointer or keyboard.</span>
              </button>
            </SurfaceCompression>
            <DepthShift className="min-h-36 rounded-2xl bg-cloud-100 p-4" background={<span className="absolute inset-4 rounded-xl bg-blush-200/60" />} secondary={<span className="absolute inset-6 rounded-xl border border-white/80 bg-white/60" />}>
              <button type="button" className="relative block w-full rounded-xl bg-white p-5 text-left shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20">
                <p className="font-mono text-[0.625rem] tracking-[0.14em] text-ink-500 uppercase">Depth Shift</p>
                <p className="mt-3 text-sm">Move across the planes.</p>
              </button>
            </DepthShift>
            <BorderTravel className="rounded-2xl bg-white p-4 ring-1 ring-line">
              <button type="button" className="block w-full rounded-xl bg-cloud-50 p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20">
                <p className="font-mono text-[0.625rem] tracking-[0.14em] text-ink-500 uppercase">Border Travel</p>
                <p className="mt-3 text-sm text-ink-700">One short segment, one edge.</p>
              </button>
            </BorderTravel>
            <MaskReveal trigger="hover" direction="right" className="rounded-2xl bg-blush-50 p-4 ring-1 ring-line">
              <button type="button" className="block w-full rounded-xl bg-white/70 p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20">
                <p className="font-mono text-[0.625rem] tracking-[0.14em] text-ink-500 uppercase">Mask Reveal</p>
                <p className="mt-3 text-sm text-ink-700">Focus or hover to reveal.</p>
              </button>
            </MaskReveal>
            <EffectContentSwap />
          </div>
        </section>

        <section id="text" className="mx-auto max-w-[76rem] px-5 pt-32 sm:px-8">
          <SectionLabel eyebrow="03 · Text" title="Typography can move without losing its voice." />
          <div
            className="mt-10 rounded-[28px] border border-line p-7 shadow-soft sm:p-12"
            style={{
              background:
                "linear-gradient(150deg, var(--color-white), var(--color-blush-50) 45%, var(--color-cloud-100))",
            }}
          >
            <SplitTextReveal by="word" className="block max-w-3xl text-4xl leading-tight sm:text-6xl">
              Interfaces that feel alive, not loud.
            </SplitTextReveal>
            <div className="mt-10 grid gap-6 border-t border-line pt-7 text-sm sm:grid-cols-2">
              <div>
                <p className="text-ink-500">Word Stagger · Split Text preset</p>
                <WordStagger className="mt-3 block text-2xl">A word at a time.</WordStagger>
              </div>
              <div>
                <p className="text-ink-500">Character Stagger · Split Text preset</p>
                <CharacterStagger className="mt-3 block text-2xl">Short titles only.</CharacterStagger>
              </div>
              <div>
                <p className="text-ink-500">Hover Text</p>
                <HoverTextReveal text="View project" hoverText="Open project →" className="mt-3 text-2xl" />
                <p className="mt-3 text-sm text-ink-500">Scramble: <TextScramble text="Decode" trigger="hover" /></p>
              </div>
              <div>
                <p className="text-ink-500">Kinetic Underline</p>
                <KineticUnderline className="mt-3 text-2xl">Read the note →</KineticUnderline>
              </div>
            </div>
          </div>
        </section>

        <section id="scroll" className="mx-auto max-w-[76rem] px-5 pt-32 sm:px-8">
          <SectionLabel eyebrow="04 · Scroll" title="Scroll can carry a story without taking the wheel." />
          <ScrollReveal className="mt-10">
            <ParallaxSection background={<div className="h-full w-full rounded-[28px] bg-cloud-100" />}>
              <div style={{ ...panelStyle, minHeight: 280 }}>
                <p className="font-mono text-xs tracking-[0.16em] text-ink-500 uppercase">Parallax Section</p>
                <h3 className="mt-3 max-w-lg text-3xl">Depth in a few pixels.</h3>
                <p className="mt-4 max-w-lg leading-relaxed text-ink-700">The content stays readable while the layers move just enough to suggest space.</p>
              </div>
            </ParallaxSection>
          </ScrollReveal>
          <StickyStory
            className="mt-12"
            steps={[
              { id: "listen", title: "Listen", description: "Start with the quiet signal.", visual: <div className="rounded-3xl bg-blush-100 p-10 text-4xl">01</div> },
              { id: "shape", title: "Shape", description: "Give the response a human scale.", visual: <div className="rounded-3xl bg-cloud-100 p-10 text-4xl">02</div> },
              { id: "release", title: "Release", description: "Let the interface get out of the way.", visual: <div className="rounded-3xl bg-blush-200 p-10 text-4xl">03</div> },
            ]}
          />
          <LazyMount minHeight={360} className="mt-12 rounded-3xl bg-cloud-50/60">
          <HorizontalStory panels={IMAGES.map((image, index) => (
            <div key={image} className="overflow-hidden rounded-3xl bg-white shadow-soft">
              <Surface index={index} className="h-64 w-full" />
              <p className="p-5 text-sm text-ink-700">Panel {index + 1} · native fallback included</p>
            </div>
          ))} />
          </LazyMount>
        </section>

        <RegistryCatalogue id="browse-all" items={allEffects} hrefPrefix="/effects" label="effects" />
      </div>
    </CursorProvider>
  );
}

function SectionLabel({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="max-w-2xl">
      <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-ink-500 uppercase">{eyebrow}</p>
      <h2 className="mt-4 text-section text-balance-tight">{title}</h2>
    </div>
  );
}

function EffectContentSwap() {
  const [value, setValue] = useState(0);
  const names = ["Arrival", "Material", "Release"];
  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-line">
      <p className="font-mono text-[0.625rem] tracking-[0.14em] text-ink-500 uppercase">Content Swap Motion</p>
      <ContentSwapMotion value={value} className="mt-3 min-h-16 rounded-xl bg-cloud-50 p-4">
        <p className="text-sm font-medium">{names[value]}</p>
      </ContentSwapMotion>
      <button type="button" onClick={() => setValue((current) => (current + 1) % names.length)} className="mt-3 rounded-pill border border-line px-3 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20">Swap content</button>
    </div>
  );
}
