import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { TimelineView, type TimelineItem } from "@/components/timeline/TimelineView";
import { getEvents, tr } from "@/lib/content";
import { formatDate, yearOf } from "@/lib/format";
import type { AppLocale } from "@/i18n/routing";

export async function generateMetadata({ params }: PageProps<"/[locale]/timeline">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "timeline" });
  return { title: t("title"), description: t("lead") };
}

export default async function TimelinePage({ params }: PageProps<"/[locale]/timeline">) {
  const { locale } = (await params) as { locale: AppLocale };
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "timeline" });

  const items: TimelineItem[] = getEvents().map((e) => ({
    id: e.id,
    date: e.date,
    dateLabel: formatDate(e.date, e.precision, locale),
    // 1971 is grouped by month; other years by year.
    groupLabel:
      yearOf(e.date) === 1971
        ? formatDate(e.date.slice(0, 7), "month", locale)
        : formatDate(e.date.slice(0, 4), "year", locale),
    category: e.category,
    title: tr(e.title, locale),
    summary: tr(e.summary, locale),
    sensitive: Boolean(e.sensitive),
  }));

  return (
    <>
      <PageHeader eyebrow="1947 — 1972" title={t("title")} lead={t("lead")} />
      <TimelineView items={items} />
    </>
  );
}
