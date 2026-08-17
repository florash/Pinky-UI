"use client";

import { Jelly, Magnetic } from "@pinky-ui/primitives";
import { useState } from "react";

export function DocsLivePreview() {
  const [saved, setSaved] = useState(false);

  return (
    <div className="flex min-h-56 flex-col items-center justify-center gap-4 rounded-[22px] border border-line bg-[radial-gradient(120%_100%_at_15%_0%,var(--color-blush-100),transparent_64%),var(--color-cloud-50)] p-6 text-center">
      <Magnetic strength={0.24} range={100} maxOffset={6}>
        <Jelly elasticity={0.3} intensity={0.14} className="rounded-pill">
          <button
            type="button"
            onClick={() => setSaved((value) => !value)}
            className="rounded-pill bg-ink-900 px-5 py-3 text-sm text-milk shadow-soft focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink-900"
          >
            {saved ? "Saved · try again" : "Try the composition"}
          </button>
        </Jelly>
      </Magnetic>
      <p className="max-w-sm text-sm leading-relaxed text-ink-700">Two small behaviours, one semantic button: move nearby, then press or focus it.</p>
      <p aria-live="polite" className="font-mono text-[0.625rem] tracking-[0.12em] text-ink-500 uppercase">{saved ? "state: complete" : "state: ready"}</p>
    </div>
  );
}
