"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMuseum } from "./store";

const MAX_CANDLES = 120;
const RINGS = [2.2, 2.75, 3.3];
const PER_RING = MAX_CANDLES / RINGS.length;

/** Candle n sits on one of three rings around the flame, filling the front first. */
function candlePosition(n: number): [number, number] {
  const ring = Math.floor(n / PER_RING);
  const k = n % PER_RING;
  // Alternate left/right of the visitor-facing side so the ring fills symmetrically.
  const step = (Math.PI * 2) / PER_RING;
  const offset = (k % 2 === 0 ? 1 : -1) * Math.ceil(k / 2) * step;
  const angle = offset; // 0 = facing the entrance (+z)
  const r = RINGS[ring];
  return [Math.sin(angle) * r, Math.cos(angle) * r];
}

export function MemoryHall({ z }: { z: number }) {
  const candles = useMuseum((s) => s.candles);
  const reduced = useMuseum((s) => s.reducedMotion);
  const flame = useRef<THREE.Group>(null);
  const light = useRef<THREE.PointLight>(null);
  const bodies = useRef<THREE.InstancedMesh>(null);
  const flames = useRef<THREE.InstancedMesh>(null);

  const geo = useMemo(
    () => ({
      body: new THREE.CylinderGeometry(0.045, 0.05, 0.24, 8),
      tip: new THREE.ConeGeometry(0.03, 0.09, 6),
    }),
    [],
  );
  const mat = useMemo(
    () => ({
      body: new THREE.MeshLambertMaterial({ color: "#efe6d4" }),
      tip: new THREE.MeshBasicMaterial({ color: "#ffc069", toneMapped: false }),
    }),
    [],
  );

  useLayoutEffect(() => {
    const n = Math.min(candles, MAX_CANDLES);
    const m = new THREE.Matrix4();
    for (let i = 0; i < n; i++) {
      const [x, dz] = candlePosition(i);
      m.makeTranslation(x, 0.12, dz);
      bodies.current?.setMatrixAt(i, m);
      m.makeTranslation(x, 0.29, dz);
      flames.current?.setMatrixAt(i, m);
    }
    for (const mesh of [bodies.current, flames.current]) {
      if (!mesh) continue;
      mesh.count = n;
      mesh.instanceMatrix.needsUpdate = true;
    }
  }, [candles]);

  useFrame(({ clock }) => {
    if (reduced || !flame.current || !light.current) return;
    const t = clock.elapsedTime;
    const f = 1 + Math.sin(t * 7.3) * 0.05 + Math.sin(t * 13.1) * 0.03;
    flame.current.scale.set(1, f, 1);
    light.current.intensity = 7 * (0.92 + (f - 1) * 1.5);
  });

  return (
    <group position={[0, 0, z]}>
      <mesh position-y={0.5}>
        <cylinderGeometry args={[0.6, 0.7, 1, 24]} />
        <meshStandardMaterial color="#2a2520" roughness={0.8} />
      </mesh>
      <group ref={flame} position-y={1}>
        <mesh position-y={0.35}>
          <coneGeometry args={[0.22, 0.7, 16]} />
          <meshBasicMaterial color="#f2a33a" toneMapped={false} transparent opacity={0.9} />
        </mesh>
        <mesh position-y={0.24}>
          <coneGeometry args={[0.12, 0.45, 12]} />
          <meshBasicMaterial color="#fbe3a0" toneMapped={false} />
        </mesh>
      </group>
      <pointLight ref={light} position-y={1.7} color="#ffb35a" intensity={7} distance={11} decay={1.6} />
      <mesh rotation-x={-Math.PI / 2} position-y={0.005}>
        <ringGeometry args={[1.9, 3.6, 48]} />
        <meshStandardMaterial color="#1b1815" roughness={0.9} />
      </mesh>
      <instancedMesh ref={bodies} args={[geo.body, mat.body, MAX_CANDLES]} frustumCulled={false} />
      <instancedMesh ref={flames} args={[geo.tip, mat.tip, MAX_CANDLES]} frustumCulled={false} />
    </group>
  );
}
