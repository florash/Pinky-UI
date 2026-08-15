import type { Metadata } from "next";

import { DiscoveryBrowser } from "@/components/explore/discovery-browser";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "Explore",
  "A curated wall of Pinky UI interactions, followed by the complete reference.",
  "/explore",
);

export default function ExplorePage() {
  return (
    <main id="main">
      <header className="mx-auto max-w-[76rem] px-5 pt-10 pb-2 sm:px-8 sm:pt-14">
        <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-ink-500 uppercase">
          Explore · curated reference
        </p>
        <h1 className="mt-4 max-w-3xl text-section text-balance-tight">
          A reference wall for interaction.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-700 sm:text-lg">
          Start with the pieces that define Pinky UI. Keep scrolling when you want the full system,
          organised by the way an interaction behaves.
        </p>
      </header>
      <DiscoveryBrowser />
    </main>
  );
}
