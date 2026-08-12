import { cn } from "@pinky/components";
import type { ReactNode } from "react";

import { CodeBlock } from "@/components/site/code-block";

/**
 * A deliberately small markdown renderer for the Skills content.
 *
 * The skills are written in this repository against a fixed subset — headings,
 * paragraphs, lists, fenced code, bold, inline code and links — so a full
 * markdown pipeline would be a dependency and a parser we do not need. It
 * renders nodes, never HTML strings, so nothing can inject markup.
 */
export function Markdown({ source, className }: { source: string; className?: string }) {
  return <div className={cn("skill-markdown flex flex-col text-[0.9375rem]", className)}>{renderBlocks(source)}</div>;
}

function renderBlocks(source: string): ReactNode[] {
  const lines = source.split("\n");
  const out: ReactNode[] = [];

  let index = 0;
  let key = 0;

  while (index < lines.length) {
    const line = lines[index] ?? "";

    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (line.startsWith("```")) {
      const language = line.slice(3).trim() || "tsx";
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !(lines[index] ?? "").startsWith("```")) {
        code.push(lines[index] ?? "");
        index += 1;
      }
      index += 1;
      out.push(
        <CodeBlock key={key++} code={code.join("\n")} label={language} className="my-4" />,
      );
      continue;
    }

    if (line.startsWith("> ")) {
      const quote: string[] = [];
      while (index < lines.length && (lines[index] ?? "").startsWith("> ")) {
        quote.push((lines[index] ?? "").slice(2).trim());
        index += 1;
      }
      out.push(
        <blockquote key={key++} className="my-4 rounded-r-xl border-l-2 border-blush-200 bg-blush-50/60 px-4 py-3 text-sm leading-relaxed text-ink-700">
          {inline(quote.join(" "))}
        </blockquote>,
      );
      continue;
    }

    const heading = line.match(/^(#{1,4})\s+(.*)$/);
    if (heading) {
      const level = heading[1]?.length ?? 1;
      const text = heading[2] ?? "";
      index += 1;

      if (level === 1) {
        // The page supplies its own title; a second one would be noise.
        continue;
      }

      out.push(
        level === 2 ? (
          <h2
            key={key++}
            className="mt-12 mb-3 scroll-mt-28 font-display text-xl font-semibold tracking-tight first:mt-0"
          >
            {inline(text)}
          </h2>
        ) : (
          <h3 key={key++} className="mt-7 mb-2 scroll-mt-28 font-display text-base font-semibold tracking-tight">
            {inline(text)}
          </h3>
        ),
      );
      continue;
    }

    if (/^[-*]\s+/.test(line) || /^\d+\.\s+/.test(line)) {
      const ordered = /^\d+\.\s+/.test(line);
      const items: string[] = [];

      while (index < lines.length) {
        const current = lines[index] ?? "";
        const match = current.match(/^(?:[-*]|\d+\.)\s+(.*)$/);
        if (!match) {
          // Continuation lines are indented under their bullet.
          if (/^\s{2,}\S/.test(current) && items.length > 0) {
            items[items.length - 1] += ` ${current.trim()}`;
            index += 1;
            continue;
          }
          break;
        }
        items.push(match[1] ?? "");
        index += 1;
      }

      const listClass = "my-3 flex flex-col gap-2.5 text-sm leading-relaxed text-ink-700";
      out.push(
        ordered ? (
          <ol key={key++} className={cn(listClass, "list-decimal pl-5")}>
            {items.map((item, i) => (
              <li key={i}>{inline(item)}</li>
            ))}
          </ol>
        ) : (
          <ul key={key++} className={listClass}>
            {items.map((item, i) => (
              <li key={i} className="flex gap-3">
                <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-pill bg-blush-300" />
                <span>{inline(item)}</span>
              </li>
            ))}
          </ul>
        ),
      );
      continue;
    }

    const paragraph: string[] = [];
    while (index < lines.length) {
      const current = lines[index] ?? "";
      if (!current.trim() || current.startsWith("#") || current.startsWith("```")) break;
      if (/^[-*]\s+/.test(current) || /^\d+\.\s+/.test(current)) break;
      paragraph.push(current.trim());
      index += 1;
    }

    out.push(
      <p key={key++} className="my-2 leading-relaxed text-ink-700">
        {inline(paragraph.join(" "))}
      </p>,
    );
  }

  return out;
}

/** Handles `code`, **bold** and [links](href) inside a line. */
function inline(text: string): ReactNode[] {
  const pattern = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\[[^\]]+\]\([^)]+\))/g;
  const out: ReactNode[] = [];
  let last = 0;
  let key = 0;

  for (const match of text.matchAll(pattern)) {
    const start = match.index;
    if (start > last) out.push(text.slice(last, start));

    const [token] = match;
    if (token.startsWith("`")) {
      out.push(
        <code
          key={key++}
          className="rounded-[6px] bg-blush-50 px-1.5 py-0.5 font-mono text-[0.8125em] text-ink-900"
        >
          {token.slice(1, -1)}
        </code>,
      );
    } else if (token.startsWith("**")) {
      out.push(
        <strong key={key++} className="font-semibold text-ink-900">
          {token.slice(2, -2)}
        </strong>,
      );
    } else {
      const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      out.push(
        <a
          key={key++}
          href={link?.[2] ?? "#"}
          className="underline decoration-line-strong underline-offset-2 transition-colors hover:text-ink-900"
        >
          {link?.[1] ?? token}
        </a>,
      );
    }

    last = start + token.length;
  }

  if (last < text.length) out.push(text.slice(last));
  return out;
}
