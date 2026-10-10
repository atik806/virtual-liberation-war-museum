"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { artDataUrl } from "@/lib/art";
import { Badge } from "@/components/ui/Badge";
import { SensitiveGate } from "@/components/ui/SensitiveGate";
import { useMuseum } from "./store";
import type { MuseumExhibit, MuseumGallery } from "./types";

/**
 * Exhibit details in a DOM drawer (never 3D text): readable, translatable and
 * reachable by screen readers. Non-modal so the room stays visible.
 */
export function ExhibitPanel({
  exhibits,
  galleries,
}: {
  exhibits: MuseumExhibit[];
  galleries: MuseumGallery[];
}) {
  const t = useTranslations("museum");
  const tc = useTranslations("common");
  const selectedId = useMuseum((s) => s.selectedId);
  const select = useMuseum((s) => s.select);
  const heading = useRef<HTMLHeadingElement>(null);
  const exhibit = exhibits.find((x) => x.id === selectedId);

  useEffect(() => {
    if (exhibit) heading.current?.focus({ preventScroll: true });
  }, [exhibit]);

  if (!exhibit) return null;
  const gallery = galleries[exhibit.galleryIndex];

  const art = (
    // eslint-disable-next-line @next/next/no-img-element -- inline SVG data URL
    <img
      src={artDataUrl(exhibit.motif, gallery.tone)}
      alt={exhibit.caption}
      width={400}
      height={300}
      className="aspect-[4/3] w-full rounded-xl object-cover"
    />
  );

  return (
    <aside
      role="dialog"
      aria-modal="false"
      aria-labelledby="exhibit-title"
      className="pointer-events-auto absolute inset-x-0 bottom-0 z-30 max-h-[62vh] overflow-y-auto rounded-t-2xl border-t border-line bg-ink/95 p-5 backdrop-blur-md animate-[rise_0.5s_var(--ease-solemn)_both] md:inset-x-auto md:top-0 md:right-0 md:bottom-0 md:max-h-none md:w-[420px] md:rounded-none md:border-t-0 md:border-l md:p-7"
    >
      <div className="flex items-start justify-between gap-4">
        <p className="eyebrow">
          {gallery.title} · {gallery.period}
        </p>
        <button type="button" onClick={() => select(null)} className="btn min-h-9 px-3 text-xs" aria-label={t("close")}>
          ✕
        </button>
      </div>

      <h2 id="exhibit-title" ref={heading} tabIndex={-1} className="font-display mt-3 text-3xl leading-tight font-semibold outline-none">
        {exhibit.title}
      </h2>
      <p className="mt-1 text-flame">{exhibit.caption}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {exhibit.demo && <Badge tone="demo">{tc("demoBadge")}</Badge>}
        {exhibit.sensitive && <Badge tone="warn">{tc("contentWarning")}</Badge>}
      </div>

      <div className="relative mt-5">
        {exhibit.sensitive ? <SensitiveGate>{art}</SensitiveGate> : art}
        <span className="absolute right-2 bottom-2 rounded-full bg-ink/75 px-2 py-0.5 text-[11px] text-paper-dim">
          {tc("illustration")}
        </span>
      </div>

      <p className="mt-5 text-lg leading-relaxed text-paper">{exhibit.body}</p>

      {exhibit.events.length > 0 && (
        <section className="mt-6">
          <h3 className="eyebrow mb-2">{tc("relatedEvents")}</h3>
          <ul className="space-y-1.5">
            {exhibit.events.map((e) => (
              <li key={e.id}>
                <Link href={`/timeline/${e.id}`} className="text-paper-dim underline decoration-line underline-offset-4 hover:text-paper">
                  <span className="text-flame">{e.dateLabel}</span> · {e.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-6 border-t border-line pt-4">
        <h3 className="eyebrow mb-2">{tc("sources")}</h3>
        <ul lang="en" className="space-y-1 text-sm text-muted">
          {exhibit.sources.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </section>

      <Link href={`/exhibits/${exhibit.id}`} className="btn mt-6 w-full">
        {t("viewFull")}
      </Link>
    </aside>
  );
}
