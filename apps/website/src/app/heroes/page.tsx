import type { Metadata } from "next";

import { ExperiencesShowcase } from "@/components/experiences/experiences-showcase";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "Heroes",
  "Reusable hero experiences with one intentional signature interaction.",
  "/heroes",
);

export default function HeroesPage() {
  return <ExperiencesShowcase family="heroes" />;
}
