import { getLayout, layouts } from "@pinky/registry";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { LayoutPreview } from "@/components/previews/layout-previews";
import { hasLayoutPreview } from "@/components/previews/preview-manifest";
import { Markdown } from "@/components/skills/markdown";
import { CodeBlock } from "@/components/site/code-block";
import { Container, Halo } from "@/components/site/layout";
import { getSkill } from "@/lib/skills";
import { pageMetadata } from "@/lib/site";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return layouts.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getLayout(slug);
  if (!entry) return {};
  return pageMetadata(entry.name, entry.description, `/layouts/${entry.slug}`);
}

export default async function LayoutDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = getLayout(slug);
  if (!entry || entry.status !== "ready" || !hasLayoutPreview(entry.slug)) notFound();

  const skill = entry.skill ? await getSkill("layouts", entry.skill) : null;
  const related = entry.related.map(getLayout).filter((item) => item !== undefined);

  return (
    <article className="relative overflow-hidden pt-10 pb-20">
      <Halo className="-top-40 right-[-12rem] size-[28rem]" color="var(--pinky-halo-b)" />

      <Container>
        <nav aria-label="Breadcrumb" className="text-xs text-ink-500">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="transition-colors hover:text-ink-900">
                Pinky UI
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/layouts" className="transition-colors hover:text-ink-900">
                Layouts
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-ink-900">{entry.name}</li>
          </ol>
        </nav>

        <header className="mt-8 max-w-2xl">
          <h1 className="text-section text-balance-tight">{entry.name}</h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-700">{entry.description}</p>
          <ul className="mt-6 flex flex-wrap gap-1.5">
            {[entry.family, ...entry.tags].map((tag) => (
              <li
                key={tag}
                className="rounded-pill px-2.5 py-1 font-mono text-[0.625rem] tracking-[0.08em] text-ink-500 uppercase ring-1 ring-line"
              >
                {tag}
              </li>
            ))}
          </ul>
        </header>

        <div className="mt-12 flex min-h-[30rem] items-center justify-center rounded-2xl bg-milk/60 p-8 ring-1 ring-line/60">
          <LayoutPreview slug={entry.slug} />
        </div>

        <div className="mt-20 grid gap-16 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-12">
          <div className="flex flex-col gap-16">
            <Block title="Usage">
              <CodeBlock code={`${entry.importPath}\n\n${entry.usage}`} label="usage" />
            </Block>

            <Block title="Props">
              <div className="overflow-x-auto rounded-lg ring-1 ring-line">
                <table className="w-full min-w-[34rem] text-left text-sm">
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
                        <td className="px-4 py-3 font-mono text-xs whitespace-nowrap">{prop.name}</td>
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

            <Block title="Accessibility">
              <Bullets items={entry.accessibility} />
            </Block>

            <Block title="Performance">
              <Bullets items={entry.performance} />
            </Block>

            <Block title="Reduced motion">
              <p className="text-sm leading-relaxed text-ink-700">{entry.reducedMotion}</p>
            </Block>

            <div className="grid gap-6 sm:grid-cols-2">
              <Block title="When to use">
                <Bullets items={entry.whenToUse} tone="good" />
              </Block>
              <Block title="When not to use">
                <Bullets items={entry.whenNotToUse} />
              </Block>
            </div>

            {skill ? (
              <Block title="Skill">
                <div className="rounded-xl bg-white/70 p-6 ring-1 ring-line/60">
                  <Markdown source={skill.body} />
                  <Link
                    href={`/skills/layouts/${skill.slug}`}
                    className="mt-8 inline-flex text-sm text-ink-500 underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink-900"
                  >
                    Open this skill on its own page
                  </Link>
                </div>
              </Block>
            ) : null}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <Meta label="Item count">{entry.itemRange}</Meta>
            <Meta label="Mobile">{entry.mobile}</Meta>

            <p className="mt-8 font-mono text-[0.6875rem] tracking-[0.14em] text-ink-500 uppercase">
              Built on
            </p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {entry.builtOn.map((name) => (
                <li
                  key={name}
                  className="rounded-pill bg-white/70 px-2.5 py-1 font-mono text-xs text-ink-700 ring-1 ring-line"
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
                        href={`/layouts/${item.slug}`}
                        className="text-sm text-ink-700 transition-colors hover:text-ink-900"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </aside>
        </div>
      </Container>
    </article>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Bullets({ items, tone }: { items: string[]; tone?: "good" }) {
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

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <p className="font-mono text-[0.6875rem] tracking-[0.14em] text-ink-500 uppercase">{label}</p>
      <p className="mt-2 text-sm leading-relaxed text-ink-700">{children}</p>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 font-mono text-[0.6875rem] tracking-[0.14em] text-ink-500 uppercase">
      {children}
    </th>
  );
}
