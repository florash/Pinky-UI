"use client";

import { ExpandingSearch, InlineEditField } from "@pinky/systems";
import { layouts } from "@pinky/registry";
import Link from "next/link";

import { LayoutPreview } from "@/components/previews/layout-previews";
import { hasLayoutPreview } from "@/components/previews/preview-manifest";
import { ArrowRight } from "@/components/site/icons";
import { Container } from "@/components/site/layout";

/**
 * The medium beat: proof that Pinky is more than surface effects.
 *
 * Two arrangements and two product moments, and nothing else — the full sets
 * are one click away. The layouts run wide and asymmetric; the systems sit in
 * a compact rail underneath so the section has an internal rhythm of its own
 * rather than another equal-weight grid.
 */
const SHOWN_LAYOUTS = ["asymmetric-editorial-grid", "stack-grid"];

export function LayoutsSection() {
  const shown = SHOWN_LAYOUTS.map((slug) => layouts.find((entry) => entry.slug === slug)).filter(
    (entry): entry is NonNullable<typeof entry> =>
      Boolean(entry && entry.status === "ready" && hasLayoutPreview(entry.slug)),
  );

  return (
    <section id="layouts" className="relative py-20 sm:py-28">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <h2 className="max-w-lg text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.06] tracking-[-0.03em] text-balance-tight">
            Arrangements and product moments.
          </h2>
          <Link
            href="/explore"
            className="group inline-flex min-h-11 items-center gap-2 text-sm font-medium text-ink-700 transition-colors hover:text-ink-900"
          >
            See the rest
            <ArrowRight className="size-4 transition-transform duration-300 ease-[var(--ease-soft)] group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-12 grid gap-x-8 gap-y-12 lg:grid-cols-12">
          {shown.map((entry, index) => (
            <article
              key={entry.slug}
              className={`min-w-0 ${index === 0 ? "lg:col-span-7" : "lg:col-span-5"}`}
            >
              {/* Side by side the two share a height, so the captions sit on
                  one baseline and give the section an alignment anchor. Stacked
                  on mobile there is nothing to align to, so they shrink-wrap. */}
              <div className="flex items-center justify-center overflow-hidden rounded-[20px] bg-white/60 p-5 sm:p-6 lg:h-[29rem]">
                <LayoutPreview slug={entry.slug} />
              </div>
              <h3 className="mt-5 border-t border-line pt-3 font-mono text-[0.625rem] tracking-[0.15em] text-ink-500 uppercase">
                <Link
                  href={`/layouts/${entry.slug}`}
                  className="inline-flex min-h-11 items-center transition-colors hover:text-ink-900"
                >
                  {entry.name}
                </Link>
              </h3>
            </article>
          ))}
        </div>

        {/* A compact rail: two product systems at a much smaller footprint than
            the layouts above, so the section does not flatten into one grid. */}
        <div className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2">
          <div className="min-w-0">
            <p className="border-t border-line pt-3 font-mono text-[0.625rem] tracking-[0.15em] text-ink-500 uppercase">
              Inline Edit
            </p>
            <div className="mt-5">
              <InlineEditField
                label="Workspace name"
                defaultValue="Pinky studio"
                description="Click the value to edit."
              />
            </div>
          </div>

          <div className="min-w-0">
            <p className="border-t border-line pt-3 font-mono text-[0.625rem] tracking-[0.15em] text-ink-500 uppercase">
              Expanding Search
            </p>
            <div className="mt-5">
              <ExpandingSearch
                placeholder="Search workspace"
                results={
                  <p className="px-3 py-2 text-xs text-ink-500">Type to filter workspace items.</p>
                }
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
