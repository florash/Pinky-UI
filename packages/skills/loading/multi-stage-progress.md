# Multi-Stage Progress

## Purpose
Show system execution moving through named stages with a detailed current stage, failure and retry.

## Use when
Upload, process, review and completion are distinct machine stages rather than user decisions.

## Avoid
Using a user-facing wizard, squeezing five labels into an unreadable mobile row, or treating a generic progress bar as a stage model.

## Accessibility
Name the current stage, completed stages and failure in text. Use progress semantics only where the value is determinate and never rely on color alone.

## Keyboard and touch
Advance, failure simulation in demos, and retry are native buttons. Stage context stacks vertically on narrow screens.

## Reduced motion and performance
Keep stage state and retry destination visible without animated travel. Use discrete updates rather than a per-frame React progress loop.

## Composition and anti-patterns
This is system execution. Use Progressive Step Workflow when completed user decisions remain editable context.
