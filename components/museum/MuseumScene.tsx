"use client";

import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { roomCenterZ } from "@/lib/museum/layout";
import { MemoryHall } from "./MemoryHall";
import { Player } from "./Player";
import { Room } from "./Room";
import { useMuseum, type Quality } from "./store";
import type { MuseumExhibit, MuseumGallery } from "./types";

const DPR: Record<Quality, [number, number]> = {
  low: [0.75, 1],
  medium: [1, 1.5],
  high: [1, 2],
};
const LOWER: Record<Quality, Quality> = { high: "medium", medium: "low", low: "low" };

/** Rooms further than this from the visitor are not mounted at all. */
const STREAM_RADIUS = 1;

export default function MuseumScene({
  galleries,
  exhibits,
  startRoom,
  warningLabel,
  frozen,
}: {
  galleries: MuseumGallery[];
  exhibits: MuseumExhibit[];
  startRoom: number;
  warningLabel: string;
  frozen: boolean;
}) {
  const room = useMuseum((s) => s.room);
  const quality = useMuseum((s) => s.quality);
  const setQuality = useMuseum((s) => s.setQuality);

  const memory = galleries.find((g) => g.id === "memory");
  const blockers = useMemo(
    () => (memory ? [{ x: 0, z: roomCenterZ(memory.index), r: 3.7 }] : []),
    [memory],
  );

  return (
    <Canvas
      dpr={DPR[quality]}
      gl={{ antialias: quality !== "low", powerPreference: "high-performance" }}
      camera={{ fov: 65, near: 0.1, far: 60 }}
      className="!absolute inset-0"
      style={{ touchAction: "none" }}
      aria-hidden
    >
      <PerformanceMonitor onDecline={() => setQuality(LOWER[useMuseum.getState().quality])} />
      <color attach="background" args={["#0b0a09"]} />
      <fog attach="fog" args={["#0b0a09", 10, 36]} />
      <ambientLight intensity={0.55} />
      <hemisphereLight args={["#fff2dc", "#2a2420", 0.9]} />
      <directionalLight position={[3, 8, 2]} intensity={0.6} />

      {galleries
        .filter((g) => Math.abs(g.index - room) <= STREAM_RADIUS)
        .map((g) => (
          <Room
            key={g.id}
            gallery={g}
            count={galleries.length}
            exhibits={exhibits.filter((x) => x.galleryIndex === g.index)}
            warningLabel={warningLabel}
          />
        ))}
      {memory && Math.abs(memory.index - room) <= STREAM_RADIUS && <MemoryHall z={roomCenterZ(memory.index)} />}

      <Player roomCount={galleries.length} startRoom={startRoom} blockers={blockers} frozen={frozen} />
    </Canvas>
  );
}
