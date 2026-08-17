import {
  allEffects,
  allExperiences,
  allProductSystems,
  allWorkflowSystems,
  components,
  layouts,
} from "@pinky-ui/registry";
import Link from "next/link";

import { ArrowRight } from "@/components/site/icons";
import { Container } from "@/components/site/layout";

/**
 * The quiet beat between the two dense zones.
 *
 * No previews here on purpose — after five live interactions the page needs a
 * moment of plain text and air before it starts moving again. It is also the
 * only place the homepage acknowledges how much else there is, and it hands
 * that job straight to Explore instead of reproducing the catalogue.
 */
const FAMILIES = [
  { href: "/components", label: "Components", count: components.length },
  { href: "/layouts", label: "Layouts", count: layouts.length },
  { href: "/effects", label: "Effects", count: allEffects.length },
  { href: "/experiences", label: "Experiences", count: allExperiences.length },
  { href: "/systems", label: "Systems", count: allProductSystems.length + allWorkflowSystems.length },
];

export function ExploreRail() {
  return (
    <section id="explore-rail" className="relative py-24 sm:py-36">
      <Container>
        <p className="mx-auto max-w-2xl text-center text-[clamp(1.5rem,2.6vw,2.15rem)] leading-[1.2] tracking-[-0.025em] text-balance-tight">
          Everything above is one screen of it.
        </p>

        <ul className="mx-auto mt-12 flex max-w-3xl flex-wrap items-center justify-center gap-x-2 gap-y-3">
          {FAMILIES.map((family) => (
            <li key={family.href}>
              <Link
                href={family.href}
                className="group inline-flex min-h-11 items-baseline gap-2 rounded-pill px-4 py-3 text-sm text-ink-700 transition-colors duration-300 ease-[var(--ease-soft)] hover:bg-white hover:text-ink-900"
              >
                {family.label}
                <span className="font-mono text-[0.625rem] text-ink-500">{family.count}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex justify-center">
          <Link
            href="/explore"
            className="group inline-flex min-h-11 items-center gap-2 text-sm font-medium text-ink-900"
          >
            Explore everything
            <ArrowRight className="size-4 transition-transform duration-300 ease-[var(--ease-soft)] group-hover:translate-x-1" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
