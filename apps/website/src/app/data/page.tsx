import type { Metadata } from "next";

import { SystemsShowcase } from "@/components/systems/systems-showcase";

export const metadata: Metadata = { title: "Data", description: "Lightweight accessible data inspection and change patterns." };
export default function DataPage() { return <SystemsShowcase family="data" />; }
