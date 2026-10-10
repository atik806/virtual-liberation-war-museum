import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { WarMap, type MapEvent, type MapRoute } from "@/components/map/WarMap";
import { getEvents, getPlace, getPlaces, getSectors, tr } from "@/lib/content";
import { formatDate, monthOf1971, yearOf } from "@/lib/format";
import { projectedMap } from "@/lib/map/geo";
import type { AppLocale } from "@/i18n/routing";

export async function generateMetadata({ params }: PageProps<"/[locale]/map">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "map" });
  return { title: t("title"), description: t("lead") };
}

/** Indicative refugee routes [from, to] — illustrative arrows, not tracked paths. */
const ROUTES: [string, string][] = [
  ["jashore", "kolkata"],
  ["cumilla", "agartala"],
  ["sylhet", "meghalaya"],
  ["mymensingh", "meghalaya"],
];

const WIDTH = 640;
const HEIGHT = 780;

export default async function MapPage({ params }: PageProps<"/[locale]/map">) {
  const { locale } = (await params) as { locale: AppLocale };
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "map" });
  const map = projectedMap(WIDTH, HEIGHT);

  const places = getPlaces().map((p) => {
    const [x, y] = map.project(p.coords);
    return { id: p.id, name: tr(p.name, locale), x, y, abroad: Boolean(p.abroad), minor: Boolean(p.minor) };
  });

  const events: MapEvent[] = getEvents()
    .filter((e) => e.placeIds.length > 0)
    .map((e) => {
      const year = yearOf(e.date);
      const month = year < 1971 ? -1 : year > 1971 ? 11 : (monthOf1971(e.date) ?? 0);
      return {
        id: e.id,
        title: tr(e.title, locale),
        dateLabel: formatDate(e.date, e.precision, locale),
        month,
        category: e.category,
        placeIds: e.placeIds,
      };
    });

  const sectors = getSectors().map((s) => {
    const [x, y] = map.project(s.anchor);
    return { n: s.number, area: tr(s.area, locale), x, y };
  });

  const routes: MapRoute[] = ROUTES.flatMap(([from, to]) => {
    const a = getPlace(from);
    const b = getPlace(to);
    if (!a || !b) return [];
    const [x1, y1] = map.project(a.coords);
    const [x2, y2] = map.project(b.coords);
    // Gentle curve: control point offset perpendicular to the line.
    const mx = (x1 + x2) / 2 - (y2 - y1) * 0.2;
    const my = (y1 + y2) / 2 + (x2 - x1) * 0.2;
    return [{ id: `${from}-${to}`, d: `M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}` }];
  });

  const monthLabels = Array.from({ length: 12 }, (_, m) =>
    formatDate(`1971-${String(m + 1).padStart(2, "0")}`, "month", locale),
  );

  return (
    <>
      <PageHeader eyebrow="1971" title={t("title")} lead={t("lead")} />
      <WarMap
        width={WIDTH}
        height={HEIGHT}
        bangladesh={map.bangladesh}
        neighbours={map.neighbours}
        places={places}
        events={events}
        sectors={sectors}
        routes={routes}
        monthLabels={monthLabels}
      />
    </>
  );
}
