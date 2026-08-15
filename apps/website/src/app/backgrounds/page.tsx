import type { Metadata } from "next";

import { ExperiencesShowcase } from "@/components/experiences/experiences-showcase";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "Backgrounds",
  "Restrained ambient backgrounds for real interface content.",
  "/backgrounds",
);

export default function BackgroundsPage() {
  return <ExperiencesShowcase family="backgrounds" />;
}
