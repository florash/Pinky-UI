import { Hero } from "@/components/home/hero";
import { FeaturedInteractionWall } from "@/components/home/featured-interaction-wall";
import { LayoutsSection } from "@/components/home/layouts-section";
import { OpenSourceCta } from "@/components/home/open-source-cta";
import { PlaygroundPreview } from "@/components/home/playground-preview";
import { PrimitivesBento } from "@/components/home/primitives-bento";
import { SkillsTeaser } from "@/components/home/skills-teaser";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedInteractionWall />
      <LayoutsSection />
      <PrimitivesBento />
      <PlaygroundPreview />
      <SkillsTeaser />
      <OpenSourceCta />
    </>
  );
}
