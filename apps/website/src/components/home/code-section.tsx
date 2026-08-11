"use client";

import { JellyCard, MagneticButton } from "@pinky/components";

import { CodeBlock } from "@/components/site/code-block";
import { Container, Section, SectionHeading } from "@/components/site/layout";

const USAGE = `<JellyCard
  elasticity={0.35}
  intensity={0.18}
>
  <ProfileCard />
</JellyCard>`;

const INSTALL = `// Copy the component and its primitives into your project.
// packages/components/src/cards/jelly-card.tsx
// packages/primitives/src/jelly/jelly.tsx`;

export function CodeSection() {
  return (
    <Section id="code">
      <Container>
        <SectionHeading
          eyebrow="API"
          title="Beautiful outside. Simple inside."
          description="An expressive surface should not cost you a complicated API. Two numbers describe the character of the whole interaction."
        />

        <div className="mt-14 grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div className="flex min-h-[24rem] items-center justify-center rounded-xl border border-line bg-milk/60 p-8">
            <JellyCard className="w-full max-w-md" radius="2xl">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="font-mono text-[0.6875rem] tracking-[0.14em] text-ink-500 uppercase">
                    Profile
                  </p>
                  <p className="mt-3 font-display text-xl font-semibold tracking-tight">
                    Mira Odaka
                  </p>
                  <p className="mt-1 text-sm text-ink-500">Interaction designer, Kyoto</p>
                </div>
                <span
                  aria-hidden
                  className="size-14 shrink-0 rounded-2xl"
                  style={{
                    background:
                      "linear-gradient(140deg, var(--color-blush-200), var(--color-cloud-200))",
                  }}
                />
              </div>
              <p className="mt-6 text-sm leading-relaxed text-ink-700">
                Designs interfaces that respond to touch the way physical things do.
              </p>
              <div className="mt-7">
                <MagneticButton size="sm" variant="soft">
                  Follow
                </MagneticButton>
              </div>
            </JellyCard>
          </div>

          <div className="flex flex-col gap-4">
            <CodeBlock code={USAGE} label="usage" />
            <CodeBlock code={INSTALL} label="install" copy={false} className="bg-milk/70" />
            <p className="rounded-lg border border-dashed border-line px-4 py-3 text-xs leading-relaxed text-ink-500">
              A registry-backed CLI (<code className="font-mono">npx pinky-ui add jelly-card</code>)
              is designed for but not built yet. Until it exists, copying the component and its
              primitives is the supported path.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
