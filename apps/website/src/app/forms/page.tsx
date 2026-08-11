import type { Metadata } from "next";

import { SystemsShowcase } from "@/components/systems/systems-showcase";

export const metadata: Metadata = { title: "Forms", description: "Tactile product controls that preserve native labels, focus and precision." };
export default function FormsPage() { return <SystemsShowcase family="forms" />; }
