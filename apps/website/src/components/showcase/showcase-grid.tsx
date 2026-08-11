"use client";

import { cn, FluidTabs, GlowBorder, JellyCard, MagneticButton } from "@pinky/components";
import { CursorGlow, Magnetic, Tilt } from "@pinky/primitives";
import { useState, type ReactNode } from "react";

import { CodeBlock } from "@/components/site/code-block";

export function ShowcaseGrid({ className }: { className?: string }) {
  return (
    <div className={cn("grid gap-4 lg:grid-cols-2", className)}>
      <Exhibit
        title="Pricing card"
        note="Glow Border framing a Jelly Card, with a magnetic action inside."
        code={`<GlowBorder radius="2xl">
  <JellyCard radius="2xl" elasticity={0.25}>
    <Plan />
    <MagneticButton>Choose plan</MagneticButton>
  </JellyCard>
</GlowBorder>`}
      >
        <GlowBorder radius="2xl" className="w-full max-w-sm">
          <JellyCard radius="2xl" elasticity={0.25} intensity={0.12}>
            <p className="font-mono text-[0.6875rem] tracking-[0.14em] text-ink-500 uppercase">
              Studio
            </p>
            <p className="mt-4 font-display text-3xl font-semibold tracking-tight">
              $24
              <span className="ml-1 text-base font-normal text-ink-500">/ month</span>
            </p>
            <ul className="mt-5 flex flex-col gap-2 text-sm text-ink-700">
              <li>Unlimited projects</li>
              <li>Interaction presets</li>
              <li>Priority support</li>
            </ul>
            <div className="mt-7">
              <MagneticButton size="sm">Choose plan</MagneticButton>
            </div>
          </JellyCard>
        </GlowBorder>
      </Exhibit>

      <Exhibit
        title="Media cover"
        note="Tilt with a specular highlight, wrapped in a magnetic field."
        code={`<Magnetic strength={0.25}>
  <Tilt max={8} glare lift={10}>
    <Cover />
  </Tilt>
</Magnetic>`}
      >
        <Magnetic strength={0.25} range={160} maxOffset={10}>
          <Tilt max={8} glare lift={10} className="rounded-2xl">
            <div
              className="flex h-56 w-44 flex-col justify-end rounded-2xl border border-line p-4"
              style={{
                background:
                  "linear-gradient(160deg, var(--color-white), var(--color-blush-100) 45%, var(--color-cloud-200))",
                boxShadow: "var(--shadow-lift)",
              }}
            >
              <p className="font-display text-sm font-semibold tracking-tight">Soft Motion</p>
              <p className="text-xs text-ink-500">Volume One</p>
            </div>
          </Tilt>
        </Magnetic>
      </Exhibit>

      <Exhibit
        title="Segmented view"
        note="Fluid Tabs driving real content, inside a cursor-lit panel."
        code={`<CursorGlow>
  <FluidTabs items={views} onValueChange={setView} />
</CursorGlow>`}
      >
        <CursorGlow size={340} className="w-full rounded-xl">
          <div className="rounded-xl border border-line bg-white/80 p-5">
            <FluidTabs
              aria-label="Showcase views"
              fill
              items={[
                { id: "week", label: "Week", content: <Panel>7 interactions tuned this week.</Panel> },
                { id: "month", label: "Month", content: <Panel>31 interactions, 4 shipped.</Panel> },
                { id: "all", label: "All time", content: <Panel>Everything since v0.1.</Panel> },
              ]}
            />
          </div>
        </CursorGlow>
      </Exhibit>

      <Exhibit
        title="Reaction row"
        note="Three magnetic fields side by side, each with its own strength."
        code={`{reactions.map((r) => (
  <Magnetic key={r} strength={0.5} range={90}>
    <button>{r}</button>
  </Magnetic>
))}`}
      >
        <ReactionRow />
      </Exhibit>
    </div>
  );
}

function Exhibit({
  title,
  note,
  code,
  children,
}: {
  title: string;
  note: string;
  code: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col overflow-hidden rounded-xl border border-line bg-white/75">
      <div className="flex min-h-[22rem] items-center justify-center border-b border-line bg-milk/50 p-8">
        {children}
      </div>
      <div className="flex flex-col gap-4 p-5">
        <div>
          <h2 className="font-display text-base font-semibold tracking-tight">{title}</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-700">{note}</p>
        </div>
        <CodeBlock code={code} label="composition" className="bg-milk/60" />
      </div>
    </section>
  );
}

function Panel({ children }: { children: ReactNode }) {
  return <p className="px-1 text-sm leading-relaxed text-ink-700">{children}</p>;
}

function ReactionRow() {
  const [picked, setPicked] = useState<string | null>(null);
  const reactions = ["Soft", "Fluid", "Alive"];

  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {reactions.map((reaction, index) => (
        <Magnetic key={reaction} strength={0.45 + index * 0.1} range={100} maxOffset={10}>
          <button
            type="button"
            aria-pressed={picked === reaction}
            onClick={() => setPicked(reaction)}
            className={cn(
              "h-12 rounded-pill border px-6 text-sm font-medium transition-colors duration-300",
              picked === reaction
                ? "border-ink-900 bg-ink-900 text-milk"
                : "border-line bg-white text-ink-700 shadow-soft hover:text-ink-900",
            )}
          >
            {reaction}
          </button>
        </Magnetic>
      ))}
    </div>
  );
}
