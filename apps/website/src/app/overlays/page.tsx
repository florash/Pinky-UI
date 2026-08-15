import type { Metadata } from "next";

import { SystemsShowcase } from "@/components/systems/systems-showcase";

export const metadata: Metadata = {
  title: "Overlays · Pinky UI",
  description: "Anchored, contextual and spatial surfaces for real product interfaces.",
};

export default function OverlaysPage() {
  return <SystemsShowcase family="overlays" />;
}
