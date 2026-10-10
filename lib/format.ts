import type { DatePrecision } from "@/types/content";
import type { AppLocale } from "@/i18n/routing";

const intlLocale: Record<AppLocale, string> = { bn: "bn-BD", en: "en-GB" };

/** Formats a content date ("1971", "1971-03", "1971-03-26") honouring its precision. */
export function formatDate(
  date: string,
  precision: DatePrecision,
  locale: AppLocale,
): string {
  const [y, m = "01", d = "01"] = date.split("-");
  const value = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d)));
  const options: Intl.DateTimeFormatOptions = { timeZone: "UTC", year: "numeric" };
  if (precision === "day") Object.assign(options, { day: "numeric", month: "long" });
  if (precision === "month" || precision === "approx") options.month = "long";

  const text = new Intl.DateTimeFormat(intlLocale[locale], options).format(value);
  if (precision !== "approx") return text;
  return locale === "bn" ? `আনুমানিক ${text}` : `c. ${text}`;
}

export function formatNumber(n: number, locale: AppLocale): string {
  return new Intl.NumberFormat(intlLocale[locale]).format(n);
}

/** Month index in 1971 (0 = Jan) for a content date, or null outside 1971. */
export function monthOf1971(date: string): number | null {
  if (!date.startsWith("1971-")) return null;
  return Number(date.slice(5, 7)) - 1;
}

export function yearOf(date: string): number {
  return Number(date.slice(0, 4));
}
