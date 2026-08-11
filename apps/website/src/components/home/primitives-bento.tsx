"use client";

import { cn } from "@pinky/components";
import { CursorGlow, Jelly, Magnetic, Spring, Tilt } from "@pinky/primitives";
import type { ReactNode } from "react";

import { CodeBlock } from "@/components/site/code-block";
import { Container, Section, SectionHeading } from "@/components/site/layout";

const COMPOSITION = `<Magnetic>
  <Jelly>
    <Card />
  </Jelly>
</Magnetic>`;

export function PrimitivesBento() {
  return (
    <Section id="primitives">
      <Container>
        <SectionHeading
          eyebrow="Architecture"
          title="Built from interaction primitives."
          description="Pinky is not a bag of effects. Components are compositions of small, independent behaviours you can wrap around anything you already have."
        />

        <div className="mt-14 grid gap-4 lg:grid-cols-6">
          <Tile
            className="lg:col-span-3 lg:row-span-2"
            name="Magnetic"
            note="Proximity attraction with a hard travel cap."
          >
            <div className="flex h-full items-center justify-center gap-5">
              {[0.5, 0.3, 0.5].map((strength, index) => (
                <Magnetic key={index} strength={strength} range={140} maxOffset={14}>
                  <span
                    aria-hidden
                    className="block size-12 rounded-2xl border border-line bg-white shadow-soft"
                  />
                </Magnetic>
              ))}
            </div>
          </Tile>

          <div className="lg:col-span-3">
            <div className="flex h-full flex-col justify-between gap-5 rounded-xl border border-line bg-white/80 p-5">
              <div>
                <p className="font-mono text-[0.6875rem] tracking-[0.14em] text-ink-500 uppercase">
                  Composable by design
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink-700">
                  Primitives stack. Each one owns a single behaviour and passes the rest through.
                </p>
              </div>
              <CodeBlock code={COMPOSITION} label="composition" className="bg-milk/70" />
            </div>
          </div>

          <Tile className="lg:col-span-3" name="Spring" note="One shared vocabulary of motion.">
            <div className="flex h-full items-center justify-center gap-3">
              {(["soft", "responsive", "snappy", "elastic"] as const).map((preset) => (
                <Spring key={preset} preset={preset} hoverScale={1.06} lift={-4}>
                  <span className="inline-flex h-10 items-center rounded-pill border border-line bg-white px-4 font-mono text-xs text-ink-700 shadow-soft">
                    {preset}
                  </span>
                </Spring>
              ))}
            </div>
          </Tile>

          <Tile className="lg:col-span-2" name="Tilt" note="Perspective and specular light.">
            <div className="flex h-full items-center justify-center">
              <Tilt max={10} lift={8} glare className="rounded-lg">
                <span
                  aria-hidden
                  className="block h-20 w-28 rounded-lg border border-line"
                  style={{
                    background: "linear-gradient(160deg, var(--color-white), var(--color-cloud-100))",
                    boxShadow: "var(--shadow-soft)",
                  }}
                />
              </Tilt>
            </div>
          </Tile>

          <Tile className="lg:col-span-2" name="Cursor" note="Ambient light that follows you.">
            <CursorGlow size={260} className="flex h-full items-center justify-center rounded-lg">
              <span className="font-mono text-xs text-ink-500">move here</span>
            </CursorGlow>
          </Tile>

          <Tile className="lg:col-span-2" name="Jelly" note="Elastic lean, drift and settle.">
            <div className="flex h-full items-center justify-center">
              <Jelly elasticity={0.7} intensity={0.45}>
                <span
                  aria-hidden
                  className="block size-20 rounded-2xl border border-line"
                  style={{
                    background: "linear-gradient(150deg, var(--color-blush-100), var(--color-blush-300))",
                    boxShadow: "var(--shadow-soft)",
                  }}
                />
              </Jelly>
            </div>
          </Tile>

          <Tile className="lg:col-span-3" name="Morph" note="Shared-element state transitions." pending />
          <Tile
            className="lg:col-span-3"
            name="Liquid Surface"
            note="Displacement driven by pointer velocity."
            pending
          />
        </div>
      </Container>
    </Section>
  );
}

function Tile({
  name,
  note,
  children,
  className,
  pending = false,
}: {
  name: string;
  note: string;
  children?: ReactNode;
  className?: string;
  pending?: boolean;
}) {
  return (
    <section
      className={cn(
        "relative flex min-h-44 flex-col overflow-hidden rounded-xl border border-line bg-white/80",
        pending && "border-dashed bg-white/40",
        className,
      )}
    >
      <div className="flex items-baseline justify-between gap-3 px-5 pt-5">
        <h3 className="font-display text-sm font-semibold tracking-tight">{name}</h3>
        {pending ? (
          <span className="font-mono text-[0.625rem] tracking-[0.1em] text-ink-500 uppercase">
            in progress
          </span>
        ) : null}
      </div>
      <p className="px-5 pt-1 text-xs leading-relaxed text-ink-500">{note}</p>
      <div className="flex-1 p-5">{children}</div>
    </section>
  );
}
