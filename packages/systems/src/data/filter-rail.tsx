"use client";

import { useId } from "react";

import { cn } from "../internal/cn";
import { useControllable } from "../internal/use-controllable";

export type FilterRailOption = { id: string; label: string; count?: number };
export type FilterRailGroup = { id: string; label: string; options: FilterRailOption[] };
export type FilterRailSelection = Record<string, string>;
export type FilterRailProps = {
  groups: FilterRailGroup[];
  value?: FilterRailSelection;
  defaultValue?: FilterRailSelection;
  onValueChange?: (value: FilterRailSelection) => void;
  resultsCount?: number;
  label?: string;
  className?: string;
};

/** A compact filter rail that keeps selection, removal and result context together. */
export function FilterRail({ groups, value, defaultValue = {}, onValueChange, resultsCount, label = "Filter results", className }: FilterRailProps) {
  const id = useId();
  const [selection, setSelection] = useControllable(value, defaultValue, onValueChange);
  const selectedEntries = Object.entries(selection).map(([groupId, optionId]) => ({ groupId, optionId, group: groups.find((group) => group.id === groupId), option: groups.find((group) => group.id === groupId)?.options.find((item) => item.id === optionId) })).filter((item) => item.group && item.option);
  const update = (groupId: string, optionId?: string) => {
    const next = { ...selection };
    if (optionId) next[groupId] = optionId;
    else delete next[groupId];
    setSelection(next);
  };

  return (
    <div aria-label={label} className={cn("w-full rounded-[22px] border border-line bg-white/80 p-4 shadow-sm", className)}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1 space-y-3">
          {groups.map((group) => (
            <fieldset key={group.id} className="min-w-0">
              <legend className="mb-2 text-xs font-medium text-ink-700">{group.label}</legend>
              <div className="flex max-w-full gap-2 overflow-x-auto pb-1" aria-label={`${group.label} options`}>
                <button type="button" aria-pressed={!selection[group.id]} onClick={() => update(group.id)} className={cn("shrink-0 rounded-full border px-3 py-1.5 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20", !selection[group.id] ? "border-ink-900 bg-ink-900 text-milk" : "border-line bg-milk text-ink-700 hover:border-ink-900")}>All</button>
                {group.options.map((option) => {
                  const active = selection[group.id] === option.id;
                  return <button key={option.id} type="button" aria-pressed={active} onClick={() => update(group.id, option.id)} className={cn("shrink-0 rounded-full border px-3 py-1.5 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20", active ? "border-ink-900 bg-ink-900 text-milk" : "border-line bg-milk text-ink-700 hover:border-ink-900")}>{option.label}{option.count !== undefined ? <span className={cn("ml-1.5 tabular-nums", active ? "text-milk/70" : "text-ink-400")}>{option.count}</span> : null}</button>;
                })}
              </div>
            </fieldset>
          ))}
        </div>
        <div className="shrink-0 lg:pt-5"><p aria-live="polite" className="text-xs text-ink-500">{resultsCount !== undefined ? `${resultsCount} results` : `${selectedEntries.length} filters active`}</p>{selectedEntries.length ? <button type="button" onClick={() => setSelection({})} className="mt-2 text-xs text-ink-700 underline decoration-line underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20">Clear all</button> : null}</div>
      </div>
      {selectedEntries.length ? <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-3"><span className="font-mono text-[0.625rem] tracking-[0.14em] text-ink-500 uppercase">Selected</span>{selectedEntries.map(({ groupId, option }) => <button key={`${groupId}-${option!.id}`} type="button" onClick={() => update(groupId)} aria-label={`Remove ${option!.label} filter`} className="rounded-full bg-blush-50 px-2.5 py-1 text-xs text-ink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20">{option!.label} <span aria-hidden>×</span></button>)}</div> : null}
      <span id={`${id}-hint`} className="sr-only">Choose one option per filter group. Selected filters can be removed below.</span>
    </div>
  );
}
