import { describe, it, expect } from "vitest";
import { groupByCountry } from "../groupByCountry.mjs";

const venues = [
  { id: "1", name: "Beach House", location: { country: "Norway" } },
  { id: "2", name: "City Flat", location: { country: "Norway" } },
  { id: "3", name: "Alpine Chalet", location: { country: "Switzerland" } },
  { id: "4", name: "No Country", location: { country: "" } },
  { id: "5", name: "No Location" },
];

describe("groupByCountry()", () => {
  it("groups venues by their country", () => {
    const result = groupByCountry(venues);

    expect(result["Norway"]).toHaveLength(2);
    expect(result["Switzerland"]).toHaveLength(1);
  });

  it("places venues with an empty country under 'Other'", () => {
    const result = groupByCountry(venues);

    expect(result["Other"]).toContainEqual(expect.objectContaining({ id: "4" }));
  });

  it("places venues without a location under 'Other'", () => {
    const result = groupByCountry(venues);

    expect(result["Other"]).toContainEqual(expect.objectContaining({ id: "5" }));
  });

  it("returns an empty object for an empty array", () => {
    expect(groupByCountry([])).toEqual({});
  });

  it("trims whitespace from country names", () => {
    const result = groupByCountry([
      { id: "1", location: { country: "  Norway  " } },
    ]);

    expect(result["Norway"]).toHaveLength(1);
  });
});
