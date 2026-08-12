import { primitives } from "@pinky/registry";
import type { Metadata } from "next";

import { CodeBlock } from "@/components/site/code-block";
import { Container, Halo } from "@/components/site/layout";

export const metadata: Metadata = {
  title: "Primitives",
  description: "The small reusable behaviours underneath Pinky UI's components and systems.",
};

export default function PrimitivesPage() {
  return (
    <div className="relative overflow-hidden pt-16 pb-20 sm:pt-20">
      <Halo className="-top-40 left-[-10rem] size-[28rem]" />
      <Halo className="-top-24 right-[-8rem] size-[24rem]" color="var(--pinky-halo-b)" />
      <Container>
        <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-ink-500 uppercase">Primitive vocabulary</p>
        <h1 className="mt-5 max-w-2xl text-section text-balance-tight">Small behaviours. Shared everywhere.</h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-700 sm:text-lg">
          Primitives are the mechanics beneath the library: pointer proximity, morphing surfaces,
          press springs and depth. Components compose them; they should not invent a second motion language.
        </p>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {primitives.map((primitive) => (
            <article key={primitive.slug} className="rounded-[24px] border border-line bg-white/75 p-5 shadow-soft">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-lg font-semibold tracking-tight">{primitive.name}</h2>
                <span className="rounded-pill border border-line px-2 py-1 font-mono text-[0.6rem] text-ink-500">{primitive.status}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-700">{primitive.description}</p>
              <CodeBlock className="mt-5" code={primitive.usage} label="usage" />
            </article>
          ))}
        </div>
      </Container>
    </div>
  );
}
