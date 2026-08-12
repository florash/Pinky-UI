import type { Metadata } from "next";

import { LayoutGallery } from "@/components/gallery/layout-gallery";
import { Container, Halo } from "@/components/site/layout";
import { resolveLayoutFamily, type PublicLayoutFamily } from "@/lib/site";

export const metadata: Metadata = {
  title: "Layouts",
  description:
    "Galleries, grids, stacks and carousels where the arrangement itself is the interaction.",
};

type LayoutsPageProps = {
  searchParams: Promise<{ family?: string | string[] }>;
};

export default async function LayoutsPage({ searchParams }: LayoutsPageProps) {
  const params = await searchParams;
  const requestedFamily = typeof params.family === "string" ? params.family : "all";
  const initialFamily = resolveLayoutFamily(requestedFamily) as PublicLayoutFamily | "all";

  return (
    <div className="relative overflow-hidden pt-16 pb-20 sm:pt-20">
      <Halo className="-top-40 left-[-10rem] size-[30rem]" />
      <Halo className="-top-24 right-[-8rem] size-[26rem]" color="var(--pinky-halo-b)" />

      <Container>
        <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-ink-500 uppercase">
          Layout library
        </p>
        <h1 className="mt-5 max-w-2xl text-section text-balance-tight">Explore layouts</h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-700 sm:text-lg">
          Ways to arrange many things, where the arrangement is the interaction. Every demo below
          is live — drag the stack, focus a photo, unpack the pile.
        </p>

        <LayoutGallery initialFamily={initialFamily} />
      </Container>
    </div>
  );
}
