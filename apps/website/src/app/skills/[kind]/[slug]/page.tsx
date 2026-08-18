import { getComponent } from "@pinky-ui/registry";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";

import { CataloguePreview } from "@/components/skills/catalogue-preview";
import { Markdown } from "@/components/skills/markdown";
import { Container, Halo } from "@/components/site/layout";
import { KIND_LABEL, SKILL_KINDS, classifySkillPreview, getSkill, listSkills, skillPublicGroup, skillRouteAlias, type SkillKind } from "@/lib/skills";
import { pageMetadata } from "@/lib/site";

type PageProps = { params: Promise<{ kind: string; slug: string }> };

function isKind(value: string): value is SkillKind {
  return (SKILL_KINDS as readonly string[]).includes(value);
}

export async function generateStaticParams() {
  const groups = await Promise.all(
    SKILL_KINDS.map(async (kind) => {
      const skills = await listSkills(kind);
      return skills.map((skill) => ({ kind, slug: skill.slug }));
    }),
  );

  return groups.flat().concat(SKILL_KINDS.flatMap((kind) => {
    return kind === "motion" ? [{ kind, slug: "shared-morph" }] : [];
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { kind, slug } = await params;
  if (!isKind(kind)) return {};

  const alias = skillRouteAlias(kind, slug);
  if (alias) {
    const canonicalSkill = await getSkill(alias.kind, alias.slug);
    return canonicalSkill
      ? pageMetadata(`${canonicalSkill.title} — Skill`, canonicalSkill.summary, alias.to)
      : { alternates: { canonical: alias.to }, robots: { index: false, follow: false } };
  }

  const skill = await getSkill(kind, slug);
  if (!skill) return {};

  return pageMetadata(`${skill.title} — Skill`, skill.summary, `/skills/${kind}/${skill.slug}`);
}

export default async function SkillPage({ params }: PageProps) {
  const { kind, slug } = await params;
  const alias = skillRouteAlias(kind, slug);
  if (alias) permanentRedirect(alias.to);
  if (!isKind(kind)) notFound();

  const skill = await getSkill(kind, slug);
  if (!skill) notFound();

  // Component skills link back to the component they describe.
  const component = kind === "components" ? getComponent(slug) : undefined;

  return (
    <article className="relative overflow-hidden pt-10 pb-20">
      <Halo className="-top-40 right-[-12rem] size-[26rem]" color="var(--pinky-halo-b)" />

      <Container>
        <nav aria-label="Breadcrumb" className="text-xs text-ink-500">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <li>
              <Link href="/skills" className="transition-colors hover:text-ink-900">
                Skills
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>{skillPublicGroup(kind)} · {KIND_LABEL[kind]}</li>
            <li aria-hidden>/</li>
            <li className="min-w-0 break-words text-ink-900">{skill.title}</li>
          </ol>
        </nav>

        <header className="mt-8 max-w-2xl">
          <h1 className="text-section text-balance-tight">{skill.title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-700">{skill.summary}</p>

          {component ? (
            <Link
              href={`/components/${component.slug}`}
              className="mt-6 inline-flex items-center gap-2 rounded-pill bg-white px-4 py-2 text-sm text-ink-700 ring-1 ring-line transition-colors hover:text-ink-900"
            >
              View the {component.name} component
            </Link>
          ) : null}
        </header>

        <section aria-labelledby="live-recipe" className="mt-10 max-w-4xl sm:mt-12">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-ink-500 uppercase">Live example</p>
                <h2 id="live-recipe" className="mt-3 font-display text-2xl font-semibold tracking-tight">Try the interaction before reading the recipe.</h2>
              </div>
              <p className="font-mono text-xs text-ink-500">real component · keyboard-safe</p>
            </div>
            <div className="mt-5 overflow-hidden rounded-[26px] border border-line bg-white/75 p-3 shadow-soft sm:mt-6 sm:p-5">
              <CataloguePreview kind={kind} slug={slug} title={skill.title} classification={classifySkillPreview(kind, slug)} />
            </div>
        </section>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_14rem] lg:items-start">
          <div className="min-w-0 rounded-[26px] border border-line bg-white/70 p-6 shadow-soft sm:p-9">
            <Markdown source={skill.body} />
          </div>
          <aside className="lg:sticky lg:top-28">
            <p className="font-mono text-[0.6875rem] tracking-[0.14em] text-ink-500 uppercase">Recipe contract</p>
            <ul className="mt-4 flex flex-col gap-3 text-sm leading-relaxed text-ink-700">
              <li>Choose the relationship before the effect.</li>
              <li>Keep the live state understandable without motion.</li>
              <li>Expose keyboard, focus and touch paths.</li>
              <li>Tune a few variables, not every possible knob.</li>
            </ul>
            <Link href="/docs#accessibility" className="mt-6 inline-flex text-sm text-ink-700 underline decoration-line-strong underline-offset-4 hover:text-ink-900">Read the system rules →</Link>
          </aside>
        </div>

        <p className="mt-14 max-w-2xl font-mono text-xs text-ink-500">
          Source: packages/skills/{kind}/{skill.slug}.md
        </p>
      </Container>
    </article>
  );
}
