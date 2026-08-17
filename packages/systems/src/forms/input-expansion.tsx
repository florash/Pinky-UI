"use client";

import { motion } from "motion/react";
import { useMotionEnabled } from "@pinky-ui/primitives";
import { useCallback, useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";

import { cn } from "../internal/cn";
import { useControllable } from "../internal/use-controllable";

function focusLater(element: HTMLElement | null) {
  requestAnimationFrame(() => element?.focus());
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export type MorphingInputProps = {
  label: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  description?: ReactNode;
  className?: string;
};

/** A compact value surface that becomes its own focused editor without losing identity. */
export function MorphingInput({ label, value, defaultValue = "", onValueChange, placeholder = "Add a note", description, className }: MorphingInputProps) {
  const id = useId();
  const inputId = `${id}-input`;
  const descriptionId = `${id}-description`;
  const [current, setCurrent] = useControllable(value, defaultValue, onValueChange);
  const [draft, setDraft] = useState(current);
  const [editing, setEditing] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const wasEditing = useRef(false);
  const motionEnabled = useMotionEnabled();

  useEffect(() => {
    if (editing) {
      wasEditing.current = true;
      focusLater(input.current);
    } else {
      setDraft(current);
      if (wasEditing.current) {
        wasEditing.current = false;
        focusLater(trigger.current);
      }
    }
  }, [current, editing]);

  const cancel = () => {
    setDraft(current);
    setEditing(false);
  };
  const save = () => {
    setCurrent(draft);
    setEditing(false);
  };

  return (
    <motion.div layout={motionEnabled} className={cn("w-full max-w-xl rounded-[24px] border border-line bg-white p-3 shadow-soft", className)}>
      {!editing ? (
        <button
          ref={trigger}
          type="button"
          aria-label={`Edit ${label}`}
          aria-expanded={false}
          aria-controls={inputId}
          onClick={() => { setDraft(current); setEditing(true); }}
          className="flex w-full items-center justify-between gap-4 rounded-[18px] bg-cloud-50 px-4 py-3 text-left transition-colors hover:bg-blush-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20"
        >
          <span className="min-w-0"><span className="block text-xs text-ink-500">{label}</span><span className="mt-1 block truncate text-sm text-ink-900">{current || <span className="text-ink-400">{placeholder}</span>}</span></span>
          <span className="shrink-0 rounded-full border border-line bg-white px-2.5 py-1 text-[0.625rem] text-ink-500">Edit</span>
        </button>
      ) : (
        <form onSubmit={(event) => { event.preventDefault(); save(); }} className="rounded-[18px] bg-blush-50/70 p-3">
          <label htmlFor={inputId} className="block text-xs text-ink-600">{label}</label>
          {description ? <p id={descriptionId} className="mt-1 text-xs leading-relaxed text-ink-500">{description}</p> : null}
          <div className="mt-3 flex flex-wrap gap-2 sm:flex-nowrap">
            <input ref={input} id={inputId} value={draft} placeholder={placeholder} aria-describedby={description ? descriptionId : undefined} onChange={(event) => setDraft(event.currentTarget.value)} onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); cancel(); } }} className="min-w-0 flex-1 rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-ink-900 focus:ring-2 focus:ring-ink-900/10" />
            <button type="submit" className="rounded-xl bg-ink-900 px-3.5 py-2.5 text-xs text-milk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/30">Save</button>
            <button type="button" onClick={cancel} className="rounded-xl border border-line bg-white px-3.5 py-2.5 text-xs text-ink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20">Cancel</button>
          </div>
        </form>
      )}
    </motion.div>
  );
}

export type ExpandableComposerProps = {
  label?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  className?: string;
};

/** A small composer grows into a richer, attached editing surface as intent increases. */
export function ExpandableComposer({ label = "Composer", value, defaultValue = "", onValueChange, onSubmit, placeholder = "Write a message…", className }: ExpandableComposerProps) {
  const id = useId();
  const textareaId = `${id}-textarea`;
  const [draft, setDraft] = useControllable(value, defaultValue, onValueChange);
  const [expanded, setExpanded] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const compact = useRef<HTMLInputElement>(null);
  const expandedField = useRef<HTMLTextAreaElement>(null);
  const motionEnabled = useMotionEnabled();

  useEffect(() => {
    if (expanded) focusLater(expandedField.current);
  }, [expanded]);

  const close = () => {
    setExpanded(false);
    setToolsOpen(false);
    focusLater(compact.current);
  };
  const submit = () => {
    if (!draft.trim()) return;
    onSubmit?.(draft.trim());
    setExpanded(false);
    setToolsOpen(false);
    focusLater(compact.current);
  };

  return (
    <motion.div layout={motionEnabled} className={cn("w-full max-w-2xl rounded-[24px] border border-line bg-white p-3 shadow-soft", className)}>
      {!expanded ? (
        <div className="flex items-center gap-2 rounded-[18px] bg-cloud-50 px-3 py-2">
          <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-xl bg-white text-sm text-ink-500">↗</span>
          <label htmlFor={textareaId} className="sr-only">{label}</label>
          <input ref={compact} id={textareaId} value={draft} placeholder={placeholder} onFocus={() => setExpanded(true)} onChange={(event) => { setDraft(event.currentTarget.value); if (event.currentTarget.value) setExpanded(true); }} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); setExpanded(true); } }} className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm text-ink-900 outline-none placeholder:text-ink-400" />
          <span className="hidden rounded-md border border-line bg-white px-1.5 py-1 font-mono text-[0.6rem] text-ink-500 sm:inline">↵</span>
        </div>
      ) : (
        <motion.div layout className="rounded-[20px] bg-blush-50/70 p-3" initial={motionEnabled ? { opacity: 0, y: 4 } : false} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between gap-3"><label htmlFor={textareaId} className="font-mono text-[0.625rem] tracking-[0.14em] text-ink-500 uppercase">{label}</label><button type="button" onClick={close} className="rounded-full px-2 py-1 text-xs text-ink-500 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20">Close</button></div>
          <textarea ref={expandedField} id={textareaId} value={draft} rows={3} placeholder={placeholder} onChange={(event) => setDraft(event.currentTarget.value)} onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); close(); } }} className="mt-3 min-h-24 w-full resize-y rounded-[16px] border border-line bg-white px-3 py-3 text-sm leading-relaxed text-ink-900 outline-none focus:border-ink-900 focus:ring-2 focus:ring-ink-900/10" />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2"><div className="flex items-center gap-2"><button type="button" aria-expanded={toolsOpen} onClick={() => setToolsOpen((open) => !open)} className="rounded-xl border border-line bg-white px-3 py-2 text-xs text-ink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20">Tools</button>{toolsOpen ? <span className="rounded-xl bg-white px-3 py-2 text-xs text-ink-500">Attach · Mention · Format</span> : null}</div><button type="button" onClick={submit} disabled={!draft.trim()} className="rounded-xl bg-ink-900 px-3.5 py-2 text-xs text-milk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/30 disabled:cursor-not-allowed disabled:opacity-40">Send</button></div>
        </motion.div>
      )}
    </motion.div>
  );
}

export type TokenFieldProps = {
  label: string;
  tokens?: string[];
  defaultTokens?: string[];
  onTokensChange?: (tokens: string[]) => void;
  placeholder?: string;
  className?: string;
};

/** A real multi-value field with token confirmation, keyboard traversal and removable values. */
export function TokenField({ label, tokens, defaultTokens = [], onTokensChange, placeholder = "Add a value", className }: TokenFieldProps) {
  const id = useId();
  const inputId = `${id}-input`;
  const [current, setCurrent] = useControllable(tokens, defaultTokens, onTokensChange);
  const [draft, setDraft] = useState("");
  const tokenRefs = useRef<Array<HTMLDivElement | null>>([]);
  const update = (next: string[]) => setCurrent(next);
  const commit = () => {
    const value = draft.trim();
    if (!value || current.includes(value)) return;
    update([...current, value]);
    setDraft("");
  };
  const remove = (index: number) => update(current.filter((_, tokenIndex) => tokenIndex !== index));
  const moveToken = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex >= 0 && nextIndex < current.length) tokenRefs.current[nextIndex]?.focus();
    else if (direction === 1) document.getElementById(inputId)?.focus();
  };

  return (
    <div className={cn("w-full max-w-xl", className)}>
      <label htmlFor={inputId} className="block text-sm font-medium text-ink-900">{label}</label>
      <div className="mt-2 flex min-h-14 flex-wrap items-center gap-2 rounded-[18px] border border-line bg-white p-2.5 shadow-soft focus-within:border-ink-900 focus-within:ring-2 focus-within:ring-ink-900/10">
        {current.map((token, index) => (
          <div key={`${token}-${index}`} ref={(element) => { tokenRefs.current[index] = element; }} role="group" tabIndex={0} aria-label={`Token ${token}`} onKeyDown={(event) => { if (event.key === "Backspace" || event.key === "Delete") { event.preventDefault(); remove(index); } if (event.key === "ArrowLeft") { event.preventDefault(); moveToken(index, -1); } if (event.key === "ArrowRight") { event.preventDefault(); moveToken(index, 1); } }} className="flex items-center gap-1 rounded-xl bg-blush-50 px-2.5 py-1.5 text-xs text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25">
            <span>{token}</span><button type="button" aria-label={`Remove ${token}`} onClick={() => remove(index)} className="grid size-5 place-items-center rounded-full text-ink-500 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20">×</button>
          </div>
        ))}
        <input id={inputId} value={draft} placeholder={current.length ? "Add another" : placeholder} onChange={(event) => setDraft(event.currentTarget.value)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === ",") { event.preventDefault(); commit(); } if (event.key === "Backspace" && !draft && current.length) { event.preventDefault(); remove(current.length - 1); } if (event.key === "ArrowLeft" && !draft && current.length) { event.preventDefault(); tokenRefs.current[current.length - 1]?.focus(); } }} className="min-w-[8rem] flex-1 bg-transparent px-1.5 py-2 text-sm text-ink-900 outline-none placeholder:text-ink-400" />
      </div>
      <p className="mt-2 text-xs text-ink-500">Press Enter or comma to keep a value. Backspace removes the previous token.</p>
    </div>
  );
}

export type MultiValueCondition = { id: string; field: string; operator: string; value: string };
export type MultiValueBuilderProps = { conditions?: MultiValueCondition[]; defaultConditions?: MultiValueCondition[]; onConditionsChange?: (conditions: MultiValueCondition[]) => void; className?: string };

/** A compact condition composer with coordinated property, operator and value rows. */
export function MultiValueBuilder({ conditions, defaultConditions = [{ id: "condition-1", field: "Status", operator: "is", value: "Active" }], onConditionsChange, className }: MultiValueBuilderProps) {
  const [current, setCurrent] = useControllable(conditions, defaultConditions, onConditionsChange);
  const update = (next: MultiValueCondition[]) => setCurrent(next);
  const updateRow = (id: string, patch: Partial<MultiValueCondition>) => update(current.map((row) => row.id === id ? { ...row, ...patch } : row));
  const add = () => update([...current, { id: `condition-${current.length + 1}`, field: "Owner", operator: "is", value: "Flora" }]);
  return (
    <fieldset className={cn("w-full max-w-2xl rounded-[22px] border border-line bg-white p-4 shadow-soft", className)}>
      <legend className="px-1 text-sm font-medium text-ink-900">Build a view</legend>
      <div className="mt-3 space-y-2">
        {current.map((row, index) => <div key={row.id} className="flex flex-wrap items-center gap-2 rounded-[16px] bg-cloud-50 p-2"><span className="w-10 shrink-0 px-1 font-mono text-[0.625rem] tracking-[0.12em] text-ink-500 uppercase">{index ? "And" : "Where"}</span><label className="sr-only" htmlFor={`${row.id}-field`}>Property {index + 1}</label><select id={`${row.id}-field`} value={row.field} onChange={(event) => updateRow(row.id, { field: event.currentTarget.value })} className="min-w-28 flex-1 rounded-xl border border-line bg-white px-2.5 py-2 text-xs text-ink-900 outline-none focus:border-ink-900"><option>Status</option><option>Owner</option><option>Type</option></select><label className="sr-only" htmlFor={`${row.id}-operator`}>Operator {index + 1}</label><select id={`${row.id}-operator`} value={row.operator} onChange={(event) => updateRow(row.id, { operator: event.currentTarget.value })} className="min-w-20 flex-1 rounded-xl border border-line bg-white px-2.5 py-2 text-xs text-ink-900 outline-none focus:border-ink-900"><option>is</option><option>is not</option><option>contains</option></select><label className="sr-only" htmlFor={`${row.id}-value`}>Value {index + 1}</label><input id={`${row.id}-value`} value={row.value} onChange={(event) => updateRow(row.id, { value: event.currentTarget.value })} className="min-w-28 flex-1 rounded-xl border border-line bg-white px-2.5 py-2 text-xs text-ink-900 outline-none focus:border-ink-900" />{current.length > 1 ? <button type="button" aria-label={`Remove condition ${index + 1}`} onClick={() => update(current.filter((item) => item.id !== row.id))} className="grid size-8 shrink-0 place-items-center rounded-xl border border-line bg-white text-ink-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20">×</button> : null}</div>)}
      </div>
      <button type="button" onClick={add} className="mt-3 rounded-xl border border-line bg-white px-3 py-2 text-xs text-ink-700 hover:bg-blush-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20">+ Add condition</button>
    </fieldset>
  );
}

export type SmartSuggestionFieldProps = { label: string; options: string[]; value?: string; defaultValue?: string; onValueChange?: (value: string) => void; onSelect?: (value: string) => void; placeholder?: string; className?: string };

/** A combobox that distinguishes the raw draft from an explicit suggested completion. */
export function SmartSuggestionField({ label, options, value, defaultValue = "", onValueChange, onSelect, placeholder = "Type a city", className }: SmartSuggestionFieldProps) {
  const id = useId();
  const listId = `${id}-suggestions`;
  const [query, setQuery] = useControllable(value, defaultValue, onValueChange);
  const [focused, setFocused] = useState(false);
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const matches = options.filter((option) => option.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 5);
  const open = focused && Boolean(query.trim()) && matches.length > 0;
  const ghost = matches.find((option) => option.toLowerCase().startsWith(query.trim().toLowerCase()));
  useEffect(() => { if (active >= matches.length) setActive(0); }, [active, matches.length]);
  const choose = (option: string) => { setQuery(option); onSelect?.(option); setFocused(false); focusLater(input.current); };
  return (
    <div className={cn("relative w-full max-w-xl", className)}>
      <label htmlFor={id} className="block text-sm font-medium text-ink-900">{label}</label>
      <div className="relative mt-2 rounded-[18px] border border-line bg-white shadow-soft focus-within:border-ink-900 focus-within:ring-2 focus-within:ring-ink-900/10">
        {ghost && query && ghost.toLowerCase().startsWith(query.toLowerCase()) ? <span aria-hidden className="pointer-events-none absolute inset-y-0 left-3 flex items-center whitespace-pre text-sm text-ink-400"><span className="invisible">{query}</span>{ghost.slice(query.length)}</span> : null}
        <input ref={input} id={id} role="combobox" aria-autocomplete="list" aria-expanded={open} aria-controls={open ? listId : undefined} aria-activedescendant={open ? `${listId}-${active}` : undefined} value={query} placeholder={placeholder} onFocus={() => setFocused(true)} onBlur={() => window.setTimeout(() => setFocused(false), 120)} onChange={(event) => { setQuery(event.currentTarget.value); setActive(0); }} onKeyDown={(event) => { if (event.key === "ArrowDown" && open) { event.preventDefault(); setActive((index) => (index + 1) % matches.length); } if (event.key === "ArrowUp" && open) { event.preventDefault(); setActive((index) => (index - 1 + matches.length) % matches.length); } if (event.key === "Enter" && open && matches[active]) { event.preventDefault(); choose(matches[active]); } if (event.key === "Escape") { event.preventDefault(); setFocused(false); } }} className="relative z-10 w-full bg-transparent px-3 py-3 text-sm text-ink-900 outline-none placeholder:text-ink-400" />
      </div>
      {open ? <ul id={listId} role="listbox" aria-label={`${label} suggestions`} className="absolute inset-x-0 z-10 mt-2 overflow-hidden rounded-[18px] border border-line bg-white p-1.5 shadow-lift">{matches.map((option, index) => <li key={option} id={`${listId}-${index}`} role="option" aria-selected={index === active}><button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => choose(option)} className={cn("flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20", index === active ? "bg-blush-50 text-ink-900" : "text-ink-700 hover:bg-cloud-50")}><span>{option}</span>{index === active ? <span className="font-mono text-[0.6rem] text-ink-500">Enter</span> : null}</button></li>)}</ul> : null}
      <p className="mt-2 text-xs text-ink-500">A suggestion is proposed, never silently substituted.</p>
    </div>
  );
}

export type InlineCommand = { id: string; label: string; description?: string };
export type InlineCommandFieldProps = { label?: string; commands: InlineCommand[]; tokens?: InlineCommand[]; onTokensChange?: (tokens: InlineCommand[]) => void; placeholder?: string; className?: string };

/** A composition field where slash commands become explicit removable structured tokens. */
export function InlineCommandField({ label = "Notes", commands, tokens, onTokensChange, placeholder = "Type / for a command", className }: InlineCommandFieldProps) {
  const id = useId();
  const listId = `${id}-commands`;
  const [current, setCurrent] = useState<InlineCommand[]>(tokens ?? []);
  const [draft, setDraft] = useState("");
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const selected = tokens ?? current;
  const commandQuery = draft.match(/(?:^|\s)\/([^\s]*)$/)?.[1] ?? null;
  const matches = commandQuery === null ? [] : commands.filter((command) => command.label.toLowerCase().includes(commandQuery.toLowerCase()));
  const open = commandQuery !== null && matches.length > 0;
  useEffect(() => { if (active >= matches.length) setActive(0); }, [active, matches.length]);
  const update = (next: InlineCommand[]) => { if (tokens === undefined) setCurrent(next); onTokensChange?.(next); };
  const choose = (command: InlineCommand) => { update([...selected, command]); setDraft(""); setActive(0); focusLater(input.current); };
  const remove = (idToRemove: string) => update(selected.filter((command) => command.id !== idToRemove));
  return (
    <div className={cn("relative w-full max-w-2xl", className)}>
      <label htmlFor={id} className="block text-sm font-medium text-ink-900">{label}</label>
      <div className="mt-2 flex min-h-14 flex-wrap items-center gap-2 rounded-[18px] border border-line bg-white p-2.5 shadow-soft focus-within:border-ink-900 focus-within:ring-2 focus-within:ring-ink-900/10">
        {selected.map((command) => <span key={command.id} className="flex items-center gap-1 rounded-xl bg-cloud-100 px-2.5 py-1.5 text-xs text-ink-900"><span>/ {command.label}</span><button type="button" aria-label={`Remove ${command.label} command`} onClick={() => remove(command.id)} className="grid size-5 place-items-center rounded-full text-ink-500 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20">×</button></span>)}
        <input ref={input} id={id} role="combobox" aria-autocomplete="list" aria-expanded={open} aria-controls={open ? listId : undefined} aria-activedescendant={open ? `${listId}-${active}` : undefined} value={draft} placeholder={selected.length ? "Add another command" : placeholder} onChange={(event) => { setDraft(event.currentTarget.value); setActive(0); }} onKeyDown={(event) => { if (event.key === "ArrowDown" && open) { event.preventDefault(); setActive((index) => (index + 1) % matches.length); } if (event.key === "ArrowUp" && open) { event.preventDefault(); setActive((index) => (index - 1 + matches.length) % matches.length); } if (event.key === "Enter" && open && matches[active]) { event.preventDefault(); choose(matches[active]); } if (event.key === "Escape") { event.preventDefault(); setDraft(""); } if (event.key === "Backspace" && !draft && selected.length) { event.preventDefault(); remove(selected[selected.length - 1]!.id); } }} className="min-w-[10rem] flex-1 bg-transparent px-1.5 py-2 text-sm text-ink-900 outline-none placeholder:text-ink-400" />
      </div>
      {open ? <ul id={listId} role="listbox" aria-label="Inline commands" className="absolute inset-x-0 z-10 mt-2 overflow-hidden rounded-[18px] border border-line bg-white p-1.5 shadow-lift">{matches.map((command, index) => <li key={command.id} id={`${listId}-${index}`} role="option" aria-selected={index === active}><button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => choose(command)} className={cn("w-full rounded-xl px-3 py-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20", index === active ? "bg-blush-50" : "hover:bg-cloud-50")}><span className="text-sm text-ink-900">/ {command.label}</span>{command.description ? <span className="mt-0.5 block text-xs text-ink-500">{command.description}</span> : null}</button></li>)}</ul> : null}
      <p className="mt-2 text-xs text-ink-500">Commands become visible tokens inside the composition, separate from navigation commands.</p>
    </div>
  );
}

export type ProgressiveDisclosureFieldProps = { label: string; defaultMode?: "pickup" | "ship"; onModeChange?: (mode: "pickup" | "ship") => void; className?: string };

/** A simple field choice reveals only the dependent inputs that the choice requires. */
export function ProgressiveDisclosureField({ label, defaultMode = "pickup", onModeChange, className }: ProgressiveDisclosureFieldProps) {
  const id = useId();
  const [mode, setMode] = useState(defaultMode);
  const motionEnabled = useMotionEnabled();
  const choose = (next: "pickup" | "ship") => { setMode(next); onModeChange?.(next); };
  return (
    <fieldset className={cn("w-full max-w-xl rounded-[22px] border border-line bg-white p-4 shadow-soft", className)}>
      <legend className="px-1 text-sm font-medium text-ink-900">{label}</legend>
      <div className="mt-3 grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label={label} aria-expanded={mode === "ship"} aria-controls={`${id}-details`}>
        {(["pickup", "ship"] as const).map((option) => <label key={option} className={cn("flex cursor-pointer items-center gap-3 rounded-[16px] border px-3 py-3 text-sm transition-colors focus-within:ring-2 focus-within:ring-ink-900/15", mode === option ? "border-ink-900 bg-blush-50" : "border-line bg-white hover:bg-cloud-50")}><input type="radio" name={id} value={option} checked={mode === option} onChange={() => choose(option)} className="accent-ink-900" /><span>{option === "pickup" ? "Pick up" : "Ship to an address"}</span></label>)}
      </div>
      <motion.div layout={motionEnabled} id={`${id}-details`} aria-hidden={mode !== "ship"} className={cn("overflow-hidden", mode === "ship" ? "mt-3" : "h-0")}>
        {mode === "ship" ? <div className="grid gap-3 rounded-[18px] bg-cloud-50 p-3 sm:grid-cols-2"><label className="text-xs text-ink-600 sm:col-span-2">Address<input className="mt-1.5 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-ink-900" placeholder="12 Cloud Street" /></label><label className="text-xs text-ink-600">City<input className="mt-1.5 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-ink-900" placeholder="Melbourne" /></label><label className="text-xs text-ink-600">Postcode<input className="mt-1.5 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-ink-900" placeholder="3000" inputMode="numeric" /></label></div> : null}
      </motion.div>
      <p aria-live="polite" className="mt-3 text-xs text-ink-500">{mode === "ship" ? "Shipping details are now part of this field." : "Pickup keeps the extra address fields closed."}</p>
    </fieldset>
  );
}

export type PropertyRailItem = { id: string; label: string; value: string; options?: string[] };
export type EditablePropertyRailProps = { items: PropertyRailItem[]; onItemsChange?: (items: PropertyRailItem[]) => void; className?: string };

/** A stable property list that turns one contextual row into an editor at a time. */
export function EditablePropertyRail({ items, onItemsChange, className }: EditablePropertyRailProps) {
  const [internalItems, setInternalItems] = useState(items);
  const displayedItems = onItemsChange ? items : internalItems;
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const input = useRef<HTMLInputElement | HTMLSelectElement>(null);
  const motionEnabled = useMotionEnabled();
  useEffect(() => { if (editing) focusLater(input.current); }, [editing]);
  const open = (item: PropertyRailItem) => { setDraft(item.value); setEditing(item.id); };
  const cancel = () => { setEditing(null); setDraft(""); };
  const save = () => { if (!editing) return; const next = displayedItems.map((item) => item.id === editing ? { ...item, value: draft } : item); if (onItemsChange) onItemsChange(next); else setInternalItems(next); cancel(); };
  return (
    <motion.div layout={motionEnabled} className={cn("w-full max-w-xl divide-y divide-line overflow-hidden rounded-[22px] border border-line bg-white shadow-soft", className)}>
      {displayedItems.map((item) => editing === item.id ? (
        <form key={item.id} onSubmit={(event) => { event.preventDefault(); save(); }} className="flex flex-wrap items-center gap-3 bg-blush-50/70 p-4"><span className="w-24 shrink-0 text-sm font-medium text-ink-900">{item.label}</span>{item.options ? <select ref={input as React.RefObject<HTMLSelectElement>} value={draft} onChange={(event) => setDraft(event.currentTarget.value)} onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); cancel(); } }} className="min-w-0 flex-1 rounded-xl border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-ink-900">{item.options.map((option) => <option key={option}>{option}</option>)}</select> : <input ref={input as React.RefObject<HTMLInputElement>} value={draft} onChange={(event) => setDraft(event.currentTarget.value)} onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); cancel(); } }} className="min-w-0 flex-1 rounded-xl border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-ink-900" aria-label={`Edit ${item.label}`} />}<button type="submit" className="rounded-xl bg-ink-900 px-3 py-2.5 text-xs text-milk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/30">Save</button><button type="button" onClick={cancel} className="rounded-xl border border-line bg-white px-3 py-2.5 text-xs text-ink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20">Cancel</button></form>
      ) : (
        <div key={item.id} className="flex items-center gap-3 p-4"><span className="w-24 shrink-0 text-sm text-ink-500">{item.label}</span><span className="min-w-0 flex-1 truncate text-sm text-ink-900">{item.value}</span><button type="button" onClick={() => open(item)} aria-label={`Edit ${item.label}`} className="shrink-0 rounded-xl border border-line px-3 py-2 text-xs text-ink-700 hover:bg-blush-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20">Edit</button></div>
      ))}
    </motion.div>
  );
}

export type ContextualFormattingBarProps = { label?: string; defaultContent?: string; className?: string };

/** A small formatting surface appears only when a real selection exists in the editor. */
export function ContextualFormattingBar({ label = "Editable note", defaultContent = "Select a phrase to shape its emphasis.", className }: ContextualFormattingBarProps) {
  const editor = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const [format, setFormat] = useState("Select text");
  const [focused, setFocused] = useState(false);
  const updatePosition = useCallback(() => {
    const root = editor.current;
    const selection = window.getSelection();
    if (!root || !selection || selection.rangeCount === 0 || selection.isCollapsed || !root.contains(selection.anchorNode)) { setPosition(focused ? { top: 8, left: 8 } : null); return; }
    const range = selection.getRangeAt(0).getBoundingClientRect();
    const bounds = root.getBoundingClientRect();
    setPosition({ top: Math.max(8, range.top - bounds.top - 48), left: clamp(range.left - bounds.left, 0, Math.max(0, bounds.width - 190)) });
  }, [focused]);
  useEffect(() => { document.addEventListener("selectionchange", updatePosition); return () => document.removeEventListener("selectionchange", updatePosition); }, [updatePosition]);
  const apply = (command: "bold" | "italic") => { document.execCommand(command); setFormat(command === "bold" ? "Bold" : "Italic"); updatePosition(); };
  return (
    <div className={cn("relative w-full max-w-2xl", className)}>
      <p className="text-sm font-medium text-ink-900">{label}</p>
      <div ref={editor} role="textbox" aria-multiline="true" onFocus={() => { setFocused(true); setPosition({ top: 8, left: 8 }); }} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) { setFocused(false); setPosition(null); } }} onMouseUp={updatePosition} onKeyUp={updatePosition} className="relative mt-2 min-h-36 rounded-[22px] border border-line bg-white p-5 text-sm leading-8 text-ink-900 shadow-soft outline-none focus-within:border-ink-900 focus-within:ring-2 focus-within:ring-ink-900/10" contentEditable suppressContentEditableWarning aria-label={label} dangerouslySetInnerHTML={{ __html: defaultContent }} />
      {position ? <div role="toolbar" aria-label="Text formatting" className="absolute z-10 flex max-w-[calc(100vw-3rem)] gap-1 rounded-xl border border-line bg-ink-900 p-1 text-milk shadow-lift" style={{ top: position.top, left: position.left }}><button type="button" aria-label="Bold" aria-pressed={format === "Bold"} onMouseDown={(event) => event.preventDefault()} onClick={() => apply("bold")} className="rounded-lg px-2.5 py-1.5 text-xs font-semibold hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70">B</button><button type="button" aria-label="Italic" aria-pressed={format === "Italic"} onMouseDown={(event) => event.preventDefault()} onClick={() => apply("italic")} className="rounded-lg px-2.5 py-1.5 text-xs italic hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70">I</button><span className="px-2 py-1.5 text-[0.625rem] text-white/70">{format}</span></div> : null}
      <p className="mt-2 text-xs text-ink-500">Select text to reveal the attached tools. No floating editor is created outside the field.</p>
    </div>
  );
}

export type UnitScrubberProps = { label: string; value?: number; defaultValue?: number; onValueChange?: (value: number) => void; min?: number; max?: number; step?: number; unit?: string; className?: string };

/** A numeric field with a separate pointer/touch scrub affordance and a native editable value. */
export function UnitScrubber({ label, value, defaultValue = 24, onValueChange, min = 0, max = 100, step = 1, unit = "px", className }: UnitScrubberProps) {
  const [current, setCurrent] = useControllable(value, defaultValue, onValueChange);
  const [raw, setRaw] = useState(String(defaultValue));
  const [dragging, setDragging] = useState(false);
  const scrubber = useRef<HTMLDivElement>(null);
  const motionEnabled = useMotionEnabled();
  useEffect(() => { setRaw(String(current)); }, [current]);
  const update = (next: number) => setCurrent(clamp(Math.round(next / step) * step, min, max));
  const updateFromPointer = (clientX: number) => { const rect = scrubber.current?.getBoundingClientRect(); if (!rect) return; update(min + ((clientX - rect.left) / Math.max(rect.width, 1)) * (max - min)); };
  const commitRaw = () => { const parsed = Number(raw); if (Number.isFinite(parsed)) update(parsed); else setRaw(String(current)); };
  return (
    <div className={cn("w-full max-w-xl", className)}>
      <div className="flex items-center justify-between gap-3"><span className="text-sm font-medium text-ink-900">{label}</span><span className="font-mono text-sm text-ink-700">{current} {unit}</span></div>
      <div ref={scrubber} data-testid="unit-scrubber-target" data-scrub-target onPointerDown={(event) => { event.currentTarget.setPointerCapture?.(event.pointerId); setDragging(true); updateFromPointer(event.clientX); }} onPointerMove={(event) => { if (dragging) updateFromPointer(event.clientX); }} onPointerUp={(event) => { event.currentTarget.releasePointerCapture?.(event.pointerId); setDragging(false); }} onPointerCancel={() => setDragging(false)} onLostPointerCapture={() => setDragging(false)} className={cn("relative mt-3 h-14 touch-none select-none rounded-[18px] border border-line bg-cloud-50 px-3 py-2", dragging ? "bg-blush-50" : "")} style={{ "--scrub-progress": `${((current - min) / Math.max(max - min, 1)) * 100}%` } as CSSProperties}>
        <div aria-hidden className="absolute inset-x-3 top-1/2 h-1 -translate-y-1/2 rounded-full bg-line"><span className="block h-full rounded-full bg-ink-900 transition-[width] duration-150 motion-reduce:transition-none" style={{ width: "var(--scrub-progress)" }} /></div>
        <span aria-hidden className="absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-ink-900 shadow-soft" style={{ left: `calc(12px + (100% - 24px) * ${((current - min) / Math.max(max - min, 1))})` }} />
        <span className="absolute inset-x-3 top-1.5 flex justify-between font-mono text-[0.55rem] text-ink-500"><span>drag to adjust</span><span>{min}–{max} {unit}</span></span>
      </div>
      <div className="mt-3 flex items-center gap-2"><label htmlFor={`${label}-value`} className="sr-only">{label} value</label><input id={`${label}-value`} type="number" value={raw} min={min} max={max} step={step} aria-valuetext={`${current} ${unit}`} onChange={(event) => setRaw(event.currentTarget.value)} onBlur={commitRaw} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); commitRaw(); } if (event.key === "Escape") { setRaw(String(current)); event.currentTarget.blur(); } }} className="w-28 rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-ink-900 focus:ring-2 focus:ring-ink-900/10" /><span className="text-sm text-ink-500">{unit}</span><span className="ml-auto text-xs text-ink-500">{motionEnabled ? "pointer · touch · arrows" : "direct value · arrows"}</span></div>
    </div>
  );
}

export type RangeComposerProps = { label?: string; start?: number; end?: number; defaultStart?: number; defaultEnd?: number; min?: number; max?: number; step?: number; unit?: string; onRangeChange?: (range: { start: number; end: number }) => void; className?: string };

/** A paired endpoint editor keeps the relationship between two values visible while either changes. */
export function RangeComposer({ label = "Range", start, end, defaultStart = 10, defaultEnd = 40, min = 0, max = 100, step = 1, unit = "px", onRangeChange, className }: RangeComposerProps) {
  const [internal, setInternal] = useState({ start: defaultStart, end: defaultEnd });
  const current = { start: start ?? internal.start, end: end ?? internal.end };
  const update = (next: { start: number; end: number }) => { if (start === undefined || end === undefined) setInternal(next); onRangeChange?.(next); };
  const setStart = (next: number) => update({ start: clamp(Math.min(next, current.end), min, max), end: current.end });
  const setEnd = (next: number) => update({ start: current.start, end: clamp(Math.max(next, current.start), min, max) });
  const span = ((current.end - current.start) / Math.max(max - min, 1)) * 100;
  return (
    <fieldset className={cn("w-full max-w-xl rounded-[22px] border border-line bg-white p-4 shadow-soft", className)}>
      <legend className="px-1 text-sm font-medium text-ink-900">{label}</legend>
      <div className="mt-4 h-8 px-2"><div className="relative top-1/2 h-1 -translate-y-1/2 rounded-full bg-line"><span className="absolute h-1 rounded-full bg-blush-300" style={{ left: `${((current.start - min) / Math.max(max - min, 1)) * 100}%`, width: `${span}%` }} /><span aria-hidden className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-ink-900" style={{ left: `${((current.start - min) / Math.max(max - min, 1)) * 100}%` }} /><span aria-hidden className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-ink-900" style={{ left: `${((current.end - min) / Math.max(max - min, 1)) * 100}%` }} /></div></div>
      <div className="grid gap-3 sm:grid-cols-2"><label className="text-xs text-ink-600">From<input aria-label={`${label} start`} type="number" value={current.start} min={min} max={current.end} step={step} onChange={(event) => setStart(event.currentTarget.valueAsNumber)} className="mt-1.5 w-full rounded-xl border border-line bg-milk px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-ink-900" /><span className="sr-only">{unit}</span></label><label className="text-xs text-ink-600">To<input aria-label={`${label} end`} type="number" value={current.end} min={current.start} max={max} step={step} onChange={(event) => setEnd(event.currentTarget.valueAsNumber)} className="mt-1.5 w-full rounded-xl border border-line bg-milk px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-ink-900" /><span className="sr-only">{unit}</span></label></div>
      <p className="mt-3 text-xs text-ink-500">{current.start}–{current.end} {unit} · endpoints stay ordered.</p>
    </fieldset>
  );
}

export type SegmentedInputComposerProps = { label: string; segments?: string[]; defaultSegments?: string[]; segmentLabels?: string[]; onSegmentsChange?: (segments: string[]) => void; className?: string };

/** A coordinated multi-part value with keyboard traversal and paste distribution. */
export function SegmentedInputComposer({ label, segments, defaultSegments = ["2026", "08", "15"], segmentLabels = ["Year", "Month", "Day"], onSegmentsChange, className }: SegmentedInputComposerProps) {
  const [current, setCurrent] = useControllable(segments, defaultSegments, onSegmentsChange);
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const update = (next: string[]) => setCurrent(next);
  const change = (index: number, value: string) => { const next = [...current]; next[index] = value; update(next); if (value.length >= (index === 0 ? 4 : 2)) refs.current[index + 1]?.focus(); };
  const distribute = (index: number, text: string) => { const cleaned = text.replace(/\D/g, ""); if (!cleaned) return; const lengths = current.map((_, itemIndex) => itemIndex === 0 ? 4 : 2); const next = [...current]; let offset = 0; for (let itemIndex = index; itemIndex < next.length && offset < cleaned.length; itemIndex += 1) { const length = lengths[itemIndex] ?? 2; next[itemIndex] = cleaned.slice(offset, offset + length); offset += length; } update(next); refs.current[Math.min(index + 1, next.length - 1)]?.focus(); };
  return (
    <fieldset className={cn("w-full max-w-xl rounded-[22px] border border-line bg-white p-4 shadow-soft", className)}>
      <legend className="px-1 text-sm font-medium text-ink-900">{label}</legend>
      <div className="mt-3 grid grid-cols-[1.5fr_1fr_1fr] gap-2"><span className="col-span-3 font-mono text-[0.6rem] tracking-[0.14em] text-ink-500 uppercase">One value · three coordinated parts</span>{current.map((part, index) => <label key={segmentLabels[index] ?? index} className="min-w-0 text-xs text-ink-600">{segmentLabels[index] ?? `Part ${index + 1}`}<input ref={(element) => { refs.current[index] = element; }} value={part} inputMode="numeric" maxLength={index === 0 ? 4 : 2} aria-label={segmentLabels[index] ?? `Part ${index + 1}`} onChange={(event) => change(index, event.currentTarget.value.replace(/\D/g, ""))} onPaste={(event) => { event.preventDefault(); distribute(index, event.clipboardData.getData("text")); }} onKeyDown={(event) => { if (event.key === "ArrowLeft" && event.currentTarget.selectionStart === 0) { event.preventDefault(); refs.current[index - 1]?.focus(); } if (event.key === "ArrowRight" && event.currentTarget.selectionStart === event.currentTarget.value.length) { event.preventDefault(); refs.current[index + 1]?.focus(); } if (event.key === "Backspace" && !event.currentTarget.value) refs.current[index - 1]?.focus(); }} className="mt-1.5 w-full rounded-xl border border-line bg-milk px-2.5 py-2.5 text-sm text-ink-900 outline-none focus:border-ink-900 focus:ring-2 focus:ring-ink-900/10" /></label>)}</div>
    </fieldset>
  );
}
