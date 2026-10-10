import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/ui/PageHeader";
import type { AppLocale } from "@/i18n/routing";

export async function generateMetadata({ params }: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("title") };
}

const SECTIONS = ["purpose", "method", "warnings", "demo"] as const;

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale } = (await params) as { locale: AppLocale };
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about" });

  return (
    <>
      <PageHeader title={t("title")} />
      <div className="mx-auto w-full max-w-3xl space-y-10 px-4 py-12 sm:px-6">
        {SECTIONS.map((key) => (
          <section key={key}>
            <h2 className="font-display text-2xl font-semibold">{t(`${key}Title`)}</h2>
            <p className="mt-3 text-lg text-paper-dim">{t(key)}</p>
          </section>
        ))}
      </div>
    </>
  );
}
