import { describe, expect, it } from "vitest";
import { isConfirmedSent } from "@/lib/contact";

const reply = (status: number, body: string) =>
  new Response(body, { status, headers: { "Content-Type": "application/json" } });

describe("isConfirmedSent (the form shows success only when this is true)", () => {
  it("accepts a 200 with { ok: true }", async () => {
    expect(await isConfirmedSent(reply(200, '{"ok":true}'))).toBe(true);
  });

  it.each([
    ["404 (route missing, today's state)", 404, "Not found"],
    ["500 with ok:true body", 500, '{"ok":true}'],
    ["200 with ok:false", 200, '{"ok":false,"error":"send failed"}'],
    ["200 with an empty body", 200, ""],
    ["200 with HTML", 200, "<html></html>"],
    ["200 with ok as a string", 200, '{"ok":"true"}'],
  ])("rejects %s", async (_name, status, body) => {
    expect(await isConfirmedSent(reply(status, body))).toBe(false);
  });
});
