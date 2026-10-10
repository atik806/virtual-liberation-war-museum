import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import { Badge } from "@/components/ui/Badge";
import { ExhibitArt } from "@/components/ui/ExhibitArt";
import { SensitiveGate } from "@/components/ui/SensitiveGate";
import { SourceList } from "@/components/ui/SourceList";
import { getEventsByIds, getExhibit, getExhibits, getGallery, tr } from "@/lib/content";
import { formatDate } from "@/lib/format";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => getExhibits().map((x) => ({ locale, slug: x.id })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/exhibits/[slug]">): Promise<Metadata> {
  const { locale, slug } = (await params) as { locale: AppLocale; slug: string };
  const x = getExhibit(slug);
  return x ? { title: tr(x.title, locale), description: tr(x.caption, locale) } : {};
}

export default async function ExhibitPage({ params }: PageProps<"/[locale]/exhibits/[slug]">) {
  const { locale, slug } = (await params) as { locale: AppLocale; slug: string };
  setRequestLocale(locale);
  const x = getExhibit(slug);
  if (!x) notFound();
  const gallery = getGallery(x.galleryId)!;
  const t = await getTranslations({ locale, namespace: "common" });
  const events = getEventsByIds(x.eventIds);

  const art = (
    <ExhibitArt
      motif={x.motif}
      tone={gallery.tone}
      label={t("illustration")}
      alt={tr(x.caption, locale)}
      priority
    />
  );

  return (
    <article className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6">
      <Link href={`/museum/${gallery.id}`} className="text-sm text-paper-dim hover:text-paper">
        ← {tr(gallery.title, locale)}
      </Link>
      <div className="mt-6 grid gap-10 md:grid-cols-[1.1fr_1fr]">
        <div>{x.sensitive ? <SensitiveGate>{art}</SensitiveGate> : art}</div>
        <div>
          <p className="eyebrow">
            {t("gallery")} · {tr(gallery.title, locale)}
          </p>
          <h1 className="font-display mt-3 text-4xl leading-tight font-semibold text-balance">{tr(x.title, locale)}</h1>
          <p className="mt-2 text-flame">{tr(x.caption, locale)}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {x.demo && <Badge tone="demo">{t("demoBadge")}</Badge>}
            {x.sensitive && <Badge tone="warn">{t("contentWarning")}</Badge>}
          </div>
          <div className="prose-museum mt-6 text-lg text-paper">
            <p>{tr(x.body, locale)}</p>
          </div>
          <Link href={`/museum/${gallery.id}`} className="btn mt-8">
            {t("seeInMuseum")}
          </Link>
        </div>
      </div>

      {events.length > 0 && (
        <section className="mt-14">
          <h2 className="eyebrow mb-4">{t("relatedEvents")}</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {events.map((e) => (
              <li key={e.id}>
                <Link href={`/timeline/${e.id}`} className="card block p-4 hover:border-paper-dim">
                  <time dateTime={e.date} className="text-sm text-flame">
                    {formatDate(e.date, e.precision, locale)}
                  </time>
                  <span className="mt-1 block font-semibold">{tr(e.title, locale)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-12">
        <SourceList ids={x.sourceIds} locale={locale} />
      </div>
    </article>
  );
}
