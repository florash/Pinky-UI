import type { Metadata } from "next";

import { DiscoveryBrowser } from "@/components/explore/discovery-browser";

export const metadata: Metadata = { title: "Explore", description: "Search and filter every Pinky UI component, effect, experience and product interaction." };
export default function ExplorePage() { return <main className="mx-auto max-w-[76rem] px-5 py-20 sm:px-8 sm:py-28"><p className="font-mono text-[0.6875rem] tracking-[0.18em] text-ink-500 uppercase">Explore · all families</p><h1 className="mt-5 max-w-3xl text-display text-balance-tight">Find the right interaction, not another effect.</h1><p className="mt-6 mb-12 max-w-2xl text-lg leading-relaxed text-ink-700">Search across components, layouts, effects, experiences, media, forms and data without turning the primary header into fourteen links.</p><DiscoveryBrowser /></main>; }
