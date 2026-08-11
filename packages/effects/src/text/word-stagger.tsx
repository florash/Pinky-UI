"use client";

import { SplitTextReveal, type SplitTextRevealProps } from "./split-text-reveal";

export type WordStaggerProps = Omit<SplitTextRevealProps, "by">;

/** Optimized, opinionated word-level entrance for headings and short labels. */
export function WordStagger(props: WordStaggerProps) {
  return <SplitTextReveal {...props} by="word" />;
}
