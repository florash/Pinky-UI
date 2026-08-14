# Undoable Action

## Purpose
Remove a reversible object now while preserving a short, keyboard-accessible path to restore its identity and position.

## Use when
Archive, remove or move actions can be safely reversed and the surrounding list should close the gap immediately.

## Avoid
Irreversible deletion, long-lived history or a timer that pressures the user for routine work.

## Accessibility
Announce what changed once, give the Undo control a specific name, and communicate expiry in text rather than color or motion alone.

## Keyboard and touch
Undo is a real button and remains reachable on narrow screens. Do not make swipe or timing precision the only recovery path.

## Reduced motion and performance
Resolve list reflow without travel when motion is reduced. Clean the expiry timer on unmount and do not retain removed objects after the window closes.

## Composition and anti-patterns
The item should disappear and the surrounding layout should reflow before the recovery surface appears. A static toast with no object restoration is only an Action Undo Bar preset.
