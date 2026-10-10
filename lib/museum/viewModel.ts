import "server-only";
import type { MuseumExhibit, MuseumGallery } from "@/components/museum/types";
import type { AppLocale } from "@/i18n/routing";
import { getEventsByIds, getExhibits, getGalleries, getSourcesByIds, tr } from "@/lib/content";
import { formatDate } from "@/lib/format";

/** Localised, serialisable museum data for the client shell. */
export function museumViewModel(locale: AppLocale): {
  galleries: MuseumGallery[];
  exhibits: MuseumExhibit[];
} {
  const galleries = getGalleries().map((g, index) => ({
    id: g.id,
    index,
    title: tr(g.title, locale),
    period: tr(g.period, locale),
    intro: tr(g.intro, locale),
    tone: g.tone,
    sensitive: Boolean(g.sensitive),
  }));
  const indexOf = new Map(galleries.map((g) => [g.id, g.index]));

  const exhibits = getExhibits().map((x) => ({
    id: x.id,
    galleryIndex: indexOf.get(x.galleryId) ?? 0,
    slot: x.slot,
    kind: x.kind,
    motif: x.motif,
    title: tr(x.title, locale),
    caption: tr(x.caption, locale),
    body: tr(x.body, locale),
    sensitive: Boolean(x.sensitive),
    demo: Boolean(x.demo),
    events: getEventsByIds(x.eventIds).map((e) => ({
      id: e.id,
      title: tr(e.title, locale),
      dateLabel: formatDate(e.date, e.precision, locale),
    })),
    sources: getSourcesByIds(x.sourceIds).map((s) =>
      [s.author, s.title, s.year].filter(Boolean).join(", "),
    ),
  }));

  return { galleries, exhibits };
}
