import { describe, expect, it } from "vitest";
import { validateContent } from "@/lib/content/validate";
import { getExhibits, getGalleries } from "@/lib/content";

describe("content", () => {
  it("passes schema and reference validation", () => {
    expect(validateContent()).toEqual([]);
  });

  it("every gallery has at least one exhibit", () => {
    const exhibits = getExhibits();
    for (const g of getGalleries()) {
      expect(exhibits.some((e) => e.galleryId === g.id), g.id).toBe(true);
    }
  });

  it("gallery orders are contiguous from 0", () => {
    expect(getGalleries().map((g) => g.order)).toEqual(
      getGalleries().map((_, i) => i),
    );
  });
});
