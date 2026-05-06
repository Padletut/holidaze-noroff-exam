import { describe, it, expect } from "vitest";
import { buildVenuePayload } from "../buildVenuePayload.mjs";

const baseForm = {
  name: "  Beach House  ",
  description: "  A lovely venue  ",
  price: "150",
  maxGuests: "4",
  wifi: true,
  parking: false,
  breakfast: false,
  pets: true,
  address: "Ocean Road 1",
  zip: "1234",
  city: "Oslo",
  country: "Norway",
};

const mediaItems = [
  { url: "  https://example.com/img.jpg  ", alt: "  Beach view  " },
  { url: "", alt: "ignored" },
];

describe("buildVenuePayload()", () => {
  it("trims whitespace from name and description", () => {
    const result = buildVenuePayload(baseForm, []);

    expect(result.name).toBe("Beach House");
    expect(result.description).toBe("A lovely venue");
  });

  it("converts price and maxGuests to numbers", () => {
    const result = buildVenuePayload(baseForm, []);

    expect(result.price).toBe(150);
    expect(result.maxGuests).toBe(4);
  });

  it("filters out media items with empty URLs", () => {
    const result = buildVenuePayload(baseForm, mediaItems);

    expect(result.media).toHaveLength(1);
    expect(result.media[0].url).toBe("https://example.com/img.jpg");
  });

  it("trims whitespace from media url and alt", () => {
    const result = buildVenuePayload(baseForm, mediaItems);

    expect(result.media[0].url).toBe("https://example.com/img.jpg");
    expect(result.media[0].alt).toBe("Beach view");
  });

  it("passes meta flags through correctly", () => {
    const result = buildVenuePayload(baseForm, []);

    expect(result.meta).toEqual({
      wifi: true,
      parking: false,
      breakfast: false,
      pets: true,
    });
  });

  it("sets empty location fields to null", () => {
    const result = buildVenuePayload(
      { ...baseForm, address: "", zip: "", city: "", country: "" },
      [],
    );

    expect(result.location.address).toBeNull();
    expect(result.location.zip).toBeNull();
    expect(result.location.city).toBeNull();
    expect(result.location.country).toBeNull();
  });

  it("returns an empty media array when all items have empty URLs", () => {
    const result = buildVenuePayload(baseForm, [{ url: "", alt: "" }]);

    expect(result.media).toEqual([]);
  });
});
