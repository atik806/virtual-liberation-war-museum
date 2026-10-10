"use client";

import { useTranslations } from "next-intl";
import { PITCH, ROOM_D, ROOM_W, slotPlacement, spawnPose } from "@/lib/museum/layout";
import { Joystick } from "./Joystick";
import { useMuseum, type Quality } from "./store";
import type { MuseumExhibit, MuseumGallery } from "./types";

const MAP_SCALE = 2;

/** Top-down strip of the museum; each room is a button that takes you there. */
function MiniMap({ galleries }: { galleries: MuseumGallery[] }) {
  const t = useTranslations("museum");
  const pose = useMuseum((s) => s.pose);
  const room = useMuseum((s) => s.room);
  const goTo = useMuseum((s) => s.goTo);
  const width = galleries.length * PITCH * MAP_SCALE;
  const height = ROOM_W * MAP_SCALE;
  // Walking direction (-z) runs left to right on the map.
  const px = -pose.z * MAP_SCALE;
  const py = (pose.x + ROOM_W / 2) * MAP_SCALE;
  const hx = Math.cos(pose.yaw) * 9;
  const hy = -Math.sin(pose.yaw) * 9;

  return (
    <nav aria-label={t("miniMap")} className="rounded-xl border border-line bg-ink/70 p-2 backdrop-blur-md">
      <svg viewBox={`-2 -2 ${width + 4} ${height + 4}`} className="block h-9 w-auto" role="presentation">
        {galleries.map((g) => (
          <rect
            key={g.id}
            x={g.index * PITCH * MAP_SCALE}
            y={0}
            width={ROOM_D * MAP_SCALE}
            height={height}
            rx={3}
            fill={g.index === room ? g.tone : "#24211d"}
            stroke={g.index === room ? "#efe6d4" : "#36312a"}
            strokeWidth={1}
          />
        ))}
        <line x1={px} y1={py} x2={px + hx} y2={py + hy} stroke="#f2a33a" strokeWidth={2} strokeLinecap="round" />
        <circle cx={px} cy={py} r={3.5} fill="#f2a33a" />
      </svg>
      <ul className="mt-1 flex gap-1">
        {galleries.map((g) => (
          <li key={g.id} className="flex-1">
            <button
              type="button"
              onClick={() => goTo(spawnPose(g.index))}
              aria-current={g.index === room ? "location" : undefined}
              title={g.title}
              className="w-full rounded px-1 text-[10px] leading-5 text-muted hover:text-paper aria-[current=location]:text-paper"
            >
              <span className="sr-only">{g.title}</span>
              <span aria-hidden>{g.index + 1}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Hud({
  galleries,
  exhibits,
  tourOrder,
  coarsePointer,
  onExit2d,
  onLeave,
  startTour,
  stepTour,
}: {
  galleries: MuseumGallery[];
  exhibits: MuseumExhibit[];
  tourOrder: MuseumExhibit[];
  coarsePointer: boolean;
  onExit2d: () => void;
  onLeave: () => void;
  startTour: () => void;
  stepTour: (step: number) => void;
}) {
  const t = useTranslations("museum");
  const room = useMuseum((s) => s.room);
  const tour = useMuseum((s) => s.tour);
  const setTour = useMuseum((s) => s.setTour);
  const quality = useMuseum((s) => s.quality);
  const setQuality = useMuseum((s) => s.setQuality);
  const selectedId = useMuseum((s) => s.selectedId);
  const candles = useMuseum((s) => s.candles);
  const lightCandle = useMuseum((s) => s.lightCandle);
  const gallery = galleries[room];
  const here = exhibits.filter((x) => x.galleryIndex === room);
  const isMemory = gallery.id === "memory";

  const open = (x: MuseumExhibit) => {
    const s = useMuseum.getState();
    s.select(x.id);
    s.goTo(slotPlacement(x.galleryIndex, x.slot).view);
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-3 sm:p-4">
      {/* Top bar */}
      <div className="flex items-start justify-between gap-3">
        <div className="pointer-events-auto rounded-xl bg-ink/60 px-4 py-2 backdrop-blur-md" aria-live="polite">
          <p className="text-[11px] tracking-widest text-muted uppercase">{t("room", { n: room + 1 })}</p>
          <p className="font-display text-lg leading-tight font-semibold">{gallery.title}</p>
          <p className="text-xs text-paper-dim">{gallery.period}</p>
        </div>

        <div className="hidden lg:block pointer-events-auto">
          <MiniMap galleries={galleries} />
        </div>

        <div className="pointer-events-auto flex flex-wrap justify-end gap-2">
          {tour === null ? (
            <button type="button" className="btn btn-primary min-h-9 px-4 text-xs" onClick={startTour}>
              {t("tourStart")}
            </button>
          ) : (
            <button type="button" className="btn min-h-9 bg-ink/60 px-4 text-xs" onClick={() => setTour(null)}>
              {t("tourStop")}
            </button>
          )}
          <button type="button" className="btn min-h-9 bg-ink/60 px-4 text-xs" onClick={onExit2d}>
            {t("exit2d")}
          </button>
          <label className="btn min-h-9 bg-ink/60 px-3 text-xs">
            <span className="sr-only sm:not-sr-only">{t("quality")}</span>
            <select
              value={quality}
              onChange={(e) => setQuality(e.target.value as Quality)}
              className="bg-transparent text-paper outline-none [&>option]:bg-ink"
            >
              {(["low", "medium", "high"] as const).map((q) => (
                <option key={q} value={q}>
                  {t(q)}
                </option>
              ))}
            </select>
          </label>
          <button type="button" className="btn min-h-9 bg-ink/60 px-3 text-xs" onClick={onLeave} aria-label={t("close")}>
            ✕
          </button>
        </div>
      </div>

      {/* Bottom */}
      <div className="flex items-end justify-between gap-3">
        <div className="pointer-events-auto">
          {coarsePointer ? (
            <Joystick />
          ) : (
            <p className="max-w-xs rounded-lg bg-ink/60 px-3 py-2 text-xs text-paper-dim backdrop-blur-md">
              {t("controlsDesktop")}
            </p>
          )}
        </div>

        <div className="pointer-events-auto flex flex-col items-center gap-2">
          {tour !== null && (
            <div className="flex items-center gap-2 rounded-full bg-ink/70 p-1 backdrop-blur-md">
              <button
                type="button"
                className="btn min-h-9 px-4 text-xs"
                disabled={tour === 0}
                onClick={() => stepTour(tour - 1)}
              >
                ← {t("tourPrev")}
              </button>
              <span className="px-2 text-xs text-paper-dim tabular-nums">
                {t("tourStep", { n: tour + 1, total: tourOrder.length })}
              </span>
              <button
                type="button"
                className="btn btn-primary min-h-9 px-4 text-xs"
                disabled={tour >= tourOrder.length - 1}
                onClick={() => stepTour(tour + 1)}
              >
                {t("tourNext")} →
              </button>
            </div>
          )}
          {isMemory && (
            <div className="flex flex-col items-center gap-1 rounded-2xl bg-ink/70 px-4 py-3 text-center backdrop-blur-md">
              <button type="button" className="btn btn-primary" onClick={lightCandle}>
                🕯 {t("lightCandle")}
              </button>
              <p className="text-xs text-paper-dim" aria-live="polite">
                {t("candlesLit", { count: candles })}
              </p>
            </div>
          )}
        </div>

        {!selectedId && (
          <nav
            aria-label={t("exhibitsHere")}
            className="pointer-events-auto hidden max-w-64 rounded-xl bg-ink/70 p-3 backdrop-blur-md sm:block"
          >
            <p className="eyebrow mb-2">{t("exhibitsHere")}</p>
            <ul className="space-y-1">
              {here.map((x) => (
                <li key={x.id}>
                  <button
                    type="button"
                    onClick={() => open(x)}
                    className="w-full rounded-md px-2 py-1 text-left text-sm text-paper-dim hover:bg-ink-3 hover:text-paper"
                  >
                    {x.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
}
