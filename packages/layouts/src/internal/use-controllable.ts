"use client";

import { useState } from "react";

export function useControllable<T>(value: T | undefined, defaultValue: T, onChange?: (value: T) => void) {
  const [internal, setInternal] = useState(defaultValue);
  const current = value === undefined ? internal : value;
  const set = (next: T) => {
    if (value === undefined) setInternal(next);
    onChange?.(next);
  };
  return [current, set] as const;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function mod(value: number, length: number) {
  return length === 0 ? 0 : ((value % length) + length) % length;
}
