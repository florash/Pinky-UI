"use client";

import { usePressSpring } from "@pinky-ui/primitives";
import { motion, useTransform } from "motion/react";
import { forwardRef } from "react";

import { cn } from "../utils/cn";
import { DISABLED, FOCUS_RING, useEngagement, useMenuTrigger, type MenuTriggerBase } from "./internal";

export type AvatarMenuProps = MenuTriggerBase & {
  /** One or two characters. Kept short so the disc stays a disc. */
  initials?: string;
};

/**
 * Construction: an initials disc with a hairline ring and a small caret tucked
 * at its lower edge — the account-menu lineage used by essentially every
 * product with a signed-in state.
 *
 * Motion signature — **the ring opens, the caret turns**. Hover expands the
 * ring outward from the disc and the caret drops a pixel; open rotates the
 * caret and pulls the ring in tight against the avatar. The disc itself never
 * moves — an avatar that bounces reads as a game, and this is the one trigger
 * whose content is a person.
 *
 * The close state is a rotated caret rather than a cross, because the control
 * never claimed to be a hamburger and turning into one would be a lie about
 * what it opens.
 */
export const AvatarMenu = forwardRef<HTMLButtonElement, AvatarMenuProps>(function AvatarMenu(
  { initials = "PK", className, ...base },
  ref,
) {
  const { isOpen, buttonProps, spring } = useMenuTrigger({
    ...base,
    label: base.label ?? "Account menu",
    closeLabel: base.closeLabel ?? "Close account menu",
  });
  const engagement = useEngagement();
  const press = usePressSpring({ scale: 1, disabled: base.disabled });
  const ringScale = useTransform([engagement.value, press.pressed], ([h, p]: number[]) =>
    1 + (h ?? 0) * 0.1 - (p ?? 0) * 0.06 - (isOpen ? 0.06 : 0),
  );
  const ringOpacity = useTransform(engagement.value, [0, 1], [0.5, 1]);
  const caretY = useTransform(engagement.value, [0, 1], [0, 1]);

  return (
    <motion.button
      ref={ref}
      {...buttonProps}
      className={cn("relative grid size-12 place-items-center rounded-full", FOCUS_RING, DISABLED, className)}
      {...engagement.handlers}
      {...press.handlers}
    >
      <motion.span
        aria-hidden
        style={{ scale: ringScale, opacity: ringOpacity }}
        className="absolute inset-0 rounded-full border border-[color:var(--color-line-strong)]"
      />
      <span
        aria-hidden
        className="grid size-9 place-items-center rounded-full font-mono text-[0.65rem] tracking-wide text-ink-900 [box-shadow:var(--depth-raised-sm),var(--edge-light)]"
        style={{
          background:
            "linear-gradient(145deg, var(--color-blush-100), var(--color-cloud-200))",
        }}
      >
        {initials}
      </span>
      <motion.span
        aria-hidden
        className="absolute -bottom-0.5 grid size-4 place-items-center rounded-full border border-[color:var(--color-line)] bg-white text-[8px] leading-none text-ink-700"
        style={{ y: caretY }}
        initial={false}
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={spring}
      >
        ⌄
      </motion.span>
    </motion.button>
  );
});
