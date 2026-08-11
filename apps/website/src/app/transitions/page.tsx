import type { Metadata } from "next";

import { ExperiencesShowcase } from "@/components/experiences/experiences-showcase";

export const metadata: Metadata = { title: "Transitions", description: "Focus-aware content and page transitions with immediate reduced-motion fallbacks." };

export default function TransitionsPage() {
  return <ExperiencesShowcase family="transitions" />;
}
