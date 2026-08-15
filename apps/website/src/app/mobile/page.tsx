import type { Metadata } from "next";

import { MobileShowcase } from "@/components/mobile/mobile-showcase";

export const metadata: Metadata = {
  title: "Mobile-first UI · Pinky UI",
  description: "A curated mobile-first interaction wall with live navigation, input, selection, auth, screens and flows.",
};

export default function MobilePage() {
  return <MobileShowcase />;
}
