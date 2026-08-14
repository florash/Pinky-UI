# Edge Rail Navigation

## Purpose

`EdgeRailNavigation` keeps a persistent navigation rail narrow until pointer or keyboard attention needs the labels. It is useful for desktop tools where the rail should give content room without hiding the information architecture from focus users.

## Interaction anatomy

- **Rail:** one stable edge surface owns the destinations.
- **Collapsed state:** icons or compact initials preserve a visual index.
- **Expanded state:** labels appear when the rail is approached or focused.
- **Touch:** use a visible expanded state or a parent layout that provides labels; do not make the rail hover-only on small screens.

## Live example

Move into the rail or focus a destination. The rail expands and the same native links become easier to scan.

## Usage

```tsx
import { EdgeRailNavigation } from "@pinky/experiences";

<EdgeRailNavigation items={items} aria-label="Workspace sections" />;
```

## Tune

- Supply icons that reinforce, rather than replace, meaningful labels.
- Keep the rail away from critical mobile controls.
- Use a small set of top-level destinations.

## Accessibility

Labels stay in the DOM, focus expands the rail, and every link has a visible focus treatment. Do not expose icon initials as the only accessible name.

## Reduced motion

Switch width and label visibility immediately. The expanded labels and current destination still provide complete context.
