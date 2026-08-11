import type { Metadata } from "next";

import { ExperiencesShowcase } from "@/components/experiences/experiences-showcase";

export const metadata: Metadata = { title: "Spatial", description: "Readable CSS-and-Motion depth patterns that flatten gracefully." };

export default function SpatialPage() {
  return <ExperiencesShowcase family="spatial" />;
}
