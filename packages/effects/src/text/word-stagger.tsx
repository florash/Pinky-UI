"use client";

import { SplitTextReveal, type SplitTextRevealProps } from "./split-text-reveal";

export type WordStaggerProps = Omit<SplitTextRevealProps, "by">;

/**
 * A named preset of {@link SplitTextReveal}, not a separate implementation.
 *
 * `<WordStagger {...props} />` is `<SplitTextReveal {...props} by="word" />` and
 * nothing more. It exists so the common case reads well at the call site; if
 * the split mode is itself a decision, use `SplitTextReveal` directly.
 */
export function WordStagger(props: WordStaggerProps) {
  return <SplitTextReveal {...props} by="word" />;
}
