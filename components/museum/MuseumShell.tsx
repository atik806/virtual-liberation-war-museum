"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { slotPlacement, spawnPose } from "@/lib/museum/layout";
import { ExhibitPanel } from "./ExhibitPanel";
import { Gallery2D } from "./Gallery2D";
import { Hud } from "./Hud";
import { useMuseum } from "./store";
import { WarningDialog } from "./WarningDialog";
import type { MuseumExhibit, MuseumGallery } from "./types";

function Loading() {
  const t = useTranslations("museum");
  const th = useTranslations("home");
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-ink p-6 text-center">
      <p className="font-display max-w-xl text-2xl text-paper">{th("quote")}</p>
      <p className="text-sm text-muted">{t("loading")}</p>
      <div className="h-px w-48 overflow-hidden bg-line">
        <div className="h-full w-1/3 animate-[loadbar_1.4s_ease-in-out_infinite] bg-flame" />
      </div>
    </div>
  );
}

// three.js only ever loads here, and only on the client.
const MuseumScene = dynamic(() => import("./MuseumScene"), { ssr: false, loading: Loading });

interface Capabilities {
  webgl: boolean;
  lowEnd: boolean;
  coarse: boolean;
  reducedMotion: boolean;
}

function detect(): Capabilities {
  const canvas = document.createElement("canvas");
  const webgl = Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lowEnd = (nav.deviceMemory ?? 8) <= 2 || Boolean(nav.connection?.saveData);
  return { webgl, lowEnd, reducedMotion, coarse: matchMedia("(pointer: coarse)").matches };
}

export function MuseumShell({
  galleries,
  exhibits,
  startRoom,
}: {
  galleries: MuseumGallery[];
  exhibits: MuseumExhibit[];
  startRoom: number;
}) {
  const t = useTranslations("museum");
  const tc = useTranslations("common");
  const mode = useMuseum((s) => s.mode);
  const setMode = useMuseum((s) => s.setMode);
  const room = useMuseum((s) => s.room);
  const warningAck = useMuseum((s) => s.warningAck);
  const cutNonce = useMuseum((s) => s.cutNonce);
  const [caps, setCaps] = useState<Capabilities | null>(null);

  const tourOrder = useMemo(
    () => [...exhibits].sort((a, b) => a.galleryIndex - b.galleryIndex || a.slot - b.slot),
    [exhibits],
  );

  // Capability detection must run in the browser; the first paint is the static chooser.
  useEffect(() => {
    const c = detect();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only detection after hydration
    setCaps(c);
    const s = useMuseum.getState();
    s.setReducedMotion(c.reducedMotion);
    if (c.lowEnd || c.coarse) s.setQuality(c.lowEnd ? "low" : "medium");
    s.setMode(c.webgl ? "choose" : "2d");
    s.setRoom(startRoom);
    s.setPose(spawnPose(startRoom));
  }, [startRoom]);

  // Immersive mode: no page scrolling behind the canvas.
  useEffect(() => {
    if (mode !== "3d") return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prev;
    };
  }, [mode]);

  const stepTour = useCallback(
    (step: number) => {
      const x = tourOrder[step];
      if (!x) return;
      const s = useMuseum.getState();
      s.setTour(step);
      s.select(x.id);
      s.goTo(slotPlacement(x.galleryIndex, x.slot).view);
    },
    [tourOrder],
  );

  const sensitiveRoom = galleries[room]?.sensitive ?? false;
  const showWarning = mode === "3d" && sensitiveRoom && !warningAck;

  const skipSensitive = () => {
    const s = useMuseum.getState();
    s.ackWarning();
    const next = Math.min(room + 1, galleries.length - 1);
    if (s.tour !== null) {
      const step = tourOrder.findIndex((x) => x.galleryIndex === next);
      if (step >= 0) return stepTour(step);
    }
    s.select(null);
    s.goTo(spawnPose(next));
  };

  if (mode === "3d") {
    return (
      <div className="fixed inset-0 z-50 bg-ink" role="application" aria-label={t("title")}>
        <MuseumScene
          galleries={galleries}
          exhibits={exhibits}
          startRoom={startRoom}
          warningLabel={tc("contentWarning")}
          frozen={showWarning}
        />
        {cutNonce > 0 && (
          <div key={cutNonce} aria-hidden className="pointer-events-none absolute inset-0 z-10 animate-[cut_0.7s_ease-out_both] bg-ink" />
        )}
        <Hud
          galleries={galleries}
          exhibits={exhibits}
          tourOrder={tourOrder}
          coarsePointer={caps?.coarse ?? false}
          onExit2d={() => setMode("2d")}
          onLeave={() => setMode("choose")}
          startTour={() => stepTour(0)}
          stepTour={stepTour}
        />
        <ExhibitPanel exhibits={exhibits} galleries={galleries} />
        {showWarning && (
          <WarningDialog onContinue={() => useMuseum.getState().ackWarning()} onSkip={skipSensitive} />
        )}
      </div>
    );
  }

  if (mode === "2d") {
    return (
      <>
        <div className="mx-auto w-full max-w-6xl px-4 pt-8 sm:px-6">
          {caps && !caps.webgl ? (
            <p role="note" className="rounded-xl border border-line bg-ink-2 p-4 text-sm text-paper-dim">
              {t("noWebgl")}
            </p>
          ) : (
            <button type="button" className="btn" onClick={() => setMode("3d")}>
              {t("to3d")}
            </button>
          )}
        </div>
        <Gallery2D galleries={galleries} exhibits={exhibits} focusGallery={startRoom} />
      </>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-center">
        <div>
          <h2 className="font-display text-3xl font-semibold">{t("chooseTitle")}</h2>
          {caps?.lowEnd && (
            <p role="note" className="mt-4 rounded-xl border border-flame/30 bg-flame/5 p-4 text-sm text-paper-dim">
              {t("recommend2d")}
            </p>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              className={`btn ${caps?.lowEnd ? "" : "btn-primary"}`}
              onClick={() => setMode("3d")}
              disabled={!caps?.webgl}
            >
              {t("enter3d")}
            </button>
            <button type="button" className={`btn ${caps?.lowEnd ? "btn-primary" : ""}`} onClick={() => setMode("2d")}>
              {t("enter2d")}
            </button>
          </div>
          <p className="mt-6 text-sm text-muted">{caps?.coarse ? t("controlsMobile") : t("controlsDesktop")}</p>
        </div>

        <ol className="card divide-y divide-line">
          {galleries.map((g) => (
            <li key={g.id} className="flex items-center gap-4 p-4">
              <span aria-hidden className="size-3 shrink-0 rounded-full" style={{ background: g.tone }} />
              <span className="flex-1">
                <span className="font-display block font-semibold">{g.title}</span>
                <span className="text-xs text-muted">{g.period}</span>
              </span>
              {g.index === startRoom && startRoom > 0 && <span className="text-xs text-flame">●</span>}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
