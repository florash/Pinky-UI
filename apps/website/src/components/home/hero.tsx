"use client";

import { FluidTabs, GlowBorder, JellyCard, MagneticButton } from "@pinky/components";
import { CursorGlow, subscribeToPointer, useMotionEnabled } from "@pinky/primitives";
import { useEffect, useRef } from "react";

import { ArrowRight } from "@/components/site/icons";
import { Container } from "@/components/site/layout";
import { MagneticLink } from "@/components/site/magnetic-link";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-8 pb-10 sm:pt-12 sm:pb-14">
      <HeroAtmosphere />

      <Container className="relative">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-10">
          <div className="max-w-xl">
            <p className="flex items-center gap-2.5 font-mono text-[0.6875rem] tracking-[0.2em] text-ink-500 uppercase">
              <span className="size-1.5 rounded-pill bg-blush-300" />
              Pinky UI
              <span className="h-px flex-1 bg-line" />
              v0.1
            </p>

            {/*
              The tagline carries the page, not the product name — the name is
              in the header, the logo and the eyebrow above. What a first-time
              visitor should remember is what the library does.
            */}
            <h1 className="mt-6 max-w-xl text-[clamp(2.5rem,4.4vw,4rem)] leading-[0.96] tracking-[-0.055em] text-balance-tight">
              UI that likes
              <br />
              to move.
            </h1>

            {/*
              One sentence and one door. GitHub already sits in the header and
              closes the page, so the hero does not need a second CTA competing
              with the live surfaces beside it.
            */}
            <p className="mt-5 max-w-sm text-base leading-relaxed text-ink-700">
              An open-source interaction system — real UI, already moving, ready to touch.
            </p>

            <div className="mt-7">
              <MagneticLink href="/explore" size="lg">
                Explore
                <ArrowRight className="size-4" />
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
          <p className="mt-4 font-display text-2xl leading-tight font-semibold tracking-tight">
            Move across
            <br />
            this card.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink-700">
            The surface leans toward you, drifts a little, and settles on a spring.
          </p>
          <div className="mt-7 flex items-center gap-3">
            <span
              aria-hidden
              className="size-8 rounded-pill"
              style={{
                background: "linear-gradient(140deg, var(--color-blush-200), var(--color-cloud-200))",
              }}
            />
            <span className="font-mono text-xs text-ink-500">elasticity 0.4 · intensity 0.2</span>
          </div>
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
