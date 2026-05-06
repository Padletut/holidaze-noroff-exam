import { describe, it, expect } from "vitest";
import validateLoginForm from "../validateLoginForm.mjs";

describe("validateLoginForm()", () => {
  it("returns no errors for a valid stud.noroff.no email and a long-enough password", () => {
    const errors = validateLoginForm({ email: "user@stud.noroff.no", password: "password123" });

    expect(errors).toEqual({});
  });

  it("returns an email error when the field is empty", () => {
    const errors = validateLoginForm({ email: "", password: "password123" });

    expect(errors.email).toBeDefined();
  });

  it("returns an email error for a non stud.noroff.no domain", () => {
    const errors = validateLoginForm({ email: "user@gmail.com", password: "password123" });

    expect(errors.email).toBeDefined();
  });

  it("returns a password error when the field is empty", () => {
    const errors = validateLoginForm({ email: "user@stud.noroff.no", password: "" });

    expect(errors.password).toBeDefined();
  });

  it("returns a password error when the password is shorter than 8 characters", () => {
    const errors = validateLoginForm({ email: "user@stud.noroff.no", password: "short" });

    expect(errors.password).toBeDefined();
  });

  it("returns errors for both fields when both are invalid", () => {
    const errors = validateLoginForm({ email: "", password: "" });

    expect(errors.email).toBeDefined();
    expect(errors.password).toBeDefined();
  });
});
