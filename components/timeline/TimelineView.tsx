"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { EventCategory } from "@/types/content";

export interface TimelineItem {
  id: string;
  date: string;
  dateLabel: string;
  groupLabel: string;
  category: EventCategory;
  title: string;
  summary: string;
  sensitive: boolean;
}

const CATEGORIES: EventCategory[] = [
  "political",
  "military",
  "human-cost",
  "international",
  "refugees",
  "culture",
];

const dot: Record<EventCategory, string> = {
  political: "bg-paper",
  military: "bg-green-bright",
  "human-cost": "bg-red",
  international: "bg-sky-300",
  refugees: "bg-flame",
  culture: "bg-violet-300",
};

export function TimelineView({ items }: { items: TimelineItem[] }) {
  const t = useTranslations("timeline");
  const tc = useTranslations("categories");
  const [active, setActive] = useState<EventCategory | "all">("all");

  const visible = useMemo(
    () => (active === "all" ? items : items.filter((i) => i.category === active)),
    [items, active],
  );

  // Consecutive items sharing a group label (a year, or a month of 1971).
  const groups = useMemo(() => {
    const out: { label: string; items: TimelineItem[] }[] = [];
    for (const item of visible) {
      const last = out.at(-1);
      if (last && last.label === item.groupLabel) last.items.push(item);
      else out.push({ label: item.groupLabel, items: [item] });
    }
    return out;
  }, [visible]);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <div role="group" aria-label={t("filter")} className="flex flex-wrap gap-2">
        {(["all", ...CATEGORIES] as const).map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={active === c}
            onClick={() => setActive(c)}
            className="btn min-h-9 px-4 text-xs aria-pressed:border-paper aria-pressed:bg-paper aria-pressed:text-ink"
          >
            {c !== "all" && <span aria-hidden className={`size-2 rounded-full ${dot[c]}`} />}
            {c === "all" ? t("all") : tc(c)}
          </button>
        ))}
      </div>
      <p className="mt-4 text-sm text-muted" aria-live="polite">
        {t("count", { count: visible.length })}
      </p>

      {groups.length === 0 && <p className="mt-10 text-paper-dim">{t("empty")}</p>}

      <div className="relative mt-8">
        <div aria-hidden className="absolute top-2 bottom-2 left-[7px] w-px bg-line" />
        {groups.map((g) => (
          <section key={g.label} className="mb-10" aria-label={g.label}>
            <h2 className="font-display relative mb-4 pl-8 text-2xl font-semibold text-paper">{g.label}</h2>
            <ol className="space-y-4">
              {g.items.map((item) => (
                <li key={item.id} className="relative pl-8">
                  <span
                    aria-hidden
                    className={`absolute top-6 left-[3px] size-[9px] rounded-full ring-4 ring-ink ${dot[item.category]}`}
                  />
                  <Link
                    href={`/timeline/${item.id}`}
                    className="card block p-5 transition-colors duration-300 hover:border-paper-dim"
                  >
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                      <time dateTime={item.date} className="text-flame">
                        {item.dateLabel}
                      </time>
                      <span className="text-muted">{tc(item.category)}</span>
                    </div>
                    <h3 className="font-display mt-1.5 text-xl font-semibold">{item.title}</h3>
                    <p className="mt-2 text-paper-dim">{item.summary}</p>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
