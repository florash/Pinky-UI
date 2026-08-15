import type { Metadata } from "next";

import { Container, Halo } from "@/components/site/layout";
import { InteractionStudyWall } from "@/components/home/featured-interaction-wall";
import { ShowcaseGrid } from "@/components/showcase/showcase-grid";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "Showcase",
  "Compositions built by stacking Pinky UI primitives and components.",
  "/showcase",
);

export default function ShowcasePage() {
  return (
    <div className="relative overflow-hidden pt-16 pb-20 sm:pt-20">
      <Halo className="-top-32 right-[-10rem] size-[28rem]" color="var(--pinky-halo-b)" />

      <Container>
        <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-ink-500 uppercase">
          Showcase
        </p>
        <h1 className="mt-5 max-w-2xl text-section text-balance-tight">
          What happens when they stack.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-700 sm:text-lg">
          These are compositions, not new components — the same four building blocks arranged
          differently. Every example on this page is live.
        </p>

        <ShowcaseGrid className="mt-14" />
        <InteractionStudyWall />
      </Container>
    </div>
  );
}
