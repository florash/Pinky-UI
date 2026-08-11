import type { Metadata } from "next";

import { ExperiencesShowcase } from "@/components/experiences/experiences-showcase";

export const metadata: Metadata = { title: "Navigation", description: "Expressive, semantic navigation and menu patterns." };

export default function NavigationPage() {
  return <ExperiencesShowcase family="navigation" />;
}
