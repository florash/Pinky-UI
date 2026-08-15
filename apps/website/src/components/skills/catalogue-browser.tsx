"use client";

import Link from "next/link";
import { useEffect, useState, type FocusEvent, type MouseEvent } from "react";

import { cn } from "@pinky/components";
import type { Skill, SkillKind, SkillPreviewClass } from "@/lib/skills";

import { CataloguePreview } from "./catalogue-preview";

type KindBlock = { kind: SkillKind; label: string; blurb: string; skills: Array<Skill & { classification: SkillPreviewClass }> };

export function CatalogueBrowser({ blocks }: { blocks: KindBlock[] }) {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 639px)");
    const sync = () => setCompact(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return (
    <div className="grid gap-5 lg:grid-cols-2 [&>section:last-child:nth-child(odd)]:lg:col-span-2 [&>section:only-child]:lg:col-span-2">
      {blocks.map((block) => {
        const active = block.skills.find((skill) => `${block.kind}/${skill.slug}` === activeKey);
        return (
          <section
            key={block.kind}
            className="min-w-0 rounded-[22px] border border-line bg-white/60 p-4 sm:p-5"
            onMouseLeave={() => { if (!compact) setActiveKey(null); }}
            onBlur={(event: FocusEvent<HTMLElement>) => { if (!event.currentTarget.contains(event.relatedTarget)) setActiveKey(null); }}
          >
            <div className="flex items-baseline justify-between gap-4">
              <h4 className="font-display text-lg font-semibold tracking-tight">{block.label}</h4>
              <span className="font-mono text-xs text-ink-500">{block.skills.length}</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink-700">{block.blurb}</p>

            <div className="mt-5 grid gap-5 sm:grid-cols-[minmax(0,1fr)_17rem]">
              <ul className="grid min-w-0 grid-cols-2 content-start gap-x-3 sm:grid-cols-1 sm:gap-x-0">
                {block.skills.map((skill) => {
                  const key = `${block.kind}/${skill.slug}`;
                  const selected = key === activeKey;
                  const activate = () => setActiveKey(key);
                  const click = (event: MouseEvent<HTMLAnchorElement>) => {
                    if (compact) { event.preventDefault(); activate(); }
                  };
                  return (
                    <li key={skill.slug} className={cn("min-w-0 border-t border-line first:border-t-0 [&:nth-child(2)]:border-t-0 sm:[&:nth-child(2)]:border-t", compact && selected && "col-span-2")}>
                      <Link
                        href={`/skills/${block.kind}/${skill.slug}`}
                        onMouseEnter={() => { if (!compact) activate(); }}
                        onFocus={activate}
                        onClick={click}
                        aria-describedby={selected ? `catalogue-preview-${block.kind}` : undefined}
                        className={cn("group flex min-h-14 min-w-0 items-center justify-between gap-2 rounded-lg px-2 py-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25 focus-visible:ring-offset-1", selected && "bg-blush-50 text-ink-900")}
                      >
                        <span className="min-w-0">
                          <span className="block text-[0.8125rem] font-medium group-hover:underline sm:text-sm">{skill.title}</span>
                          <span className="mt-1 hidden truncate text-xs text-ink-500 sm:block">{skill.summary}</span>
                        </span>
                        <span aria-hidden className="shrink-0 font-mono text-[0.55rem] text-ink-500">{skill.classification === "LIVE" ? "LIVE" : skill.classification === "CONCEPTUAL" ? "STATE" : "STUDY"}</span>
                      </Link>
                      {compact && selected ? <MobileStage block={block} skill={skill} /> : null}
                    </li>
                  );
                })}
              </ul>

              {!compact ? (
                <aside id={`catalogue-preview-${block.kind}`} className="sticky top-24 h-fit min-w-0" aria-live="polite">
                  {active ? <Stage kind={block.kind} skill={active} /> : <IdleStage />}
                </aside>
              ) : null}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function Stage({ kind, skill }: { kind: SkillKind; skill: Skill & { classification: SkillPreviewClass } }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 px-1">
        <p className="truncate text-xs font-medium text-ink-900">{skill.title}</p>
        <span className="font-mono text-[0.55rem] tracking-[0.08em] text-ink-500">{skill.classification}</span>
      </div>
      <CataloguePreview key={`${kind}/${skill.slug}`} kind={kind} slug={skill.slug} title={skill.title} classification={skill.classification} />
      <Link href={`/skills/${kind}/${skill.slug}`} className="mt-2 inline-flex min-h-10 items-center rounded-lg px-2 text-xs font-medium text-ink-700 underline decoration-line-strong underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25 focus-visible:ring-offset-1">Open recipe →</Link>
    </div>
  );
}

function MobileStage({ block, skill }: { block: KindBlock; skill: KindBlock["skills"][number] }) {
  return <div className="col-span-2 my-2 sm:hidden"><Stage kind={block.kind} skill={skill} /></div>;
}

function IdleStage() {
  return <div className="grid min-h-52 place-items-center rounded-[18px] border border-dashed border-line bg-cloud-50/35 p-5 text-center text-xs leading-relaxed text-ink-500">Hover or focus a recipe<br />to inspect its interaction.</div>;
}
