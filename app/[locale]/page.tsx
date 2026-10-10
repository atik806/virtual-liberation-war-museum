import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getEvent, tr } from "@/lib/content";
import { formatDate } from "@/lib/format";
import type { AppLocale } from "@/i18n/routing";

const KEY_DATES = [
  "march-7-speech",
  "operation-searchlight",
  "declaration-of-independence",
  "mujibnagar-government",
  "martyred-intellectuals",
  "victory-day",
];

const CARDS = [
  { key: "museum", href: "/museum", glyph: "◫" },
  { key: "timeline", href: "/timeline", glyph: "⟶" },
  { key: "map", href: "/map", glyph: "◎" },
  { key: "stories", href: "/stories", glyph: "❝" },
] as const;

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = (await params) as { locale: AppLocale };
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "home" });

  return (
    <>
      <section className="grain relative overflow-hidden border-b border-line">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_70%_20%,rgba(244,42,65,0.16),transparent_55%),radial-gradient(ellipse_at_10%_90%,rgba(0,106,78,0.28),transparent_60%)]"
        />
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 md:grid-cols-[1.4fr_1fr] md:py-28">
          <div className="animate-[rise_1.2s_var(--ease-solemn)_both]">
            <p className="eyebrow mb-5">{t("eyebrow")}</p>
            <h1 className="font-display text-5xl leading-[1.08] font-semibold text-balance sm:text-6xl">
              {t("title")}
            </h1>
            <p className="mt-6 max-w-xl text-lg text-paper-dim text-pretty">{t("lead")}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/museum" className="btn btn-primary">
                {t("enter")}
              </Link>
              <Link href="/timeline" className="btn">
                {t("explore")}
              </Link>
            </div>
          </div>

          <blockquote className="self-end border-l-2 border-red pl-6 animate-[rise_1.6s_var(--ease-solemn)_0.3s_both]">
            <p lang="bn" className="font-display text-2xl leading-snug text-paper">
              {locale === "bn"
                ? t("quote")
                : "“এবারের সংগ্রাম আমাদের মুক্তির সংগ্রাম, এবারের সংগ্রাম স্বাধীনতার সংগ্রাম।”"}
            </p>
            {locale === "en" && <p className="mt-3 text-paper-dim italic">{t("quote")}</p>}
            <footer className="mt-4 text-sm text-muted">— {t("quoteBy")}</footer>
          </blockquote>
        </div>

        <dl className="mx-auto grid max-w-6xl grid-cols-3 border-t border-line/70 px-4 sm:px-6">
          {(["months", "sectors", "victory"] as const).map((k) => (
            <div key={k} className="py-6 pr-4">
              <dt className="sr-only">{t(`stats.${k}Label`)}</dt>
              <dd>
                <span className="font-display block text-3xl font-semibold text-paper sm:text-4xl">
                  {t(`stats.${k}`)}
                </span>
                <span className="text-sm text-muted">{t(`stats.${k}Label`)}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map(({ key, href, glyph }) => (
            <li key={key}>
              <Link
                href={href}
                className="card group flex h-full flex-col gap-3 p-6 transition-colors duration-500 hover:border-paper-dim"
              >
                <span aria-hidden className="text-2xl text-flame">
                  {glyph}
                </span>
                <span className="font-display text-xl font-semibold">{t(`cards.${key}.title`)}</span>
                <span className="text-sm text-paper-dim">{t(`cards.${key}.body`)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="key-dates" className="border-y border-line bg-ink-2">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2 id="key-dates" className="font-display text-3xl font-semibold">
              {t("keyDates")}
            </h2>
            <Link href="/timeline" className="text-sm text-paper-dim underline underline-offset-4 hover:text-paper">
              {t("seeTimeline")}
            </Link>
          </div>
          <ol className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {KEY_DATES.map((id) => {
              const e = getEvent(id);
              if (!e) return null;
              return (
                <li key={id} className="bg-ink-2">
                  <Link href={`/timeline/${e.id}`} className="block h-full p-6 transition-colors hover:bg-ink-3">
                    <time dateTime={e.date} className={`text-sm ${e.id === "victory-day" ? "text-red" : "text-flame"}`}>
                      {formatDate(e.date, e.precision, locale)}
                    </time>
                    <p className="font-display mt-2 text-lg font-semibold">{tr(e.title, locale)}</p>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h2 className="font-display text-2xl font-semibold">{t("approachTitle")}</h2>
        <p className="mt-4 text-paper-dim text-pretty">{t("approachBody")}</p>
      </section>
    </>
  );
}
