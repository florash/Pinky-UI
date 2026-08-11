import type { Metadata } from "next";

import { ExperiencesShowcase } from "@/components/experiences/experiences-showcase";

export const metadata: Metadata = { title: "Backgrounds", description: "Restrained ambient backgrounds for real interface content." };

export default function BackgroundsPage() {
  return <ExperiencesShowcase family="backgrounds" />;
}
