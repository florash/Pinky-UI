import type { Metadata } from "next";

import { ExperiencesShowcase } from "@/components/experiences/experiences-showcase";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "Experiences",
  "Navigation, heroes, ambient backgrounds, transitions and spatial UI built from Pinky's shared interaction systems.",
  "/experiences",
);

export default function ExperiencesPage() {
  return <ExperiencesShowcase />;
}
