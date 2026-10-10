"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { artDataUrl } from "@/lib/art";
import { Badge } from "@/components/ui/Badge";
import type { MuseumExhibit, MuseumGallery } from "./types";

/** The whole museum without WebGL: same galleries, same exhibits, same order. */
export function Gallery2D({
  galleries,
  exhibits,
  focusGallery,
}: {
  galleries: MuseumGallery[];
  exhibits: MuseumExhibit[];
  focusGallery: number;
}) {
  const tc = useTranslations("common");

  useEffect(() => {
    if (focusGallery > 0) {
      document.getElementById(`gallery-${galleries[focusGallery].id}`)?.scrollIntoView();
    }
  }, [focusGallery, galleries]);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-16 px-4 py-12 sm:px-6">
      {galleries.map((g) => (
        <section key={g.id} id={`gallery-${g.id}`} aria-labelledby={`h-${g.id}`} className="scroll-mt-28">
          <div className="mb-6 border-l-4 pl-4" style={{ borderColor: g.tone }}>
            <p className="eyebrow">
              {g.index + 1} · {g.period}
            </p>
            <h2 id={`h-${g.id}`} className="font-display mt-1 text-3xl font-semibold">
              {g.title}
            </h2>
            <p className="mt-2 max-w-2xl text-paper-dim">{g.intro}</p>
            {g.sensitive && (
              <p className="mt-3">
                <Badge tone="warn">{tc("contentWarning")}</Badge>
              </p>
            )}
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {exhibits
              .filter((x) => x.galleryIndex === g.index)
              .map((x) => (
                <li key={x.id}>
                  <Link href={`/exhibits/${x.id}`} className="card group block h-full overflow-hidden hover:border-paper-dim">
                    <div className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element -- inline SVG data URL */}
                      <img
                        src={artDataUrl(x.motif, g.tone)}
                        alt=""
                        width={400}
                        height={300}
                        loading="lazy"
                        className={`aspect-[4/3] w-full object-cover ${x.sensitive ? "blur-lg grayscale" : ""}`}
                      />
                      {x.sensitive && (
                        <span className="absolute inset-0 flex items-center justify-center text-sm text-paper">
                          {tc("contentWarning")}
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-flame">{x.caption}</p>
                      <h3 className="font-display mt-1 text-lg leading-snug font-semibold">{x.title}</h3>
                    </div>
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
