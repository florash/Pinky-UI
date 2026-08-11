import { layouts } from "@pinky/registry";
import Link from "next/link";

import { LayoutPreview } from "@/components/previews/layout-previews";
import { ArrowRight } from "@/components/site/icons";
import { Container, Section, SectionHeading } from "@/components/site/layout";

/** Ordered so the first two are the most spatially surprising. */
const SHOWN = [
  "polaroid-wall",
  "stack-grid",
  "card-fan",
  "masonry-gallery",
  "draggable-card-stack",
  "expandable-bento",
];

export function LayoutsSection() {
  const shown = SHOWN.map((slug) => layouts.find((entry) => entry.slug === slug)).filter(
    (entry) => entry !== undefined,
  );

  return (
    <Section id="layouts" className="relative">
      {/* A darker field, so the layout family reads as its own territory rather
          than more of the component gallery. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full"
        style={{
          background:
            "linear-gradient(180deg, transparent, color-mix(in oklab, var(--color-cloud-50) 70%, var(--pinky-page)) 18%, color-mix(in oklab, var(--color-cloud-50) 70%, var(--pinky-page)) 82%, transparent)",
        }}
      />

      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Layouts"
            title="Arrange things differently."
            description="Components are one thing at a time. These are ways to arrange many — where the layout itself becomes the interaction."
          />
          <Link
            href="/layouts"
            className="group inline-flex items-center gap-2 text-sm font-medium text-ink-700 transition-colors hover:text-ink-900"
          >
            All layouts
            <ArrowRight className="size-4 transition-transform duration-300 ease-[var(--ease-soft)] group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-2">
          {shown.map((entry, index) => (
            <article
              key={entry.slug}
              className={
                // The first two get full width: a stack unpacking and a photo
                // wall need room to be legible.
                index < 2
                  ? "overflow-hidden rounded-2xl bg-white/70 ring-1 ring-line/60 lg:col-span-1"
                  : "overflow-hidden rounded-2xl bg-white/70 ring-1 ring-line/60"
              }
            >
              <div className="flex min-h-[24rem] items-center justify-center overflow-hidden p-8">
                <LayoutPreview slug={entry.slug} />
              </div>
              <div className="flex items-baseline justify-between gap-4 px-6 py-5">
                <div>
                  <h3 className="font-display text-base font-semibold tracking-tight">
                    <Link
                      href={`/layouts/${entry.slug}`}
                      className="transition-colors hover:text-ink-700"
                    >
                      {entry.name}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-700">{entry.description}</p>
                </div>
                <span className="font-mono text-[0.625rem] tracking-[0.12em] whitespace-nowrap text-ink-500 uppercase">
                  {entry.family}
                </span>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
