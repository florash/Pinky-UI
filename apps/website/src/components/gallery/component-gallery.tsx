"use client";

import { cn } from "@pinky/components";
import {
  CATEGORIES,
  components,
  filterComponents,
  INTERACTIONS,
  type Category,
  type Interaction,
} from "@pinky/registry";
import Link from "next/link";
import { useMemo, useState } from "react";

import { ComponentPreview } from "@/components/previews/component-previews";
import { SearchMark } from "@/components/site/icons";

export function ComponentGallery() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "all">("all");
  const [interaction, setInteraction] = useState<Interaction | "all">("all");

  const results = useMemo(
    () => filterComponents(components, { query, category, interaction }),
    [category, interaction, query],
  );

  return (
    <>
      <div className="mt-10 flex flex-col gap-6">
        <label className="relative block max-w-md">
          <span className="sr-only">Search components</span>
          <SearchMark className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ink-500" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search interactions, tags, components…"
            className="h-12 w-full rounded-pill border border-line bg-white/80 pr-4 pl-11 text-sm text-ink-900 placeholder:text-ink-500 focus:border-line-strong focus:outline-none"
          />
        </label>

        <FilterRow
          label="Category"
          options={["all", ...CATEGORIES]}
          value={category}
          onChange={(value) => setCategory(value as Category | "all")}
        />
        <FilterRow
          label="Interaction"
          options={["all", ...INTERACTIONS]}
          value={interaction}
          onChange={(value) => setInteraction(value as Interaction | "all")}
        />
      </div>

      <p aria-live="polite" className="mt-8 font-mono text-xs text-ink-500">
        {results.length} {results.length === 1 ? "component" : "components"}
      </p>

      {results.length === 0 ? (
        <p className="mt-10 rounded-xl border border-dashed border-line px-6 py-14 text-center text-sm text-ink-500">
          Nothing matches that yet. Try a different interaction.
        </p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((entry) => (
            <Link
              key={entry.slug}
              href={`/components/${entry.slug}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-line bg-white/80 transition-shadow duration-500 ease-[var(--ease-soft)] hover:shadow-soft"
            >
              <div className="flex h-52 items-center justify-center overflow-hidden border-b border-line bg-milk/50 p-6">
                <ComponentPreview slug={entry.slug} />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-base font-semibold tracking-tight">
                    {entry.name}
                  </h2>
                  {entry.status === "in-progress" ? (
                    <span className="rounded-pill border border-line px-2 py-0.5 font-mono text-[0.625rem] tracking-[0.1em] text-ink-500 uppercase">
                      soon
                    </span>
                  ) : null}
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-700">{entry.description}</p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {entry.interactions.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-pill bg-blush-50 px-2.5 py-1 font-mono text-[0.625rem] tracking-[0.08em] text-ink-500 uppercase"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

function FilterRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 font-mono text-[0.6875rem] tracking-[0.14em] text-ink-500 uppercase">
        {label}
      </span>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={value === option}
          onClick={() => onChange(option)}
          className={cn(
            "rounded-pill border px-3.5 py-1.5 text-xs font-medium capitalize transition-colors duration-200",
            value === option
              ? "border-ink-900 bg-ink-900 text-milk"
              : "border-line text-ink-700 hover:border-line-strong hover:bg-white/80",
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
