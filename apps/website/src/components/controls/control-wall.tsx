"use client";

import {
  BloomButton,
  BloomToggle,
  BorderBeamButton,
  CommandChip,
  DirectionalButton,
  DoubleRingButton,
  ExpandButton,
  ExtrudedButton,
  GlassButton,
  HairlineChamber,
  HairlineCircle,
  LiquidToggle,
  InsetButton,
  LayeredButton,
  SheenButton,
  SpotlightBorderButton,
  SplitActionButton,
  TrailToggle,
} from "@pinky-ui/components";
import { Proximity } from "@pinky-ui/primitives";
import type { ReactNode } from "react";

import { MenuWall } from "./menu-wall";

/* Thin geometric glyphs. Stroke 1.5 to match the hairline language. */
const g = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const };
const Plus = () => (
  <svg viewBox="0 0 20 20" className="size-[18px]" aria-hidden {...g}>
    <path d="M10 4.5v11M4.5 10h11" />
  </svg>
);
const Close = () => (
  <svg viewBox="0 0 20 20" className="size-[18px]" aria-hidden {...g}>
    <path d="M5.5 5.5l9 9M14.5 5.5l-9 9" />
  </svg>
);
const Record = () => <span className="block size-3 rounded-full bg-ink-900" />;
const Sliders = () => (
  <svg viewBox="0 0 20 20" className="size-[18px]" aria-hidden {...g}>
    <path d="M3 6h14M3 14h14" />
    <circle cx="8" cy="6" r="2" />
    <circle cx="13" cy="14" r="2" />
  </svg>
);

/**
 * The wall.
 *
 * Every control is mounted and interactive on arrival — no tabs, no accordions,
 * no "view demo". The names are set small and quiet beside each specimen so the
 * eye compares silhouettes first and reads second. This is a page for looking
 * at UI, not for reading about it.
 */
export function ControlWall() {
  return (
    <main className="mx-auto max-w-[76rem] px-5 py-12 sm:px-8 sm:py-16">
      <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-ink-500 uppercase">
        Controls · calibration
      </p>
      <h1 className="mt-4 max-w-2xl text-section text-balance-tight">
        Depth you can press.
      </h1>
      <p className="mt-4 max-w-xl leading-relaxed text-ink-700">
        Eight constructions, one depth language. Hover them, press them, tab through them — every
        specimen below is the real component.
      </p>

      {/* ---- Phase 0: the scale itself ---- */}
      <Band title="Surface scale" note="The five semantic levels. Everything else is composed from these.">
        <div className="flex flex-wrap items-end gap-x-8 gap-y-7">
          <Swatch name="flat" shadow="var(--depth-flat)" />
          <Swatch name="raised sm" shadow="var(--depth-raised-sm), var(--edge-light)" />
          <Swatch name="raised md" shadow="var(--depth-raised-md), var(--edge-light)" />
          <Swatch name="raised lg" shadow="var(--depth-raised-lg), var(--edge-light)" />
          <Swatch name="floating" shadow="var(--depth-floating), var(--edge-light)" />
          <Swatch name="inset" shadow="var(--depth-inset)" tint />
          <Swatch name="pressed" shadow="var(--depth-pressed)" tint />
        </div>
        <div className="mt-8 flex flex-wrap items-end gap-x-8 gap-y-7">
          <Travel name="lift sm" px={1} />
          <Travel name="lift md" px={2} />
          <Travel name="lift lg" px={3} />
        </div>
      </Band>

      {/* ---- The eight ---- */}
      <Band
        title="Eight constructions"
        note="Each answers the pointer differently: rise, collapse, recess, separate, widen, travel, divide, approach."
      >
        <div className="grid grid-cols-2 items-start gap-x-6 gap-y-10 sm:grid-cols-4 sm:gap-x-10">
          <Specimen name="Hairline Circle" signature="rise and return">
            <HairlineCircle icon={<Plus />} aria-label="Add" />
          </Specimen>

          <Specimen name="Extruded" signature="collapse">
            <ExtrudedButton>Continue</ExtrudedButton>
          </Specimen>

          <Specimen name="Inset" signature="toward flush, then deeper">
            <InsetButton icon={<Sliders />}>Adjust</InsetButton>
          </Specimen>

          <Specimen name="Layered" signature="separate, recombine">
            <LayeredButton>Open panel</LayeredButton>
          </Specimen>

          <Specimen name="Expand" signature="change of silhouette">
            <ExpandButton icon={<Plus />} label="Add item" />
          </Specimen>

          <Specimen name="Directional" signature="semantic travel">
            <DirectionalButton direction="forward">Next</DirectionalButton>
          </Specimen>

          <Specimen name="Split Action" signature="independent chambers">
            <SplitActionButton menuLabel="More create options">Create</SplitActionButton>
          </Specimen>

          {/* Proximity is the enhancement layer; the ring works without it. */}
          <Proximity distance={140} axis="both">
            <Specimen name="Double-Ring" signature="response to approach">
              <DoubleRingButton icon={<Record />} aria-label="Record" />
            </Specimen>
          </Proximity>
        </div>
      </Band>

      {/* ---- Direct comparison rows ---- */}
      <Band title="Same family, different jobs" note="Sizes, directions and tones side by side.">
        <Row label="Sizes">
          <HairlineCircle icon={<Close />} aria-label="Close, extra small" size="xs" />
          <HairlineCircle icon={<Close />} aria-label="Close, small" size="sm" />
          <HairlineCircle icon={<Close />} aria-label="Close, medium" size="md" />
          <HairlineCircle icon={<Close />} aria-label="Close, large" size="lg" />
        </Row>
        <Row label="Direction">
          <DirectionalButton direction="back">Back</DirectionalButton>
          <DirectionalButton direction="forward">Next</DirectionalButton>
          <DirectionalButton direction="up">Upload</DirectionalButton>
          <DirectionalButton direction="down">Download</DirectionalButton>
        </Row>
        <Row label="Thickness">
          <ExtrudedButton thickness={2}>Thin</ExtrudedButton>
          <ExtrudedButton thickness={3}>Default</ExtrudedButton>
          <ExtrudedButton thickness={5}>Thick</ExtrudedButton>
          <ExtrudedButton tone="soft">Soft tone</ExtrudedButton>
        </Row>
        <Row label="Disabled">
          <HairlineCircle icon={<Plus />} aria-label="Add, disabled" disabled />
          <ExtrudedButton disabled>Continue</ExtrudedButton>
          <LayeredButton disabled>Open panel</LayeredButton>
          <DirectionalButton disabled>Next</DirectionalButton>
        </Row>
      </Band>

      <Band
        title="Modern surfaces"
        note="Current treatments — glass, a travelling edge, pointer-tracked light, a pass of sheen, a keycap chamber."
      >
        {/* Glass needs something behind it, or there is nothing to refract. */}
        <div
          className="rounded-[22px] p-7"
          style={{ background: "linear-gradient(120deg, var(--color-blush-100), var(--color-cloud-200) 55%, var(--color-blush-50))" }}
        >
          <div className="flex flex-wrap items-start gap-x-12 gap-y-11">
            <Specimen name="Glass" signature="light before matter">
              <GlassButton>Continue</GlassButton>
            </Specimen>
            <Specimen name="Border Beam" signature="a lap of light">
              <BorderBeamButton>Get started</BorderBeamButton>
            </Specimen>
            <Specimen name="Spotlight Edge" signature="light follows the pointer">
              <SpotlightBorderButton>Explore</SpotlightBorderButton>
            </Specimen>
            <Specimen name="Sheen" signature="one pass across the face">
              <SheenButton>Upgrade</SheenButton>
            </Specimen>
            <Specimen name="Command Chip" signature="the keycap answers first">
              <CommandChip>Search</CommandChip>
            </Specimen>
            <Specimen name="Hairline Chamber" signature="opposing surfaces">
              <HairlineChamber icon={<Sliders />} aria-label="Settings" />
            </Specimen>
          </div>
        </div>
      </Band>

      <Band
        title="Gradient on transition"
        note="No colour at rest — the gradient exists only while something is changing, then it is gone. Flip them."
      >
        <div className="flex flex-wrap items-start gap-x-14 gap-y-9">
          <Specimen name="Liquid" signature="wipes along the track">
            <LiquidToggle label="Sync" labelHidden />
          </Specimen>
          <Specimen name="Liquid · fluid" signature="more overshoot">
            <LiquidToggle label="Overshoot" labelHidden fluidity={1} defaultChecked />
          </Specimen>
          <Specimen name="Bloom" signature="bursts from the thumb">
            <BloomToggle label="Notifications" labelHidden />
          </Specimen>
          <Specimen name="Trail" signature="a wake behind the travel">
            <TrailToggle label="Autoplay" labelHidden defaultChecked />
          </Specimen>
          <Specimen name="Bloom Button" signature="colour at the touch point">
            <BloomButton>Follow</BloomButton>
          </Specimen>
          <Specimen name="Disabled" signature="no bloom">
            <LiquidToggle label="Locked" labelHidden disabled />
          </Specimen>
        </div>
      </Band>

      <MenuWall />

      <p className="mt-16 max-w-xl text-sm leading-relaxed text-ink-500">
        Focus is part of the construction: tab through this page and every control lifts exactly as
        it does under the pointer, with a 2px ink outline offset clear of its own shadow. With
        reduced motion enabled the depth stays and only the travel goes.
      </p>
    </main>
  );
}

function Band({ title, note, children }: { title: string; note: string; children: ReactNode }) {
  return (
    <section className="mt-16 border-t border-line pt-9 first-of-type:mt-12">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <h2 className="font-display text-base font-semibold tracking-tight">{title}</h2>
        <p className="text-sm text-ink-500">{note}</p>
      </div>
      <div className="mt-9">{children}</div>
    </section>
  );
}

/** Label sits under the specimen, small and quiet — the control is the content. */
function Specimen({ name, signature, children }: { name: string; signature: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col items-start gap-4">
      <div className="flex min-h-14 items-center">{children}</div>
      <div>
        <p className="text-[0.8125rem] font-medium text-ink-900">{name}</p>
        <p className="mt-0.5 font-mono text-[0.65rem] tracking-[0.02em] text-ink-500">{signature}</p>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-4 border-b border-line/60 py-5 last:border-b-0">
      <span className="w-24 shrink-0 font-mono text-[0.65rem] tracking-[0.14em] text-ink-500 uppercase">
        {label}
      </span>
      {children}
    </div>
  );
}

function Swatch({ name, shadow, tint = false }: { name: string; shadow: string; tint?: boolean }) {
  return (
    <div className="flex flex-col items-start gap-3">
      <span
        aria-hidden
        className={`block size-20 rounded-2xl border border-[color:var(--color-line)] ${tint ? "bg-cloud-50" : "bg-white"}`}
        style={{ boxShadow: shadow }}
      />
      <span className="font-mono text-[0.65rem] text-ink-500">{name}</span>
    </div>
  );
}

function Travel({ name, px }: { name: string; px: number }) {
  return (
    <div className="flex flex-col items-start gap-3">
      <span aria-hidden className="relative block h-12 w-20">
        <span className="absolute inset-x-0 bottom-0 h-9 rounded-xl bg-cloud-100" />
        <span
          className="absolute inset-x-2 bottom-0 h-9 rounded-xl border border-[color:var(--color-line)] bg-white [box-shadow:var(--depth-raised-sm),var(--edge-light)]"
          style={{ transform: `translateY(-${px}px)` }}
        />
      </span>
      <span className="font-mono text-[0.65rem] text-ink-500">
        {name} · {px}px
      </span>
    </div>
  );
}
