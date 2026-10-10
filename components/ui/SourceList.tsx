import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getSourcesByIds } from "@/lib/content";

export async function SourceList({ ids, locale }: { ids: string[]; locale: string }) {
  const t = await getTranslations({ locale, namespace: "common" });
  const sources = getSourcesByIds(ids);
  if (!sources.length) return null;

  return (
    <section aria-labelledby="sources-heading" className="border-t border-line pt-6">
      <h2 id="sources-heading" className="eyebrow mb-3">
        {t("sources")}
      </h2>
      <ol className="space-y-1.5 text-sm text-paper-dim">
        {sources.map((s) => (
          <li key={s.id} lang="en">
            <Link href={{ pathname: "/sources", hash: s.id }} className="underline decoration-line underline-offset-4 hover:text-paper">
              {s.author ? `${s.author}, ` : ""}
              <cite>{s.title}</cite>
              {s.year ? ` (${s.year})` : ""}
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
