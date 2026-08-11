"use client";

import {
  BlurReveal,
  CharacterStagger,
  CursorBlob,
  CursorProvider,
  CursorSpotlight,
  CursorTarget,
  CursorText,
  CursorTrail,
  HoverImagePreview,
  HoverImagePreviewItem,
  HorizontalStory,
  HoverTextReveal,
  ImageReveal,
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
  TextScramble,
  WordStagger,
} from "@pinky/effects";

const IMAGES = [
  "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
];

const panelStyle = {
  minHeight: 220,
  borderRadius: 24,
  padding: 24,
  background: "color-mix(in oklab, var(--color-white) 76%, var(--pinky-page))",
  border: "1px solid var(--color-line)",
  boxShadow: "var(--shadow-soft)",
};

export function EffectsShowcase() {
  return (
    <CursorProvider>
      <SoftCursor followerOnly />
      <CursorText />
      <CursorBlob opacity={0.22} size={260} />
      <CursorTrail count={10} size={8} lifetime={520} />
      <ScrollProgress />

      <div className="relative overflow-hidden pb-32">
        <section className="mx-auto max-w-[76rem] px-5 pt-24 sm:px-8 sm:pt-32">
          <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-ink-500 uppercase">
            Milestone 2.6 · Effects
          </p>
          <h1 className="mt-5 max-w-4xl text-display text-balance-tight">
            A calmer way to make interfaces feel alive.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-700">
            Cursor, motion, text and scroll effects with a native, keyboard-safe fallback built in.
            Move through the page on a desktop pointer, then try the same content with reduced
            motion enabled.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <MagneticCursorTarget label="Explore" influence="both">
              <a className="rounded-pill bg-ink-900 px-5 py-3 text-sm text-milk" href="#cursor">
                Explore effects
              </a>
            </MagneticCursorTarget>
            <KineticUnderline href="#scroll" className="px-2 py-3 text-sm text-ink-700">
              Jump to scroll stories
            </KineticUnderline>
            <KineticUnderline href="/experiences" className="px-2 py-3 text-sm text-ink-700">
              Explore experience-level UI →
            </KineticUnderline>
          </div>
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
              <ImageTrail images={IMAGES} threshold={120} className="mt-6 overflow-hidden rounded-2xl">
                <div className="flex min-h-40 items-end rounded-2xl bg-ink-900 p-5 text-milk">
                  Move quickly across this field
                </div>
              </ImageTrail>
            </div>
            <div style={panelStyle}>
              <p className="font-mono text-xs tracking-[0.16em] text-ink-500 uppercase">Preview + lens</p>
              <h3 className="mt-3 text-2xl">Media arrives when it helps.</h3>
              <HoverImagePreview className="mt-6 space-y-1">
                {IMAGES.slice(0, 3).map((image, index) => (
                  <HoverImagePreviewItem key={image} src={image} as="div">
                    <a className="block rounded-xl px-4 py-3 text-ink-700 hover:bg-blush-50" href={`#image-${index}`}>
                      Case study {String(index + 1).padStart(2, "0")}
                    </a>
                  </HoverImagePreviewItem>
                ))}
              </HoverImagePreview>
              <LensCursor src={IMAGES[0]} className="mt-4 overflow-hidden rounded-2xl" disabled>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={IMAGES[0]} alt="A quiet concrete interior" className="h-28 w-full object-cover" />
              </LensCursor>
              <div className="mt-3 flex gap-3 text-xs text-ink-500">
                <LiquidCursor disabled />
                <span>Liquid Cursor is available as a standalone layer.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[76rem] px-5 pt-32 sm:px-8">
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
                <p className="font-mono text-xs tracking-[0.16em] text-ink-500 uppercase">Spring Reveal</p>
                <h3 className="mt-3 text-2xl">A small physical settle.</h3>
                <p className="mt-4 leading-relaxed text-ink-700">One shared spring vocabulary keeps distant sections related.</p>
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
          <ImageReveal src={IMAGES[1]} alt="A bright shared studio" className="mt-6 h-72 rounded-[28px]" />
        </section>

        <section className="mx-auto max-w-[76rem] px-5 pt-32 sm:px-8">
          <SectionLabel eyebrow="03 · Text" title="Typography can move without losing its voice." />
          <div className="mt-10 rounded-[28px] bg-ink-900 p-7 text-milk sm:p-12">
            <SplitTextReveal by="word" className="block max-w-3xl text-4xl leading-tight sm:text-6xl">
              Interfaces that feel alive, not loud.
            </SplitTextReveal>
            <div className="mt-10 grid gap-6 border-t border-white/15 pt-7 text-sm sm:grid-cols-2">
              <div>
                <p className="text-milk/60">Word Stagger</p>
                <WordStagger className="mt-3 block text-2xl">A word at a time.</WordStagger>
              </div>
              <div>
                <p className="text-milk/60">Character Stagger</p>
                <CharacterStagger className="mt-3 block text-2xl">Short titles only.</CharacterStagger>
              </div>
              <div>
                <p className="text-milk/60">Hover Text</p>
                <HoverTextReveal text="View project" hoverText="Open project →" className="mt-3 text-2xl" />
                <p className="mt-3 text-sm text-milk/60">Scramble: <TextScramble text="Decode" trigger="hover" /></p>
              </div>
              <div>
                <p className="text-milk/60">Kinetic Underline</p>
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
              { id: "release", title: "Release", description: "Let the interface get out of the way.", visual: <div className="rounded-3xl bg-ink-900 p-10 text-4xl text-milk">03</div> },
            ]}
          />
          <HorizontalStory className="mt-12" panels={IMAGES.map((image, index) => (
            <div key={image} className="overflow-hidden rounded-3xl bg-white shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt={`Story panel ${index + 1}`} className="h-64 w-full object-cover" />
              <p className="p-5 text-sm text-ink-700">Panel {index + 1} · native fallback included</p>
            </div>
          ))} />
        </section>
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
