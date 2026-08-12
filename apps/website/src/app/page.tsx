import { ExploreRail } from "@/components/home/explore-rail";
import { Hero } from "@/components/home/hero";
import { LayoutsSection } from "@/components/home/layouts-section";
import { OpenSourceCta } from "@/components/home/open-source-cta";
import { SignatureInteractions } from "@/components/home/signature-interactions";
import { SkillsTeaser } from "@/components/home/skills-teaser";

/**
 * The homepage is a curation, not a catalogue.
 *
 * It runs dense (signature interactions) → quiet (a line of text and a rail)
 * → medium (layouts and systems) → quiet again, so the page has a rhythm
 * instead of one uniform grid. Everything it leaves out is in Explore.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <SignatureInteractions />
      <ExploreRail />
      <LayoutsSection />
      <SkillsTeaser />
      <OpenSourceCta />
    </>
  );
}
