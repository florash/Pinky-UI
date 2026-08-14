import type { DiscoveryMetadata } from "@pinky/registry";
import Link from "next/link";

export type RegistryCatalogueItem = {
  slug: string;
  name: string;
  family: string;
  description: string;
  discovery?: DiscoveryMetadata;
};

const ROLE_ORDER = {
  canonical: 0,
  solid: 1,
  preset: 2,
  secondary: 3,
  legacy: 4,
} as const;

export function RegistryCatalogue({
  id,
  items,
  hrefPrefix,
  label,
}: {
  id: string;
  items: readonly RegistryCatalogueItem[];
  hrefPrefix: string;
  label: string;
}) {
  const bySlug = new Map(items.map((item) => [item.slug, item]));
  const groups = new Map<string, RegistryCatalogueItem[]>();

  for (const item of items) {
    const group = groups.get(item.family) ?? [];
    group.push(item);
    groups.set(item.family, group);
  }

  for (const group of groups.values()) {
    group.sort((a, b) => {
      const roleDelta = (ROLE_ORDER[a.discovery?.role ?? "solid"] ?? 1) - (ROLE_ORDER[b.discovery?.role ?? "solid"] ?? 1);
      return roleDelta || a.name.localeCompare(b.name);
    });
  }

  return (
    <section id={id} className="mx-auto max-w-[76rem] scroll-mt-24 px-5 pt-24 sm:px-8 sm:pt-28" aria-labelledby={`${id}-title`}>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div className="max-w-3xl">
          <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-ink-500 uppercase">
            Browse all · {items.length} {label}
          </p>
          <h2 id={`${id}-title`} className="mt-4 text-section text-balance-tight">
            The full set of {label}, easy to reach.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-700">
            Live studies stay above. This compact catalogue keeps the full family visible, with canonical patterns first and quieter variations kept in context.
          </p>
        </div>
        <p className="max-w-[15rem] font-mono text-[0.625rem] leading-relaxed tracking-[0.12em] text-ink-500 uppercase">
          name / relationship / detail
        </p>
      </div>

      <div className="mt-9 space-y-8">
        {[...groups.entries()].map(([family, group]) => (
          <section key={family} aria-labelledby={`${id}-${family}-title`}>
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-3">
              <h3 id={`${id}-${family}-title`} className="font-display text-xl font-semibold capitalize tracking-tight">
                {family.replace(/-/g, " ")}
              </h3>
              <p className="font-mono text-[0.625rem] tracking-[0.14em] text-ink-500 uppercase">
                {group.length} {group.length === 1 ? "entry" : "entries"}
              </p>
            </div>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {group.map((item) => {
                const detailHref = `${hrefPrefix}/${item.slug}`;
                const canonical = item.discovery?.canonicalSlug ? bySlug.get(item.discovery.canonicalSlug) : undefined;
                const relationship = relationshipLabel(item, canonical);

                return (
                  <li key={item.slug} className="min-w-0 rounded-2xl border border-line bg-white/72 px-4 py-4 transition-colors hover:border-line-strong sm:px-5">
                    <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <Link href={detailHref} className="min-w-0 rounded-sm font-display text-base font-semibold tracking-tight text-ink-900 underline decoration-transparent underline-offset-4 transition-colors hover:decoration-line-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20">
                            {item.name}
                          </Link>
                          {relationship ? (
                            canonical && item.discovery?.role !== "solid" ? (
                              <Link href={`${hrefPrefix}/${canonical.slug}`} className="rounded-pill border border-line px-2 py-1 font-mono text-[0.55rem] tracking-[0.1em] text-ink-500 uppercase hover:border-line-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20">
                                {relationship}
                              </Link>
                            ) : (
                              <span className="rounded-pill border border-line px-2 py-1 font-mono text-[0.55rem] tracking-[0.1em] text-ink-500 uppercase">
                                {relationship}
                              </span>
                            )
                          ) : null}
                        </div>
                        <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-700">{item.description}</p>
                      </div>
                      <Link href={detailHref} aria-label={`Open ${item.name} detail`} className="inline-flex min-h-9 shrink-0 items-center self-start rounded-pill border border-line px-3 py-2 text-xs font-medium text-ink-700 transition-colors hover:border-ink-900 hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20">
                        Open detail <span aria-hidden className="ml-1">↗</span>
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}

function relationshipLabel(item: RegistryCatalogueItem, canonical?: RegistryCatalogueItem) {
  if (item.discovery?.role === "canonical") return "Canonical";
  if (item.discovery?.role === "solid") return "Independent";
  if (item.discovery?.role === "preset" && canonical) return `Variation of ${canonical.name}`;
  if (item.discovery?.role === "secondary" && canonical) return `Related to ${canonical.name}`;
  if (item.discovery?.role === "legacy") return "Earlier route";
  return "";
}
