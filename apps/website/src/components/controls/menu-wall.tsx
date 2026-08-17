"use client";

import {
  AvatarMenu,
  BentoMenu,
  BracketMenu,
  DotGrid,
  DoubleLineRing,
  ElasticLines,
  ExpandableMenu,
  FloatingLines,
  InsetMenu,
  KebabMenu,
  MeatballMenu,
  PanelToggle,
  PlusRotate,
  SlidingStack,
  SplitRail,
  TextMenu,
} from "@pinky-ui/components";
import { Proximity } from "@pinky-ui/primitives";
import { useState, type ReactNode } from "react";

const SIGNATURE_TRIGGERS = [
  { id: "floating-lines", name: "Floating Lines", signature: "depth separation → offset cross" },
  { id: "bracket-menu", name: "Bracket Menu", signature: "convergence → framed cross" },
  { id: "split-rail", name: "Split Rail", signature: "counter-slide → recombine" },
  { id: "text-menu", name: "Text Menu", signature: "rule draws, word travels" },
  { id: "bento", name: "Bento Menu", signature: "gutter breathes → block turns", origin: "waffle · Microsoft" },
  { id: "inset-menu", name: "Inset Menu", signature: "opposing depths → minus + dot" },
  { id: "expandable-menu", name: "Expandable Menu", signature: "silhouette → word travel" },
  { id: "panel-toggle", name: "Panel Toggle", signature: "rail redraws the layout", origin: "sidebar · VS Code / Linear" },
] as const;

const SECONDARY_TRIGGERS = [
  { id: "sliding-stack", name: "Sliding Stack", signature: "shear → parallel diagonals" },
  { id: "double-line-ring", name: "Double-Line Ring", signature: "staged: ring, then lines" },
  { id: "elastic-lines", name: "Elastic Lines", signature: "length in place" },
  { id: "dot-grid", name: "Dot Grid", signature: "radial stagger → cross", origin: "app launcher · Google" },
  { id: "meatball", name: "Meatball", signature: "spread → diagonal fold", origin: "overflow · iOS / Notion" },
  { id: "kebab", name: "Kebab", signature: "column merges to a bar", origin: "overflow · Material" },
  { id: "plus-rotate", name: "Plus", signature: "arms extend → 45°", origin: "create · Notion / Linear" },
  { id: "avatar-menu", name: "Avatar", signature: "ring opens, caret turns", origin: "account menu" },
] as const;

/**
 * The menu-trigger wall.
 *
 * Every trigger is mounted, interactive and independently stateful on arrival.
 * The first wall is the public signature set; the second keeps useful presets
 * and familiar marks available without giving them equal discovery weight.
 */
export function MenuWall() {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const bind = (id: string) => ({
    open: open[id] ?? false,
    onOpenChange: (next: boolean) => setOpen((prev) => ({ ...prev, [id]: next })),
    controls: `${id}-surface`,
  });

  const everything = [...SIGNATURE_TRIGGERS, ...SECONDARY_TRIGGERS];
  const allOpen = everything.every((t) => open[t.id]);

  return (
    <section className="mt-16 border-t border-line pt-9">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h2 className="font-display text-base font-semibold tracking-tight">Menu triggers · Signatures</h2>
          <p className="text-sm text-ink-500">
            The clearest Pinky constructions: each has a different close-mark signature and a direct action path.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            setOpen(Object.fromEntries(everything.map((t) => [t.id, !allOpen])))
          }
          className="min-h-10 rounded-pill border border-line bg-white px-3.5 py-2 text-sm text-ink-700 transition-colors hover:border-line-strong"
        >
          {allOpen ? "Close all" : "Open all"}
        </button>
      </div>

      <div className="mt-10 grid grid-cols-2 items-start gap-x-6 gap-y-10 sm:grid-cols-4 sm:gap-x-10">
        <Cell trigger={SIGNATURE_TRIGGERS[0]}>
          <FloatingLines {...bind("floating-lines")} />
        </Cell>
        <Cell trigger={SIGNATURE_TRIGGERS[1]}>
          <BracketMenu {...bind("bracket-menu")} />
        </Cell>
        <Cell trigger={SIGNATURE_TRIGGERS[2]}>
          <SplitRail {...bind("split-rail")} />
        </Cell>
        <Cell trigger={SIGNATURE_TRIGGERS[3]}>
          <TextMenu {...bind("text-menu")} className="min-h-12 min-w-16 px-2" />
        </Cell>
        <Cell trigger={SIGNATURE_TRIGGERS[4]}>
          <BentoMenu {...bind("bento")} />
        </Cell>
        <Cell trigger={SIGNATURE_TRIGGERS[5]}>
          <InsetMenu {...bind("inset-menu")} />
        </Cell>
        <Cell trigger={SIGNATURE_TRIGGERS[6]}>
          <ExpandableMenu {...bind("expandable-menu")} />
        </Cell>
        <Cell trigger={SIGNATURE_TRIGGERS[7]}>
          <PanelToggle {...bind("panel-toggle")} />
        </Cell>
      </div>


      <div className="mt-14 border-t border-line pt-9">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h2 className="font-display text-base font-semibold tracking-tight">Menu triggers · Presets & utility marks</h2>
          <p className="text-sm text-ink-500">
            Familiar marks and secondary variants remain live for comparison, but do not compete with the signature set above.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 items-start gap-x-6 gap-y-10 sm:grid-cols-4 sm:gap-x-10">
          <Cell trigger={SECONDARY_TRIGGERS[0]}><SlidingStack {...bind("sliding-stack")} /></Cell>
          {/* Proximity is the enhancement layer; the ring is complete without it. */}
          <Proximity distance={150} axis="both">
            <Cell trigger={SECONDARY_TRIGGERS[1]}><DoubleLineRing {...bind("double-line-ring")} /></Cell>
          </Proximity>
          <Cell trigger={SECONDARY_TRIGGERS[2]}><ElasticLines {...bind("elastic-lines")} /></Cell>
          <Cell trigger={SECONDARY_TRIGGERS[3]}><DotGrid {...bind("dot-grid")} /></Cell>
          <Cell trigger={SECONDARY_TRIGGERS[4]}><MeatballMenu {...bind("meatball")} /></Cell>
          <Cell trigger={SECONDARY_TRIGGERS[5]}><KebabMenu {...bind("kebab")} /></Cell>
          <Cell trigger={SECONDARY_TRIGGERS[6]}><PlusRotate {...bind("plus-rotate")} /></Cell>
          <Cell trigger={SECONDARY_TRIGGERS[7]}><AvatarMenu {...bind("avatar-menu")} /></Cell>
        </div>

        <div className="sr-only">
          {SECONDARY_TRIGGERS.map((t) => (
            <div key={t.id} id={`${t.id}-surface`} hidden={!open[t.id]}>
              {t.name} navigation
            </div>
          ))}
        </div>
      </div>

      {/* Each trigger owns a real surface, so aria-controls points somewhere. */}
      <div className="sr-only">
        {SIGNATURE_TRIGGERS.map((t) => (
          <div key={t.id} id={`${t.id}-surface`} hidden={!open[t.id]}>
            {t.name} navigation
          </div>
        ))}
      </div>
    </section>
  );
}

function Cell({
  trigger,
  children,
}: {
  trigger: { name: string; signature: string; origin?: string };
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col items-start gap-4">
      <div className="flex min-h-14 items-center">{children}</div>
      <div>
        <p className="text-[0.8125rem] font-medium text-ink-900">{trigger.name}</p>
        <p className="mt-0.5 font-mono text-[0.65rem] text-ink-500">{trigger.signature}</p>
        {trigger.origin ? (
          <p className="mt-0.5 font-mono text-[0.6rem] text-ink-500/70">{trigger.origin}</p>
        ) : null}
      </div>
    </div>
  );
}
