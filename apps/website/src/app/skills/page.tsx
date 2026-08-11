import type { Metadata } from "next";
import Link from "next/link";

import { Container, Halo } from "@/components/site/layout";
import { KIND_BLURB, KIND_LABEL, SKILL_KINDS, listAllSkills } from "@/lib/skills";

export const metadata: Metadata = {
  title: "Skills",
  description:
    "Pinky UI Skills help coding agents choose and compose interactions responsibly — when to use a component, when not to, and how much is too much.",
};

export default async function SkillsPage() {
  const skills = await listAllSkills();

  return (
    <div className="relative overflow-hidden pt-16 pb-20 sm:pt-20">
      <Halo className="-top-40 left-[-10rem] size-[28rem]" />
      <Halo className="-top-24 right-[-8rem] size-[24rem]" color="var(--pinky-halo-b)" />

      <Container>
        <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-ink-500 uppercase">Skills</p>
        <h1 className="mt-5 max-w-2xl text-section text-balance-tight">
          Guidance a machine can read.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-700 sm:text-lg">
          Pinky UI Skills help coding agents choose and compose interactions responsibly. They
          carry the judgment a props table cannot: when a component is the right answer, when it is
          the wrong one, and how much motion is too much.
        </p>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-500">
          Every skill is a markdown file in{" "}
          <code className="font-mono text-xs">packages/skills</code>. This site renders those files
          directly — there is no second copy to fall out of date.
        </p>

        <div className="mt-16 flex flex-col gap-14">
          {SKILL_KINDS.map((kind) => (
            <section key={kind}>
              <div className="flex items-baseline gap-4">
                <h2 className="font-display text-xl font-semibold tracking-tight">
                  {KIND_LABEL[kind]}
                </h2>
                <span className="font-mono text-xs text-ink-500">{skills[kind].length}</span>
              </div>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-700">
                {KIND_BLURB[kind]}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {skills[kind].map((skill) => (
                  <Link
                    key={skill.slug}
                    href={`/skills/${kind}/${skill.slug}`}
                    className="group flex flex-col rounded-xl bg-white/70 p-5 ring-1 ring-line/60 transition-[box-shadow,background-color] duration-500 ease-[var(--ease-soft)] hover:bg-white hover:shadow-soft"
                  >
                    <h3 className="font-display text-base font-semibold tracking-tight">
                      {skill.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-700">
                      {skill.summary}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </Container>
    </div>
  );
}
