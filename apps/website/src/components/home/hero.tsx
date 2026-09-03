"use client";

import { FluidTabs, GlowBorder, JellyCard, MagneticButton } from "@pinky-ui/components";
import { CursorGlow, subscribeToPointer, useMotionEnabled } from "@pinky-ui/primitives";
import { useEffect, useRef } from "react";

import { CodeBlock } from "@/components/site/code-block";
import { ArrowRight, GitHubMark } from "@/components/site/icons";
import { Container } from "@/components/site/layout";
import { MagneticLink } from "@/components/site/magnetic-link";
import { SITE } from "@/lib/site";

const CLONE_COMMAND = `git clone https://github.com/florash/Pinky-UI.git
cd Pinky-UI && npm install && npm run dev`;

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-8 pb-10 sm:pt-12 sm:pb-14">
      <HeroAtmosphere />

      <Container className="relative">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-10">
          {/*
            min-w-0: a grid item's default min-width is "auto" (its content's
            intrinsic width), so without this the CodeBlock below — a single
            un-wrapped `git clone` line — pushes this column wider than the
            viewport on narrow screens instead of letting the code scroll
            inside its own box.
          */}
          <div className="min-w-0 max-w-xl">
            <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[0.6875rem] tracking-[0.2em] text-ink-500 uppercase">
              <span className="size-1.5 shrink-0 rounded-pill bg-blush-300" />
              <span className="whitespace-nowrap">Pinky UI</span>
              <span className="h-px min-w-4 flex-1 bg-line" />
              <span className="whitespace-nowrap">v0.1</span>
              {/*
                w-full: on a row too narrow for all five pieces, flex-wrap
                drops this note alone onto its own line instead of squeezing
                every item down until "Pinky UI" itself wraps mid-word.
              */}
              <span className="w-full normal-case text-ink-400 sm:w-auto">Source available · npm coming soon</span>
            </p>

            {/*
              Developer-tool ordering: say what it is, then hand over code
              that runs, then let tone follow. The tagline still carries the
              page, not the product name — the name is in the header, the
              logo and the eyebrow above.
            */}
            <h1 className="mt-6 max-w-xl text-[clamp(2.5rem,4.4vw,4rem)] leading-[0.96] tracking-[-0.055em] text-balance-tight">
              A React library
              <br />
              for interactive motion.
            </h1>

            <p className="mt-5 max-w-sm text-base leading-relaxed text-ink-700">
              75 building blocks — 12 motion primitives, 35 components, 28 layouts. Every one has
              a live preview and an import path.
            </p>

            <div className="mt-6">
              <CodeBlock code={CLONE_COMMAND} label="shell" language="bash" className="max-w-sm" />
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <MagneticLink href="/components" size="lg">
                Browse Components
                <ArrowRight className="size-4" />
              </MagneticLink>
              <MagneticLink href={SITE.github} variant="soft" size="lg" external>
                <GitHubMark className="size-4" />
                View on GitHub
              </MagneticLink>
            </div>
          </div>

          <HeroStage />
        </div>
      </Container>
    </section>
  );
}

/**
 * Two soft light pools that drift a few pixels with the pointer.
 *
 * Written straight to CSS variables on one element — the whole effect costs a
 * single style write per frame and no React renders.
 */
function HeroAtmosphere() {
  const ref = useRef<HTMLDivElement>(null);
  const motionEnabled = useMotionEnabled();

  useEffect(() => {
    const element = ref.current;
    if (!element || !motionEnabled) return;

    return subscribeToPointer((pointer) => {
      if (pointer.coarse || !pointer.active) return;
      const x = pointer.x / window.innerWidth - 0.5;
      const y = pointer.y / window.innerHeight - 0.5;
      element.style.setProperty("--drift-x", `${(x * 24).toFixed(1)}px`);
      element.style.setProperty("--drift-y", `${(y * 18).toFixed(1)}px`);
    });
  }, [motionEnabled]);

  return (
    // The section clips its overflow, so the light pools are faded out before
    // the bottom edge — otherwise the hero ends on a hard horizontal seam.
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10"
      style={{
        maskImage: "linear-gradient(180deg, #000 55%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(180deg, #000 55%, transparent 100%)",
      }}
    >
      <div
        className="absolute -top-40 -left-32 size-[36rem] rounded-pill blur-[100px]"
        style={{
          background: "var(--pinky-halo-a)",
          transform: "translate3d(var(--drift-x, 0), var(--drift-y, 0), 0)",
          transition: "transform 800ms var(--ease-soft)",
        }}
      />
      <div
        className="absolute top-24 right-[-14rem] size-[40rem] rounded-pill blur-[110px]"
        style={{
          background: "var(--pinky-halo-b)",
          transform: "translate3d(calc(var(--drift-x, 0) * -1), calc(var(--drift-y, 0) * -1), 0)",
          transition: "transform 800ms var(--ease-soft)",
        }}
      />
    </div>
  );
}

/**
 * The hero exhibit.
 *
 * A composed scene rather than a grid of demos: the surfaces overlap, sit at
 * different depths, and are the real components. On narrow screens the same
 * pieces fall back into ordinary stacked flow.
 */
function HeroStage() {
  return (
    <CursorGlow size={460} intensity={0.36} className="rounded-2xl">
      <div className="relative mx-auto w-full max-w-md lg:h-[23rem] lg:max-w-none">
        {/* An abstract soft surface, purely there to give the scene depth. */}
        <span
          aria-hidden
          className="pointer-events-none absolute -top-6 right-4 hidden size-44 rounded-[42%_58%_63%_37%/51%_39%_61%_49%] lg:block"
          style={{
            background:
              "linear-gradient(150deg, var(--color-blush-200), var(--color-cloud-200))",
            opacity: 0.5,
            filter: "blur(2px)",
          }}
        />

        <JellyCard
          radius="2xl"
          elasticity={0.4}
          intensity={0.2}
          className="lg:absolute lg:top-10 lg:left-0 lg:z-20 lg:w-[20rem]"
          surfaceClassName="p-7"
        >
          <p className="font-mono text-[0.6875rem] tracking-[0.16em] text-ink-500 uppercase">
            Jelly Card
          </p>
          <p className="mt-2 font-mono text-xs text-ink-500">elasticity 0.4 · intensity 0.2</p>
          <p className="mt-4 font-display text-2xl leading-tight font-semibold tracking-tight">
            Move across
            <br />
            this card.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink-700">
            Elastic lean, drift and settle — with squash and stretch on press.
          </p>
        </JellyCard>

        {/* Pointer-only, so it earns nothing on a touch screen and only makes
            the mobile hero taller. */}
        <GlowBorder
          radius="xl"
          size={170}
          className="mt-4 hidden lg:absolute lg:top-0 lg:right-0 lg:z-10 lg:mt-0 lg:block lg:w-[13rem]"
        >
          <div className="rounded-xl bg-white/90 p-5 shadow-soft ring-1 ring-line">
            <p className="font-mono text-[0.6875rem] tracking-[0.16em] text-ink-500 uppercase">
              Glow Border
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink-700">
              Light gathers at the edge nearest your pointer.
            </p>
          </div>
        </GlowBorder>

        <div className="mt-4 lg:absolute lg:right-0 lg:bottom-6 lg:z-30 lg:mt-0 lg:w-[15rem]">
          <div className="rounded-xl bg-white/90 p-4 shadow-lift ring-1 ring-line">
            <p className="mb-3 font-mono text-[0.6875rem] tracking-[0.16em] text-ink-500 uppercase">
              Fluid Tabs
            </p>
            <FluidTabs
              aria-label="Hero demo"
              size="sm"
              fill
              items={[
                { id: "soft", label: "Soft" },
                { id: "fluid", label: "Fluid" },
                { id: "alive", label: "Alive" },
              ]}
            />
          </div>
        </div>

        {/* Floating free of any card, so the magnetism reads as its own thing. */}
        <div className="mt-5 flex justify-center lg:absolute lg:bottom-0 lg:left-8 lg:z-30 lg:mt-0 lg:justify-start">
          <MagneticButton size="lg" strength={0.45} range={150}>
            Magnetic
          </MagneticButton>
        </div>
      </div>
    </CursorGlow>
  );
}
