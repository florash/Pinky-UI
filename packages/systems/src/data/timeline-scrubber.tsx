"use client";

import { cn } from "../internal/cn";
import { useControllable } from "../internal/use-controllable";

export type TimelineStop = { id: string; label: string; description?: string };
export type TimelineScrubberProps = {
  stops: TimelineStop[];
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  orientation?: "horizontal" | "vertical";
  label?: string;
  className?: string;
  disabled?: boolean;
};

export function TimelineScrubber({ stops, index, defaultIndex = 0, onIndexChange, orientation = "horizontal", label = "Timeline", className, disabled = false }: TimelineScrubberProps) {
  const [active, setActive] = useControllable(index, defaultIndex, onIndexChange);
  const bounded = Math.min(Math.max(active, 0), Math.max(stops.length - 1, 0)); const vertical = orientation === "vertical"; const stop = stops[bounded];
  return <div className={cn(vertical ? "flex gap-5" : "", className)}><input type="range" min={0} max={Math.max(stops.length - 1, 0)} step={1} value={bounded} disabled={disabled} aria-label={label} aria-valuetext={stop?.label} onChange={(event) => setActive(event.currentTarget.valueAsNumber)} className={cn("accent-[color:var(--color-ink-900,#252933)]", vertical ? "h-56" : "w-full")} style={vertical ? { writingMode: "vertical-lr", direction: "rtl" } : undefined} /><div className={cn("mt-3 flex justify-between gap-2", vertical && "mt-0 flex-col")}>{stops.map((item, itemIndex) => <button key={item.id} type="button" onClick={() => setActive(itemIndex)} aria-current={itemIndex === bounded ? "step" : undefined} className={cn("text-left text-xs", itemIndex === bounded ? "font-semibold text-[color:var(--color-ink-900,#252933)]" : "text-[color:var(--color-ink-500,#7b8492)]")}>{item.label}</button>)}</div>{stop?.description ? <p aria-live="polite" className={cn("mt-4 text-sm text-[color:var(--color-ink-700,#505865)]", vertical && "mt-0 self-center")}>{stop.description}</p> : null}</div>;
}
