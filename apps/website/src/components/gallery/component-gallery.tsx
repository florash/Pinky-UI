"use client";

import { cn } from "@pinky-ui/components";
import {
  CATEGORIES,
  components,
  filterComponents,
  INTERACTIONS,
  type Category,
  type Interaction,
} from "@pinky-ui/registry";
import Link from "next/link";
import { useMemo, useState } from "react";

import { ComponentPreview, hasComponentPreview } from "@/components/previews/component-previews";
import { SearchMark } from "@/components/site/icons";

export function ComponentGallery() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "all">("all");
  const [interaction, setInteraction] = useState<Interaction | "all">("all");

  const results = useMemo(
    () =>
      filterComponents(components, { query, category, interaction }).filter(
        (entry) => entry.status === "ready" && hasComponentPreview(entry.slug),
      ),
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
            className="h-12 w-full rounded-pill border border-line bg-white/80 pr-4 pl-11 text-sm text-ink-900 placeholder:text-ink-500 focus:border-line-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-900 focus-visible:ring-offset-2 focus-visible:ring-offset-milk"
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
            <article
              key={entry.slug}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-line bg-white/80 transition-[transform,box-shadow] duration-500 ease-[var(--ease-soft)] hover:shadow-soft focus-within:shadow-lift active:translate-y-px"
            >
              {/*
                A stretched link, not a card-wide <Link>: the preview below
                can render a component that renders its own real <a>/<button>
                (Pill Nav, for example), and nesting an anchor inside an
                anchor is invalid HTML that fails hydration. This covers the
                same click area — everywhere except the live preview itself,
                which sits above it via z-10 and stays genuinely interactive,
                matching "Previews are live — try them here" above.
              */}
              <Link
                href={`/components/${entry.slug}`}
                className="absolute inset-0 z-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25 focus-visible:ring-offset-2"
              >
                <span className="sr-only">{entry.name}</span>
              </Link>
              <div className="relative z-10 flex h-52 items-center justify-center overflow-hidden border-b border-line bg-milk/50 p-6">
                <ComponentPreview slug={entry.slug} />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h2 className="font-display text-base font-semibold tracking-tight">{entry.name}</h2>
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
            </article>
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
            "min-h-10 rounded-pill border px-3.5 py-2 text-xs font-medium capitalize transition-colors duration-200 sm:min-h-0 sm:py-1.5",
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
