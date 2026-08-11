"use client";

import { SplitTextReveal, type SplitTextRevealProps } from "./split-text-reveal";

export type CharacterStaggerProps = Omit<SplitTextRevealProps, "by">;

/** Character-level entrance intended for short display headings only. */
export function CharacterStagger(props: CharacterStaggerProps) {
  return <SplitTextReveal {...props} by="character" />;
}
