import type { Metadata } from "next";

import { ComponentGallery } from "@/components/gallery/component-gallery";
import { Container, Halo } from "@/components/site/layout";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "Components",
  "Browse Pinky UI's interactive components and interaction primitives.",
  "/components",
);

export default function ComponentsPage() {
  return (
    <div className="relative overflow-hidden pt-16 pb-20 sm:pt-20">
      <Halo className="-top-40 left-[-10rem] size-[30rem]" />
      <Halo className="-top-24 right-[-8rem] size-[26rem]" color="var(--pinky-halo-b)" />

      <Container>
        <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-ink-500 uppercase">
          Component library
        </p>
        <h1 className="mt-5 max-w-2xl text-section text-balance-tight">Explore interactions</h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-700 sm:text-lg">
          Filter by what a component is, or by how it feels. Previews are live — try them here
          before you open the detail page.
        </p>

        <ComponentGallery />
      </Container>
    </div>
  );
}
