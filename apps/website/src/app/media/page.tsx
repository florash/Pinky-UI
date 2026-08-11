import type { Metadata } from "next";

import { SystemsShowcase } from "@/components/systems/systems-showcase";

export const metadata: Metadata = { title: "Media", description: "Media inspection, comparison and persistent playback interactions." };
export default function MediaPage() { return <SystemsShowcase family="media" />; }
