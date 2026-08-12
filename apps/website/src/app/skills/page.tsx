import type { Metadata } from "next";

import { CatalogueBrowser } from "@/components/skills/catalogue-browser";
import { SkillPreviewWall } from "@/components/skills/skill-preview-wall";
import { Container, Halo } from "@/components/site/layout";
import {
  DIRECT_PREVIEW_SKILLS,
  KIND_BLURB,
  KIND_LABEL,
  SKILL_PUBLIC_GROUPS,
  classifySkillPreview,
  listAllSkills,
} from "@/lib/skills";

export const metadata: Metadata = {
  title: "Skills",
  description:
    "Pinky UI interaction recipes help people and coding agents choose, tune and ship motion responsibly.",
};

export default async function SkillsPage() {
  const skills = await listAllSkills();
  const featured = DIRECT_PREVIEW_SKILLS.map((entry) => ({
    ...entry,
    skill: skills[entry.kind].find((skill) => skill.slug === entry.slug),
  })).filter((entry): entry is typeof entry & { skill: NonNullable<typeof entry.skill> } => Boolean(entry.skill));

  return (
    <div className="relative overflow-x-clip pt-12 pb-24 sm:pt-16">
      <Halo className="-top-40 left-[-10rem] size-[28rem]" />
      <Halo className="top-24 right-[-12rem] size-[26rem]" color="var(--pinky-halo-b)" />

      <Container>
        <header className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
          <div>
            <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-ink-500 uppercase">Skills · interaction recipes</p>
            <h1 className="mt-5 max-w-3xl text-section text-balance-tight">Make the interaction, then make the judgment visible.</h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-700 sm:text-lg">
              A skill answers the question an API cannot: what the interaction is for, when it is the wrong choice,
              and which few variables keep it feeling like Pinky UI.
            </p>
          </div>
          <aside className="rounded-[22px] border border-line bg-white/70 p-5 shadow-soft">
            <p className="font-mono text-[0.625rem] tracking-[0.14em] text-ink-500 uppercase">Recipe shape</p>
            <ol className="mt-4 flex flex-col gap-2 text-sm text-ink-700">
              <li><span className="mr-2 font-mono text-xs text-ink-500">01</span>What it does</li>
              <li><span className="mr-2 font-mono text-xs text-ink-500">02</span>Interaction anatomy</li>
              <li><span className="mr-2 font-mono text-xs text-ink-500">03</span>Live example + usage</li>
              <li><span className="mr-2 font-mono text-xs text-ink-500">04</span>Tune + accessibility</li>
            </ol>
          </aside>
        </header>

        <section id="featured" className="mt-16 scroll-mt-24 sm:mt-20" aria-labelledby="featured-title">
          <div className="flex flex-wrap items-end justify-between gap-5 border-b border-line pb-5">
            <div>
              <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-ink-500 uppercase">Featured recipes</p>
              <h2 id="featured-title" className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight">A live reference wall for interaction decisions.</h2>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-ink-500">Hover or focus one recipe at a time. Its real component answers immediately; the rest stay quiet.</p>
          </div>

          <SkillPreviewWall
            entries={featured.map((entry) => ({
              kind: entry.kind,
              slug: entry.slug,
              title: entry.skill.title,
              summary: entry.skill.summary,
              eyebrow: entry.eyebrow,
              liveLabel: entry.liveLabel,
              signature: entry.signature,
              wide: "span" in entry && entry.span === "wide",
            }))}
          />
        </section>

        <section id="catalog" className="mt-24 scroll-mt-24 sm:mt-32" aria-labelledby="catalog-title">
          <div className="max-w-2xl">
            <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-ink-500 uppercase">Full recipe catalogue</p>
            <h2 id="catalog-title" className="mt-3 font-display text-3xl font-semibold tracking-tight">Browse by public interaction family.</h2>
            <p className="mt-3 text-base leading-relaxed text-ink-700">The folders remain useful for imports; the discovery language stays aligned with the site taxonomy.</p>
          </div>

          <div className="mt-10 flex flex-col gap-14">
            {SKILL_PUBLIC_GROUPS.map((group) => (
              <section key={group.label} aria-labelledby={`skill-group-${group.label.toLowerCase()}`}>
                <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-4">
                  <div>
                    <h3 id={`skill-group-${group.label.toLowerCase()}`} className="font-display text-2xl font-semibold tracking-tight">{group.label}</h3>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-700">{group.description}</p>
                  </div>
                  <span className="font-mono text-xs text-ink-500">
                    {group.kinds.reduce((count, kind) => count + skills[kind].length, 0)} recipes
                  </span>
                </div>

                <div className="mt-6">
                  <CatalogueBrowser blocks={group.kinds.map((kind) => ({
                    kind,
                    label: KIND_LABEL[kind],
                    blurb: KIND_BLURB[kind],
                    skills: skills[kind].map((skill) => ({ ...skill, classification: classifySkillPreview(kind, skill.slug) })),
                  }))} />
                </div>
              </section>
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
}
