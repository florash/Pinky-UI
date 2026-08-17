/** Local class joiner. mobile must not depend on @pinky-ui/components. */
export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}
