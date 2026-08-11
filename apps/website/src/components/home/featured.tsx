import { cn } from "@pinky/components";
import { components } from "@pinky/registry";
import Link from "next/link";

import { ComponentPreview } from "@/components/previews/component-previews";
import { ArrowRight } from "@/components/site/icons";
import { Container, Section, SectionHeading } from "@/components/site/layout";

/** Each exhibit gets its own light, so the row does not read as one repeated card. */
const STAGE_TINT = [
  "radial-gradient(120% 90% at 20% 0%, var(--color-blush-50), transparent 70%)",
  "radial-gradient(120% 90% at 80% 10%, var(--color-cloud-50), transparent 70%)",
  "radial-gradient(110% 80% at 50% 100%, var(--color-blush-50), transparent 72%)",
  "radial-gradient(130% 90% at 0% 100%, var(--color-cloud-50), transparent 70%)",
];

/** The six that best show what the library is; the rest live in the gallery. */
const FEATURED = [
  "jelly-card",
  "liquid-card",
  "morph-card",
  "magnetic-button",
  "fluid-tabs",
  "floating-dock",
];

export function Featured() {
  const ready = FEATURED.map((slug) => components.find((entry) => entry.slug === slug)).filter(
    (entry) => entry !== undefined,
  );
  const rest = components.filter((entry) => !FEATURED.includes(entry.slug));

  return (
    <Section id="components">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Component library"
            title="Components you can feel."
            description="Every exhibit below is the real component running, not a screenshot of one."
          />
          <Link
            href="/components"
            className="group inline-flex items-center gap-2 text-sm font-medium text-ink-700 transition-colors hover:text-ink-900"
          >
            All components
            <ArrowRight className="size-4 transition-transform duration-300 ease-[var(--ease-soft)] group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-16 grid gap-3 lg:grid-cols-2">
          {ready.map((entry, index) => (
            <Link
              key={entry.slug}
              href={`/components/${entry.slug}`}
              className="group relative isolate flex flex-col overflow-hidden rounded-2xl bg-white/60 ring-1 ring-line/60 transition-[box-shadow,background-color] duration-500 ease-[var(--ease-soft)] hover:bg-white/90 hover:shadow-soft"
            >
              <div
                className={cn(
                  "flex items-center justify-center overflow-hidden p-8",
                  // The first exhibit gets more room — a gallery has a lead piece.
                  index === 0 ? "h-72" : "h-60",
                )}
                style={{ background: STAGE_TINT[index % STAGE_TINT.length] }}
              >
                <ComponentPreview slug={entry.slug} />
              </div>

              <div className="flex items-baseline justify-between gap-4 px-6 py-5">
                <div>
                  <h3 className="font-display text-base font-semibold tracking-tight">
                    {entry.name}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-700">{entry.description}</p>
                </div>
                <span className="font-mono text-[0.625rem] tracking-[0.12em] whitespace-nowrap text-ink-500 uppercase">
                  {entry.category}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-3 rounded-2xl px-6 py-5 ring-1 ring-line/60">
          <p className="font-mono text-[0.625rem] tracking-[0.14em] text-ink-500 uppercase">
            Also in the library
          </p>
          <ul className="mt-3 flex flex-wrap gap-x-8 gap-y-2">
            {rest.map((entry) => (
              <li key={entry.slug}>
                <Link
                  href={`/components/${entry.slug}`}
                  className="text-sm text-ink-500 transition-colors hover:text-ink-900"
                >
                  {entry.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
