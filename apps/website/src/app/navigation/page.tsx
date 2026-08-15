import type { Metadata } from "next";

import { ExperiencesShowcase } from "@/components/experiences/experiences-showcase";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "Navigation",
  "Expressive, semantic navigation and menu patterns.",
  "/navigation",
);

export default function NavigationPage() {
  return <ExperiencesShowcase family="navigation" />;
}
