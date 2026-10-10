"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { EventCategory } from "@/types/content";

export interface MapPlace {
  id: string;
  name: string;
  x: number;
  y: number;
  abroad: boolean;
  minor: boolean;
}

export interface MapEvent {
  id: string;
  title: string;
  dateLabel: string;
  /** -1 = before 1971, 0-11 = month of 1971 (1972 events count as December). */
  month: number;
  category: EventCategory;
  placeIds: string[];
}

export interface MapSector {
  n: number;
  area: string;
  x: number;
  y: number;
}

export interface MapRoute {
  id: string;
  d: string;
}

interface Props {
  width: number;
  height: number;
  bangladesh: string;
  neighbours: string;
  places: MapPlace[];
  events: MapEvent[];
  sectors: MapSector[];
  routes: MapRoute[];
  monthLabels: string[];
}

const FIRST_WAR_MONTH = 2; // March

export function WarMap(props: Props) {
  const { width, height, bangladesh, neighbours, places, events, sectors, routes, monthLabels } = props;
  const t = useTranslations("map");
  const [month, setMonth] = useState(11);
  const [playing, setPlaying] = useState(false);
  const [layers, setLayers] = useState({ events: true, sectors: true, refugees: true });
  const [selected, setSelected] = useState<string | null>(null);

  // Deep link: /map?place=dhaka (read client-side so the page stays static).
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("place");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from the URL after hydration
    if (id && places.some((p) => p.id === id)) setSelected(id);
  }, [places]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setMonth((m) => {
        if (m >= 11) {
          setPlaying(false);
          return 11;
        }
        return m + 1;
      });
    }, 1400);
    return () => window.clearInterval(timer);
  }, [playing]);

  const visibleEvents = useMemo(() => events.filter((e) => e.month <= month), [events, month]);

  const eventsByPlace = useMemo(() => {
    const map = new Map<string, MapEvent[]>();
    for (const e of visibleEvents) {
      for (const id of e.placeIds) map.set(id, [...(map.get(id) ?? []), e]);
    }
    return map;
  }, [visibleEvents]);

  const activePlaces = places.filter((p) => {
    if (p.abroad) return layers.refugees && month >= 3;
    return layers.events && eventsByPlace.has(p.id);
  });

  const selectedPlace = places.find((p) => p.id === selected) ?? null;
  const selectedEvents = selected ? (eventsByPlace.get(selected) ?? []) : [];

  const togglePlay = () => {
    if (!playing && month >= 11) setMonth(FIRST_WAR_MONTH);
    setPlaying((p) => !p);
  };

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_340px]">
      <div>
        <div className="card mb-4 flex flex-wrap items-center gap-4 p-4">
          <button type="button" className="btn min-h-9 px-4 text-xs" onClick={togglePlay} aria-pressed={playing}>
            {playing ? t("pause") : t("play")}
          </button>
          <label className="flex min-w-56 flex-1 flex-col gap-1 text-sm">
            <span className="text-paper-dim">
              {t("month")}: <strong className="text-paper">{t("upTo", { month: monthLabels[month] })}</strong>
            </span>
            <input
              type="range"
              min={0}
              max={11}
              step={1}
              value={month}
              onChange={(e) => {
                setPlaying(false);
                setMonth(Number(e.target.value));
              }}
              aria-valuetext={monthLabels[month]}
              className="accent-[var(--color-red)]"
            />
          </label>
          <fieldset className="flex flex-wrap gap-3 text-sm">
            <legend className="sr-only">{t("layers")}</legend>
            {(["events", "sectors", "refugees"] as const).map((k) => (
              <label key={k} className="flex items-center gap-1.5 text-paper-dim">
                <input
                  type="checkbox"
                  checked={layers[k]}
                  onChange={() => setLayers((l) => ({ ...l, [k]: !l[k] }))}
                  className="accent-[var(--color-green-bright)]"
                />
                {t(k === "events" ? "layerEvents" : k === "sectors" ? "layerSectors" : "layerRefugees")}
              </label>
            ))}
          </fieldset>
        </div>

        <div className="card overflow-hidden">
          <svg viewBox={`0 0 ${width} ${height}`} className="block h-auto w-full" role="group" aria-label={t("title")}>
            <rect width={width} height={height} fill="#0d1b22" />
            <path d={neighbours} fill="#1d1b18" stroke="#3a352d" strokeWidth={0.8} />
            <path d={bangladesh} fill="#1f3a2f" stroke="#7fb59c" strokeWidth={1.2} />

            {layers.refugees && month >= 3 && (
              <g fill="none" stroke="var(--color-flame)" strokeWidth={2} strokeDasharray="6 6" opacity={0.75}>
                {routes.map((r) => (
                  <path key={r.id} d={r.d} markerEnd="url(#arrow)" />
                ))}
              </g>
            )}
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0 0 L10 5 L0 10z" fill="var(--color-flame)" />
              </marker>
            </defs>

            {layers.sectors && (
              <g aria-hidden>
                {sectors.map((s) => (
                  <g key={s.n} transform={`translate(${s.x} ${s.y})`}>
                    <circle r={13} fill="rgba(0,106,78,0.35)" stroke="#2f9b74" strokeWidth={1} />
                    <text textAnchor="middle" dy="0.35em" fontSize={12} fill="#cfe9dc" fontWeight={600}>
                      {s.n}
                    </text>
                  </g>
                ))}
              </g>
            )}

            {activePlaces.map((p) => {
              const count = eventsByPlace.get(p.id)?.length ?? 0;
              const isSel = p.id === selected;
              return (
                <g
                  key={p.id}
                  transform={`translate(${p.x} ${p.y})`}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSel}
                  aria-label={`${p.name}${count ? ` (${count})` : ""}`}
                  className="cursor-pointer outline-none [&:focus-visible>circle:first-child]:stroke-[var(--color-flame)]"
                  onClick={() => setSelected(p.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelected(p.id);
                    }
                  }}
                >
                  <circle r={isSel ? 12 : 9} fill="transparent" stroke={isSel ? "var(--color-flame)" : "transparent"} strokeWidth={2} />
                  <circle r={p.abroad ? 5 : 6} fill={p.abroad ? "var(--color-flame)" : "var(--color-red)"} stroke="#11100e" strokeWidth={1.5} />
                  <text
                    x={10}
                    visibility={p.minor && !isSel ? "hidden" : undefined}
                    dy="0.35em" fontSize={13} fill="#efe6d4" stroke="#11100e" strokeWidth={3} paintOrder="stroke">
                    {p.name.split(" (")[0]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        <p className="mt-2 text-xs text-muted">{t("approxNote")}</p>
      </div>

      <aside className="space-y-6" aria-live="polite">
        <div className="card p-5">
          {selectedPlace ? (
            <>
              <h2 className="font-display text-2xl font-semibold">{selectedPlace.name}</h2>
              {selectedPlace.abroad && <p className="text-sm text-flame">{t("abroad")}</p>}
              {selectedEvents.length ? (
                <ul className="mt-4 space-y-3">
                  {selectedEvents.map((e) => (
                    <li key={e.id}>
                      <Link href={`/timeline/${e.id}`} className="block rounded-lg p-2 -m-2 hover:bg-ink-3">
                        <span className="text-xs text-flame">{e.dateLabel}</span>
                        <span className="block">{e.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-paper-dim">{t("noEvents")}</p>
              )}
            </>
          ) : (
            <p className="text-paper-dim">{t("selectPlace")}</p>
          )}
        </div>

        <nav aria-label={t("listView")}>
          <h2 className="eyebrow mb-3">{t("listView")}</h2>
          <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
            {activePlaces.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => setSelected(p.id)}
                  aria-pressed={p.id === selected}
                  className="rounded-full border border-line px-3 py-1.5 text-left text-sm text-paper-dim hover:text-paper aria-pressed:border-flame aria-pressed:text-paper lg:w-full lg:rounded-lg"
                >
                  {p.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {layers.sectors && (
          <section>
            <h2 className="eyebrow mb-3">{t("layerSectors")}</h2>
            <ol className="space-y-1 text-sm text-paper-dim">
              {sectors.map((s) => (
                <li key={s.n}>
                  <span className="text-green-bright">{t("sector", { n: s.n })}</span> — {s.area}
                </li>
              ))}
            </ol>
          </section>
        )}
      </aside>
    </div>
  );
}
