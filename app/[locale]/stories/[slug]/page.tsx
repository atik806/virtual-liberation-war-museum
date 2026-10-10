import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import { Badge } from "@/components/ui/Badge";
import { SourceList } from "@/components/ui/SourceList";
import { StoryReader, type ReaderSection } from "@/components/story/StoryReader";
import { getEvent, getPlace, getStories, getStory, tr } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { projectedMap } from "@/lib/map/geo";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => getStories().map((s) => ({ locale, slug: s.id })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/stories/[slug]">): Promise<Metadata> {
  const { locale, slug } = (await params) as { locale: AppLocale; slug: string };
  const s = getStory(slug);
  return s ? { title: tr(s.title, locale), description: tr(s.dek, locale) } : {};
}

export default async function StoryPage({ params }: PageProps<"/[locale]/stories/[slug]">) {
  const { locale, slug } = (await params) as { locale: AppLocale; slug: string };
  setRequestLocale(locale);
  const story = getStory(slug);
  if (!story) notFound();
  const t = await getTranslations({ locale, namespace: "common" });
  const tStories = await getTranslations({ locale, namespace: "stories" });

  // Locator map spans Kolkata to Meghalaya so camps in India can be shown.
  const map = projectedMap(200, 240, [[88.0, 20.6], [92.7, 26.7]], 8);

  const sections: ReaderSection[] = story.sections.map((sec) => {
    const place = sec.placeId ? getPlace(sec.placeId) : undefined;
    const event = sec.eventId ? getEvent(sec.eventId) : undefined;
    const [x, y] = place ? map.project(place.coords) : [0, 0];
    return {
      heading: tr(sec.heading, locale),
      body: tr(sec.body, locale),
      motif: sec.motif,
      place: place ? { name: tr(place.name, locale), x, y } : null,
      event: event
        ? { id: event.id, title: tr(event.title, locale), dateLabel: formatDate(event.date, event.precision, locale) }
        : null,
    };
  });

  return (
    <article>
      <header className="grain border-b border-line">
        <div className="mx-auto max-w-3xl px-4 pt-14 pb-10 text-center sm:px-6 sm:pt-20">
          <Link href="/stories" className="text-sm text-paper-dim hover:text-paper">
            ← {tStories("title")}
          </Link>
          <h1 className="font-display mt-6 text-5xl leading-tight font-semibold text-balance">{tr(story.title, locale)}</h1>
          <p className="mt-4 text-lg text-paper-dim">{tr(story.dek, locale)}</p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {story.fictional && <Badge tone="demo">{t("fictional")}</Badge>}
            <Badge>{t("minutes", { count: story.readingMinutes })}</Badge>
          </div>
          {story.contentWarning && (
            <p role="note" className="mx-auto mt-6 max-w-lg rounded-xl border border-red/40 bg-red/5 p-3 text-sm text-paper-dim">
              <strong className="text-red">{t("contentWarning")}: </strong>
              {tr(story.contentWarning, locale)}
            </p>
          )}
        </div>
      </header>

      <StoryReader
        sections={sections}
        tone={story.type === "refugee" ? "#5b4a36" : "#2f5446"}
        map={{ width: map.width, height: map.height, outline: map.bangladesh }}
      />

      <div className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        {story.fictional && <p className="mb-8 text-sm text-muted">{tStories("fictionalNote")}</p>}
        <SourceList ids={story.sourceIds} locale={locale} />
      </div>
    </article>
  );
}
