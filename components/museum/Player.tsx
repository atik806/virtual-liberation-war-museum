"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  EYE_H,
  angleDelta,
  moveWithCollision,
  roomIndexAt,
  spawnPose,
  walkableRects,
  type Blocker,
  type Pose,
} from "@/lib/museum/layout";
import { dragState, useMuseum } from "./store";

const WALK_SPEED = 3.2; // m/s
const TURN_SPEED = 1.8; // rad/s
const GLIDE_RATE = 3.2;
const MAX_PITCH = 0.6;

const KEYS = {
  forward: ["w", "arrowup"],
  back: ["s", "arrowdown"],
  left: ["a"],
  right: ["d"],
  turnLeft: ["arrowleft", "q"],
  turnRight: ["arrowright", "e"],
};
const ALL_KEYS = new Set(Object.values(KEYS).flat());

const isTyping = (t: EventTarget | null) =>
  t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));

/**
 * First-person controller: keyboard / joystick walking, drag-to-look, glides
 * to exhibits within a room and cuts between rooms. Collision is 2D against
 * the walkable rectangles from lib/museum/layout.
 */
export function Player({
  roomCount,
  startRoom,
  blockers,
  frozen,
}: {
  roomCount: number;
  startRoom: number;
  blockers: Blocker[];
  /** Movement paused (e.g. while the content warning is showing). */
  frozen: boolean;
}) {
  const camera = useThree((s) => s.camera);
  const gl = useThree((s) => s.gl);
  const rects = useMemo(() => walkableRects(roomCount), [roomCount]);
  const pose = useRef<Pose>(spawnPose(startRoom));
  const pitch = useRef(0);
  const keys = useRef(new Set<string>());
  const lastPublish = useRef(0);
  const frozenRef = useRef(frozen);

  useEffect(() => {
    frozenRef.current = frozen;
  }, [frozen]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        useMuseum.getState().select(null);
        return;
      }
      if (isTyping(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (!ALL_KEYS.has(k)) return;
      keys.current.add(k);
      if (k.startsWith("arrow")) e.preventDefault();
    };
    const up = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());
    const clear = () => keys.current.clear();
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", clear);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", clear);
    };
  }, []);

  // Drag to look (mouse, pen and touch). "Grab" semantics, like a panorama.
  useEffect(() => {
    const el = gl.domElement;
    let active: number | null = null;
    let lastX = 0;
    let lastY = 0;
    let startX = 0;
    let startY = 0;

    const onDown = (e: PointerEvent) => {
      if (active !== null) return;
      active = e.pointerId;
      lastX = startX = e.clientX;
      lastY = startY = e.clientY;
      dragState.moved = false;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerId !== active) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      if (!dragState.moved && Math.hypot(e.clientX - startX, e.clientY - startY) > 6) {
        dragState.moved = true;
        const s = useMuseum.getState();
        if (s.target) s.arrive(); // taking control cancels a glide
      }
      if (!dragState.moved) return;
      const k = e.pointerType === "touch" ? 0.006 : 0.0035;
      pose.current.yaw += dx * k;
      pitch.current = Math.max(-MAX_PITCH, Math.min(MAX_PITCH, pitch.current + dy * k));
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerId === active) active = null;
    };

    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [gl]);

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const s = useMuseum.getState();
    const p = pose.current;
    const k = keys.current;
    const has = (list: string[]) => list.some((key) => k.has(key));

    let fwd = (has(KEYS.forward) ? 1 : 0) - (has(KEYS.back) ? 1 : 0) - s.joystick.y;
    let strafe = (has(KEYS.right) ? 1 : 0) - (has(KEYS.left) ? 1 : 0) + s.joystick.x;
    const turn = (has(KEYS.turnLeft) ? 1 : 0) - (has(KEYS.turnRight) ? 1 : 0);
    const manual = fwd !== 0 || strafe !== 0 || turn !== 0;
    const currentRoom = roomIndexAt(p.z, roomCount);

    if (s.target) {
      if (manual) {
        s.arrive();
      } else {
        const t = s.target;
        const targetRoom = roomIndexAt(t.z, roomCount);
        if (targetRoom !== currentRoom || s.reducedMotion) {
          // Cut instead of gliding through walls.
          p.x = t.x;
          p.z = t.z;
          p.yaw = t.yaw;
          pitch.current = 0;
          s.arrive();
          if (targetRoom !== currentRoom) s.cut();
        } else {
          const a = 1 - Math.exp(-dt * GLIDE_RATE);
          const dYaw = angleDelta(p.yaw, t.yaw);
          p.x += (t.x - p.x) * a;
          p.z += (t.z - p.z) * a;
          p.yaw += dYaw * a;
          pitch.current *= 1 - a;
          if (Math.hypot(t.x - p.x, t.z - p.z) < 0.02 && Math.abs(dYaw) < 0.01) s.arrive();
        }
      }
    }

    if (manual && !frozenRef.current) {
      p.yaw += turn * TURN_SPEED * dt;
      const len = Math.hypot(fwd, strafe);
      if (len > 1) {
        fwd /= len;
        strafe /= len;
      }
      const step = WALK_SPEED * dt;
      const sin = Math.sin(p.yaw);
      const cos = Math.cos(p.yaw);
      const dx = (-sin * fwd + cos * strafe) * step;
      const dz = (-cos * fwd - sin * strafe) * step;
      const next = moveWithCollision(rects, p.x, p.z, dx, dz, blockers);
      p.x = next.x;
      p.z = next.z;
    }

    camera.position.set(p.x, EYE_H, p.z);
    camera.rotation.set(pitch.current, p.yaw, 0, "YXZ");

    const room = roomIndexAt(p.z, roomCount);
    if (room !== s.room) s.setRoom(room);
    if (state.clock.elapsedTime - lastPublish.current > 0.12) {
      lastPublish.current = state.clock.elapsedTime;
      s.setPose({ x: p.x, z: p.z, yaw: p.yaw });
    }
  });

  return null;
}
