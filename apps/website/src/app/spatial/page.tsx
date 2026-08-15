import type { Metadata } from "next";

import { ExperiencesShowcase } from "@/components/experiences/experiences-showcase";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "Spatial",
  "Readable CSS-and-Motion depth patterns that flatten gracefully.",
  "/spatial",
);

export default function SpatialPage() {
  return <ExperiencesShowcase family="spatial" />;
}
