"use client";

import {
  BottomSearchSheet,
  BottomToastStack,
  DetentSheet,
  FocusRailMobile,
  FullscreenMediaMorph,
  LongPressSelection,
  MorphingBottomNavigation,
  QuickActionSheet,
} from "@pinky/systems";
import { allWorkflowSystems } from "@pinky/registry";
import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@pinky/components";
import { SectionHeading } from "@/components/site/layout";

const NEW_MOBILE_SLUGS = [
  "morphing-bottom-navigation",
  "floating-dock-navigation",
  "thumb-reach-menu",
  "bottom-search-sheet",
  "search-filter-morph",
  "inline-search-reveal",
  "detent-sheet",
  "content-aware-sheet",
  "swipe-dismiss-card-sheet",
  "long-press-selection",
  "swipe-actions",
  "focus-lift-field",
  "mobile-validation-morph",
  "progressive-mobile-form",
  "card-stack-browse",
  "expand-in-place-card",
  "focus-rail-mobile",
  "fullscreen-media-morph",
  "swipe-media-inspector",
  "floating-media-controls",
  "bottom-toast-stack",
  "mobile-undo-bar",
  "quick-action-sheet",
  "hold-to-reveal-actions",
] as const;

const FEATURED = [
  { slug: "morphing-bottom-navigation", title: "Morphing bottom navigation", note: "active geometry", preview: <MorphingBottomNavigation /> },
  { slug: "bottom-search-sheet", title: "Bottom search sheet", note: "thumb → workspace", preview: <BottomSearchSheet /> },
  { slug: "detent-sheet", title: "Detent sheet", note: "peek / half / full", preview: <DetentSheet /> },
  { slug: "long-press-selection", title: "Long-press selection", note: "hold → batch mode", preview: <LongPressSelection /> },
  { slug: "focus-rail-mobile", title: "Focus rail mobile", note: "center → next", preview: <FocusRailMobile /> },
  { slug: "fullscreen-media-morph", title: "Fullscreen media morph", note: "source → inspection", preview: <FullscreenMediaMorph /> },
  { slug: "bottom-toast-stack", title: "Bottom toast stack", note: "stack → compress", preview: <BottomToastStack /> },
  { slug: "quick-action-sheet", title: "Quick action sheet", note: "recent → action", preview: <QuickActionSheet /> },
] satisfies Array<{ slug: string; title: string; note: string; preview: ReactNode }>;

export function MobileExpansionShowcase({ compact = false }: { compact?: boolean }) {
  const catalogue = allWorkflowSystems.filter((entry) => NEW_MOBILE_SLUGS.includes(entry.slug as (typeof NEW_MOBILE_SLUGS)[number]));
  return <section id="mobile-expansion" className={cn("scroll-mt-24", compact ? "pt-20" : "pt-24 sm:pt-32")}><SectionHeading eyebrow="Mobile-first expansion" title="Small screens need their own interaction grammar." description="These live surfaces use touch, thumb reach, press, drag and contained scroll as primary inputs. The full set stays compactly linked below." /><div className={cn("mt-9 grid gap-4", compact ? "sm:grid-cols-2 xl:grid-cols-4" : "lg:grid-cols-2 xl:grid-cols-4")}>{FEATURED.map((item) => <article key={item.slug} className={cn("min-w-0", compact ? "border-t border-line pt-4" : "rounded-[24px] border border-line bg-white/75 p-4 shadow-soft")}><div className="flex items-baseline justify-between gap-3"><div><p className="font-mono text-[0.58rem] tracking-[0.14em] text-ink-500 uppercase">Live mobile</p><h3 className="mt-2 font-display text-lg font-semibold tracking-tight">{item.title}</h3></div><span className="shrink-0 font-mono text-[0.56rem] tracking-[0.08em] text-ink-500 uppercase">{item.note}</span></div><div className="mt-4 min-w-0">{item.preview}</div><Link href={`/workflows/${item.slug}`} className="mt-4 inline-flex min-h-9 items-center text-xs text-ink-700 underline decoration-line-strong underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20">Open recipe ↗</Link></article>)}</div><div className="mt-8 border-t border-line pt-5"><div className="flex flex-wrap items-baseline justify-between gap-3"><p className="font-mono text-[0.62rem] tracking-[0.15em] text-ink-500 uppercase">Browse the new mobile set · {catalogue.length}</p><Link href="/workflows#browse-all" className="text-sm text-ink-700 underline decoration-line-strong underline-offset-4">Open full workflow catalogue ↗</Link></div><ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-ink-700">{catalogue.map((entry) => <li key={entry.slug}><Link href={`/workflows/${entry.slug}`} className="underline decoration-line/80 underline-offset-4 hover:decoration-line-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20">{entry.name}</Link></li>)}</ul></div></section>;
}
