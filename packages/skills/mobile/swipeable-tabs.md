# Swipeable Tabs

## Purpose
Use as a touch companion to Fluid Tabs when panels are naturally adjacent.

## Use when
Mobile users benefit from a horizontal gesture between a small number of peer views.

## Avoid
Hijacking browser back/forward gestures, vertical scrolling, or large tab sets.

## Accessibility
Use tablist, tab, selected state, and keyboard arrow movement on desktop.

## Keyboard and touch
Tap and arrows are first-class; swipe is bounded and does not prevent normal page scroll.

## Reduced motion and performance
Switch panels immediately or use restrained transform motion without per-frame React state.

## Composition and anti-patterns
Use Fluid Tabs vocabulary and keep panels independently addressable where possible.
