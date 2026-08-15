"use client";

import { FluidTabs } from "@pinky/components";
import type { ReactNode } from "react";

import { ComponentPreview } from "@/components/previews/component-previews";
import { CodeBlock } from "@/components/site/code-block";

/**
 * The Preview / Code / Skill switch on a component page — itself built from
 * Fluid Tabs, so the documentation runs on the library it documents.
 */
export function PreviewPanel({
  slug,
  code,
  skill,
}: {
  slug: string;
  code: string;
  /** Rendered skill markdown, passed in from the server component. */
  skill?: ReactNode;
}) {
  return (
    <FluidTabs
      aria-label="Preview, code or skill"
      items={[
        {
          id: "preview",
          label: "Preview",
          content: (
            <div className="flex min-h-[16rem] items-center justify-center rounded-xl bg-milk/60 p-6 sm:min-h-[18rem] sm:p-8 ring-1 ring-line/60">
              <ComponentPreview slug={slug} />
            </div>
          ),
        },
        {
          id: "code",
          label: "Code",
          content: code ? (
            <CodeBlock code={code} label="usage" />
          ) : (
            <p className="rounded-xl px-6 py-14 text-center text-sm text-ink-500 ring-1 ring-line/60 ring-dashed">
              This live preview does not need a usage snippet.
            </p>
          ),
        },
        ...(skill
          ? [
              {
                id: "skill",
                label: "Skill",
                content: (
                  <div className="rounded-xl bg-white/70 p-6 ring-1 ring-line/60 sm:p-8">{skill}</div>
                ),
              },
            ]
          : []),
      ]}
    />
  );
}
