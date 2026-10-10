import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import { Badge } from "@/components/ui/Badge";
import { SourceList } from "@/components/ui/SourceList";
import {
  getEvent,
  getEvents,
  getExhibitsForEvent,
  getGallery,
  getPeopleByIds,
  getPlace,
  getStoriesForEvent,
  tr,
} from "@/lib/content";
import { formatDate } from "@/lib/format";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => getEvents().map((e) => ({ locale, slug: e.id })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/timeline/[slug]">): Promise<Metadata> {
  const { locale, slug } = (await params) as { locale: AppLocale; slug: string };
  const e = getEvent(slug);
  return e ? { title: tr(e.title, locale), description: tr(e.summary, locale) } : {};
}

export default async function EventPage({ params }: PageProps<"/[locale]/timeline/[slug]">) {
  const { locale, slug } = (await params) as { locale: AppLocale; slug: string };
  setRequestLocale(locale);
  const e = getEvent(slug);
  if (!e) notFound();

  const t = await getTranslations({ locale, namespace: "common" });
  const tc = await getTranslations({ locale, namespace: "categories" });
  const all = getEvents();
  const index = all.findIndex((x) => x.id === e.id);
  const prev = all[index - 1];
  const next = all[index + 1];
  const places = e.placeIds.flatMap((id) => getPlace(id) ?? []);
  const people = getPeopleByIds(e.personIds);
  const exhibits = getExhibitsForEvent(e.id);
  const stories = getStoriesForEvent(e.id);

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
      <Link href="/timeline" className="text-sm text-paper-dim hover:text-paper">
        ← {t("back")}
      </Link>
      <header className="mt-6">
        <time dateTime={e.date} className="text-flame">
          {formatDate(e.date, e.precision, locale)}
        </time>
        <h1 className="font-display mt-2 text-4xl leading-tight font-semibold text-balance sm:text-5xl">
          {tr(e.title, locale)}
        </h1>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge>{tc(e.category)}</Badge>
          {e.sensitive && <Badge tone="warn">{t("contentWarning")}</Badge>}
        </div>
      </header>

      <p className="mt-8 text-xl leading-relaxed text-paper">{tr(e.summary, locale)}</p>

      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        {places.length > 0 && (
          <section>
            <h2 className="eyebrow mb-3">{t("places")}</h2>
            <ul className="space-y-2">
              {places.map((p) => (
                <li key={p.id}>
                  <Link href={{ pathname: "/map", query: { place: p.id } }} className="text-paper-dim underline decoration-line underline-offset-4 hover:text-paper">
                    {tr(p.name, locale)} — {t("showOnMap")}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
        {people.length > 0 && (
          <section>
            <h2 className="eyebrow mb-3">{t("people")}</h2>
            <ul className="space-y-2 text-paper-dim">
              {people.map((p) => (
                <li key={p.id}>
                  <Link href={{ pathname: "/heroes", hash: p.id }} className="hover:text-paper">
                    {tr(p.name, locale)}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
        {exhibits.length > 0 && (
          <section>
            <h2 className="eyebrow mb-3">{t("relatedExhibits")}</h2>
            <ul className="space-y-2">
              {exhibits.map((x) => (
                <li key={x.id}>
                  <Link href={`/exhibits/${x.id}`} className="text-paper-dim underline decoration-line underline-offset-4 hover:text-paper">
                    {tr(x.title, locale)}
                  </Link>
                  <span className="text-sm text-muted"> · {tr(getGallery(x.galleryId)!.title, locale)}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
        {stories.length > 0 && (
          <section>
            <h2 className="eyebrow mb-3">{t("relatedStories")}</h2>
            <ul className="space-y-2">
              {stories.map((s) => (
                <li key={s.id}>
                  <Link href={`/stories/${s.id}`} className="text-paper-dim underline decoration-line underline-offset-4 hover:text-paper">
                    {tr(s.title, locale)}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <div className="mt-12">
        <SourceList ids={e.sourceIds} locale={locale} />
      </div>

      <nav aria-label="Timeline" className="mt-12 grid gap-4 border-t border-line pt-6 sm:grid-cols-2">
        {prev ? (
          <Link href={`/timeline/${prev.id}`} className="card p-4 hover:border-paper-dim">
            <span className="text-xs text-muted">← {formatDate(prev.date, prev.precision, locale)}</span>
            <span className="mt-1 block">{tr(prev.title, locale)}</span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/timeline/${next.id}`} className="card p-4 text-right hover:border-paper-dim">
            <span className="text-xs text-muted">{formatDate(next.date, next.precision, locale)} →</span>
            <span className="mt-1 block">{tr(next.title, locale)}</span>
          </Link>
        )}
      </nav>
    </article>
  );
}
