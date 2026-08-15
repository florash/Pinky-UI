"use client";

import { getProductSystem } from "@pinky/registry";
import { ExplorePreview } from "@/components/previews/explore-previews";
import Link from "next/link";
import { useMemo } from "react";

const OVERLAY_ORDER = [
  "anchored-inspector",
  "adaptive-popover",
  "context-menu-surface",
  "selection-toolbar",
  "peek-overlay",
  "nested-surface-stack",
  "spotlight-overlay",
  "cursor-action-surface",
  "edge-docked-panel",
  "expanding-action-surface",
  "follow-anchor-surface",
  "shared-context-surface",
  "morphing-context-surface",
] as const;

const SIGNATURE = new Set(["anchored-inspector", "adaptive-popover", "context-menu-surface", "selection-toolbar", "nested-surface-stack", "spotlight-overlay"]);

export function OverlaysShowcase({ compact = false }: { compact?: boolean }) {
  const order = useMemo(() => compact ? OVERLAY_ORDER.slice(0, 4) : OVERLAY_ORDER, [compact]);
  return <div className="space-y-10">
    <div className="grid gap-6 lg:grid-cols-2">
      {order.filter((slug) => SIGNATURE.has(slug)).map((slug) => <OverlayDemo key={slug} slug={slug} />)}
    </div>
    {!compact ? <section aria-labelledby="overlay-contextual-family" className="space-y-5"><div><p className="font-mono text-[0.6875rem] tracking-[0.18em] text-ink-500 uppercase">Contextual layers</p><h3 id="overlay-contextual-family" className="mt-2 text-2xl font-semibold">Keep the relationship visible.</h3><p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-700">These surfaces follow a source, rebind one context or make room beside it. They share a visual language without becoming one generic overlay.</p></div><div className="grid gap-6 lg:grid-cols-2">{order.filter((slug) => !SIGNATURE.has(slug)).map((slug) => <OverlayDemo key={slug} slug={slug} />)}</div></section> : null}
  </div>;
}

function OverlayDemo({ slug }: { slug: string }) {
  const entry = getProductSystem(slug);
  if (!entry) return null;
  return <article id={slug} className="scroll-mt-28 rounded-[28px] border border-line bg-white/80 p-5 shadow-soft sm:p-6"><div className="flex items-start justify-between gap-4"><div><p className="font-mono text-[0.62rem] tracking-[0.16em] text-ink-500 uppercase">{entry.tags[0] ?? "overlay"}</p><h3 className="mt-2 text-xl font-semibold">{entry.name}</h3></div><Link href={`/systems/${entry.slug}`} className="inline-flex min-h-9 shrink-0 items-center rounded-full px-3 py-2 text-xs text-ink-500 underline underline-offset-4">Detail</Link></div><p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-700">{entry.description}</p><div className="mt-5 min-w-0"><ExplorePreview slug={slug} /></div></article>;
}

export const OVERLAY_SLUGS = OVERLAY_ORDER;
