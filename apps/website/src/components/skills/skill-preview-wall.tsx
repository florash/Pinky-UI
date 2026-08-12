"use client";

import { useState } from "react";

import type { SkillKind } from "@/lib/skills";

import { SkillPreviewCard } from "./skill-preview-card";

type PreviewEntry = {
  kind: SkillKind;
  slug: string;
  title: string;
  summary: string;
  eyebrow: string;
  liveLabel: string;
  signature: string;
  wide?: boolean;
};

export function SkillPreviewWall({ entries }: { entries: PreviewEntry[] }) {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  return (
    <div className="mt-8 flex flex-wrap gap-4">
      {entries.map((entry, index) => {
        const key = `${entry.kind}/${entry.slug}`;
        return (
          <SkillPreviewCard
            key={key}
            {...entry}
            index={index}
            total={entries.length}
            active={activeKey === key}
            onActiveChange={(active) => setActiveKey((current) => {
              if (active) return key;
              return current === key ? null : current;
            })}
          />
        );
      })}
    </div>
  );
}
