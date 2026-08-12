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
} from "@pinky/components";
import { Proximity } from "@pinky/primitives";
import { useState, type ReactNode } from "react";

const TRIGGERS = [
  { id: "floating-lines", name: "Floating Lines", signature: "depth separation → offset cross" },
  { id: "split-rail", name: "Split Rail", signature: "counter-slide → recombine" },
  { id: "inset-menu", name: "Inset Menu", signature: "opposing depths → minus + dot" },
  { id: "bracket-menu", name: "Bracket Menu", signature: "convergence → framed cross" },
  { id: "sliding-stack", name: "Sliding Stack", signature: "shear → parallel diagonals" },
  { id: "expandable-menu", name: "Expandable Menu", signature: "silhouette → word travel" },
  { id: "double-line-ring", name: "Double-Line Ring", signature: "staged: ring, then lines" },
  { id: "elastic-lines", name: "Elastic Lines", signature: "length in place" },
] as const;

const NON_LINE = [
  { id: "dot-grid", name: "Dot Grid", signature: "radial stagger → cross", origin: "app launcher · Google" },
  { id: "meatball", name: "Meatball", signature: "spread → diagonal fold", origin: "overflow · iOS / Notion" },
  { id: "kebab", name: "Kebab", signature: "column merges to a bar", origin: "overflow · Material" },
  { id: "bento", name: "Bento", signature: "gutter breathes → block turns", origin: "waffle · Microsoft" },
  { id: "panel-toggle", name: "Panel Toggle", signature: "rail redraws the layout", origin: "sidebar · VS Code / Linear" },
  { id: "plus-rotate", name: "Plus", signature: "arms extend → 45°", origin: "create · Notion / Linear" },
  { id: "text-menu", name: "Text", signature: "rule draws, word travels", origin: "editorial / fashion" },
  { id: "avatar-menu", name: "Avatar", signature: "ring opens, caret turns", origin: "account menu" },
] as const;

/**
 * The menu-trigger wall.
 *
 * Every trigger is mounted, interactive and independently stateful on arrival —
 * no tabs, no cards to open, no playground. Each keeps its own open state so
 * the whole row can be left open at once and the eight close marks compared
 * side by side, which is the comparison that actually matters here.
 */
export function MenuWall() {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const bind = (id: string) => ({
    open: open[id] ?? false,
    onOpenChange: (next: boolean) => setOpen((prev) => ({ ...prev, [id]: next })),
    controls: `${id}-surface`,
  });

  const everything = [...TRIGGERS, ...NON_LINE];
  const allOpen = everything.every((t) => open[t.id]);

  return (
    <section className="mt-16 border-t border-line pt-9">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h2 className="font-display text-base font-semibold tracking-tight">Menu triggers · Lines</h2>
          <p className="text-sm text-ink-500">
Eight constructions built from two strokes. Not one of them rotates into an X.
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
        <Cell trigger={TRIGGERS[0]}>
          <FloatingLines {...bind("floating-lines")} />
        </Cell>
        <Cell trigger={TRIGGERS[1]}>
          <SplitRail {...bind("split-rail")} />
        </Cell>
        <Cell trigger={TRIGGERS[2]}>
          <InsetMenu {...bind("inset-menu")} />
        </Cell>
        <Cell trigger={TRIGGERS[3]}>
          <BracketMenu {...bind("bracket-menu")} />
        </Cell>
        <Cell trigger={TRIGGERS[4]}>
          <SlidingStack {...bind("sliding-stack")} />
        </Cell>
        <Cell trigger={TRIGGERS[5]}>
          <ExpandableMenu {...bind("expandable-menu")} />
        </Cell>
        {/* Proximity is the enhancement layer; the ring is complete without it. */}
        <Proximity distance={150} axis="both">
          <Cell trigger={TRIGGERS[6]}>
            <DoubleLineRing {...bind("double-line-ring")} />
          </Cell>
        </Proximity>
        <Cell trigger={TRIGGERS[7]}>
          <ElasticLines {...bind("elastic-lines")} />
        </Cell>
      </div>


      <div className="mt-14 border-t border-line pt-9">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h2 className="font-display text-base font-semibold tracking-tight">Menu triggers · Marks</h2>
          <p className="text-sm text-ink-500">
Dots, squares, a layout diagram, a plus, a word, a face — the archetypes the
            industry settled on when it stopped drawing lines.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 items-start gap-x-6 gap-y-10 sm:grid-cols-4 sm:gap-x-10">
          <Cell trigger={NON_LINE[0]}><DotGrid {...bind("dot-grid")} /></Cell>
          <Cell trigger={NON_LINE[1]}><MeatballMenu {...bind("meatball")} /></Cell>
          <Cell trigger={NON_LINE[2]}><KebabMenu {...bind("kebab")} /></Cell>
          <Cell trigger={NON_LINE[3]}><BentoMenu {...bind("bento")} /></Cell>
          <Cell trigger={NON_LINE[4]}><PanelToggle {...bind("panel-toggle")} /></Cell>
          <Cell trigger={NON_LINE[5]}><PlusRotate {...bind("plus-rotate")} /></Cell>
          <Cell trigger={NON_LINE[6]}><TextMenu {...bind("text-menu")} className="min-h-12 min-w-16 px-2" /></Cell>
          <Cell trigger={NON_LINE[7]}><AvatarMenu {...bind("avatar-menu")} /></Cell>
        </div>

        <div className="sr-only">
          {NON_LINE.map((t) => (
            <div key={t.id} id={`${t.id}-surface`} hidden={!open[t.id]}>
              {t.name} navigation
            </div>
          ))}
        </div>
      </div>

      {/* Each trigger owns a real surface, so aria-controls points somewhere. */}
      <div className="sr-only">
        {TRIGGERS.map((t) => (
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
