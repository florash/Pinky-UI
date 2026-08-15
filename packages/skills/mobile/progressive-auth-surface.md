# Progressive Auth Surface

## Purpose

Use a progressive auth surface when a mobile sign-in flow should reveal identity, method and verification one decision at a time.

## Interaction anatomy

- Identity is collected before choosing a method.
- Verification is shown only when requested.
- Back paths preserve the previous decision without opening a new route.

## Good for

Passkey or code sign-in, compact onboarding and trusted-device verification.

## Avoid

Long account setup, multi-factor administration or forms with many independent fields.

## Live example

Enter an email, choose a method and continue through the verification step.

## Usage

```tsx
<ProgressiveAuthSurface />
```

## Tune

Keep one decision in view, explain what happens next and preserve a clear Back action.

## Accessibility and reduced motion

Use native labels, `autocomplete="one-time-code"`, text status and keyboard-submit paths. Reduced motion keeps each step and its status language visible.
