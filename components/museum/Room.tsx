"use client";

import { useMemo } from "react";
import * as THREE from "three";
import {
  CORRIDOR,
  DOOR_W,
  ROOM_D,
  ROOM_W,
  WALL_H,
  roomCenterZ,
  roomEnd,
  roomStart,
} from "@/lib/museum/layout";
import { ExhibitFrame } from "./ExhibitFrame";
import { useLabelTexture } from "./textures";
import type { MuseumExhibit, MuseumGallery } from "./types";

const DOOR_H = 3.2;
const T = 0.2; // wall thickness

const floorMat = new THREE.MeshStandardMaterial({ color: "#2a2622", roughness: 0.5, metalness: 0.05 });
const ceilingMat = new THREE.MeshLambertMaterial({ color: "#151311" });
const stripMat = new THREE.MeshBasicMaterial({ color: "#f3e3c2", toneMapped: false });

/** A wall across the room at z, optionally with a doorway in the middle. */
function CrossWall({ z, door, material }: { z: number; door: boolean; material: THREE.Material }) {
  if (!door) {
    return (
      <mesh position={[0, WALL_H / 2, z]} material={material}>
        <boxGeometry args={[ROOM_W + T * 2, WALL_H, T]} />
      </mesh>
    );
  }
  const seg = (ROOM_W - DOOR_W) / 2 + T;
  const segX = DOOR_W / 2 + seg / 2;
  return (
    <group>
      <mesh position={[-segX, WALL_H / 2, z]} material={material}>
        <boxGeometry args={[seg, WALL_H, T]} />
      </mesh>
      <mesh position={[segX, WALL_H / 2, z]} material={material}>
        <boxGeometry args={[seg, WALL_H, T]} />
      </mesh>
      <mesh position={[0, DOOR_H + (WALL_H - DOOR_H) / 2, z]} material={material}>
        <boxGeometry args={[DOOR_W, WALL_H - DOOR_H, T]} />
      </mesh>
    </group>
  );
}

function Corridor({ z, material }: { z: number; material: THREE.Material }) {
  const cz = z - CORRIDOR / 2;
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, cz]} material={floorMat}>
        <planeGeometry args={[DOOR_W, CORRIDOR]} />
      </mesh>
      <mesh rotation-x={Math.PI / 2} position={[0, DOOR_H, cz]} material={ceilingMat}>
        <planeGeometry args={[DOOR_W, CORRIDOR]} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * (DOOR_W / 2 + T / 2), DOOR_H / 2, cz]} material={material}>
          <boxGeometry args={[T, DOOR_H, CORRIDOR]} />
        </mesh>
      ))}
    </group>
  );
}

function GallerySign({ gallery, z }: { gallery: MuseumGallery; z: number }) {
  const texture = useLabelTexture(gallery.title, gallery.period, {
    width: 768,
    height: 220,
    background: "#14120f",
    color: "#efe6d4",
    titleSize: 64,
  });
  return (
    <group position={[0, 3.5, z]}>
      <mesh>
        <planeGeometry args={[4.2, 1.2]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      {[-1.8, 1.8].map((x) => (
        <mesh key={x} position={[x, 1.25, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 1.3, 4]} />
          <meshBasicMaterial color="#5a5248" />
        </mesh>
      ))}
    </group>
  );
}

export function Room({
  gallery,
  count,
  exhibits,
  warningLabel,
}: {
  gallery: MuseumGallery;
  count: number;
  exhibits: MuseumExhibit[];
  warningLabel: string;
}) {
  const i = gallery.index;
  const start = roomStart(i);
  const end = roomEnd(i);
  const cz = roomCenterZ(i);

  const wallMat = useMemo(() => {
    const color = new THREE.Color(gallery.tone).multiplyScalar(gallery.sensitive ? 0.55 : 0.85);
    return new THREE.MeshLambertMaterial({ color });
  }, [gallery.tone, gallery.sensitive]);

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, cz]} material={floorMat}>
        <planeGeometry args={[ROOM_W, ROOM_D]} />
      </mesh>
      <mesh rotation-x={Math.PI / 2} position={[0, WALL_H, cz]} material={ceilingMat}>
        <planeGeometry args={[ROOM_W, ROOM_D]} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * (ROOM_W / 2 + T / 2), WALL_H / 2, cz]} material={wallMat}>
          <boxGeometry args={[T, WALL_H, ROOM_D]} />
        </mesh>
      ))}
      <CrossWall z={start + T / 2} door={i > 0} material={wallMat} />
      <CrossWall z={end - T / 2} door={i < count - 1} material={wallMat} />
      {i < count - 1 && <Corridor z={end} material={wallMat} />}

      {/* Ceiling light strips — omitted in the quiet room. */}
      {!gallery.sensitive &&
        [-3.2, 3.2].map((x) => (
          <mesh key={x} position={[x, WALL_H - 0.03, cz]} material={stripMat}>
            <boxGeometry args={[0.12, 0.04, ROOM_D - 4]} />
          </mesh>
        ))}

      <GallerySign gallery={gallery} z={start - 7} />

      {exhibits.map((x) => (
        <ExhibitFrame key={x.id} exhibit={x} roomIndex={i} tone={gallery.tone} warningLabel={warningLabel} />
      ))}
    </group>
  );
}
