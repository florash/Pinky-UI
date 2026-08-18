"use client";

import { cn } from "@pinky-ui/components";
import { useCallback, useEffect, useState, type ReactNode } from "react";

import { CheckMark, CopyMark } from "./icons";

type Token = { text: string; kind: "tag" | "string" | "punct" | "plain" };

// Deliberately small: enough to give JSX snippets a readable shape without
// pulling a full syntax highlighter into the bundle.
const PATTERN = /("[^"]*"|'[^']*'|`[^`]*`)|(<\/?[A-Za-z][\w.]*|\/>|>)|([{}()[\],;=]|\.\.\.)/g;

function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let index = 0;

  for (const match of code.matchAll(PATTERN)) {
    const start = match.index;
    if (start > index) tokens.push({ text: code.slice(index, start), kind: "plain" });

    const [text, string, tag] = match;
    tokens.push({ text, kind: string ? "string" : tag ? "tag" : "punct" });
    index = start + text.length;
  }

  if (index < code.length) tokens.push({ text: code.slice(index), kind: "plain" });
  return tokens;
}

const TOKEN_CLASS: Record<Token["kind"], string> = {
  tag: "text-code-tag",
  string: "text-code-string",
  punct: "text-code-punct",
  plain: "text-ink-900",
};

export type CodeBlockProps = {
  code: string;
  language?: string;
  /** Small label in the block's header, e.g. a file name. */
  label?: ReactNode;
  className?: string;
  copy?: boolean;
};

export function CodeBlock({ code, language = "tsx", label, className, copy = true }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(timer);
  }, [copied]);

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      // Clipboard access can be denied; the code stays selectable either way.
    }
  }, [code]);

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border border-line bg-white/80",
        className,
      )}
    >
      <div className="flex min-w-0 items-center justify-between gap-3 border-b border-line px-4 py-2.5">
        <span className="min-w-0 flex-1 truncate font-mono text-[0.6875rem] tracking-[0.14em] text-ink-500 uppercase">
          {label ?? language}
        </span>
        {copy ? (
          <button
            type="button"
            onClick={onCopy}
            aria-label={copied ? "Code copied" : "Copy code"}
            className="inline-flex min-h-9 min-w-16 shrink-0 items-center justify-center gap-1.5 rounded-pill px-2.5 py-1 font-mono text-[0.6875rem] text-ink-500 transition-colors hover:bg-blush-50 hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20"
          >
            {copied ? <CheckMark className="size-3.5" /> : <CopyMark className="size-3.5" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        ) : null}
      </div>
      <span className="sr-only" role="status" aria-live="polite">{copied ? "Code copied to clipboard." : ""}</span>
      <pre
        tabIndex={0}
        aria-label={`${label ?? language} code`}
        className="max-w-full overflow-x-auto px-4 py-4 font-mono text-[0.8125rem] leading-relaxed outline-none focus-visible:ring-2 focus-visible:ring-ink-900/15"
      >
        <code>
          {tokenize(code).map((token, i) => (
            <span key={i} className={TOKEN_CLASS[token.kind]}>
              {token.text}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
