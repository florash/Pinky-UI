import type { Metadata } from "next";

import { CollectionsShowcase } from "@/components/collections/collections-showcase";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "Collections",
  "Content browsing systems with direct previews, inline detail and spatial continuity.",
  "/collections",
);

export default function CollectionsPage() {
  return <CollectionsShowcase />;
}
