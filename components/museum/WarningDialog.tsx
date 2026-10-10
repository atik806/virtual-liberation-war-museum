"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

/** Shown once, at the threshold of the genocide gallery. */
export function WarningDialog({ onContinue, onSkip }: { onContinue: () => void; onSkip: () => void }) {
  const t = useTranslations("museum");
  const first = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    first.current?.focus();
  }, []);

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-ink/85 p-4 backdrop-blur-sm">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="warning-title"
        aria-describedby="warning-body"
        className="card max-w-lg p-7 text-center animate-[rise_0.8s_var(--ease-solemn)_both]"
        onKeyDown={(e) => {
          // Keep focus inside the two choices.
          if (e.key !== "Tab") return;
          const buttons = e.currentTarget.querySelectorAll("button");
          const last = buttons[buttons.length - 1];
          if (e.shiftKey && document.activeElement === buttons[0]) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            buttons[0].focus();
          }
        }}
      >
        <p aria-hidden className="text-3xl text-muted">
          ◯
        </p>
        <h2 id="warning-title" className="font-display mt-3 text-2xl font-semibold text-balance">
          {t("warningTitle")}
        </h2>
        <p id="warning-body" className="mt-3 text-paper-dim">
          {t("warningBody")}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button ref={first} type="button" className="btn btn-primary" onClick={onContinue}>
            {t("warningContinue")}
          </button>
          <button type="button" className="btn" onClick={onSkip}>
            {t("warningSkip")}
          </button>
        </div>
      </div>
    </div>
  );
}
