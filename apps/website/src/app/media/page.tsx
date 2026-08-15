import type { Metadata } from "next";

import { SystemsShowcase } from "@/components/systems/systems-showcase";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "Media",
  "Media inspection, comparison and persistent playback interactions.",
  "/media",
);
export default function MediaPage() { return <SystemsShowcase family="media" />; }
