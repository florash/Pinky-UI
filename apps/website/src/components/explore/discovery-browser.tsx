"use client";

import { allEffects, allExperiences, allProductSystems, allWorkflowSystems, components, layouts } from "@pinky/registry";
import Link from "next/link";
import { useMemo, useState } from "react";

type DiscoveryFamily = "Components" | "Layouts" | "Cursor" | "Motion" | "Text" | "Scroll" | "Navigation" | "Heroes" | "Backgrounds" | "Transitions" | "Spatial" | "Media" | "Forms" | "Data" | "Feedback" | "Search" | "Loading" | "Lists" | "Drag" | "Onboarding" | "Mobile";
type DiscoveryItem = { slug: string; name: string; description: string; family: DiscoveryFamily; href: string; tags: string[] };

const title = (value: string) => `${value.charAt(0).toUpperCase()}${value.slice(1)}` as DiscoveryFamily;
const ITEMS: DiscoveryItem[] = [
  ...components.map((item) => ({ slug: item.slug, name: item.name, description: item.description, family: "Components" as const, href: `/components/${item.slug}`, tags: item.tags })),
  ...layouts.map((item) => ({ slug: item.slug, name: item.name, description: item.description, family: "Layouts" as const, href: `/layouts/${item.slug}`, tags: item.tags })),
  ...allEffects.map((item) => ({ slug: item.slug, name: item.name, description: item.description, family: title(item.family), href: `/effects#${item.slug}`, tags: [item.family] })),
  ...allExperiences.map((item) => ({ slug: item.slug, name: item.name, description: item.description, family: title(item.family), href: item.demoPath, tags: item.tags })),
  ...allProductSystems.map((item) => ({ slug: item.slug, name: item.name, description: item.description, family: title(item.family), href: item.demoPath, tags: item.tags })),
  ...allWorkflowSystems.map((item) => ({ slug: item.slug, name: item.name, description: item.description, family: title(item.family), href: item.demoPath, tags: item.tags })),
];
const FAMILIES = ["Components", "Layouts", "Cursor", "Motion", "Text", "Scroll", "Navigation", "Heroes", "Backgrounds", "Transitions", "Spatial", "Media", "Forms", "Data", "Feedback", "Search", "Loading", "Lists", "Drag", "Onboarding", "Mobile"] as const;

export function DiscoveryBrowser() {
  const [query, setQuery] = useState(""); const [family, setFamily] = useState<DiscoveryFamily | "All">("All");
  const filtered = useMemo(() => { const needle = query.trim().toLowerCase(); return ITEMS.filter((item) => (family === "All" || item.family === family) && (!needle || [item.name, item.description, ...item.tags].join(" ").toLowerCase().includes(needle))); }, [family, query]);
  return <div><label className="block"><span className="font-mono text-xs tracking-[0.16em] text-ink-500 uppercase">Search all Pinky UI</span><input type="search" value={query} onChange={(event) => setQuery(event.currentTarget.value)} placeholder="Try morph, keyboard, gallery…" className="mt-3 w-full rounded-2xl border border-line bg-white px-5 py-4 text-base shadow-soft outline-none" /></label><div role="group" aria-label="Filter by family" className="mt-5 flex max-w-full gap-2 overflow-x-auto pb-2"><button type="button" aria-pressed={family === "All"} onClick={() => setFamily("All")} className={filterChip(family === "All")}>All</button>{FAMILIES.map((item) => <button key={item} type="button" aria-pressed={family === item} onClick={() => setFamily(item)} className={filterChip(family === item)}>{item}</button>)}</div><p aria-live="polite" className="mt-5 font-mono text-xs text-ink-500">{filtered.length} results</p><div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((item) => <Link key={`${item.family}-${item.slug}`} href={item.href} className="rounded-[22px] border border-line bg-white/75 p-5 shadow-soft transition-transform hover:-translate-y-0.5"><span className="font-mono text-[0.65rem] tracking-[0.15em] text-ink-500 uppercase">{item.family}</span><h2 className="mt-3 text-lg">{item.name}</h2><p className="mt-2 text-sm leading-relaxed text-ink-700">{item.description}</p></Link>)}</div>{filtered.length === 0 ? <p className="rounded-2xl bg-cloud-50 p-6 text-ink-700">No matching interaction. Try a broader family or search term.</p> : null}</div>;
}
function filterChip(active: boolean) { return `shrink-0 rounded-pill border px-3.5 py-2 text-sm ${active ? "border-ink-900 bg-ink-900 text-milk" : "border-line bg-white text-ink-700"}`; }
