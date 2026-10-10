import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <div className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <p className="font-display text-6xl text-muted">404</p>
      <h1 className="font-display mt-4 text-3xl font-semibold">{t("title")}</h1>
      <p className="mt-3 text-paper-dim">{t("body")}</p>
      <Link href="/" className="btn mt-8">
        {t("home")}
      </Link>
    </div>
  );
}
