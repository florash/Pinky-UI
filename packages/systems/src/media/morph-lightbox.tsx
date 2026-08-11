"use client";

import { Morph } from "@pinky/primitives";
import { useState, type ReactNode } from "react";

import { cn } from "../internal/cn";

export type MorphLightboxItem = {
  id: string;
  label: string;
  thumbnail: ReactNode;
  media: ReactNode;
  caption?: ReactNode;
};

export type MorphLightboxProps = {
  items: MorphLightboxItem[];
  label?: string;
  className?: string;
  itemClassName?: string;
  disabled?: boolean;
};

/** A collection lightbox whose selected thumbnail is the surface that expands. */
export function MorphLightbox({ items, label = "Media gallery", className, itemClassName, disabled = false }: MorphLightboxProps) {
  return (
    <div aria-label={label} className={cn("grid gap-4 sm:grid-cols-2", className)}>
      {items.map((item, index) => (
        <Morph
          key={item.id}
          label={item.label}
          maxWidth={1040}
          disabled={disabled}
          className={cn("overflow-hidden rounded-[22px] bg-white text-left shadow-soft", itemClassName)}
          expandedClassName="overflow-hidden rounded-[28px] bg-[color:var(--color-ink-900,#252933)] text-[color:var(--color-milk,#fcfbf8)] shadow-2xl"
          expanded={<LightboxView items={items} initialIndex={index} />}
        >
          {item.thumbnail}
        </Morph>
      ))}
    </div>
  );
}

function LightboxView({ items, initialIndex }: { items: MorphLightboxItem[]; initialIndex: number }) {
  const [index, setIndex] = useState(initialIndex);
  const item = items[index];
  if (!item) return null;
  const move = (delta: number) => setIndex((value) => (value + delta + items.length) % items.length);
  return (
    <div onKeyDown={(event) => {
      if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
      if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
    }}>
      <div className="grid max-h-[72vh] min-h-72 place-items-center overflow-auto bg-black/20">{item.media}</div>
      <div className="flex items-center justify-between gap-4 p-4 sm:p-5">
        <div><p className="font-medium">{item.label}</p>{item.caption ? <div className="mt-1 text-sm text-white/65">{item.caption}</div> : null}</div>
        {items.length > 1 ? <div className="flex gap-2"><button type="button" onClick={() => move(-1)} aria-label="Previous media" className="rounded-full border border-white/20 px-3 py-2">←</button><button type="button" onClick={() => move(1)} aria-label="Next media" className="rounded-full border border-white/20 px-3 py-2">→</button></div> : null}
      </div>
    </div>
  );
}
