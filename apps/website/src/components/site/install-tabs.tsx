"use client";

import { cn } from "@pinky-ui/components";
import { useId, useState } from "react";

import { CodeBlock } from "./code-block";

export type InstallTabsProps = {
  /** e.g. "@pinky-ui/components" */
  packageName: string;
  /** Registry slug, used for the CLI's `add` command. */
  slug: string;
  className?: string;
};

const TABS = ["npm", "pnpm", "yarn", "CLI"] as const;
type Tab = (typeof TABS)[number];

function commandFor(tab: Tab, packageName: string, slug: string): string {
  switch (tab) {
    case "npm":
      return `npm install ${packageName}`;
    case "pnpm":
      return `pnpm add ${packageName}`;
    case "yarn":
      return `yarn add ${packageName}`;
    case "CLI":
      return `npx pinky-ui add ${slug}`;
  }
}

export function InstallTabs({ packageName, slug, className }: InstallTabsProps) {
  const [active, setActive] = useState<Tab>("npm");
  const baseId = useId();

  return (
    <div className={className}>
      <div role="tablist" aria-label="Install command" className="inline-flex gap-1 rounded-pill border border-line bg-white/70 p-1">
        {TABS.map((tab) => {
          const selected = tab === active;
          return (
            <button
              key={tab}
              type="button"
              role="tab"
              id={`${baseId}-${tab}-tab`}
              aria-selected={selected}
              aria-controls={`${baseId}-${tab}-panel`}
              onClick={() => setActive(tab)}
              className={cn(
                "rounded-pill px-3 py-1.5 font-mono text-[0.6875rem] tracking-[0.08em] uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20",
                selected ? "bg-ink-900 text-white" : "text-ink-500 hover:text-ink-900",
              )}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {TABS.map((tab) => (
        <div
          key={tab}
          role="tabpanel"
          id={`${baseId}-${tab}-panel`}
          aria-labelledby={`${baseId}-${tab}-tab`}
          hidden={tab !== active}
          className="mt-3"
        >
          <CodeBlock code={commandFor(tab, packageName, slug)} label={tab === "CLI" ? "shell — copies source into your project" : "shell"} language="bash" />
        </div>
      ))}
    </div>
  );
}
