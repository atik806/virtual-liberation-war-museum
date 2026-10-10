import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { ExhibitArt } from "@/components/ui/ExhibitArt";
import { Badge } from "@/components/ui/Badge";
import { getStories, tr } from "@/lib/content";
import type { AppLocale } from "@/i18n/routing";

export async function generateMetadata({ params }: PageProps<"/[locale]/stories">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "stories" });
  return { title: t("title"), description: t("lead") };
}

const TONES = ["#5b4a36", "#2f5446"];

export default async function StoriesPage({ params }: PageProps<"/[locale]/stories">) {
  const { locale } = (await params) as { locale: AppLocale };
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "stories" });
  const tc = await getTranslations({ locale, namespace: "common" });

  return (
    <>
      <PageHeader title={t("title")} lead={t("lead")}>
        <p className="mt-4 max-w-2xl rounded-xl border border-flame/30 bg-flame/5 p-4 text-sm text-paper-dim">
          {t("fictionalNote")}
        </p>
      </PageHeader>
      <ul className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-12 sm:px-6 md:grid-cols-2">
        {getStories().map((s, i) => (
          <li key={s.id}>
            <Link href={`/stories/${s.id}`} className="card group block overflow-hidden transition-colors hover:border-paper-dim">
              <ExhibitArt
                motif={s.sections[0].motif}
                tone={TONES[i % TONES.length]}
                label={tc("illustration")}
                alt=""
                className="rounded-none"
              />
              <div className="p-6">
                <div className="flex flex-wrap gap-2">
                  {s.fictional && <Badge tone="demo">{tc("fictional")}</Badge>}
                  <Badge>{tc("minutes", { count: s.readingMinutes })}</Badge>
                </div>
                <h2 className="font-display mt-3 text-2xl font-semibold">{tr(s.title, locale)}</h2>
                <p className="mt-2 text-paper-dim">{tr(s.dek, locale)}</p>
                <span className="mt-4 inline-block text-sm text-flame">{t("read")} →</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
