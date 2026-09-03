import type { Preset, PropDef } from "@pinky-ui/registry";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ExploreDetailPreview } from "@/components/previews/explore-previews";
import { hasExplorePreview } from "@/components/previews/preview-manifest";
import { Markdown } from "@/components/skills/markdown";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CodeBlock } from "@/components/site/code-block";
import { FamilyLinks } from "@/components/site/family-links";
import { InstallTabs } from "@/components/site/install-tabs";
import { Container, Halo } from "@/components/site/layout";
import { l1ForHref } from "@/config/navigation";
import type { SkillKind } from "@/lib/skills";

export type RegistryDetailRecord = {
  slug: string;
  name: string;
  description: string;
  familyLabel: string;
  collectionHref: string;
  collectionLabel: string;
  status?: string;
  tags: string[];
  builtOn: string[];
  importPath: string;
  usage: string;
  props: PropDef[];
  presets: Preset[];
  accessibility: string[];
  reducedMotion: string;
  performance: string[];
  whenToUse: string[];
  whenNotToUse: string[];
  related: Array<{ slug: string; name: string; href: string }>;
  /** A guaranteed same-family list, independent of the curated `related` set. */
  sameFamily?: Array<{ slug: string; name: string; href: string }>;
  discovery?: {
    role: "canonical" | "solid" | "preset" | "secondary" | "legacy";
    note?: string;
    canonical?: { name: string; href: string };
  };
  skill?: { kind: SkillKind; slug: string; body: string } | null;
};

export function RegistryDetailPage({ entry }: { entry: RegistryDetailRecord }) {
  if (entry.status !== undefined && entry.status !== "ready") notFound();

  const packageName = entry.importPath.match(/@pinky-ui\/[\w-]+/)?.[0] ?? "@pinky-ui/components";
  const l1 = l1ForHref(entry.collectionHref);
  const trail = l1 && l1.href !== entry.collectionHref
    ? [l1, { href: entry.collectionHref, label: entry.collectionLabel }]
    : [{ href: entry.collectionHref, label: entry.collectionLabel }];

  return (
    <article className="relative overflow-hidden pt-10 pb-20">
      <Halo className="-top-40 right-[-12rem] size-[28rem]" color="var(--pinky-halo-b)" />

      <Container>
        <Breadcrumbs trail={trail} current={entry.name} />

        <header className="mt-8 max-w-2xl">
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-ink-500 uppercase">{entry.familyLabel}</p>
          </div>
          <h1 className="mt-4 text-section text-balance-tight">{entry.name}</h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-700">{entry.description}</p>
          <ul className="mt-6 flex flex-wrap gap-1.5">
            {[entry.familyLabel, ...entry.tags].filter((tag, index, values) => values.indexOf(tag) === index).map((tag) => (
              <li key={tag} className="rounded-pill border border-line px-2.5 py-1 font-mono text-[0.625rem] tracking-[0.08em] text-ink-500 uppercase">
                {tag}
              </li>
            ))}
          </ul>
          {entry.discovery && (entry.discovery.role !== "canonical" || entry.discovery.note) ? (
            <div className="mt-6 rounded-2xl border border-line bg-white/70 px-4 py-3 text-sm leading-relaxed text-ink-700">
              <span className="font-mono text-[0.625rem] tracking-[0.14em] text-ink-500 uppercase">
                {entry.discovery.role === "preset" ? "Variation of" : entry.discovery.role === "legacy" ? "Earlier route" : "Related pattern"}
              </span>
              <p className="mt-1">
                {entry.discovery.note ?? `${entry.name} remains available as a ${entry.discovery.role} entry.`}
                {entry.discovery.canonical ? (
                  <>
                    {" "}
                    <Link href={entry.discovery.canonical.href} className="font-medium text-ink-900 underline decoration-line-strong underline-offset-4">
                      Open {entry.discovery.canonical.name}
                    </Link>
                  </>
                ) : null}
              </p>
            </div>
          ) : null}
        </header>

        {hasExplorePreview(entry.slug) ? (
          <section aria-labelledby="live-preview" className="mt-12">
            <h2 id="live-preview" className="sr-only">Live preview</h2>
            <div className="flex min-h-[16rem] items-center justify-center overflow-hidden rounded-[28px] border border-line bg-white/75 p-5 shadow-soft sm:min-h-[18rem] sm:p-8">
              <ExploreDetailPreview slug={entry.slug} />
            </div>
          </section>
        ) : null}

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
                      <div key={preset.name} className="rounded-xl border border-line bg-white/70 p-4">
                        <p className="text-sm font-medium">{preset.name}</p>
                        <p className="mt-1 text-sm leading-relaxed text-ink-700">{preset.description}</p>
                        <p className="mt-3 font-mono text-xs text-ink-500">
                          {Object.entries(preset.props).map(([key, value]) => `${key}={${JSON.stringify(value)}}`).join(" ") || "Default behaviour"}
                        </p>
                      </div>
                    ))}
                  </div>
                </Block>
              ) : null}

              <Block title="Install" id="installation">
                <p className="text-sm leading-relaxed text-ink-700">
                  Add <code className="font-mono text-xs">{packageName}</code> as a dependency, or use the CLI to
                  copy this component&apos;s source directly into your project — no dependency to manage, fully editable.
                </p>
                <InstallTabs className="mt-4" packageName={packageName} slug={entry.slug} />
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

              {entry.props.length > 0 ? (
                <Block title="Props" id="props">
                  <div className="overflow-x-auto rounded-xl border border-line">
                    <table className="w-full min-w-[36rem] text-left text-sm">
                      <thead className="bg-white/70">
                        <tr className="border-b border-line"><Th>Prop</Th><Th>Type</Th><Th>Default</Th><Th>Description</Th></tr>
                      </thead>
                      <tbody>
                        {entry.props.map((prop) => (
                          <tr key={prop.name} className="border-b border-line last:border-b-0">
                            <td className="px-4 py-3 font-mono text-xs whitespace-nowrap text-ink-900">{prop.name}</td>
                            <td className="px-4 py-3 font-mono text-xs text-code-tag">{prop.type}</td>
                            <td className="px-4 py-3 font-mono text-xs text-ink-500">{prop.defaultValue ?? "—"}</td>
                            <td className="px-4 py-3 leading-relaxed text-ink-700">{prop.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Block>
              ) : null}

              <Block title="Accessibility" id="accessibility"><Bullets items={entry.accessibility} /></Block>
              {entry.performance.length > 0 ? <Block title="Performance" id="performance"><Bullets items={entry.performance} /></Block> : null}
              <Block title="Reduced motion" id="reduced-motion"><p className="text-sm leading-relaxed text-ink-700">{entry.reducedMotion}</p></Block>

              <div className="grid gap-6 sm:grid-cols-2">
                <Block title="When to use"><Bullets items={entry.whenToUse} tone="good" /></Block>
                <Block title="When not to use"><Bullets items={entry.whenNotToUse} /></Block>
              </div>

              {entry.skill ? (
                <Block title="Skill" id="skill">
                  <div className="rounded-xl bg-white/70 p-6 ring-1 ring-line/60 sm:p-8">
                    <Markdown source={entry.skill.body} />
                    <Link href={`/skills/${entry.skill.kind}/${entry.skill.slug}`} className="mt-8 inline-flex text-sm text-ink-500 underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink-900">
                      Open this skill on its own page
                    </Link>
                  </div>
                </Block>
              ) : null}
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              {entry.builtOn.length > 0 ? (
                <>
                  <p className="font-mono text-[0.6875rem] tracking-[0.14em] text-ink-500 uppercase">Built on</p>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {entry.builtOn.map((name) => <li key={name} className="rounded-pill border border-line bg-white/70 px-2.5 py-1 font-mono text-xs text-ink-700">{name}</li>)}
                  </ul>
                </>
              ) : null}

              {entry.related.length > 0 ? (
                <>
                  <p className="mt-8 font-mono text-[0.6875rem] tracking-[0.14em] text-ink-500 uppercase">Related</p>
                  <ul className="mt-3 flex flex-col gap-2">
                    {entry.related.map((item) => <li key={item.slug}><Link href={item.href} className="text-sm text-ink-700 transition-colors hover:text-ink-900">{item.name}</Link></li>)}
                  </ul>
                </>
              ) : null}

              <FamilyLinks heading={`More in ${entry.collectionLabel}`} items={(entry.sameFamily ?? []).filter((item) => item.slug !== entry.slug)} />
            </aside>
          </div>
      </Container>
    </article>
  );
}

function Block({ title, id, children }: { title: string; id?: string; children: ReactNode }) {
  return <section id={id}><h2 className="font-display text-xl font-semibold tracking-tight">{title}</h2><div className="mt-5">{children}</div></section>;
}

function Bullets({ items, tone }: { items: string[]; tone?: "good" }) {
  return <ul className="flex flex-col gap-2.5">{items.map((item) => <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink-700"><span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-pill" style={{ background: tone === "good" ? "var(--color-cloud-300)" : "var(--color-blush-300)" }} />{item}</li>)}</ul>;
}

function Th({ children }: { children: ReactNode }) {
  return <th className="px-4 py-3 font-mono text-[0.6875rem] tracking-[0.14em] text-ink-500 uppercase">{children}</th>;
}
