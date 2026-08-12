import type { Metadata } from "next";

import { ControlWall } from "@/components/controls/control-wall";

export const metadata: Metadata = {
  title: "Controls",
  description:
    "Eight tactile button constructions and the Pinky depth scale they are built from — every specimen live on the page.",
};

export default function ControlsPage() {
  return <ControlWall />;
}
