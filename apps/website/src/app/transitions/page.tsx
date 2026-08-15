import type { Metadata } from "next";

import { ExperiencesShowcase } from "@/components/experiences/experiences-showcase";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "Transitions",
  "Focus-aware content and page transitions with immediate reduced-motion fallbacks.",
  "/transitions",
);

export default function TransitionsPage() {
  return <ExperiencesShowcase family="transitions" />;
}
