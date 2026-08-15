"use client";

import { cn } from "@pinky/components";
import Link from "next/link";
import { useEffect, useRef, type FocusEvent, type PointerEvent as ReactPointerEvent } from "react";

import { LazyMount } from "@/components/site/lazy-mount";
import type { SkillKind } from "@/lib/skills";

import { SkillLivePreview } from "./skill-live-preview";

type SkillPreviewCardProps = {
  kind: SkillKind;
  slug: string;
  title: string;
  summary: string;
  eyebrow: string;
  liveLabel: string;
  signature: string;
  index: number;
  total: number;
  wide?: boolean;
  active: boolean;
  onActiveChange: (active: boolean) => void;
};

export function SkillPreviewCard({ kind, slug, title, summary, eyebrow, liveLabel, signature, index, total, wide = false, active, onActiveChange }: SkillPreviewCardProps) {
  const preview = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const targets = preview.current?.querySelectorAll<HTMLElement>("button, [data-skill-preview-target]");
    targets?.forEach((target) => {
      target.dispatchEvent(new PointerEvent(active ? "pointerover" : "pointerout", {
        bubbles: true,
        pointerType: "mouse",
      }));
    });
  }, [active]);

  const leaveFocus = (event: FocusEvent<HTMLElement>) => {
    if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) onActiveChange(false);
  };

  const touch = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "touch") return;
    if ((event.target as Element).closest("button, a, input, select, textarea")) return;
    onActiveChange(true);
  };

  return (
    <article
      className={cn(
        "group/skill flex min-w-0 flex-col overflow-hidden rounded-[22px] border border-line bg-white/55 transition-[background-color,box-shadow,border-color] duration-300",
        active && "border-line-strong bg-white/85 shadow-soft",
        "w-full lg:w-auto lg:flex-grow lg:basis-[calc(33.333%-0.75rem)]",
        wide && "lg:basis-[calc(50%-0.5rem)]",
      )}
      onPointerEnter={(event) => {
        if (event.pointerType !== "touch" && event.currentTarget.ownerDocument.defaultView!.innerWidth >= 640) onActiveChange(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== "touch" && event.currentTarget.ownerDocument.defaultView!.innerWidth >= 640) onActiveChange(false);
      }}
      onBlurCapture={leaveFocus}
    >
      <div className="flex items-center justify-between gap-3 border-b border-line/80 px-5 py-3.5">
        <p className="font-mono text-[0.6rem] tracking-[0.14em] text-ink-500 uppercase">{eyebrow}</p>
        <span className="font-mono text-[0.6rem] text-ink-500 sm:hidden">tap to try</span>
        <span className="hidden font-mono text-[0.6rem] text-ink-500 sm:inline">{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
      </div>

      <div className={cn("grid min-w-0 flex-1", wide && "lg:grid-cols-[minmax(16rem,0.8fr)_minmax(0,1.2fr)]")}>
        <div className="flex min-w-0 flex-col p-5 sm:p-6">
          <h3 className="font-display text-xl font-semibold tracking-tight">
            <Link href={`/skills/${kind}/${slug}`} className="rounded-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25 focus-visible:ring-offset-4">{title}</Link>
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-700">{summary}</p>
          <p className="mt-5 font-mono text-[0.625rem] tracking-[0.1em] text-ink-500 uppercase">{signature}</p>
          <Link href={`/skills/${kind}/${slug}`} className="mt-auto rounded-sm pt-5 text-sm font-medium text-ink-700 underline decoration-line-strong underline-offset-4 hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25 focus-visible:ring-offset-4">
            Open recipe →
          </Link>
        </div>

        <div
          ref={preview}
          tabIndex={0}
          role="group"
          aria-label={`Live preview: ${liveLabel}`}
          data-active={active}
          onPointerUp={touch}
          onFocus={(event) => { if (event.currentTarget === event.target) onActiveChange(true); }}
          className="relative min-w-0 border-t border-line/80 bg-cloud-50/55 p-3 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink-900 lg:border-t-0 lg:border-l"
        >
          <LazyMount minHeight={184} className="h-full min-h-48">
            <div className="grid h-full min-h-48 place-items-center overflow-hidden rounded-[18px] bg-[radial-gradient(120%_100%_at_20%_0%,var(--color-blush-50),transparent_70%)] p-4">
              <SkillLivePreview kind={kind} slug={slug} active={active} onActiveChange={onActiveChange} />
            </div>
          </LazyMount>
        </div>
      </div>
    </article>
  );
}
