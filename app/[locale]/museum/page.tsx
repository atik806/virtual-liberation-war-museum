import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { MuseumShell } from "@/components/museum/MuseumShell";
import { museumViewModel } from "@/lib/museum/viewModel";
import type { AppLocale } from "@/i18n/routing";

export async function generateMetadata({ params }: PageProps<"/[locale]/museum">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "museum" });
  return { title: t("title"), description: t("lead") };
}

export default async function MuseumPage({ params }: PageProps<"/[locale]/museum">) {
  const { locale } = (await params) as { locale: AppLocale };
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "museum" });
  const { galleries, exhibits } = museumViewModel(locale);

  return (
    <>
      <PageHeader title={t("title")} lead={t("lead")} />
      <MuseumShell galleries={galleries} exhibits={exhibits} startRoom={0} />
    </>
  );
}
