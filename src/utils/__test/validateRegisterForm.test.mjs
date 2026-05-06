import { describe, it, expect } from "vitest";
import validateRegisterForm from "../validateRegisterForm.mjs";

const valid = {
  name: "testuser",
  email: "testuser@stud.noroff.no",
  password: "password123",
  confirmPassword: "password123",
};

describe("validateRegisterForm()", () => {
  it("returns no errors for valid input", () => {
    const errors = validateRegisterForm(valid);

    expect(errors).toEqual({});
  });

  it("returns a name error when the name is too short", () => {
    const errors = validateRegisterForm({ ...valid, name: "ab" });

    expect(errors.name).toBeDefined();
  });

  it("returns a name error when the name is empty", () => {
    const errors = validateRegisterForm({ ...valid, name: "" });

    expect(errors.name).toBeDefined();
  });

  it("returns an email error for an invalid email", () => {
    const errors = validateRegisterForm({ ...valid, email: "notanemail" });

    expect(errors.email).toBeDefined();
  });

  it("returns an email error for a non stud.noroff.no domain", () => {
    const errors = validateRegisterForm({ ...valid, email: "user@gmail.com" });

    expect(errors.email).toBeDefined();
  });

  it("returns a password error when shorter than 8 characters", () => {
    const errors = validateRegisterForm({ ...valid, password: "short", confirmPassword: "short" });

    expect(errors.password).toBeDefined();
  });

  it("returns a confirmPassword error when passwords do not match", () => {
    const errors = validateRegisterForm({ ...valid, confirmPassword: "different99" });

    expect(errors.confirmPassword).toBeDefined();
  });

  it("returns errors for all fields when all are invalid", () => {
    const errors = validateRegisterForm({ name: "", email: "", password: "", confirmPassword: "" });

    expect(errors.name).toBeDefined();
    expect(errors.email).toBeDefined();
    expect(errors.password).toBeDefined();
  });
});
