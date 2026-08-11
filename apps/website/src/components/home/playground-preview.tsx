import Link from "next/link";

import { Playground } from "@/components/playground/playground";
import { ArrowRight } from "@/components/site/icons";
import { Container, Section, SectionHeading } from "@/components/site/layout";

export function PlaygroundPreview() {
  return (
    <Section id="playground">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Playground"
            title="Tune every interaction."
            description="Change the physics, watch the surface change character, and take the generated code with you."
          />
          <Link
            href="/playground"
            className="group inline-flex items-center gap-2 text-sm font-medium text-ink-700 transition-colors hover:text-ink-900"
          >
            Open the playground
            <ArrowRight className="size-4 transition-transform duration-300 ease-[var(--ease-soft)] group-hover:translate-x-1" />
          </Link>
        </div>

        <Playground className="mt-14" />
      </Container>
    </Section>
  );
}
