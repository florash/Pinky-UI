"use client";

import { Morph } from "@pinky/primitives";
import { type ReactNode } from "react";

import { cn } from "../internal/cn";
import { useControllable } from "../internal/use-controllable";

export type MorphMenuItem = {
  id: string;
  label: ReactNode;
  href: string;
  description?: ReactNode;
  onSelect?: () => void;
};

export type MorphMenuProps = {
  items: MorphMenuItem[];
  trigger?: ReactNode;
  label?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  panelClassName?: string;
  maxWidth?: number;
  disabled?: boolean;
};

/** A compact trigger that expands as the same surface into a modal navigation. */
export function MorphMenu({
  items,
  trigger = "Menu",
  label = "Site navigation",
  open,
  defaultOpen = false,
  onOpenChange,
  className,
  panelClassName,
  maxWidth = 720,
  disabled = false,
}: MorphMenuProps) {
  const [expanded, setExpanded] = useControllable(open, defaultOpen, onOpenChange);

  return (
    <Morph
      label={label}
      open={expanded}
      onOpenChange={setExpanded}
      maxWidth={maxWidth}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-2 rounded-[999px] border border-[color:var(--color-line,rgba(70,90,115,.1))] bg-white px-4 py-2.5 text-sm shadow-sm",
        className,
      )}
      expandedClassName={cn(
        "rounded-[28px] border border-[color:var(--color-line,rgba(70,90,115,.1))] bg-[color:var(--color-milk,#fcfbf8)] p-6 shadow-2xl sm:p-9",
        panelClassName,
      )}
      expanded={
        <div>
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-[color:var(--color-ink-500,#7b8492)]">{label}</p>
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="rounded-[999px] border border-[color:var(--color-line,rgba(70,90,115,.1))] px-3 py-1.5 text-sm"
            >
              Close
            </button>
          </div>
          <nav aria-label={label} className="mt-7">
            <ul className="divide-y divide-[color:var(--color-line,rgba(70,90,115,.1))]">
              {items.map((item, index) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    onClick={() => {
                      item.onSelect?.();
                      setExpanded(false);
                    }}
                    className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 py-4"
                  >
                    <span className="font-mono text-xs text-[color:var(--color-ink-500,#7b8492)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <span className="block text-xl font-semibold">{item.label}</span>
                      {item.description ? (
                        <span className="mt-1 block text-sm text-[color:var(--color-ink-700,#505865)]">
                          {item.description}
                        </span>
                      ) : null}
                    </span>
                    <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      }
    >
      <span aria-hidden className="grid size-5 place-items-center">≡</span>
      {trigger}
    </Morph>
  );
}
