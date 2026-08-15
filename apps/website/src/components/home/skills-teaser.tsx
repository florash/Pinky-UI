import Link from "next/link";

import { ArrowRight } from "@/components/site/icons";
import { Container } from "@/components/site/layout";
import { SKILL_KINDS, SKILL_ROUTE_ALIASES, listAllSkills } from "@/lib/skills";

/**
 * One idea, one number, one way in.
 *
 * The old teaser printed every skill category as a stat table, which read as
 * documentation. The interesting fact is that guidance ships with the code at
 * all — the catalogue itself belongs on /skills.
 */
const SAMPLE = `# Jelly Card

## Avoid for

- forms and input-heavy panels
- dense data tables
- long repeated lists`;

export async function SkillsTeaser() {
  const skills = await listAllSkills();
  const total = SKILL_KINDS.reduce((sum, kind) => sum + skills[kind].length, 0) + SKILL_ROUTE_ALIASES.length;

  return (
    <section id="skills" className="relative py-20 sm:py-28">
      <Container>
        <div className="grid min-w-0 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-16">
          <div className="min-w-0">
            <h2 className="max-w-md text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.06] tracking-[-0.03em] text-balance-tight">
              Written for developers — and coding agents.
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-ink-700">
              <span className="font-mono text-ink-900">{total}</span> public skill routes backed by plain markdown: what
              a component is for, when it is the wrong choice, and how much motion is too much.
            </p>
            <Link
              href="/skills"
              className="group mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-ink-700 transition-colors hover:text-ink-900"
            >
              Read the skills
              <ArrowRight className="size-4 transition-transform duration-300 ease-[var(--ease-soft)] group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="min-w-0 rounded-[20px] bg-white/70 p-6 ring-1 ring-line/60">
            <p className="font-mono text-[0.625rem] tracking-[0.14em] text-ink-500 uppercase">
              packages/skills/components/jelly-card.md
            </p>
            <pre className="mt-4 max-w-full min-w-0 overflow-x-auto font-mono text-[0.8125rem] leading-relaxed text-ink-700">
              <code>{SAMPLE}</code>
            </pre>
          </div>
        </div>
      </Container>
    </section>
  );
}
