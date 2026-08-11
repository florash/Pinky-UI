import { primitives, readyComponents } from "@pinky/registry";
import type { Metadata } from "next";
import Link from "next/link";

import { CodeBlock } from "@/components/site/code-block";
import { Container, Halo } from "@/components/site/layout";

export const metadata: Metadata = {
  title: "Docs",
  description: "How Pinky UI is built, how to use it today, and the rules its motion follows.",
};

const COMPOSITION = `import { Magnetic, Jelly } from "@pinky/primitives";

<Magnetic strength={0.4}>
  <Jelly elasticity={0.35}>
    <Card />
  </Jelly>
</Magnetic>`;

const MOTION_RULES = [
  {
    title: "Motion responds, it does not perform",
    body: "Animation answers a pointer, a focus, a state change or a navigation. Continuous ambient animation with no cause is not used.",
  },
  {
    title: "Small movement, strong perception",
    body: "Hover translation stays at or under 8px, scale at or under 1.04, rotation at or under 4°. Primitives clamp their own output rather than trusting the caller.",
  },
  {
    title: "Springs, not long easings",
    body: "Every component reaches into one shared spring vocabulary — soft, snappy, glide, jelly, subtle — so unrelated parts of a page feel related.",
  },
  {
    title: "Reduced motion is a first-class state",
    body: "Every component branches on prefers-reduced-motion and renders a complete, static, fully usable version. Nothing is hidden or broken by turning motion off.",
  },
  {
    title: "No layout instability",
    body: "Interaction effects are transforms, opacity and CSS variables. Nothing an interaction does can move the elements around it.",
  },
];

export default function DocsPage() {
  return (
    <div className="relative overflow-hidden pt-16 pb-20 sm:pt-20">
      <Halo className="-top-40 left-[-10rem] size-[28rem]" />

      <Container>
        <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-ink-500 uppercase">Docs</p>
        <h1 className="mt-5 max-w-2xl text-section text-balance-tight">Get started</h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-700 sm:text-lg">
          Pinky UI is early. This page describes exactly what exists today and how to use it — no
          more than that.
        </p>

        <div className="mt-16 grid gap-16 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-12">
          <div className="flex flex-col gap-16">
            <Section title="Installation" id="installation">
              <p className="text-sm leading-relaxed text-ink-700">
                There is no npm package and no CLI yet. Nothing on this site should suggest
                otherwise. To use a component today, copy its file and the primitives it is built
                on into your project — they depend only on React 19 and Motion 12.
              </p>
              <CodeBlock
                className="mt-5"
                copy={false}
                label="requirements"
                code={`react       >= 19
motion      >= 12
tailwindcss >= 4   // for the shipped class names`}
              />
            </Section>

            <Section title="Composition" id="composition">
              <p className="text-sm leading-relaxed text-ink-700">
                Primitives own one behaviour each and pass everything else through, so they stack.
                A component is a composition someone made for you; you can always make your own.
              </p>
              <CodeBlock className="mt-5" code={COMPOSITION} label="composition" />
            </Section>

            <Section title="Motion rules" id="motion">
              <div className="flex flex-col gap-6">
                {MOTION_RULES.map((rule, index) => (
                  <div key={rule.title} className="flex gap-5">
                    <span className="font-mono text-xs text-ink-500">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-display text-base font-semibold tracking-tight">
                        {rule.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-700">{rule.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Accessibility" id="accessibility">
              <p className="text-sm leading-relaxed text-ink-700">
                Effects never replace semantics. Buttons are buttons, tabs implement the ARIA tabs
                pattern, decorative light is <code className="font-mono text-xs">aria-hidden</code>{" "}
                and non-interactive, and every pointer-driven effect has a state it degrades to for
                keyboard, touch and reduced-motion users.
              </p>
            </Section>

            <Section title="Theming" id="theming">
              <p className="text-sm leading-relaxed text-ink-700">
                Three light environments — milk, blush and cloud — retint the page atmosphere and
                the accent. They are not three design systems: components read the same tokens in
                all of them. Switch between them with the control in the header.
              </p>
            </Section>

            <Section title="Status" id="status">
              <p className="text-sm leading-relaxed text-ink-700">
                Implemented today: {readyComponents().length} components and{" "}
                {primitives.filter((entry) => entry.status === "ready").length} primitives. The
                remaining V1 items are marked <em>in progress</em> everywhere they appear, and are
                not documented until they exist.
              </p>
            </Section>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="font-mono text-[0.6875rem] tracking-[0.14em] text-ink-500 uppercase">
              Ready components
            </p>
            <ul className="mt-3 flex flex-col gap-2">
              {readyComponents().map((entry) => (
                <li key={entry.slug}>
                  <Link
                    href={`/components/${entry.slug}`}
                    className="text-sm text-ink-700 transition-colors hover:text-ink-900"
                  >
                    {entry.name}
                  </Link>
                </li>
              ))}
            </ul>

            <p className="mt-8 font-mono text-[0.6875rem] tracking-[0.14em] text-ink-500 uppercase">
              Primitives
            </p>
            <ul className="mt-3 flex flex-col gap-2">
              {primitives.map((entry) => (
                <li key={entry.slug} className="flex items-center gap-2 text-sm text-ink-700">
                  {entry.name}
                  {entry.status === "in-progress" ? (
                    <span className="font-mono text-[0.625rem] tracking-[0.1em] text-ink-500 uppercase">
                      soon
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </Container>
    </div>
  );
}

function Section({
  title,
  id,
  children,
}: {
  title: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id}>
      <h2 className="font-display text-xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}
