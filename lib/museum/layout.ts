/**
 * Geometry of the 3D museum: a straight sequence of gallery rooms joined by
 * short corridors, walked along -Z. Pure functions so movement, collision and
 * exhibit placement can be unit tested without WebGL.
 *
 * Camera yaw convention: yaw 0 looks down -Z; forward = (-sin yaw, -cos yaw).
 */

export const ROOM_W = 16;
export const ROOM_D = 20;
export const CORRIDOR = 4;
export const DOOR_W = 4;
export const WALL_H = 5;
export const EYE_H = 1.65;
export const PITCH = ROOM_D + CORRIDOR;
const MARGIN = 0.6;

export interface Rect {
  x0: number;
  x1: number;
  z0: number; // the larger (closer to 0) z
  z1: number; // the smaller z
}

export interface Pose {
  x: number;
  z: number;
  yaw: number;
}

/** z where room i starts (entrance side) and ends (exit side). */
export const roomStart = (i: number) => -i * PITCH;
export const roomEnd = (i: number) => roomStart(i) - ROOM_D;
export const roomCenterZ = (i: number) => roomStart(i) - ROOM_D / 2;

export function walkableRects(roomCount: number): Rect[] {
  const rects: Rect[] = [];
  for (let i = 0; i < roomCount; i++) {
    rects.push({
      x0: -ROOM_W / 2 + MARGIN,
      x1: ROOM_W / 2 - MARGIN,
      z0: roomStart(i) - MARGIN,
      z1: roomEnd(i) + MARGIN,
    });
    if (i < roomCount - 1) {
      // Corridor overlaps the rooms slightly so there is no seam to get stuck on.
      rects.push({
        x0: -DOOR_W / 2 + MARGIN,
        x1: DOOR_W / 2 - MARGIN,
        z0: roomEnd(i) + MARGIN + 0.01,
        z1: roomStart(i + 1) - MARGIN - 0.01,
      });
    }
  }
  return rects;
}

const inside = (r: Rect, x: number, z: number) =>
  x >= r.x0 && x <= r.x1 && z <= r.z0 && z >= r.z1;

/** Round obstacles inside rooms (pedestals). */
export interface Blocker {
  x: number;
  z: number;
  r: number;
}

export const isWalkable = (rects: Rect[], x: number, z: number, blockers: Blocker[] = []) =>
  rects.some((r) => inside(r, x, z)) &&
  !blockers.some((b) => (x - b.x) ** 2 + (z - b.z) ** 2 < b.r * b.r);

/**
 * Moves from (x, z) by (dx, dz), sliding along walls: if the full move is
 * blocked, try each axis on its own.
 */
export function moveWithCollision(
  rects: Rect[],
  x: number,
  z: number,
  dx: number,
  dz: number,
  blockers: Blocker[] = [],
): { x: number; z: number } {
  if (isWalkable(rects, x + dx, z + dz, blockers)) return { x: x + dx, z: z + dz };
  if (isWalkable(rects, x + dx, z, blockers)) return { x: x + dx, z };
  if (isWalkable(rects, x, z + dz, blockers)) return { x, z: z + dz };
  return { x, z };
}

/** Which room the visitor is in (corridors count as the room behind them). */
export function roomIndexAt(z: number, roomCount: number): number {
  const i = Math.floor(-z / PITCH);
  return Math.min(Math.max(i, 0), roomCount - 1);
}

export interface SlotPlacement {
  position: [number, number, number];
  rotationY: number;
  /** Where the visitor should stand to look at it. */
  view: Pose;
}

/** Wall slot 0/1 = left wall (near, far), 2/3 = right wall (near, far). */
export function slotPlacement(roomIndex: number, slot: number): SlotPlacement {
  const left = slot < 2;
  const near = slot % 2 === 0;
  const z = roomStart(roomIndex) - (near ? 6 : 14);
  const x = left ? -ROOM_W / 2 + 0.08 : ROOM_W / 2 - 0.08;
  const normalX = left ? 1 : -1;
  const viewX = x + normalX * 3.6;
  return {
    position: [x, 2.3, z],
    rotationY: left ? Math.PI / 2 : -Math.PI / 2,
    view: { x: viewX, z, yaw: yawToward(-normalX, 0) },
  };
}

/** Yaw that looks along direction (dx, dz). */
export const yawToward = (dx: number, dz: number) => Math.atan2(-dx, -dz);

export const spawnPose = (roomIndex: number): Pose => ({
  x: 0,
  z: roomStart(roomIndex) - 1.8,
  yaw: 0,
});

/** Shortest signed angle from a to b. */
export function angleDelta(a: number, b: number): number {
  let d = (b - a) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return d;
}
