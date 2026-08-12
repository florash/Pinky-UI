"use client";

import { useEffect, useRef, type PointerEvent } from "react";

import type { SkillKind, SkillPreviewClass } from "@/lib/skills";

import { SkillLivePreview } from "./skill-live-preview";

type Props = { kind: SkillKind; slug: string; title: string; classification: SkillPreviewClass };

export function CataloguePreview({ kind, slug, title, classification }: Props) {
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const targets = stage.current?.querySelectorAll<HTMLElement>("button, [data-skill-preview-target]");
    targets?.forEach((target) => target.dispatchEvent(new PointerEvent("pointerover", { bubbles: true, pointerType: "mouse" })));
    return () => targets?.forEach((target) => target.dispatchEvent(new PointerEvent("pointerout", { bubbles: true, pointerType: "mouse" })));
  }, [kind, slug]);

  return (
    <div ref={stage} data-catalogue-live-stage className="min-h-44 overflow-hidden rounded-[18px] border border-line bg-cloud-50/65 p-3">
      <div className="grid min-h-40 place-items-center overflow-hidden rounded-[14px] bg-white/55 p-3">
        {classification === "LIVE" ? <SkillLivePreview kind={kind} slug={slug} active /> : null}
        {classification === "COMPOSABLE" ? <ComposablePreview kind={kind} title={title} /> : null}
        {classification === "CONCEPTUAL" ? <ConceptPreview title={title} slug={slug} /> : null}
      </div>
    </div>
  );
}

function ComposablePreview({ kind, title }: { kind: SkillKind; title: string }) {
  if (kind === "cursor" || kind === "primitives") return <PointerField title={title} />;
  if (kind === "scroll" || kind === "media") return <FlowStudy title={title} />;
  if (kind === "spatial" || kind === "heroes") return <DepthStudy title={title} />;
  return <StateStudy title={title} />;
}

function PointerField({ title }: { title: string }) {
  const field = useRef<HTMLDivElement>(null);
  const move = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--preview-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--preview-y", `${event.clientY - rect.top}px`);
  };
  return (
    <div ref={field} onPointerMove={move} className="relative h-36 w-full overflow-hidden rounded-xl border border-line bg-cloud-50 [--preview-x:50%] [--preview-y:50%]">
      <span aria-hidden className="absolute size-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blush-200/70 blur-xl transition-[left,top] duration-100 motion-reduce:transition-none" style={{ left: "var(--preview-x)", top: "var(--preview-y)" }} />
      <span data-skill-preview-target className="absolute left-[var(--preview-x)] top-[var(--preview-y)] size-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-line-strong bg-white shadow-soft motion-reduce:left-1/2 motion-reduce:top-1/2" />
      <PreviewLabel title={title} note="move through the bounded field" />
    </div>
  );
}

function FlowStudy({ title }: { title: string }) {
  return (
    <div className="relative h-36 w-full overflow-hidden rounded-xl border border-line bg-white">
      <div className="absolute inset-x-4 top-4 flex gap-2">
        {[0, 1, 2].map((item) => <span key={item} className="h-16 flex-1 rounded-lg bg-cloud-100 even:bg-blush-100" />)}
      </div>
      <div className="absolute inset-x-4 bottom-4 h-1 overflow-hidden rounded-pill bg-line"><span className="block h-full w-2/3 rounded-pill bg-ink-900 transition-[width] duration-500 motion-reduce:transition-none" /></div>
      <PreviewLabel title={title} note="content flow remains readable" />
    </div>
  );
}

function DepthStudy({ title }: { title: string }) {
  return (
    <div className="relative h-36 w-full overflow-hidden rounded-xl border border-line bg-[radial-gradient(circle_at_70%_20%,var(--color-blush-100),transparent_55%)]">
      {[2, 1, 0].map((layer) => <span key={layer} className="absolute left-1/2 top-1/2 h-16 w-24 rounded-xl border border-line bg-white/85 shadow-soft transition-transform duration-500 motion-reduce:transition-none" style={{ transform: `translate(-50%, -50%) translate(${layer * 9}px, ${layer * -7}px) rotate(${layer * 2}deg)` }} />)}
      <PreviewLabel title={title} note="depth flattens to reading order" />
    </div>
  );
}

function StateStudy({ title }: { title: string }) {
  return (
    <div className="grid w-full grid-cols-2 gap-3">
      <StateCell label="Rest" active={false} />
      <StateCell label="Active" active />
      <p className="col-span-2 text-center text-xs text-ink-500">{title} · one controlled state</p>
    </div>
  );
}

function ConceptPreview({ title, slug }: { title: string; slug: string }) {
  const concept = conceptStates(slug);
  return (
    <div className="w-full">
      <div className={`grid gap-3 ${concept.vertical ? "grid-cols-1" : "grid-cols-2"}`}>
        <StateCell label={concept.from} active={false} />
        <StateCell label={concept.to} active />
      </div>
      <p className="mt-4 text-center text-xs leading-relaxed text-ink-500">{title} · {concept.note}</p>
    </div>
  );
}

function conceptStates(slug: string) {
  if (/accessibility|etiquette|reorder/.test(slug)) return { from: "Native path", to: "Enhanced path", note: "the fallback remains complete", vertical: false };
  if (/density|hierarchy/.test(slug)) return { from: "Quiet support", to: "Primary response", note: "attention follows consequence", vertical: false };
  if (/motion|hover|transition|scroll/.test(slug)) return { from: "Resting state", to: "Intentional change", note: "motion explains one relationship", vertical: false };
  if (/layout|editorial|composition|spatial|3d/.test(slug)) return { from: "Source order", to: "Authored composition", note: "hierarchy changes without losing order", vertical: true };
  if (/loading|notification|workflow|destructive/.test(slug)) return { from: "Pending action", to: "Resolved status", note: "state follows real product work", vertical: false };
  if (/search|gallery|collection|media|form/.test(slug)) return { from: "Overview", to: "Focused item", note: "selection stays explicit", vertical: false };
  return { from: "Default", to: "Resolved", note: "compare the system relationship", vertical: false };
}

function StateCell({ label, active }: { label: string; active: boolean }) {
  return <div className={`grid min-h-20 place-items-center rounded-xl border text-xs transition-colors motion-reduce:transition-none ${active ? "border-line-strong bg-blush-100 text-ink-900" : "border-line bg-white text-ink-500"}`}>{label}</div>;
}

function PreviewLabel({ title, note }: { title: string; note: string }) {
  return <span className="absolute inset-x-3 bottom-3 text-center font-mono text-[0.55rem] tracking-[0.08em] text-ink-500 uppercase">{title} · {note}</span>;
}
