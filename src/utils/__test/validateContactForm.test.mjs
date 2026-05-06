import { describe, it, expect } from "vitest";
import validateContactForm from "../validateContactForm.mjs";

const valid = {
  name: "Alice Tester",
  email: "alice@example.com",
  subject: "General enquiry",
  message: "Hello, I have a question about your services.",
};

describe("validateContactForm()", () => {
  it("returns no errors for valid input", () => {
    const errors = validateContactForm(valid);

    expect(errors).toEqual({});
  });

  it("returns a name error when the name is too short", () => {
    const errors = validateContactForm({ ...valid, name: "A" });

    expect(errors.name).toBeDefined();
  });

  it("returns a name error when the name is empty", () => {
    const errors = validateContactForm({ ...valid, name: "" });

    expect(errors.name).toBeDefined();
  });

  it("returns an email error for an invalid email", () => {
    const errors = validateContactForm({ ...valid, email: "notanemail" });

    expect(errors.email).toBeDefined();
  });

  it("returns a subject error when too short", () => {
    const errors = validateContactForm({ ...valid, subject: "Hi" });

    expect(errors.subject).toBeDefined();
  });

  it("returns a message error when too short", () => {
    const errors = validateContactForm({ ...valid, message: "Short" });

    expect(errors.message).toBeDefined();
  });

  it("returns errors for all fields when all are invalid", () => {
    const errors = validateContactForm({ name: "", email: "", subject: "", message: "" });

    expect(errors.name).toBeDefined();
    expect(errors.email).toBeDefined();
    expect(errors.subject).toBeDefined();
    expect(errors.message).toBeDefined();
  });
});
