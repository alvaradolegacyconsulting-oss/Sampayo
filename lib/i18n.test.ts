import { describe, expect, it } from "vitest";
import { drafted } from "@/content/types";
import { fill, t } from "@/lib/i18n";

describe("i18n", () => {
  it("returns the requested language", () => {
    const text = drafted("Hola", "Hello");
    expect(t(text, "es")).toBe("Hola");
    expect(t(text, "en")).toBe("Hello");
  });

  it("fills named slots and leaves unknown ones visible", () => {
    expect(fill("Call {phone}", { phone: "555-0100" })).toBe("Call 555-0100");
    expect(fill("Call {name}", {})).toBe("Call {name}");
  });
});
