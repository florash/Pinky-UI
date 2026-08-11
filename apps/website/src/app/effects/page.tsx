import type { Metadata } from "next";

import { EffectsShowcase } from "@/components/effects/effects-showcase";

export const metadata: Metadata = {
  title: "Effects",
  description: "Cursor, motion, text and scroll effects for interfaces that feel alive.",
};

export default function EffectsPage() {
  return <EffectsShowcase />;
}
