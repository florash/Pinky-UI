import type { Metadata } from "next";

import { ControlWall } from "@/components/controls/control-wall";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "Controls",
  "Eight tactile button constructions and the Pinky depth scale they are built from — every specimen live on the page.",
  "/controls",
);

export default function ControlsPage() {
  return <ControlWall />;
}
