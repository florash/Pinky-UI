"use client";

import { cn } from "@pinky-ui/components";
import { layouts } from "@pinky-ui/registry";
import Link from "next/link";
import { useEffect, useState } from "react";

import { LayoutPreview, hasLayoutPreview } from "@/components/previews/layout-previews";
import {
  layoutBelongsToPublicFamily,
  publicLayoutFamilyFor,
  PUBLIC_LAYOUT_FAMILIES,
  resolveLayoutFamily,
  type PublicLayoutFamily,
} from "@/lib/site";

/**
 * Layout cards are much larger than component cards on purpose: a spatial
 * arrangement needs room to say what it is. A masonry gallery shrunk into a
 * component-sized tile just looks like a grid.
 */
export function LayoutGallery({ initialFamily = "all" }: { initialFamily?: PublicLayoutFamily | "all" }) {
  const [family, setFamily] = useState<PublicLayoutFamily | "all">(initialFamily);

  useEffect(() => {
    const requestedFamily = new URLSearchParams(window.location.search).get("family");
    if (requestedFamily) setFamily(resolveLayoutFamily(requestedFamily));
  }, []);

  const results = layouts.filter(
    (entry) =>
      entry.status === "ready" &&
      hasLayoutPreview(entry.slug) &&
      layoutBelongsToPublicFamily(entry.family, family),
  );

  return (
    <>
      <div className="mt-10 flex flex-wrap items-center gap-2">
        <span className="mr-1 font-mono text-[0.6875rem] tracking-[0.14em] text-ink-500 uppercase">
          Family
        </span>
        {(["all", ...PUBLIC_LAYOUT_FAMILIES] as const).map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={family === option}
            onClick={() => setFamily(option)}
            className={cn(
              "min-h-10 rounded-pill px-3.5 py-2 text-xs font-medium capitalize transition-colors duration-200 sm:min-h-0 sm:py-1.5",
              family === option
                ? "bg-ink-900 text-milk"
                : "text-ink-700 ring-1 ring-line hover:bg-white/70 hover:ring-line-strong",
            )}
          >
            {option}
          </button>
        ))}
      </div>

      <p aria-live="polite" className="mt-8 font-mono text-xs text-ink-500">
        {results.length} {results.length === 1 ? "layout" : "layouts"}
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {results.map((entry) => (
          <article
            key={entry.slug}
            className="flex flex-col overflow-hidden rounded-2xl bg-white/60 ring-1 ring-line/60"
          >
            <div className="flex min-h-[20rem] items-center justify-center overflow-hidden bg-milk/50 p-4 sm:min-h-[26rem] sm:p-8">
              <LayoutPreview slug={entry.slug} />
            </div>

            <div className="flex flex-col gap-3 p-6">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="font-display text-lg font-semibold tracking-tight">
                  <Link href={`/layouts/${entry.slug}`} className="transition-colors hover:text-ink-700">
                    {entry.name}
                  </Link>
                </h2>
                <span className="font-mono text-[0.625rem] tracking-[0.12em] text-ink-500 uppercase">
                  {publicLayoutFamilyFor(entry.family)}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-ink-700">{entry.description}</p>
              <p className="font-mono text-xs text-ink-500">{entry.itemRange}</p>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
