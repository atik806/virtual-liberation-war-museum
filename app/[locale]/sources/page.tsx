import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { getSources, tr } from "@/lib/content";
import type { AppLocale } from "@/i18n/routing";

export async function generateMetadata({ params }: PageProps<"/[locale]/sources">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sources" });
  return { title: t("title") };
}

export default async function SourcesPage({ params }: PageProps<"/[locale]/sources">) {
  const { locale } = (await params) as { locale: AppLocale };
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "sources" });

  return (
    <>
      <PageHeader title={t("title")} lead={t("lead")} />
      <ol className="mx-auto w-full max-w-3xl space-y-4 px-4 py-12 sm:px-6">
        {getSources().map((s) => (
          <li key={s.id} id={s.id} className="card scroll-mt-28 p-5 target:border-flame">
            <p lang="en" className="font-display text-lg font-semibold">
              <cite className="not-italic">{s.title}</cite>
            </p>
            <p lang="en" className="mt-1 text-sm text-paper-dim">
              {[s.author, s.publisher, s.year].filter(Boolean).join(" · ")}
            </p>
            {s.note && <p className="mt-2 text-sm text-paper-dim">{tr(s.note, locale)}</p>}
            {s.url && (
              <a
                href={s.url}
                rel="noopener noreferrer"
                target="_blank"
                className="mt-2 inline-block text-sm text-flame underline underline-offset-4"
              >
                {s.url.replace(/^https?:\/\//, "")}
              </a>
            )}
          </li>
        ))}
      </ol>
    </>
  );
}
