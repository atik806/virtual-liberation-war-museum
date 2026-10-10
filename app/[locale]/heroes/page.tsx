import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { getPeople, tr } from "@/lib/content";
import type { AppLocale } from "@/i18n/routing";
import type { Person } from "@/types/content";

export async function generateMetadata({ params }: PageProps<"/[locale]/heroes">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "heroes" });
  return { title: t("title"), description: t("lead") };
}

const TITLES = /^(Captain|Sepoy|Lance Naik|Flight Lieutenant|Engine Room Artificer|Bangabandhu)\s+/i;

/** Initials medallion in place of a portrait — portraits come from licensed archives only. */
function Medallion({ name, accent }: { name: string; accent: string }) {
  const initials = name
    .replace(TITLES, "")
    .split(/\s+/)
    .filter((w) => /^[A-Z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  return (
    <span aria-hidden className={`font-display flex size-16 shrink-0 items-center justify-center rounded-full border text-xl ${accent}`}>
      {initials}
    </span>
  );
}

export default async function HeroesPage({ params }: PageProps<"/[locale]/heroes">) {
  const { locale } = (await params) as { locale: AppLocale };
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "heroes" });
  const tc = await getTranslations({ locale, namespace: "common" });
  const people = getPeople();

  const group = (title: string, list: Person[], accent: string) => (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <h2 className="font-display mb-6 text-3xl font-semibold">{title}</h2>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <li key={p.id} id={p.id} className="card flex scroll-mt-28 gap-4 p-5">
            <Medallion name={p.name.en} accent={accent} />
            <div>
              <h3 className="font-display text-lg leading-snug font-semibold">{tr(p.name, locale)}</h3>
              <p className="text-sm text-flame">{tr(p.role, locale)}</p>
              <p className="mt-2 text-sm text-paper-dim">{tr(p.bio, locale)}</p>
              {p.demo && (
                <div className="mt-3">
                  <Badge tone="demo">{tc("demoBadge")}</Badge>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );

  return (
    <>
      <PageHeader title={t("title")} lead={t("lead")}>
        <p className="mt-3 text-sm text-muted">{t("portraitNote")}</p>
      </PageHeader>
      {group(t("birSreshtho"), people.filter((p) => p.honour === "bir-sreshtho"), "border-red/60 text-red")}
      {group(t("leaders"), people.filter((p) => p.honour === "leader"), "border-green-bright/60 text-green-bright")}
    </>
  );
}
