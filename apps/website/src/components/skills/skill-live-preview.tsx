"use client";

import {
  BracketMenu,
  DirectionalButton,
  DoubleRingButton,
  ExtrudedButton,
  FloatingLines,
  InsetButton,
  LayeredButton,
  SplitRail,
  TextMenu,
} from "@pinky/components";
import { CursorProvider, MagneticCursorTarget, StickyStory } from "@pinky/effects";
import { Morph, Proximity } from "@pinky/primitives";
import { cloneElement, type ReactElement, type ReactNode } from "react";

import { ExploreDetailPreview } from "@/components/previews/explore-previews";
import type { SkillKind } from "@/lib/skills";

type SkillLivePreviewProps = {
  kind: SkillKind;
  slug: string;
  active?: boolean;
  onActiveChange?: (active: boolean) => void;
};

/**
 * The featured recipes use the same live surfaces as Explore wherever one
 * already exists. The three cases below need a little more context than a
 * catalogue card, so they get a small, honest composition here.
 */
export function SkillLivePreview({ kind, slug, active = false, onActiveChange }: SkillLivePreviewProps) {
  const key = `${kind}/${slug}`;

  if (key === "primitives/morph") return <MorphRecipePreview active={active} />;
  if (key === "cursor/magnetic-cursor-target") return <CursorRecipePreview />;
  if (key === "scroll/sticky-story") return <StickyStoryRecipePreview />;
  if (key === "patterns/tactile-press") return <TactilePressPreview />;
  if (key === "components/extruded-button") return <SingleControl label="Visible thickness collapses into its base."><ExtrudedButton>Continue</ExtrudedButton></SingleControl>;
  if (key === "components/layered-button") return <SingleControl label="Rear planes separate before the panel opens."><LayeredButton>Open panel</LayeredButton></SingleControl>;
  if (key === "components/inset-button") return <SingleControl label="The recess comes toward flush, then presses deeper."><InsetButton>Adjust</InsetButton></SingleControl>;
  if (key === "components/directional-button") return <DirectionalPreview />;
  if (key === "components/double-ring-button") return <DoubleRingPreview />;
  if (key === "navigation/menu-trigger-motion") return <MenuTriggerPreview active={active} onActiveChange={onActiveChange} />;
  if (key === "navigation/bracket-menu") return <SingleMenuPreview label="Four corners converge around a framed close mark." active={active} onActiveChange={onActiveChange}><BracketMenu /></SingleMenuPreview>;
  if (key === "navigation/split-rail") return <SingleMenuPreview label="Two independent rails part, then recombine." active={active} onActiveChange={onActiveChange}><SplitRail /></SingleMenuPreview>;
  if (key === "navigation/text-menu") return <SingleMenuPreview label="The rule draws before the word travels." active={active} onActiveChange={onActiveChange}><TextMenu className="min-h-12 min-w-20 px-2" /></SingleMenuPreview>;

  return <ExploreDetailPreview slug={slug} />;
}

function MorphRecipePreview({ active }: { active: boolean }) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-4 text-center">
      <Morph
        label="A continuous detail surface"
        maxWidth={520}
        className={`${active ? "w-[min(100%,22rem)] rounded-[26px] bg-white px-7 py-6" : "w-[min(100%,18rem)] rounded-2xl bg-cloud-50 px-5 py-4"} border border-line text-left shadow-soft transition-[width,padding,border-radius,background-color] duration-500 ease-[var(--ease-soft)] motion-reduce:transition-none`}
        expandedClassName="rounded-[26px] border border-line bg-white p-7 shadow-lift"
        expanded={
          <div>
            <p className="font-mono text-[0.625rem] tracking-[0.14em] text-ink-500 uppercase">Expanded state</p>
            <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight">The same object, more room.</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-700">Press Escape or click outside to return the surface to its resting state.</p>
          </div>
        }
      >
        <p className="font-display text-base font-semibold tracking-tight">Open the detail surface</p>
        <p className="mt-1 text-sm text-ink-700">A panel should feel like the thing you selected.</p>
      </Morph>
      <p className="font-mono text-[0.625rem] tracking-[0.12em] text-ink-500 uppercase">focus · escape · restore</p>
    </div>
  );
}

function TactilePressPreview() {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-6 text-center">
      <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-7">
        <ExtrudedButton>Continue</ExtrudedButton>
        <InsetButton>Adjust</InsetButton>
        <LayeredButton>Open panel</LayeredButton>
      </div>
      <p className="font-mono text-[0.6rem] tracking-[0.12em] text-ink-500 uppercase">collapse · recess · separate</p>
    </div>
  );
}

function SingleControl({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-5 text-center">
      {children}
      <p className="max-w-xs text-xs leading-relaxed text-ink-500">{label}</p>
    </div>
  );
}

function DirectionalPreview() {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-5 text-center">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <DirectionalButton direction="back">Back</DirectionalButton>
        <DirectionalButton direction="forward">Next</DirectionalButton>
        <DirectionalButton direction="up">Upload</DirectionalButton>
      </div>
      <p className="font-mono text-[0.6rem] tracking-[0.12em] text-ink-500 uppercase">motion follows meaning</p>
    </div>
  );
}

function DoubleRingPreview() {
  return (
    <Proximity distance={170} axis="both">
      <div className="flex min-h-40 flex-col items-center justify-center gap-5 text-center">
        <DoubleRingButton aria-label="Record a note" icon={<span className="block size-3 rounded-full bg-ink-900" />} />
        <p className="max-w-xs text-xs leading-relaxed text-ink-500">The outer ring answers approach; the centre stays still.</p>
      </div>
    </Proximity>
  );
}

function MenuTriggerPreview({ active, onActiveChange }: { active: boolean; onActiveChange?: (active: boolean) => void }) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-6 text-center">
      <div className="flex items-center justify-center gap-8">
        <FloatingLines open={active} onOpenChange={onActiveChange} />
        <BracketMenu open={active} onOpenChange={onActiveChange} />
        <TextMenu open={active} onOpenChange={onActiveChange} className="min-h-12 min-w-20 px-2" />
      </div>
      <p className="font-mono text-[0.6rem] tracking-[0.12em] text-ink-500 uppercase">three constructions · one state contract</p>
    </div>
  );
}

function SingleMenuPreview({ children, label, active, onActiveChange }: { children: ReactNode; label: string; active: boolean; onActiveChange?: (active: boolean) => void }) {
  const trigger = children as ReactElement<{ open?: boolean; onOpenChange?: (active: boolean) => void }>;
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-5 text-center">
      {cloneElement(trigger, { open: active, onOpenChange: onActiveChange })}
      <p className="max-w-xs text-xs leading-relaxed text-ink-500">{label}</p>
    </div>
  );
}

function CursorRecipePreview() {
  return (
    <CursorProvider>
      <div className="flex min-h-40 flex-col items-center justify-center gap-4 text-center">
        <MagneticCursorTarget label="Open" variant="recipe" strength={0.28} range={110} maxOffset={7}>
          <button type="button" className="rounded-pill bg-ink-900 px-5 py-3 text-sm text-milk shadow-soft focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink-900">
            Approach this action
          </button>
        </MagneticCursorTarget>
        <p className="max-w-sm text-sm leading-relaxed text-ink-700">Pointer proximity adds a small pull; keyboard focus claims the same meaningful target, and touch keeps the native button path.</p>
      </div>
    </CursorProvider>
  );
}

function StickyStoryRecipePreview() {
  const steps = [
    { id: "signal", eyebrow: <Eyebrow>01 · Signal</Eyebrow>, title: <Title>Start with one relationship.</Title>, description: <Description>Keep the visual supplemental while the story remains ordinary document flow.</Description>, visual: <StoryVisual label="Signal" tone="blush" /> },
    { id: "settle", eyebrow: <Eyebrow>02 · Settle</Eyebrow>, title: <Title>Let the surface change quietly.</Title>, description: <Description>As the reader moves, the visual follows the step without taking over the page.</Description>, visual: <StoryVisual label="Settle" tone="cloud" /> },
    { id: "continue", eyebrow: <Eyebrow>03 · Continue</Eyebrow>, title: <Title>Then get out of the way.</Title>, description: <Description>On touch and reduced motion this becomes a clear, readable stack.</Description>, visual: <StoryVisual label="Continue" tone="milk" /> },
  ];

  return (
    <div className="max-h-[30rem] overflow-auto rounded-2xl bg-cloud-50 p-4 sm:p-6">
      <StickyStory steps={steps} top={12} className="gap-8" visualClassName="min-h-48" contentClassName="min-w-0" />
    </div>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <span className="font-mono text-[0.625rem] tracking-[0.14em] text-ink-500 uppercase">{children}</span>;
}

function Title({ children }: { children: ReactNode }) {
  return <span className="mt-3 block font-display text-xl font-semibold tracking-tight">{children}</span>;
}

function Description({ children }: { children: ReactNode }) {
  return <span className="mt-2 block max-w-sm text-sm leading-relaxed text-ink-700">{children}</span>;
}

function StoryVisual({ label, tone }: { label: string; tone: "blush" | "cloud" | "milk" }) {
  const background = tone === "blush"
    ? "linear-gradient(145deg,var(--color-blush-100),var(--color-white))"
    : tone === "cloud"
      ? "linear-gradient(145deg,var(--color-cloud-100),var(--color-white))"
      : "linear-gradient(145deg,var(--color-white),var(--color-blush-50))";

  return (
    <div className="grid min-h-48 place-items-center rounded-[22px] border border-line shadow-soft" style={{ background }}>
      <span className="rounded-pill bg-white/80 px-4 py-2 font-mono text-xs tracking-[0.12em] text-ink-700 uppercase">{label}</span>
    </div>
  );
}
