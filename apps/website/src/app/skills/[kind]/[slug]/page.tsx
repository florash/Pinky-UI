import { getComponent } from "@pinky/registry";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Markdown } from "@/components/skills/markdown";
import { Container, Halo } from "@/components/site/layout";
import { KIND_LABEL, SKILL_KINDS, getSkill, listSkills, type SkillKind } from "@/lib/skills";

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

  return groups.flat();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { kind, slug } = await params;
  if (!isKind(kind)) return {};

  const skill = await getSkill(kind, slug);
  if (!skill) return {};

  return { title: `${skill.title} — Skill`, description: skill.summary };
}

export default async function SkillPage({ params }: PageProps) {
  const { kind, slug } = await params;
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
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/skills" className="transition-colors hover:text-ink-900">
                Skills
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="capitalize">{KIND_LABEL[kind]}</li>
            <li aria-hidden>/</li>
            <li className="text-ink-900">{skill.title}</li>
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

        <div className="mt-12 max-w-2xl">
          <Markdown source={skill.body} />
        </div>

        <p className="mt-14 max-w-2xl font-mono text-xs text-ink-500">
          Source: packages/skills/{kind}/{skill.slug}.md
        </p>
      </Container>
    </article>
  );
}
