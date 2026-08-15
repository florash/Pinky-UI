import type { Metadata } from "next";

import { SystemsShowcase } from "@/components/systems/systems-showcase";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "Forms",
  "Tactile product controls that preserve native labels, focus and precision.",
  "/forms",
);
export default function FormsPage() { return <SystemsShowcase family="forms" />; }
