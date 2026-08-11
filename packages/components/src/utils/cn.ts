type ClassValue = string | number | null | false | undefined | ClassValue[];

/**
 * Joins class names. Deliberately not `clsx` + `tailwind-merge` — Pinky's
 * components keep their own class lists short enough that conflict resolution
 * is not worth two dependencies.
 */
export function cn(...values: ClassValue[]): string {
  const out: string[] = [];

  for (const value of values) {
    if (!value && value !== 0) continue;
    if (Array.isArray(value)) {
      const nested = cn(...value);
      if (nested) out.push(nested);
    } else {
      out.push(String(value));
    }
  }

  return out.join(" ");
}
