"use client";

import { useState, type ReactNode } from "react";

import { cn } from "../internal/cn";

export type SortableDataColumn = { id: string; label: string };
export type SortableDataRow = { id: string; label: string; secondary?: string; values: Record<string, ReactNode> };
export type SortableDataRowsProps = {
  columns: SortableDataColumn[];
  items: SortableDataRow[];
  onReorder: (items: SortableDataRow[]) => void;
  label?: string;
  className?: string;
};

/** A table-shaped reorder pattern with native drag acceleration and touch-safe buttons. */
export function SortableDataRows({ columns, items, onReorder, label = "Sortable data rows", className }: SortableDataRowsProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [grabbedId, setGrabbedId] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const gridStyle = { gridTemplateColumns: `minmax(9rem, 1.35fr) repeat(${columns.length}, minmax(4.5rem, 1fr)) auto` };

  const move = (id: string, destination: number) => {
    const from = items.findIndex((item) => item.id === id);
    if (from < 0) return;
    const nextIndex = Math.max(0, Math.min(items.length - 1, destination));
    if (from === nextIndex) return;
    const next = [...items];
    const [item] = next.splice(from, 1);
    if (!item) return;
    next.splice(nextIndex, 0, item);
    onReorder(next);
    setAnnouncement(`${item.label} moved to position ${nextIndex + 1} of ${items.length}.`);
  };
  const moveBy = (id: string, offset: number) => {
    const index = items.findIndex((item) => item.id === id);
    if (index >= 0) move(id, index + offset);
  };
  const drop = (targetId: string) => {
    if (!draggingId || draggingId === targetId) return;
    const target = items.findIndex((item) => item.id === targetId);
    move(draggingId, target);
    setDraggingId(null);
    setOverId(null);
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, id: string) => {
    if (event.key === " " || event.key === "Spacebar") {
      event.preventDefault();
      setGrabbedId((current) => {
        const next = current === id ? null : id;
        setAnnouncement(next ? `Grabbed ${items.find((item) => item.id === id)?.label ?? "row"}. Use Arrow Up or Arrow Down to move, then Space to drop.` : "Dropped row.");
        return next;
      });
    } else if (grabbedId === id && (event.key === "ArrowUp" || event.key === "ArrowDown")) {
      event.preventDefault();
      moveBy(id, event.key === "ArrowUp" ? -1 : 1);
    } else if (grabbedId === id && event.key === "Escape") {
      event.preventDefault();
      setGrabbedId(null);
      setAnnouncement("Reorder cancelled.");
    }
  };

  return (
    <div className={cn("w-full overflow-x-auto rounded-[20px] border border-line bg-white", className)}>
      <div role="table" aria-label={label} className="min-w-[34rem] text-sm">
        <div role="row" style={gridStyle} className="grid items-center gap-3 border-b border-line bg-cloud-50 px-3 py-2.5 text-[0.6875rem] font-medium text-ink-500 sm:px-4"><span role="columnheader">Item</span>{columns.map((column) => <span key={column.id} role="columnheader">{column.label}</span>)}<span role="columnheader" className="sr-only">Reorder</span></div>
        {items.map((item, index) => {
          const grabbed = grabbedId === item.id;
          const target = overId === item.id && draggingId !== item.id;
          return (
            <div
              key={item.id}
              role="row"
              draggable
              onDragStart={() => { setDraggingId(item.id); setAnnouncement(`Dragging ${item.label}.`); }}
              onDragOver={(event) => { event.preventDefault(); setOverId(item.id); }}
              onDrop={() => drop(item.id)}
              onDragEnd={() => { setDraggingId(null); setOverId(null); }}
              data-dragging={draggingId === item.id ? "true" : undefined}
              data-drop-target={target ? "true" : undefined}
              style={gridStyle}
              className={cn("grid items-center gap-3 border-b border-line px-3 py-3 transition-colors last:border-b-0 sm:px-4", grabbed && "bg-blush-50", target && "border-t-2 border-t-ink-900 bg-cloud-50")}
            >
              <div role="cell" className="min-w-0"><p className="truncate font-medium text-ink-900">{item.label}</p>{item.secondary ? <p className="mt-0.5 truncate text-xs text-ink-500">{item.secondary}</p> : null}</div>
              {columns.map((column) => <div key={column.id} role="cell" className="min-w-0 truncate text-ink-700">{item.values[column.id]}</div>)}
              <div role="cell" className="flex items-center justify-end gap-1">
                <button type="button" aria-label={`Reorder ${item.label}`} aria-pressed={grabbed} onKeyDown={(event) => handleKeyDown(event, item.id)} className="grid size-11 shrink-0 cursor-grab place-items-center rounded-lg border border-line text-ink-500 hover:border-ink-900 hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20 sm:size-9">↕</button>
                <div className="flex gap-1"><button type="button" disabled={index === 0} aria-label={`Move ${item.label} up`} onClick={() => moveBy(item.id, -1)} className="grid size-11 place-items-center rounded-lg border border-line text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20 disabled:opacity-30 sm:size-9">↑</button><button type="button" disabled={index === items.length - 1} aria-label={`Move ${item.label} down`} onClick={() => moveBy(item.id, 1)} className="grid size-11 place-items-center rounded-lg border border-line text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20 disabled:opacity-30 sm:size-9">↓</button></div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex min-w-[34rem] items-center justify-between gap-3 border-t border-line bg-milk px-3 py-2.5 text-xs text-ink-500 sm:px-4"><span>Drag rows on desktop; use ↑ ↓ on touch.</span><span>Focus ↕, press Space, then use arrows.</span></div>
      <p aria-live="polite" className="sr-only">{announcement}</p>
    </div>
  );
}
