"use client";

import { useMemo, useState } from "react";
import { useCursor } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { slotPlacement } from "@/lib/museum/layout";
import { dragState, useMuseum } from "./store";
import { useArtTexture, useLabelTexture } from "./textures";
import type { MuseumExhibit } from "./types";

export function ExhibitFrame({
  exhibit,
  roomIndex,
  tone,
  warningLabel,
}: {
  exhibit: MuseumExhibit;
  roomIndex: number;
  tone: string;
  warningLabel: string;
}) {
  const placement = useMemo(() => slotPlacement(roomIndex, exhibit.slot), [roomIndex, exhibit.slot]);
  const art = useArtTexture(exhibit.motif, tone, exhibit.sensitive, warningLabel);
  const plaque = useLabelTexture(exhibit.title, exhibit.caption, { width: 512, height: 160, titleSize: 32 });
  const [hovered, setHovered] = useState(false);
  const selected = useMuseum((s) => s.selectedId === exhibit.id);
  useCursor(hovered);

  const open = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (dragState.moved) return; // the pointer was dragging the view, not clicking
    const s = useMuseum.getState();
    s.select(exhibit.id);
    s.goTo(placement.view);
  };

  const lit = hovered || selected;

  return (
    <group
      position={placement.position}
      rotation-y={placement.rotationY}
      onClick={open}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      <mesh position-z={0.02}>
        <boxGeometry args={[2.7, 2.1, 0.08]} />
        <meshStandardMaterial
          color={lit ? "#8a6a3a" : "#1c1814"}
          emissive={lit ? "#3a2a10" : "#000000"}
          roughness={0.6}
        />
      </mesh>
      <mesh position-z={0.065}>
        <planeGeometry args={[2.4, 1.8]} />
        <meshBasicMaterial map={art} toneMapped={false} />
      </mesh>
      <mesh position={[0, -1.45, 0.03]}>
        <planeGeometry args={[1.7, 0.53]} />
        <meshBasicMaterial map={plaque} toneMapped={false} />
      </mesh>
    </group>
  );
}
