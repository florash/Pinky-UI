import type { Metadata } from "next";

import { SystemsShowcase } from "@/components/systems/systems-showcase";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "Overlays",
  "Anchored, contextual and spatial surfaces for real product interfaces.",
  "/overlays",
);

export default function OverlaysPage() {
  return <SystemsShowcase family="overlays" />;
}
