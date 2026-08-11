import type { Metadata } from "next";

import { ExperiencesShowcase } from "@/components/experiences/experiences-showcase";

export const metadata: Metadata = { title: "Heroes", description: "Reusable Hero experiences with one intentional signature interaction." };

export default function HeroesPage() {
  return <ExperiencesShowcase family="heroes" />;
}
