"use client";

import { allEffects, allExperiences, allProductSystems, allWorkflowSystems, components, layouts, type DiscoveryRole, type DiscoveryMetadata } from "@pinky/registry";
import { cn } from "@pinky/components";
import Link from "next/link";
import { useMemo, useState } from "react";

import { FeaturedInteractionWall, MenuTriggerSampler as HomeMenuTriggerSampler } from "@/components/home/featured-interaction-wall";
import { ExplorePreview, hasExplorePreview } from "@/components/previews/explore-previews";
import { LazyMount } from "@/components/site/lazy-mount";

type DiscoveryGroup = "Components" | "Collections" | "Editorial" | "Spatial" | "Experiences" | "Systems" | "Effects";
type DiscoveryItem = {
  slug: string;
  name: string;
  description: string;
  group: DiscoveryGroup;
  family: string;
  href: string;
  tags: string[];
  discovery?: DiscoveryMetadata;
  canonicalName?: string;
  canonicalHref?: string;
};

const PUBLIC_SECTIONS: Array<{ id: DiscoveryGroup; description: string }> = [
  { id: "Components", description: "Small pieces with an immediate physical response." },
  { id: "Collections", description: "Stacks, grids and galleries for a collection that wants a point of view." },
  { id: "Editorial", description: "Composed arrangements where rhythm and whitespace are part of the interface." },
  { id: "Experiences", description: "Navigation, Heroes, backgrounds and transitions that shape the whole page." },
  { id: "Systems", description: "Media, forms, data and workflows for product moments that need a state." },
  { id: "Effects", description: "Cursor, motion, text and scroll — the smallest layer of expression." },
  { id: "Spatial", description: "High-risk depth experiments, kept discoverable but deliberately later." },
];

const FILTERS = [
  "All",
  ...PUBLIC_SECTIONS.map((section) => section.id),
  "Navigation",
  "Heroes",
  "Backgrounds",
  "Transitions",
  "Media",
  "Forms",
  "Data",
  "Workflows",
  "Cursor",
  "Motion",
  "Text",
  "Scroll",
] as const;
type DiscoveryFilter = (typeof FILTERS)[number];

const EXPERIMENTAL_SLUGS = new Set([
  "cursor-preview-nav",
  "shared-element-transition",
  "perspective-gallery",
  "floating-window-stack",
  "spatial-carousel",
  "orbit-menu",
  "image-sequence",
]);

const CURATED_SLUGS = new Set([
  "jelly-card",
  "liquid-card",
  "morph-card",
  "magnetic-button",
  "editorial-mosaic",
  "gallery-list-morph",
  "stack-spatial",
  "morphing-hero",
  "morph-lightbox",
  "command-palette",
  "sticky-story",
]);

const title = (value: string) => `${value.charAt(0).toUpperCase()}${value.slice(1)}`;

const ITEMS: DiscoveryItem[] = [
  ...components.map((item) => ({
    slug: item.slug,
    name: item.name,
    description: item.description,
    group: "Components" as const,
    family: title(item.category),
    href: `/components/${item.slug}`,
    tags: [...item.tags, ...item.interactions],
    discovery: item.discovery,
  })),
  ...layouts.map((item) => ({
    slug: item.slug,
    name: item.name,
    description: item.description,
    group: item.family === "spatial" ? "Spatial" as const : item.family === "editorial" ? "Editorial" as const : "Collections" as const,
    family: item.family === "spatial" ? "Spatial" : item.family === "editorial" ? "Editorial" : "Collections",
    href: `/layouts/${item.slug}`,
    tags: [item.family, ...item.tags],
  })),
  ...allEffects.map((item) => ({
    slug: item.slug,
    name: item.name,
    description: item.description,
    group: "Effects" as const,
    family: title(item.family),
    href: `/effects/${item.slug}`,
    tags: [item.family],
    discovery: item.discovery,
  })),
  ...allExperiences.map((item) => ({
    slug: item.slug,
    name: item.name,
    description: item.description,
    group: item.family === "spatial" ? "Spatial" as const : "Experiences" as const,
    family: title(item.family),
    href: `/experiences/${item.slug}`,
    tags: item.tags,
  })),
  ...allProductSystems.map((item) => ({
    slug: item.slug,
    name: item.name,
    description: item.description,
    group: "Systems" as const,
    family: title(item.family),
    href: `/systems/${item.slug}`,
    tags: item.tags,
    discovery: item.discovery,
  })),
  ...allWorkflowSystems.map((item) => ({
    slug: item.slug,
    name: item.name,
    description: item.description,
    group: "Systems" as const,
    family: "Workflows",
    href: `/workflows/${item.slug}`,
    tags: [item.family, ...item.tags],
    discovery: item.discovery,
  })),
];

const ITEM_BY_SLUG = new Map(ITEMS.map((item) => [item.slug, item]));
const PUBLIC_ITEMS = ITEMS.filter((item) => hasExplorePreview(item.slug)).map((item) => {
  const canonical = item.discovery?.canonicalSlug ? ITEM_BY_SLUG.get(item.discovery.canonicalSlug) : undefined;
  return {
    ...item,
    canonicalName: canonical?.name,
    canonicalHref: canonical?.href,
  };
});

const ROLE_ORDER: Record<DiscoveryRole, number> = {
  canonical: 0,
  solid: 1,
  preset: 2,
  secondary: 3,
  legacy: 4,
};

function discoveryRole(item: DiscoveryItem) {
  return item.discovery?.role ?? "solid";
}

function relationshipLabel(item: DiscoveryItem) {
  const canonicalName = item.canonicalName;
  if (item.discovery?.role === "preset" && canonicalName) return "Variation of " + canonicalName;
  if (item.discovery?.role === "secondary" && canonicalName) return "Related to " + canonicalName;
  if (item.discovery?.role === "solid") return "Independent pattern";
  if (item.discovery?.role === "legacy") return "Earlier route";
  return item.discovery?.role ?? "";
}

function compareDiscoveryItems(a: DiscoveryItem, b: DiscoveryItem) {
  const roleDelta = ROLE_ORDER[discoveryRole(a)] - ROLE_ORDER[discoveryRole(b)];
  if (roleDelta !== 0) return roleDelta;
  return Number(CURATED_SLUGS.has(b.slug)) - Number(CURATED_SLUGS.has(a.slug));
}

const ORDERED = [...PUBLIC_ITEMS].sort((a, b) => {
  const groupOrder = PUBLIC_SECTIONS.map((section) => section.id);
  const groupDelta = groupOrder.indexOf(a.group) - groupOrder.indexOf(b.group);
  if (groupDelta !== 0) return groupDelta;
  const experimentalDelta = Number(EXPERIMENTAL_SLUGS.has(a.slug)) - Number(EXPERIMENTAL_SLUGS.has(b.slug));
  if (experimentalDelta !== 0) return experimentalDelta;
  return compareDiscoveryItems(a, b);
});

/** Keep the default wall editorial: sample across families instead of letting
 * the largest registry family consume the whole section. Featured items are
 * already running above, so complementary pieces get the first look here. */
function curateSection(items: DiscoveryItem[], limit = 4) {
  const ordered = [...items].sort(compareDiscoveryItems);
  const preferred = ordered.filter((item) => !["preset", "legacy"].includes(discoveryRole(item)));
  const source = preferred.length >= limit ? preferred : ordered;
  const families = [...new Set(source.map((item) => item.family))];
  const buckets = new Map(families.map((family) => [family, source.filter((item) => item.family === family)]));
  const curated: DiscoveryItem[] = [];

  while (curated.length < limit && [...buckets.values()].some((bucket) => bucket.length > 0)) {
    families.forEach((family) => {
      if (curated.length >= limit) return;
      const next = buckets.get(family)?.shift();
      if (next) curated.push(next);
    });
  }

  return curated;
}

/**
 * Explore is a reference wall with an index beneath it: a curated first read,
 * a visible experimental shelf, then the complete catalogue grouped by the
 * public language rather than by implementation history.
 */
export function DiscoveryBrowser() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<DiscoveryFilter>("All");
  const needle = query.trim().toLowerCase();
  const curatedView = filter === "All" && needle.length === 0;

  const filtered = useMemo(() => ORDERED.filter((item) => {
    const matchesFilter = filter === "All" || item.group === filter || item.family === filter;
    const matchesQuery = !needle || [item.name, item.description, item.group, item.family, ...item.tags].join(" ").toLowerCase().includes(needle);
    return matchesFilter && matchesQuery;
  }), [filter, needle]);

  const live = filtered.filter((item) => hasExplorePreview(item.slug)).length;

  return (
    <div>
      {curatedView ? <FeaturedInteractionWall compact /> : null}

      <section id="browse" className="relative overflow-hidden py-12 sm:py-16">
        <div className="mx-auto max-w-[76rem] px-5 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-ink-500 uppercase">Browse the reference</p>
              <h2 className="mt-4 text-section text-balance-tight">Browse by interaction family.</h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-700">A restrained first edit of every family. Search or choose a filter to open the complete catalogue.</p>
            </div>
            <p className="font-mono text-xs text-ink-500">
              {curatedView ? `${filtered.length} in catalogue · curated by family` : `${filtered.length} results · ${live} running right here`}
            </p>
          </div>

          <label className="mt-8 block max-w-2xl">
            <span className="font-mono text-xs tracking-[0.16em] text-ink-500 uppercase">Search the wall</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.currentTarget.value)}
              placeholder="Try morph, editorial, keyboard…"
              className="mt-3 w-full rounded-2xl border border-line bg-white px-5 py-4 text-base shadow-soft outline-none focus-visible:ring-2 focus-visible:ring-ink-900"
            />
          </label>

          <div role="group" aria-label="Filter by public family" className="mt-5 flex max-w-full gap-2 overflow-x-auto pb-2 md:flex-wrap md:overflow-visible">
            {FILTERS.map((option) => (
              <button key={option} type="button" aria-pressed={filter === option} onClick={() => setFilter(option)} className={filterChip(filter === option)}>
                {option}
              </button>
            ))}
          </div>

          {curatedView ? <ExperimentalShelf items={ORDERED.filter((item) => EXPERIMENTAL_SLUGS.has(item.slug))} /> : null}

          <div className="mt-14 space-y-16">
            {PUBLIC_SECTIONS.map((section) => {
              const sectionItems = filtered.filter((item) => item.group === section.id);
              if (sectionItems.length === 0) return null;
              const displayedItems = curatedView ? curateSection(sectionItems) : sectionItems;
              const families = [...new Set(displayedItems.map((item) => item.family))];
              return (
                <section key={section.id} aria-labelledby={`browse-${section.id.toLowerCase()}`}>
                  <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-4">
                    <div>
                      <h2 id={`browse-${section.id.toLowerCase()}`} className="font-display text-2xl font-semibold tracking-tight">{section.id}</h2>
                      <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-700">{section.description}</p>
                    </div>
                    {curatedView && displayedItems.length < sectionItems.length ? (
                      <button
                        type="button"
                        onClick={() => {
                          setFilter(section.id);
                          window.requestAnimationFrame(() => document.querySelector("#browse")?.scrollIntoView({ block: "start" }));
                        }}
                        className="min-h-10 rounded-pill border border-line bg-white px-4 py-2 text-sm font-medium text-ink-700 transition-colors hover:border-line-strong hover:bg-cloud-50"
                      >
                        Browse all {section.id.toLowerCase()} · {sectionItems.length}
                      </button>
                    ) : (
                      <span className="font-mono text-xs text-ink-500">{sectionItems.length} {sectionItems.length === 1 ? "piece" : "pieces"}</span>
                    )}
                  </div>

                  {curatedView ? (
                    <div className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-4">
                      {displayedItems.map((item) => <DiscoveryCard key={`${item.group}-${item.slug}`} item={item} className="w-[82vw] shrink-0 snap-start sm:w-auto" />)}
                    </div>
                  ) : <div className="mt-9 space-y-12">
                    {families.map((family) => {
                      const familyItems = displayedItems.filter((item) => item.family === family);
                      return (
                        <div key={family}>
                          <div className="flex items-center gap-3">
                            <h3 className="font-mono text-[0.6875rem] tracking-[0.16em] text-ink-500 uppercase">{family}</h3>
                            <span className="h-px flex-1 bg-line" />
                            <span className="font-mono text-[0.625rem] text-ink-500">{familyItems.length}</span>
                          </div>
                          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {familyItems.map((item) => <DiscoveryCard key={`${item.group}-${item.slug}`} item={item} />)}
                          </div>
                        </div>
                      );
                    })}
                  </div>}
                </section>
              );
            })}
          </div>

          {filtered.length === 0 ? <p className="mt-12 rounded-2xl bg-cloud-50 p-6 text-ink-700">No matching interaction. Try a broader family or search term.</p> : null}
        </div>
      </section>
    </div>
  );
}

function ExperimentalShelf({ items }: { items: DiscoveryItem[] }) {
  const visibleItems = items.slice(0, 3);
  return (
    <section id="experimental" className="mt-16 border-y border-line py-10" aria-labelledby="experimental-title">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-ink-500 uppercase">New / Experimental</p>
          <h2 id="experimental-title" className="mt-3 font-display text-2xl font-semibold tracking-tight">Sharp edges, intentionally later.</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-700">The new Menu Trigger vocabulary is live below. Spatial and route-dependent experiments stay visible without stealing the first read.</p>
        </div>
        <Link href="/controls" className="text-sm font-medium text-ink-700 underline decoration-line-strong underline-offset-4">Open the full Menu Trigger wall</Link>
      </div>

      <div className={cn("mt-8 grid gap-4", visibleItems.length > 0 && "lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.9fr)]")}>
        <div className="rounded-[24px] border border-line bg-white/70 p-5 shadow-soft">
          <p className="font-mono text-[0.625rem] tracking-[0.15em] text-ink-500 uppercase">Menu Trigger sampler</p>
          <div className="mt-5"><HomeMenuTriggerSampler idPrefix="explore-experimental-menu" /></div>
        </div>
        {visibleItems.length > 0 ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{visibleItems.map((item) => <DiscoveryCard key={item.slug} item={item} experimental />)}</div> : null}
      </div>
    </section>
  );
}

function DiscoveryCard({ item, experimental = false, className }: { item: DiscoveryItem; experimental?: boolean; className?: string }) {
  const livePreview = hasExplorePreview(item.slug);
  return (
    <article className={cn("group flex min-w-0 flex-col overflow-hidden rounded-[22px] border border-line bg-white/75 shadow-soft transition-shadow duration-500 ease-[var(--ease-soft)] hover:shadow-lift", className)}>
      {livePreview ? (
        <LazyMount minHeight={176} className="bg-cloud-50/50">
          <div className="grid min-h-44 place-items-center overflow-hidden bg-[radial-gradient(120%_90%_at_30%_0%,var(--color-blush-50),transparent_70%)] p-5">
            <div className="w-full origin-center scale-[0.86] [&_*]:max-w-full"><ExplorePreview slug={item.slug} /></div>
          </div>
        </LazyMount>
      ) : null}

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[0.65rem] tracking-[0.15em] text-ink-500 uppercase">{item.family}</span>
          <div className="flex flex-wrap justify-end gap-1.5">
            {item.discovery && item.discovery.role !== "canonical" ? (
              item.canonicalName && item.canonicalHref ? (
                <Link href={item.canonicalHref} className="rounded-pill border border-line px-2 py-1 font-mono text-[0.55rem] tracking-[0.1em] text-ink-500 uppercase hover:border-line-strong">
                  {relationshipLabel(item)}
                </Link>
              ) : (
                <span className="rounded-pill border border-line px-2 py-1 font-mono text-[0.55rem] tracking-[0.1em] text-ink-500 uppercase">{relationshipLabel(item)}</span>
              )
            ) : null}
            {experimental ? <span className="rounded-pill border border-line px-2 py-1 font-mono text-[0.55rem] tracking-[0.1em] text-ink-500 uppercase">experimental</span> : null}
          </div>
        </div>
        <h4 className="mt-2 text-lg">
          <Link href={item.href} className="rounded-sm outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ink-900">{item.name}</Link>
        </h4>
        <p className="mt-2 text-sm leading-relaxed text-ink-700">{item.description}</p>
      </div>
    </article>
  );
}

function filterChip(active: boolean) {
  return `shrink-0 rounded-pill border px-3.5 py-2 text-sm ${active ? "border-ink-900 bg-ink-900 text-milk" : "border-line bg-white text-ink-700 hover:bg-cloud-50"}`;
}
