import { describe, expect, it } from "vitest";
import { drafted } from "@/content/types";
import { findTexts } from "@/lib/texts";

describe("findTexts", () => {
  it("finds Text values at any depth, with their path", () => {
    const value = { a: { b: [drafted("uno", "one")] }, n: null, s: "plain string" };
    expect(findTexts(value, "x")).toEqual([{ path: "x.a.b[0]", text: drafted("uno", "one") }]);
  });
});
