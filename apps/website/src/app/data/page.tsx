import type { Metadata } from "next";

import { SystemsShowcase } from "@/components/systems/systems-showcase";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "Data",
  "Lightweight accessible data inspection and change patterns.",
  "/data",
);
export default function DataPage() { return <SystemsShowcase family="data" />; }
