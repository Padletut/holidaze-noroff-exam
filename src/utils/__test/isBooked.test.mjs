import { describe, it, expect } from "vitest";
import { isBooked } from "../isBooked.mjs";

const bookings = [
  { dateFrom: "2026-06-01T00:00:00.000Z", dateTo: "2026-06-05T00:00:00.000Z" },
  { dateFrom: "2026-07-10T00:00:00.000Z", dateTo: "2026-07-15T00:00:00.000Z" },
];

describe("isBooked()", () => {
  it("returns true for a date inside a booking range", () => {
    expect(isBooked("2026-06-03", bookings)).toBe(true);
  });

  it("returns true for the first day of a booking", () => {
    expect(isBooked("2026-06-01", bookings)).toBe(true);
  });

  it("returns true for the last day of a booking", () => {
    expect(isBooked("2026-06-05", bookings)).toBe(true);
  });

  it("returns false for a date before any booking", () => {
    expect(isBooked("2026-05-31", bookings)).toBe(false);
  });

  it("returns false for a date between two bookings", () => {
    expect(isBooked("2026-06-20", bookings)).toBe(false);
  });

  it("returns false for a date after all bookings", () => {
    expect(isBooked("2026-07-20", bookings)).toBe(false);
  });

  it("returns false when bookings array is empty", () => {
    expect(isBooked("2026-06-03", [])).toBe(false);
  });
});
