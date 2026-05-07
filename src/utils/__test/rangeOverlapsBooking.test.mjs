import { describe, it, expect } from "vitest";
import { rangeOverlapsBooking } from "../rangeOverlapsBooking.mjs";

const bookings = [
  { dateFrom: "2026-06-10T00:00:00.000Z", dateTo: "2026-06-15T00:00:00.000Z" },
];

describe("rangeOverlapsBooking()", () => {
  it("returns true when the selected range is fully inside a booking", () => {
    expect(rangeOverlapsBooking("2026-06-11", "2026-06-13", bookings)).toBe(true);
  });

  it("returns true when the selected range fully covers a booking", () => {
    expect(rangeOverlapsBooking("2026-06-08", "2026-06-18", bookings)).toBe(true);
  });

  it("returns true when the range starts inside a booking", () => {
    expect(rangeOverlapsBooking("2026-06-12", "2026-06-20", bookings)).toBe(true);
  });

  it("returns true when the range ends inside a booking", () => {
    expect(rangeOverlapsBooking("2026-06-05", "2026-06-12", bookings)).toBe(true);
  });

  it("returns true when the range exactly matches a booking", () => {
    expect(rangeOverlapsBooking("2026-06-10", "2026-06-15", bookings)).toBe(true);
  });

  it("returns false when the range is entirely before the booking", () => {
    expect(rangeOverlapsBooking("2026-06-01", "2026-06-09", bookings)).toBe(false);
  });

  it("returns false when the range is entirely after the booking", () => {
    expect(rangeOverlapsBooking("2026-06-16", "2026-06-20", bookings)).toBe(false);
  });

  it("returns false when bookings array is empty", () => {
    expect(rangeOverlapsBooking("2026-06-10", "2026-06-15", [])).toBe(false);
  });
});
