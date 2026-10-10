import { describe, expect, it } from "vitest";
import { formatDate, monthOf1971 } from "@/lib/format";

describe("formatDate", () => {
  it("formats by precision in English", () => {
    expect(formatDate("1971-12-16", "day", "en")).toBe("16 December 1971");
    expect(formatDate("1966-02", "month", "en")).toBe("February 1966");
    expect(formatDate("1971-05", "approx", "en")).toBe("c. May 1971");
  });

  it("uses Bangla digits in Bangla", () => {
    expect(formatDate("1971-12-16", "day", "bn")).toContain("১৯৭১");
  });

  it("maps 1971 dates to month indexes", () => {
    expect(monthOf1971("1971-03-26")).toBe(2);
    expect(monthOf1971("1970-12-07")).toBeNull();
  });
});
