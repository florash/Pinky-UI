import type { Metadata } from "next";

import { Playground } from "@/components/playground/playground";
import { Container, Halo } from "@/components/site/layout";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "Playground",
  "Tune Pinky UI interactions and take the generated code with you.",
  "/playground",
);

export default function PlaygroundPage() {
  return (
    <div className="relative overflow-hidden pt-16 pb-20 sm:pt-20">
      <Halo className="-top-40 left-[-10rem] size-[28rem]" />

      <Container>
        <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-ink-500 uppercase">
          Playground
        </p>
        <h1 className="mt-5 max-w-2xl text-section text-balance-tight">Tune every interaction.</h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-700 sm:text-lg">
          Physics first, code second. Adjust the parameters, feel the difference, then copy the
          exact configuration you landed on.
        </p>

        <Playground className="mt-14" />

        <p className="mt-10 max-w-xl rounded-lg px-5 py-4 text-sm leading-relaxed text-ink-500 ring-1 ring-line/60 ring-dashed">
          Tune four core components. Controls are named for the feeling they produce rather than
          for stiffness and damping — the physics is the implementation, not the interface.
        </p>
      </Container>
    </div>
  );
}
