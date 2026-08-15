import type { Metadata } from "next";

import { EffectsShowcase } from "@/components/effects/effects-showcase";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "Effects",
  "Cursor, motion, text and scroll effects for interfaces that feel alive.",
  "/effects",
);

export default function EffectsPage() {
  return <EffectsShowcase />;
}
