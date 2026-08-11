/** Local class joiner. Effects must not depend on @pinky/components. */
export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}
