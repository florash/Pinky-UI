import type { Metadata } from "next";

import { WorkflowShowcase } from "@/components/workflows/workflow-showcase";

export const metadata: Metadata = { title: "Product workflows", description: "Pinky UI feedback, search, loading, list, reorder, onboarding and mobile interaction systems." };
export default function WorkflowsPage() { return <WorkflowShowcase />; }
