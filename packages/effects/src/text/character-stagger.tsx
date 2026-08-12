"use client";

import { SplitTextReveal, type SplitTextRevealProps } from "./split-text-reveal";

export type CharacterStaggerProps = Omit<SplitTextRevealProps, "by">;

/**
 * A named preset of {@link SplitTextReveal}, not a separate implementation.
 *
 * `<CharacterStagger {...props} />` is `<SplitTextReveal {...props}
 * by="character" />` and nothing more. Reserve it for short display headings —
 * the per-character spans are the cost, and they scale with the text length.
 */
export function CharacterStagger(props: CharacterStaggerProps) {
  return <SplitTextReveal {...props} by="character" />;
}
