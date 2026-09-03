import { components, getComponent } from "@pinky-ui/registry";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PreviewPanel } from "@/components/gallery/preview-panel";
import { hasComponentPreview } from "@/components/previews/preview-manifest";
import { Markdown } from "@/components/skills/markdown";
import { getSkill } from "@/lib/skills";
import { Playground } from "@/components/playground/playground";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CodeBlock } from "@/components/site/code-block";
import { FamilyLinks } from "@/components/site/family-links";
import { InstallTabs } from "@/components/site/install-tabs";
import { Container, Halo } from "@/components/site/layout";
import { pageMetadata } from "@/lib/site";

type PageProps = { params: Promise<{ slug: string }> };

/** Components the playground has controls for. */
const PLAYABLE = ["jelly-card", "liquid-card", "magnetic-button", "tilt-card"];

export function generateStaticParams() {
  return components.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getComponent(slug);
  if (!entry) return {};

  return pageMetadata(entry.name, entry.description, `/components/${entry.slug}`);
}

export default async function ComponentDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = getComponent(slug);
  if (!entry || entry.status !== "ready" || !hasComponentPreview(entry.slug)) notFound();

  const related = entry.related.map(getComponent).filter((item) => item !== undefined);
  const sameFamily = components
    .filter((item) => item.category === entry.category && item.slug !== entry.slug)
    .slice(0, 4)
    .map((item) => ({ slug: item.slug, name: item.name, href: `/components/${item.slug}` }));
  // One source of truth: the same markdown the /skills route renders.
  const skill = entry.skill ? await getSkill("components", entry.skill) : null;

  return (
    <article className="relative overflow-hidden pt-10 pb-16">
      <Halo className="-top-40 right-[-12rem] size-[30rem]" color="var(--pinky-halo-b)" />

      <Container>
        <Breadcrumbs trail={[{ href: "/components", label: "Components" }]} current={entry.name} />

        <header className="mt-8 max-w-2xl">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-section text-balance-tight">{entry.name}</h1>
          </div>
          <p className="mt-5 text-lg leading-relaxed text-ink-700">{entry.description}</p>

          <ul className="mt-6 flex flex-wrap gap-1.5">
            {/* A tag can repeat the category or an interaction — Fluid Tabs is
                both in "navigation" and tagged "navigation". */}
            {[...new Set([entry.category, ...entry.interactions, ...entry.tags])].map((tag) => (
              <li
                key={tag}
                className="rounded-pill border border-line px-2.5 py-1 font-mono text-[0.625rem] tracking-[0.08em] text-ink-500 uppercase"
              >
                {tag}
              </li>
            ))}
          </ul>
        </header>

        <div className="mt-12">
          <PreviewPanel
            slug={entry.slug}
            code={entry.usage}
            skill={
              skill ? (
                <>
                  <Markdown source={skill.body} />
                  <Link
                    href={`/skills/components/${skill.slug}`}
                    className="mt-8 inline-flex text-sm text-ink-500 underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink-900"
                  >
                    Open this skill on its own page
                  </Link>
                </>
              ) : undefined
            }
          />
        </div>

        <div className="mt-10 max-w-3xl">
          <Block title="Quick usage" id="usage">
            <CodeBlock code={entry.importPath + "\n\n" + entry.usage} label="usage" />
          </Block>
        </div>

        <div className="mt-20 grid gap-16 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-12">
            {/* min-w-0: a grid item's default min-width is "auto" (its
                content's intrinsic width) — wide children below (code
                blocks, tables) were pushing this column past the viewport
                on mobile, clipped invisibly by an ancestor's overflow-hidden
                instead of wrapping/scrolling within their own bounds. */}
            <div className="flex min-w-0 flex-col gap-16">
              {entry.presets.length > 0 ? (
                <Block title="Presets" id="presets">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {entry.presets.map((preset) => (
                      <div key={preset.name} className="rounded-lg border border-line bg-white/70 p-4">
                        <p className="text-sm font-medium">{preset.name}</p>
                        <p className="mt-1 text-sm leading-relaxed text-ink-700">
                          {preset.description}
                        </p>
                        <p className="mt-3 font-mono text-xs text-ink-500">
                          {Object.entries(preset.props)
                            .map(([key, value]) => `${key}={${JSON.stringify(value)}}`)
                            .join(" ")}
                        </p>
                      </div>
                    ))}
                  </div>
                </Block>
              ) : null}

              <Block title="Install" id="installation">
                <p className="text-sm leading-relaxed text-ink-700">
                  Add <code className="font-mono text-xs">@pinky-ui/components</code> as a dependency, or use the CLI to
                  copy this component&apos;s source directly into your project — no dependency to manage, fully editable.
                </p>
                <InstallTabs className="mt-4" packageName="@pinky-ui/components" slug={entry.slug} />
                <p className="mt-4 text-sm leading-relaxed text-ink-700">
                  Prefer to run the whole repository locally instead?
                </p>
                <CodeBlock
                  className="mt-2"
                  copy={false}
                  label="repository"
                  code={"git clone https://github.com/florash/Pinky-UI.git\ncd Pinky-UI\nnpm install\nnpm run dev"}
                />
              </Block>

              <Block title="Props" id="props">
                <div className="overflow-x-auto rounded-lg border border-line">
                  <table className="w-full min-w-[36rem] text-left text-sm">
                    <thead className="bg-white/70">
                      <tr className="border-b border-line">
                        <Th>Prop</Th>
                        <Th>Type</Th>
                        <Th>Default</Th>
                        <Th>Description</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {entry.props.map((prop) => (
                        <tr key={prop.name} className="border-b border-line last:border-b-0">
                          <td className="px-4 py-3 font-mono text-xs whitespace-nowrap text-ink-900">
                            {prop.name}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-code-tag">{prop.type}</td>
                          <td className="px-4 py-3 font-mono text-xs text-ink-500">
                            {prop.defaultValue ?? "—"}
                          </td>
                          <td className="px-4 py-3 leading-relaxed text-ink-700">
                            {prop.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Block>

              <Block title="Accessibility" id="accessibility">
                <ul className="flex flex-col gap-2.5">
                  {entry.accessibility.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink-700">
                      <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-pill bg-blush-300" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Block>

              <Block title="Reduced motion" id="reduced-motion">
                <p className="text-sm leading-relaxed text-ink-700">{entry.reducedMotion}</p>
              </Block>

              <div className="grid gap-6 sm:grid-cols-2">
                <Block title="When to use">
                  <List items={entry.whenToUse} tone="good" />
                </Block>
                <Block title="When not to use">
                  <List items={entry.whenNotToUse} tone="bad" />
                </Block>
              </div>

              {/* Only for components the playground can actually configure. */}
              {PLAYABLE.includes(entry.slug) ? (
                <Block title="Playground" id="playground">
                  <Playground />
                </Block>
              ) : null}
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <p className="font-mono text-[0.6875rem] tracking-[0.14em] text-ink-500 uppercase">
                Built on
              </p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {entry.builtOn.map((name) => (
                  <li
                    key={name}
                    className="rounded-pill border border-line bg-white/70 px-2.5 py-1 font-mono text-xs text-ink-700"
                  >
                    {name}
                  </li>
                ))}
              </ul>

              {related.length > 0 ? (
                <>
                  <p className="mt-8 font-mono text-[0.6875rem] tracking-[0.14em] text-ink-500 uppercase">
                    Related
                  </p>
                  <ul className="mt-3 flex flex-col gap-2">
                    {related.map((item) => (
                      <li key={item.slug}>
                        <Link
                          href={`/components/${item.slug}`}
                          className="text-sm text-ink-700 transition-colors hover:text-ink-900"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}

              <FamilyLinks heading="More components" items={sameFamily} />
            </aside>
          </div>
      </Container>
    </article>
  );
}

function Block({
  title,
  id,
  children,
}: {
  title: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id}>
      <h2 className="font-display text-xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function List({ items, tone }: { items: string[]; tone: "good" | "bad" }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink-700">
          <span
            aria-hidden
            className="mt-2 size-1.5 shrink-0 rounded-pill"
            style={{
              background: tone === "good" ? "var(--color-cloud-300)" : "var(--color-blush-300)",
            }}
          />
          {item}
        </li>
      ))}
    </ul>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 font-mono text-[0.6875rem] tracking-[0.14em] text-ink-500 uppercase">
      {children}
    </th>
  );
}
