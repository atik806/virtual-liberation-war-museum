"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { artDataUrl } from "@/lib/art";
import type { Motif } from "@/types/content";

export interface ReaderSection {
  heading: string;
  body: string;
  motif: Motif;
  place: { name: string; x: number; y: number } | null;
  event: { id: string; title: string; dateLabel: string } | null;
}

interface Props {
  sections: ReaderSection[];
  tone: string;
  map: { width: number; height: number; outline: string };
}

/**
 * Scrollytelling: text scrolls on one side while a pinned panel (illustration
 * + locator map) follows the active section.
 */
export function StoryReader({ sections, tone, map }: Props) {
  const t = useTranslations("common");
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const current = sections[active];

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-10 sm:px-6 md:grid-cols-[1fr_1.1fr]">
      <div className="md:sticky md:top-32 md:h-fit" aria-hidden>
        <div className="relative overflow-hidden rounded-2xl border border-line">
          {sections.map((s, i) => (
            // eslint-disable-next-line @next/next/no-img-element -- inline SVG data URL
            <img
              key={i}
              src={artDataUrl(s.motif, tone)}
              alt=""
              width={400}
              height={300}
              className={`aspect-[4/3] w-full object-cover transition-opacity duration-1000 ${
                i === 0 ? "relative" : "absolute inset-0"
              } ${i === active ? "opacity-100" : "opacity-0"}`}
            />
          ))}
          <span className="absolute right-2 bottom-2 rounded-full bg-ink/75 px-2 py-0.5 text-[11px] text-paper-dim">
            {t("illustration")}
          </span>
        </div>

        <div className="mt-4 hidden items-center gap-4 md:flex">
          <svg viewBox={`0 0 ${map.width} ${map.height}`} className="h-36 w-auto shrink-0">
            <path d={map.outline} fill="#1f3a2f" stroke="#7fb59c" strokeWidth={1.5} />
            {current.place && (
              <circle
                cx={current.place.x}
                cy={current.place.y}
                r={7}
                fill="var(--color-red)"
                stroke="#11100e"
                strokeWidth={2}
                className="transition-all duration-700"
              />
            )}
          </svg>
          <div className="text-sm">
            {current.place && <p className="text-paper">{current.place.name}</p>}
            {current.event && <p className="text-flame">{current.event.dateLabel}</p>}
          </div>
        </div>
      </div>

      <div>
        {sections.map((s, i) => (
          <section
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            data-index={i}
            className={`flex min-h-[60vh] flex-col justify-center py-10 transition-opacity duration-700 md:min-h-[75vh] ${
              i === active ? "opacity-100" : "md:opacity-40"
            }`}
          >
            <h2 className="font-display text-3xl font-semibold">{s.heading}</h2>
            {s.place && <p className="mt-1 text-sm text-muted">{s.place.name}</p>}
            <p className="mt-5 text-xl leading-relaxed text-paper">{s.body}</p>
            {s.event && (
              <Link
                href={`/timeline/${s.event.id}`}
                className="mt-6 self-start rounded-full border border-line px-4 py-1.5 text-sm text-paper-dim hover:border-paper-dim hover:text-paper"
              >
                {s.event.dateLabel} · {s.event.title} →
              </Link>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
