import { describe, expect, it } from "vitest";
import { emailPasswordSchema, registerSchema } from "./auth";

describe("emailPasswordSchema", () => {
  it("accepts valid email and password", () => {
    const r = emailPasswordSchema.safeParse({
      email: "  User@Example.com  ",
      password: "password1",
    });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.email).toBe("user@example.com");
    }
  });

  it("rejects short password", () => {
    const r = emailPasswordSchema.safeParse({
      email: "a@b.co",
      password: "short",
    });
    expect(r.success).toBe(false);
  });
});

describe("registerSchema", () => {
  it("maps empty name to undefined", () => {
    const r = registerSchema.safeParse({
      email: "User@Example.com",
      password: "password1",
      name: "",
    });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.email).toBe("user@example.com");
      expect(r.data.name).toBeUndefined();
    }
  });
});
