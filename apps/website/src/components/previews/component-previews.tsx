"use client";

import {
  ElasticToggle,
  FloatingDock,
  FluidTabs,
  GlowBorder,
  GooeyMenu,
  JellyCard,
  LiquidCard,
  MagneticButton,
  MorphCard,
  PillNav,
  RippleButton,
  SpotlightCard,
  TiltCard,
} from "@pinky-ui/components";
import { useState, type ReactNode } from "react";

/**
 * One place where every component's live preview is defined.
 *
 * The homepage, the gallery and the detail pages all render from this map, so a
 * component's demo is written once and can never drift between surfaces.
 */
export const COMPONENT_PREVIEWS: Record<string, ReactNode> = {
  "jelly-card": <JellyCardPreview />,
  "liquid-card": <LiquidCardPreview />,
  "morph-card": <MorphCardPreview />,
  "spotlight-card": <SpotlightCardPreview />,
  "tilt-card": <TiltCardPreview />,
  "magnetic-button": <MagneticButtonPreview />,
  "ripple-button": <RippleButtonPreview />,
  "glow-border": <GlowBorderPreview />,
  "fluid-tabs": <FluidTabsPreview />,
  "pill-nav": <PillNavPreview />,
  "gooey-menu": <GooeyMenuPreview />,
  "floating-dock": <FloatingDockPreview />,
  "elastic-toggle": <ElasticTogglePreview />,
};

export function ComponentPreview({ slug }: { slug: string }) {
  const preview = COMPONENT_PREVIEWS[slug];
  if (preview) return <>{preview}</>;
  return null;
}

export { hasComponentPreview } from "./preview-manifest";

function Avatar({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={className ?? "size-10 rounded-pill"}
      style={{
        background: "linear-gradient(140deg, var(--color-blush-200), var(--color-cloud-200))",
      }}
    />
  );
}

function JellyCardPreview() {
  return (
    <JellyCard className="w-full max-w-[17rem]" radius="xl">
      <div className="flex items-center gap-3">
        <Avatar />
        <div>
          <p className="text-sm font-medium">Elastic surface</p>
          <p className="text-xs text-ink-500">Leans, drifts, settles</p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-ink-700">
        Pointer-driven deformation with a spring return.
      </p>
    </JellyCard>
  );
}

function LiquidCardPreview() {
  return (
    <div className="relative w-full max-w-[18rem]">
      {/* Something worth seeing through — glass over nothing is just a panel. */}
      <span
        aria-hidden
        className="absolute -top-6 -left-6 size-32 rounded-pill blur-[26px]"
        style={{ background: "var(--color-blush-300)", opacity: 0.75 }}
      />
      <span
        aria-hidden
        className="absolute -right-4 -bottom-8 size-28 rounded-pill blur-[26px]"
        style={{ background: "var(--color-cloud-300)", opacity: 0.8 }}
      />
      <LiquidCard tint="clear" intensity={0.24} className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[0.625rem] tracking-[0.14em] text-ink-500 uppercase">Liquid Card</p>
            <p className="mt-2 text-sm font-medium">Quiet priority</p>
          </div>
          <span className="rounded-lg bg-white/70 px-2 py-1 font-mono text-[0.6rem] text-ink-500">LIVE</span>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-ink-700">
          The surface redistributes light and keeps the action attached to the content.
        </p>
        <div className="mt-5 flex items-center justify-between border-t border-white/70 pt-3">
          <span className="text-xs text-ink-500">Pointer-aware material</span>
          <span className="text-xs font-medium text-ink-900">Inspect →</span>
        </div>
      </LiquidCard>
    </div>
  );
}

function MorphCardPreview() {
  return (
    <MorphCard
      label="Mira Odaka"
      maxWidth={520}
      className="w-full max-w-[17rem]"
      expandedContent={
        <div className="p-7">
          <div className="flex items-center gap-3">
            <Avatar className="size-12 rounded-pill" />
            <div>
              <p className="font-display text-lg font-semibold tracking-tight">Mira Odaka</p>
              <p className="text-sm text-ink-500">Interaction designer, Kyoto</p>
            </div>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-ink-700">
            The card you clicked is the panel you are reading — it travelled and resized rather
            than fading out behind a modal. Press Escape, or click outside, to send it back.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-ink-700">
            Focus moved in here when it opened, and returns to the card when it closes.
          </p>
        </div>
      }
    >
      <div className="p-5">
        <div className="flex items-center gap-3">
          <Avatar />
          <div>
            <p className="text-sm font-medium">Mira Odaka</p>
            <p className="text-xs text-ink-500">Tap to expand</p>
          </div>
        </div>
      </div>
    </MorphCard>
  );
}

function SpotlightCardPreview() {
  return (
    <SpotlightCard className="w-full max-w-[17rem]">
      <p className="font-mono text-[0.625rem] tracking-[0.14em] text-ink-500 uppercase">
        Spotlight
      </p>
      <p className="mt-3 text-sm leading-relaxed text-ink-700">
        Nothing moves. The surface just notices where you are.
      </p>
    </SpotlightCard>
  );
}

function TiltCardPreview() {
  return (
    <TiltCard
      className="w-full max-w-[18rem]"
      padded={false}
      foreground={
        <span className="absolute top-4 right-4 rounded-pill bg-white/90 px-2.5 py-1 font-mono text-[0.625rem] tracking-[0.1em] text-ink-700 uppercase shadow-soft">
          Vol. 1
        </span>
      }
    >
      <div
        className="relative h-48 w-full bg-white/70 p-4"
        style={{
          background:
            "linear-gradient(160deg, var(--color-white), var(--color-blush-100) 45%, var(--color-cloud-200))",
        }}
      >
        <div className="flex h-full flex-col justify-between">
          <span className="font-mono text-[0.6rem] tracking-[0.14em] text-ink-500 uppercase">Field notes / 01</span>
          <div>
            <p className="font-display text-lg font-semibold tracking-tight text-ink-900">Solid, not loud.</p>
            <p className="mt-1 max-w-[13rem] text-xs text-ink-700">A rigid surface catches light without moving the reading.</p>
          </div>
        </div>
      </div>
    </TiltCard>
  );
}

function MagneticButtonPreview() {
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <MagneticButton>Primary</MagneticButton>
        <MagneticButton variant="soft">Soft</MagneticButton>
      </div>
      <p className="font-mono text-[0.625rem] tracking-[0.12em] text-ink-500 uppercase">
        move your pointer nearby
      </p>
    </div>
  );
}

function RippleButtonPreview() {
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <RippleButton>Save changes</RippleButton>
        <RippleButton variant="soft" rippleColor="var(--color-blush-200)">
          Cancel
        </RippleButton>
      </div>
      <p className="font-mono text-[0.625rem] tracking-[0.12em] text-ink-500 uppercase">
        local pressure · bounded response
      </p>
    </div>
  );
}

function GlowBorderPreview() {
  return (
    <GlowBorder radius="lg" size={200} className="w-full max-w-[17rem]">
      <div className="rounded-lg bg-white p-5 shadow-soft ring-1 ring-line">
        <p className="text-sm font-medium">Studio</p>
        <p className="mt-1 text-xs text-ink-500">$24 / month</p>
        <p className="mt-4 text-sm leading-relaxed text-ink-700">
          Move closer — the edge finds your pointer.
        </p>
      </div>
    </GlowBorder>
  );
}

function FluidTabsPreview() {
  return (
    <div className="w-full max-w-[19rem]">
      <FluidTabs
        aria-label="Preview tabs"
        size="sm"
        fill
        items={[
          {
            id: "overview",
            label: "Overview",
            content: <PanelLine>Twelve components, twelve primitives.</PanelLine>,
          },
          {
            id: "motion",
            label: "Motion",
            content: <PanelLine>Springs, never long easings.</PanelLine>,
          },
          {
            id: "a11y",
            label: "A11y",
            content: <PanelLine>Roving tab stop, arrow keys.</PanelLine>,
          },
        ]}
      />
    </div>
  );
}

function PillNavPreview() {
  const [active, setActive] = useState("explore");
  const ids = ["explore", "docs", "skills"];
  return (
    <PillNav
      aria-label="Preview navigation"
      size="sm"
      items={ids.map((id) => ({
        id,
        label: id[0]!.toUpperCase() + id.slice(1),
        // No `href` here on purpose: this preview is embedded inside the
        // gallery card's own <Link>, and PillNav renders a real <a> whenever
        // an item has an href — nesting an anchor inside an anchor is
        // invalid HTML and was failing hydration. onClick alone renders a
        // <button>, which still demonstrates the sliding pill/active-state
        // mechanic without the conflict.
        active: active === id,
        onClick: () => setActive(id),
      }))}
    />
  );
}

function GooeyMenuPreview() {
  return (
    <GooeyMenu
      aria-label="Preview sections"
      items={[
        { id: "work", label: "Work" },
        { id: "studio", label: "Studio" },
        { id: "contact", label: "Contact" },
      ]}
    />
  );
}

function FloatingDockPreview() {
  const [active, setActive] = useState("home");

  const items = [
    { id: "home", label: "Home", icon: <DockGlyph shape="square" /> },
    { id: "work", label: "Work", icon: <DockGlyph shape="circle" /> },
    { id: "notes", label: "Notes", icon: <DockGlyph shape="bar" /> },
    { id: "settings", label: "Settings", icon: <DockGlyph shape="ring" /> },
  ];

  return (
    <FloatingDock
      items={items.map((item) => ({
        ...item,
        active: item.id === active,
        onSelect: () => setActive(item.id),
      }))}
      aria-label="Preview dock"
    />
  );
}

function DockGlyph({ shape }: { shape: "square" | "circle" | "bar" | "ring" }) {
  const base = "block bg-current";
  if (shape === "circle") return <span className={`${base} size-4 rounded-pill`} />;
  if (shape === "bar") return <span className={`${base} h-1.5 w-4.5 rounded-pill`} />;
  if (shape === "ring")
    return <span className="block size-4 rounded-pill border-[1.5px] border-current" />;
  return <span className={`${base} size-4 rounded-[5px]`} />;
}

function ElasticTogglePreview() {
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <ElasticToggle
        label="Notifications"
        checked={notifications}
        onCheckedChange={setNotifications}
      />
      <ElasticToggle label="Sounds" checked={sounds} onCheckedChange={setSounds} />
    </div>
  );
}

function PanelLine({ children }: { children: ReactNode }) {
  return <p className="px-1 text-center text-sm leading-relaxed text-ink-700">{children}</p>;
}
