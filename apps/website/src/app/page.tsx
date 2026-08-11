import { CodeSection } from "@/components/home/code-section";
import { Featured } from "@/components/home/featured";
import { Feelings } from "@/components/home/feelings";
import { Hero } from "@/components/home/hero";
import { LayoutsSection } from "@/components/home/layouts-section";
import { OpenSourceCta } from "@/components/home/open-source-cta";
import { PlaygroundPreview } from "@/components/home/playground-preview";
import { PrimitivesBento } from "@/components/home/primitives-bento";
import { SkillsTeaser } from "@/components/home/skills-teaser";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Feelings />
      <Featured />
      <LayoutsSection />
      <PrimitivesBento />
      <CodeSection />
      <PlaygroundPreview />
      <SkillsTeaser />
      <OpenSourceCta />
    </>
  );
}
