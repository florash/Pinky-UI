import {
  allEffects,
  allExperiences,
  allProductSystems,
  allWorkflowSystems,
  components,
  layouts,
  primitives,
  readyComponents,
} from "@pinky/registry";
import type { Metadata } from "next";
import Link from "next/link";

import { DocsLivePreview } from "@/components/docs/docs-live-preview";
import { CodeBlock } from "@/components/site/code-block";
import { Container, Halo } from "@/components/site/layout";

/** Derived, never hand-counted — stale totals are how a catalogue starts lying. */
const TOTAL_ITEMS =
  components.length +
  primitives.length +
  layouts.length +
  allEffects.length +
  allExperiences.length +
  allProductSystems.length +
  allWorkflowSystems.length;

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
        <header className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
          <div>
            <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-ink-500 uppercase">Docs · a calm starting point</p>
            <h1 className="mt-5 max-w-2xl text-section text-balance-tight">Get started with the interaction in view.</h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-700 sm:text-lg">
              This page describes the public catalogue and how to use it — with the interaction in view.
            </p>
          </div>
          <nav aria-label="Docs sections" className="rounded-[22px] border border-line bg-white/70 p-5 shadow-soft">
            <p className="font-mono text-[0.625rem] tracking-[0.14em] text-ink-500 uppercase">On this page</p>
            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-ink-700">
              {["installation", "composition", "motion", "accessibility", "theming", "status"].map((id) => (
                <li key={id}><a href={`#${id}`} className="inline-flex min-h-10 items-center capitalize underline decoration-line-strong underline-offset-4 hover:text-ink-900 sm:min-h-0">{id}</a></li>
              ))}
            </ul>
          </nav>
        </header>

        <div className="mt-16 grid min-w-0 gap-16 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-12">
          <div className="flex min-w-0 flex-col gap-16">
            <Section title="Installation" id="installation">
              <p className="text-sm leading-relaxed text-ink-700">
                To use a component, copy its file and the primitives it is built on into your
                project — they depend only on React 19 and Motion 12.
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
              <div className="mt-5">
                <p className="mb-3 font-mono text-[0.625rem] tracking-[0.14em] text-ink-500 uppercase">Live composition</p>
                <DocsLivePreview />
              </div>
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
                Public catalogue: {readyComponents().length} components,{" "}
                {primitives.filter((entry) => entry.status === "ready").length} primitives,{" "}
                {layouts.length} layouts, {allEffects.length} effects, {allExperiences.length}{" "}
                experiences and {allProductSystems.length + allWorkflowSystems.length} product and
                workflow systems — {TOTAL_ITEMS} in all. Everything listed on this site is
                implemented and importable; nothing is documented before it exists.
              </p>
            </Section>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="font-mono text-[0.6875rem] tracking-[0.14em] text-ink-500 uppercase">Reference</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-700">The docs explain the system; the live catalogue is where each interaction can be tried.</p>
            <Link href="/explore" className="mt-4 inline-flex text-sm font-medium text-ink-700 underline decoration-line-strong underline-offset-4 hover:text-ink-900">Open the interaction wall →</Link>

            <p className="mt-10 font-mono text-[0.6875rem] tracking-[0.14em] text-ink-500 uppercase">
              Ready components
            </p>
            <ul className="mt-3 flex flex-col gap-2">
              {readyComponents().map((entry) => (
                <li key={entry.slug}>
                  <Link
                    href={`/components/${entry.slug}`}
                    className="inline-flex min-h-9 items-center text-sm text-ink-700 transition-colors hover:text-ink-900 sm:min-h-0"
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
              {primitives.filter((entry) => entry.status === "ready").map((entry) => (
                <li key={entry.slug} className="flex items-center gap-2 text-sm text-ink-700">
                  {entry.name}
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
    <section id={id} className="min-w-0">
      <h2 className="font-display text-xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}
