"use client";

import { useMotionEnabled } from "@pinky-ui/primitives";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

import { cn } from "./internal/cn";

export type SlashCommand = { id: string; label: string; description?: string };
export type PromptAttachment = { id: string; name: string };

export type PromptInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Textarea stops growing past this many lines and scrolls instead. */
  maxRows?: number;
  attachments?: PromptAttachment[];
  onRemoveAttachment?: (id: string) => void;
  onAttach?: () => void;
  /** Typing "/" at the start of an empty line opens this menu. */
  commands?: SlashCommand[];
  onCommand?: (command: SlashCommand) => void;
  className?: string;
};

export function PromptInput({
  value,
  onChange,
  onSubmit,
  placeholder = "Message…",
  disabled = false,
  maxRows = 8,
  attachments = [],
  onRemoveAttachment,
  onAttach,
  commands = [],
  onCommand,
  className,
}: PromptInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const motionEnabled = useMotionEnabled();
  const listId = useId();
  const [activeCommand, setActiveCommand] = useState(0);

  const showCommands = commands.length > 0 && value.startsWith("/") && !value.includes("\n");
  const query = value.slice(1).toLowerCase();
  const filtered = showCommands
    ? commands.filter((command) => command.id.toLowerCase().startsWith(query) || command.label.toLowerCase().startsWith(query))
    : [];

  useEffect(() => {
    const node = textareaRef.current;
    if (!node) return;
    const lineHeight = Number.parseFloat(getComputedStyle(node).lineHeight) || 20;
    node.style.height = "auto";
    const max = lineHeight * maxRows;
    node.style.height = `${Math.min(node.scrollHeight, max)}px`;
    node.style.overflowY = node.scrollHeight > max ? "auto" : "hidden";
  }, [value, maxRows]);

  useEffect(() => {
    setActiveCommand(0);
  }, [value]);

  const runCommand = (command: SlashCommand) => {
    onCommand?.(command);
    onChange("");
  };

  const submit = () => {
    if (disabled || !value.trim()) return;
    onSubmit(value);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (showCommands && filtered.length > 0) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveCommand((index) => (index + 1) % filtered.length);
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveCommand((index) => (index - 1 + filtered.length) % filtered.length);
        return;
      }
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        const command = filtered[activeCommand];
        if (command) runCommand(command);
        return;
      }
      if (event.key === "Escape") {
        onChange("");
        return;
      }
    }
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <div className={cn("relative rounded-2xl border border-line bg-white shadow-soft", className)}>
      {attachments.length > 0 ? (
        <ul className="flex flex-wrap gap-1.5 px-3 pt-3">
          {attachments.map((attachment) => (
            <li
              key={attachment.id}
              className="inline-flex items-center gap-1.5 rounded-pill bg-cloud-50 px-2.5 py-1 font-mono text-xs text-ink-700"
            >
              {attachment.name}
              {onRemoveAttachment ? (
                <button
                  type="button"
                  onClick={() => onRemoveAttachment(attachment.id)}
                  aria-label={`Remove ${attachment.name}`}
                  className="text-ink-500 hover:text-ink-900"
                >
                  ×
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="flex items-end gap-2 p-3">
        {onAttach ? (
          <button
            type="button"
            onClick={onAttach}
            aria-label="Attach a file"
            className="relative mb-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-pill text-ink-500 hover:bg-cloud-50 hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20 [@media(pointer:coarse)]:before:absolute [@media(pointer:coarse)]:before:-inset-1 [@media(pointer:coarse)]:before:content-['']"
          >
            +
          </button>
        ) : null}

        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={onKeyDown}
          role={showCommands ? "combobox" : undefined}
          aria-expanded={showCommands ? filtered.length > 0 : undefined}
          aria-controls={showCommands ? listId : undefined}
          aria-autocomplete={showCommands ? "list" : undefined}
          className="max-h-64 min-h-9 flex-1 resize-none bg-transparent py-1.5 text-sm leading-5 text-ink-900 placeholder:text-ink-500 focus:outline-none disabled:opacity-50"
        />

        <button
          type="button"
          disabled={disabled || !value.trim()}
          onClick={submit}
          aria-label="Send message"
          className="relative mb-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-pill bg-ink-900 text-milk transition-opacity disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25 focus-visible:ring-offset-2 [@media(pointer:coarse)]:before:absolute [@media(pointer:coarse)]:before:-inset-1 [@media(pointer:coarse)]:before:content-['']"
        >
          ↑
        </button>
      </div>

      <AnimatePresence>
        {showCommands && filtered.length > 0 ? (
          <motion.ul
            id={listId}
            role="listbox"
            initial={motionEnabled ? { opacity: 0, y: -6 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={motionEnabled ? { duration: 0.15 } : { duration: 0 }}
            className="absolute bottom-full left-0 mb-2 w-full max-w-sm rounded-xl border border-line bg-white p-1.5 shadow-lift"
          >
            {filtered.map((command, index) => (
              <li key={command.id} role="option" aria-selected={index === activeCommand}>
                <button
                  type="button"
                  onMouseEnter={() => setActiveCommand(index)}
                  onClick={() => runCommand(command)}
                  className={cn("flex w-full flex-col rounded-lg px-3 py-2 text-left text-sm", index === activeCommand ? "bg-cloud-50" : "")}
                >
                  <span className="font-medium text-ink-900">/{command.label}</span>
                  {command.description ? <span className="text-xs text-ink-500">{command.description}</span> : null}
                </button>
              </li>
            ))}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
