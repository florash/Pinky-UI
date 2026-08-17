import type { Metadata } from "next";

import { AiShowcase } from "@/components/ai/ai-showcase";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "AI",
  "Streaming text, thinking states, tool calls and a chat composer — motion for the interfaces everyone is building right now.",
  "/ai",
);

export default function AiPage() {
  return <AiShowcase />;
}
