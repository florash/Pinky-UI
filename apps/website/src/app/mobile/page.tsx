import type { Metadata } from "next";

import { MobileShowcase } from "@/components/mobile/mobile-showcase";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "Mobile-first UI",
  "A curated mobile-first interaction wall with live navigation, input, selection, auth, screens and flows.",
  "/mobile",
);

export default function MobilePage() {
  return <MobileShowcase />;
}
