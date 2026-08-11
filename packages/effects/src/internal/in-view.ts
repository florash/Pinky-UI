"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * A shared IntersectionObserver pool.
 *
 * Reveal effects are used in lists, and a list of forty cards should not create
 * forty observers. Observers are keyed by their options, so every element that
 * wants "20% visible, 0px margin" is watched by the same one.
 */
export type InViewOptions = {
  /** Fraction of the element that must be visible. */
  amount?: number;
  /** CSS margin around the root, e.g. "0px 0px -10%". */
  margin?: string;
  /** Stop watching after the first entry. Default true — reveals do not replay. */
  once?: boolean;
};

type Entry = (visible: boolean) => void;

const pools = new Map<string, { observer: IntersectionObserver; entries: Map<Element, Entry> }>();

function poolFor(amount: number, margin: string) {
  const key = `${amount}|${margin}`;
  let pool = pools.get(key);
  if (pool) return pool;

  const entries = new Map<Element, Entry>();
  const observer = new IntersectionObserver(
    (records) => {
      for (const record of records) {
        entries.get(record.target)?.(record.isIntersecting);
      }
    },
    { threshold: amount, rootMargin: margin },
  );

  pool = { observer, entries };
  pools.set(key, pool);
  return pool;
}

/** Watch one element. Returns an unobserve function. */
export function observeInView(
  element: Element,
  callback: Entry,
  { amount = 0.2, margin = "0px 0px -8% 0px" }: InViewOptions = {},
): () => void {
  const pool = poolFor(amount, margin);
  pool.entries.set(element, callback);
  pool.observer.observe(element);

  return () => {
    pool.entries.delete(element);
    pool.observer.unobserve(element);
  };
}

/**
 * `true` once the element has entered the viewport.
 *
 * State flips at most once per element with `once` (the default), so a long
 * page of reveals settles into zero ongoing work.
 */
export function useInView(ref: RefObject<Element | null>, options: InViewOptions = {}): boolean {
  const { amount = 0.2, margin = "0px 0px -8% 0px", once = true } = options;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Environments without IntersectionObserver (older jsdom, some crawlers)
    // must still see the content: reveal immediately rather than never.
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    let stop: (() => void) | null = null;
    stop = observeInView(
      element,
      (isVisible) => {
        if (isVisible) {
          setVisible(true);
          if (once) stop?.();
        } else if (!once) {
          setVisible(false);
        }
      },
      { amount, margin },
    );

    return () => stop?.();
  }, [ref, amount, margin, once]);

  return visible;
}
