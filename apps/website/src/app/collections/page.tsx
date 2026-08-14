import type { Metadata } from "next";

import { CollectionsShowcase } from "@/components/collections/collections-showcase";

export const metadata: Metadata = {
  title: "Collections",
  description: "Content browsing systems with direct previews, inline detail and spatial continuity.",
};

export default function CollectionsPage() {
  return <CollectionsShowcase />;
}
