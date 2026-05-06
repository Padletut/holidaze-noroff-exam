import { describe, it, expect } from "vitest";
import validateVenueForm from "../validateVenueForm.mjs";

describe("validateVenueForm()", () => {
  it("returns null for fully valid input", () => {
    const result = validateVenueForm({ name: "Beach House", description: "A great beach stay", price: 150, maxGuests: 4 });

    expect(result).toBeNull();
  });

  it("returns an error string when name is empty", () => {
    const result = validateVenueForm({ name: "", description: "A great beach stay", price: 150, maxGuests: 4 });

    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("returns an error string when description is empty", () => {
    const result = validateVenueForm({ name: "Beach House", description: "", price: 150, maxGuests: 4 });

    expect(typeof result).toBe("string");
  });

  it("returns an error string when price is falsy", () => {
    const result = validateVenueForm({ name: "Beach House", description: "A great beach stay", price: 0, maxGuests: 4 });

    expect(typeof result).toBe("string");
  });

  it("returns an error string when maxGuests is falsy", () => {
    const result = validateVenueForm({ name: "Beach House", description: "A great beach stay", price: 150, maxGuests: 0 });

    expect(typeof result).toBe("string");
  });
});
