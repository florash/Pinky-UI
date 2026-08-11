import type { Metadata } from "next";

import { ExperiencesShowcase } from "@/components/experiences/experiences-showcase";

export const metadata: Metadata = {
  title: "Experiences",
  description: "Navigation, Heroes, ambient backgrounds, transitions and spatial UI built from Pinky's shared interaction systems.",
};

export default function ExperiencesPage() {
  return <ExperiencesShowcase />;
}
