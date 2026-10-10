"use client";

import { useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";

/** Hides sensitive material behind a warning the visitor chooses to open. */
export function SensitiveGate({ children }: { children: ReactNode }) {
  const t = useTranslations("common");
  const [shown, setShown] = useState(false);

  if (shown) return <>{children}</>;

  return (
    <div className="relative">
      <div aria-hidden className="pointer-events-none blur-xl select-none" inert>
        {children}
      </div>
      <div
        role="region"
        aria-label={t("contentWarning")}
        className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-ink/80 p-6 text-center"
      >
        <p className="eyebrow text-flame">{t("contentWarning")}</p>
        <p className="max-w-sm text-sm text-paper-dim">{t("sensitiveBody")}</p>
        <button type="button" className="btn" onClick={() => setShown(true)}>
          {t("show")}
        </button>
      </div>
    </div>
  );
}
