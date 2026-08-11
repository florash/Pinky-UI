"use client";

import { cn, GlowBorder } from "@pinky/components";
import { Jelly, LiquidSurface, Magnetic, Tilt, useMotionEnabled } from "@pinky/primitives";
import { useState, type CSSProperties, type ReactNode } from "react";

import { Container, Section, SectionHeading } from "@/components/site/layout";

type Feeling = {
  id: string;
  name: string;
  description: string;
  /** Wide tiles put the caption beside the demo instead of under it. */
  wide?: boolean;
  /** No primitive behind it yet — the tile says so instead of pretending. */
  pending?: boolean;
  demo: ReactNode;
};

const FEELINGS: Feeling[] = [
  {
    id: "liquid",
    name: "Liquid",
    description: "Transparency, refraction and light on a surface.",
    wide: true,
    demo: <LiquidDemo />,
  },
  {
    id: "jelly",
    name: "Jelly",
    description: "Elastic and playful response.",
    demo: <JellyDemo />,
  },
  {
    id: "magnetic",
    name: "Magnetic",
    description: "Elements responding to pointer proximity.",
    demo: <MagneticDemo />,
  },
  {
    id: "depth",
    name: "Depth",
    description: "Perspective, light and spatial interaction.",
    demo: <DepthDemo />,
  },
  {
    id: "morph",
    name: "Morph",
    description: "Seamless transformation between UI states.",
    demo: <MorphDemo />,
  },
  {
    id: "glow",
    name: "Glow",
    description: "Light responding to interaction.",
    wide: true,
    demo: <GlowDemo />,
  },
];

export function Feelings() {
  return (
    <Section id="feelings">
      <Container>
        <SectionHeading
          eyebrow="Interaction language"
          title="Pick a feeling."
          description="Six ways a surface can answer you. Every tile below is the effect itself — hover, focus or tap it."
        />

        <div className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FEELINGS.map((feeling) => (
            <article
              key={feeling.id}
              className={cn(
                "group relative isolate overflow-hidden rounded-xl bg-white/60 ring-1 ring-line/60",
                "transition-[box-shadow,background-color] duration-500 ease-[var(--ease-soft)]",
                "hover:bg-white/90 hover:shadow-soft",
                feeling.wide ? "sm:col-span-2 lg:flex lg:items-center" : "",
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center overflow-hidden",
                  feeling.wide ? "h-40 lg:order-2 lg:h-52 lg:flex-1" : "h-44",
                )}
              >
                {feeling.demo}
              </div>

              <div className={cn("p-5", feeling.wide && "lg:order-1 lg:w-[13rem] lg:shrink-0")}>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg font-semibold tracking-tight">
                    {feeling.name}
                  </h3>
                  {feeling.pending ? (
                    <span className="font-mono text-[0.5625rem] tracking-[0.12em] text-ink-500 uppercase">
                      primitive soon
                    </span>
                  ) : null}
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-700">{feeling.description}</p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/** The real Liquid Surface primitive, over something worth seeing through. */
function LiquidDemo() {
  return (
    <div className="relative flex size-full items-center justify-center">
      <span
        aria-hidden
        className="liquid-blob absolute size-28 blur-[14px]"
        style={{ background: "var(--color-blush-300)", left: "22%", top: "18%" }}
      />
      <span
        aria-hidden
        className="liquid-blob liquid-blob--trail absolute size-24 blur-[14px]"
        style={{ background: "var(--color-cloud-300)", right: "20%", bottom: "14%" }}
      />
      <LiquidSurface
        intensity={0.28}
        blur={14}
        tint="clear"
        className="relative flex h-24 w-44 items-center justify-center rounded-xl"
      >
        <span className="font-mono text-[0.625rem] tracking-[0.12em] text-ink-700 uppercase">
          liquid surface
        </span>
      </LiquidSurface>
    </div>
  );
}

function JellyDemo() {
  return (
    <Jelly elasticity={0.75} intensity={0.45} hoverScale={1.04} className="cursor-pointer">
      <span
        aria-hidden
        className="block size-24 rounded-2xl"
        style={{
          background: "linear-gradient(150deg, var(--color-blush-100), var(--color-blush-300))",
          boxShadow: "var(--shadow-soft)",
        }}
      />
    </Jelly>
  );
}

function MagneticDemo() {
  return (
    <div className="flex items-center gap-6">
      {[0.6, 0.35, 0.6].map((strength, index) => (
        <Magnetic key={index} strength={strength} range={120} maxOffset={12}>
          <span
            aria-hidden
            className="block size-10 rounded-pill"
            style={{
              background: index === 1 ? "var(--color-blush-300)" : "var(--color-cloud-200)",
              boxShadow: "var(--shadow-soft)",
            }}
          />
        </Magnetic>
      ))}
    </div>
  );
}

function DepthDemo() {
  return (
    <Tilt max={9} lift={10} glare className="rounded-lg">
      <span
        aria-hidden
        className="relative block h-28 w-40 rounded-lg"
        style={{
          background: "linear-gradient(160deg, var(--color-white), var(--color-cloud-100))",
          boxShadow: "var(--shadow-lift)",
        }}
      >
        <span
          aria-hidden
          className="absolute inset-x-5 top-6 block h-1.5 rounded-pill bg-cloud-200"
        />
        <span
          aria-hidden
          className="absolute inset-x-5 top-11 block h-1.5 w-16 rounded-pill bg-blush-200"
        />
      </span>
    </Tilt>
  );
}

function MorphDemo() {
  const [state, setState] = useState(0);
  const motionEnabled = useMotionEnabled();

  const shapes = [
    { radius: "34px", width: "6rem", height: "6rem", tint: "var(--color-blush-200)" },
    { radius: "999px", width: "9rem", height: "3rem", tint: "var(--color-cloud-200)" },
    { radius: "12px", width: "5rem", height: "7rem", tint: "var(--color-blush-100)" },
  ] as const;

  const shape = shapes[state % shapes.length] ?? shapes[0];

  return (
    <button
      type="button"
      onClick={() => setState((value) => value + 1)}
      className="group/morph flex size-full flex-col items-center justify-center gap-3"
      aria-label="Morph to the next shape"
    >
      <span
        aria-hidden
        className="block"
        style={
          {
            width: shape.width,
            height: shape.height,
            borderRadius: shape.radius,
            background: shape.tint,
            boxShadow: "var(--shadow-soft)",
            transition: motionEnabled
              ? "width 620ms var(--ease-soft), height 620ms var(--ease-soft), border-radius 620ms var(--ease-soft), background-color 620ms var(--ease-soft)"
              : "none",
          } as CSSProperties
        }
      />
      <span className="font-mono text-[0.625rem] tracking-[0.12em] text-ink-500 uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        click to morph
      </span>
    </button>
  );
}

function GlowDemo() {
  return (
    <GlowBorder radius="xl" thickness={1.5} size={240} range={140} className="w-[15rem]">
      <div className="rounded-xl bg-white p-5 shadow-soft ring-1 ring-line">
        <span aria-hidden className="block h-1.5 w-20 rounded-pill bg-blush-200" />
        <span aria-hidden className="mt-3 block h-1.5 w-32 rounded-pill bg-cloud-200" />
        <span aria-hidden className="mt-3 block h-1.5 w-24 rounded-pill bg-line" />
        <span className="mt-5 block font-mono text-[0.625rem] tracking-[0.12em] text-ink-500 uppercase">
          come closer
        </span>
      </div>
    </GlowBorder>
  );
}
