import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function SiteFooter({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "footer" });
  const nav = await getTranslations({ locale, namespace: "nav" });

  return (
    <footer className="mt-auto border-t border-line bg-ink-2">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[2fr_1fr]">
        <div className="space-y-3">
          <p className="font-display text-xl text-paper">{t("tagline")}</p>
          <p className="max-w-xl text-sm text-muted">{t("demoNote")}</p>
          <p className="text-sm text-muted">{t("corrections")}</p>
        </div>
        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-2 text-sm">
            {(["museum", "timeline", "map", "stories", "heroes", "sources", "about"] as const).map((key) => (
              <li key={key}>
                <Link href={`/${key}`} className="text-paper-dim hover:text-paper">
                  {nav(key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div aria-hidden className="flex h-1">
        <span className="flex-[3] bg-green" />
        <span className="flex-1 bg-red" />
      </div>
    </footer>
  );
}
