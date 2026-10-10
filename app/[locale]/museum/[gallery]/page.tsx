import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { MuseumShell } from "@/components/museum/MuseumShell";
import { getGalleries, getGallery, tr } from "@/lib/content";
import { museumViewModel } from "@/lib/museum/viewModel";
import { routing, type AppLocale } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => getGalleries().map((g) => ({ locale, gallery: g.id })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/museum/[gallery]">): Promise<Metadata> {
  const { locale, gallery } = (await params) as { locale: AppLocale; gallery: string };
  const g = getGallery(gallery);
  return g ? { title: tr(g.title, locale), description: tr(g.intro, locale) } : {};
}

/** Deep link into one gallery: 3D spawns in that room, 2D scrolls to it. */
export default async function GalleryPage({ params }: PageProps<"/[locale]/museum/[gallery]">) {
  const { locale, gallery } = (await params) as { locale: AppLocale; gallery: string };
  setRequestLocale(locale);
  const g = getGallery(gallery);
  if (!g) notFound();
  const t = await getTranslations({ locale, namespace: "museum" });
  const { galleries, exhibits } = museumViewModel(locale);
  const startRoom = galleries.findIndex((x) => x.id === g.id);

  return (
    <>
      <PageHeader eyebrow={`${t("title")} · ${tr(g.period, locale)}`} title={tr(g.title, locale)} lead={tr(g.intro, locale)} />
      <MuseumShell galleries={galleries} exhibits={exhibits} startRoom={startRoom} />
    </>
  );
}
