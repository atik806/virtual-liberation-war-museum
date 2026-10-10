import { describe, expect, it } from "vitest";
import {
  angleDelta,
  isWalkable,
  moveWithCollision,
  roomIndexAt,
  roomStart,
  slotPlacement,
  spawnPose,
  walkableRects,
} from "@/lib/museum/layout";

const rects = walkableRects(6);

describe("museum layout", () => {
  it("spawn points are walkable in every room", () => {
    for (let i = 0; i < 6; i++) {
      const p = spawnPose(i);
      expect(isWalkable(rects, p.x, p.z), `room ${i}`).toBe(true);
      expect(roomIndexAt(p.z, 6)).toBe(i);
    }
  });

  it("blocks walking through walls but slides along them", () => {
    const start = { x: 7, z: -10 };
    const moved = moveWithCollision(rects, start.x, start.z, 2, -1);
    expect(moved.x).toBe(7);
    expect(moved.z).toBe(-11);
  });

  it("can walk from one room to the next through the corridor", () => {
    let pos = { x: 0, z: spawnPose(0).z };
    for (let i = 0; i < 300; i++) pos = moveWithCollision(rects, pos.x, pos.z, 0, -0.1);
    expect(roomIndexAt(pos.z, 6)).toBeGreaterThanOrEqual(1);
  });

  it("cannot walk past a side wall into the corridor gap", () => {
    // Beside the doorway, inside the wall thickness between rooms.
    expect(isWalkable(rects, 5, roomStart(1) + 2)).toBe(false);
  });

  it("exhibit view points face their exhibit and are walkable", () => {
    for (const slot of [0, 1, 2, 3]) {
      const s = slotPlacement(2, slot);
      expect(isWalkable(rects, s.view.x, s.view.z)).toBe(true);
      const fx = -Math.sin(s.view.yaw);
      // Looking toward the wall the exhibit hangs on.
      expect(Math.sign(fx)).toBe(Math.sign(s.position[0]));
    }
  });

  it("angleDelta takes the short way round", () => {
    expect(angleDelta(3, -3)).toBeCloseTo(2 * Math.PI - 6);
    expect(angleDelta(0, Math.PI / 2)).toBeCloseTo(Math.PI / 2);
  });
});

describe("blockers", () => {
  it("stops the visitor walking into a pedestal", () => {
    const blockers = [{ x: 0, z: -10, r: 1 }];
    expect(isWalkable(rects, 0, -10, blockers)).toBe(false);
    expect(isWalkable(rects, 0, -12, blockers)).toBe(true);
    const moved = moveWithCollision(rects, 0, -11.2, 0, 0.5, blockers);
    expect(moved.z).toBe(-11.2);
  });
});
