import type { Metadata } from "next";

import { WorkflowShowcase } from "@/components/workflows/workflow-showcase";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "Product workflows",
  "Pinky UI feedback, search, loading, list, reorder, onboarding and mobile interaction systems.",
  "/workflows",
);
export default function WorkflowsPage() { return <WorkflowShowcase />; }
