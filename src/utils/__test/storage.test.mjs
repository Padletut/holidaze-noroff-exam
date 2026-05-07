import { vi, describe, it, expect, beforeEach } from "vitest";

// Provide a localStorage-compatible mock in the node environment
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => (key in store ? store[key] : null),
    setItem: (key, value) => {
      store[key] = String(value);
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

vi.stubGlobal("localStorage", localStorageMock);

const { loadStorage } = await import("../loadStorage.mjs");
const { saveStorage } = await import("../saveStorage.mjs");
const { clearSession } = await import("../clearSession.mjs");

// ─── loadStorage ──────────────────────────────────────────────────────────────

describe("loadStorage()", () => {
  beforeEach(() => localStorageMock.clear());

  it("returns the parsed value for an existing key", () => {
    localStorageMock.setItem("profile", JSON.stringify({ name: "testuser" }));

    const result = loadStorage("profile");

    expect(result).toEqual({ name: "testuser" });
  });

  it("returns null for a missing key", () => {
    const result = loadStorage("nonexistent");

    expect(result).toBeNull();
  });

  it("parses primitive values correctly", () => {
    localStorageMock.setItem("count", JSON.stringify(42));

    expect(loadStorage("count")).toBe(42);
  });

  it("parses boolean values correctly", () => {
    localStorageMock.setItem("flag", JSON.stringify(true));

    expect(loadStorage("flag")).toBe(true);
  });
});

// ─── saveStorage ──────────────────────────────────────────────────────────────

describe("saveStorage()", () => {
  beforeEach(() => localStorageMock.clear());

  it("stringifies and stores an object", () => {
    const profile = { name: "testuser" };

    saveStorage("profile", profile);

    expect(localStorageMock.getItem("profile")).toBe(JSON.stringify(profile));
  });

  it("stores a primitive value", () => {
    saveStorage("accessToken", "tok_abc");

    expect(localStorageMock.getItem("accessToken")).toBe('"tok_abc"');
  });

  it("overwrites an existing value", () => {
    saveStorage("key", "first");
    saveStorage("key", "second");

    expect(localStorageMock.getItem("key")).toBe('"second"');
  });
});

// ─── clearSession ─────────────────────────────────────────────────────────────

describe("clearSession()", () => {
  beforeEach(() => localStorageMock.clear());

  it("removes the accessToken key", () => {
    localStorageMock.setItem("accessToken", '"tok_abc"');

    clearSession();

    expect(localStorageMock.getItem("accessToken")).toBeNull();
  });

  it("removes the profile key", () => {
    localStorageMock.setItem("profile", JSON.stringify({ name: "testuser" }));

    clearSession();

    expect(localStorageMock.getItem("profile")).toBeNull();
  });

  it("does not throw when keys are already absent", () => {
    expect(() => clearSession()).not.toThrow();
  });
});
