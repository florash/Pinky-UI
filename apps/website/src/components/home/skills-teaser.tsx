import Link from "next/link";

import { ArrowRight } from "@/components/site/icons";
import { Container, Section, SectionHeading } from "@/components/site/layout";
import { SKILL_KINDS, KIND_LABEL, listAllSkills } from "@/lib/skills";

const SAMPLE = `# Jelly Card

## Avoid for

- forms and input-heavy panels
- dense data tables
- long repeated lists, where per-item motion becomes noise`;

export async function SkillsTeaser() {
  const skills = await listAllSkills();
  const counts = SKILL_KINDS.map((kind) => ({
    kind,
    label: KIND_LABEL[kind],
    count: skills[kind].length,
  }));

  return (
    <Section id="skills">
      <Container>
        <div className="grid min-w-0 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-16">
          <div className="min-w-0">
            <SectionHeading
              eyebrow="Skills"
              title="Built for developers — and coding agents."
              description="Every component ships with written guidance: what it is for, when it is the wrong choice, and how much motion is too much. Plain markdown, read by people and by the agents writing alongside them."
            />

            <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
              {counts.map((entry) => (
                <div key={entry.kind}>
                  <dt className="font-mono text-[0.625rem] tracking-[0.14em] text-ink-500 uppercase">
                    {entry.label}
                  </dt>
                  <dd className="mt-1 font-display text-2xl font-semibold tracking-tight">
                    {entry.count}
                  </dd>
                </div>
              ))}
            </dl>

            <Link
              href="/skills"
              className="group mt-10 inline-flex items-center gap-2 text-sm font-medium text-ink-700 transition-colors hover:text-ink-900"
            >
              Explore Skills
              <ArrowRight className="size-4 transition-transform duration-300 ease-[var(--ease-soft)] group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="min-w-0 rounded-xl bg-white/70 p-6 ring-1 ring-line/60">
            <p className="font-mono text-[0.625rem] tracking-[0.14em] text-ink-500 uppercase">
              packages/skills/components/jelly-card.md
            </p>
            <pre className="mt-4 min-w-0 max-w-full overflow-x-auto font-mono text-[0.8125rem] leading-relaxed text-ink-700">
              <code>{SAMPLE}</code>
            </pre>
            <p className="mt-5 text-sm leading-relaxed text-ink-500">
              Guidance, not API docs. The props table already says what the knobs do — a skill says
              whether you should turn them.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
