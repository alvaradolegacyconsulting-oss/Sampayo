import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { gallery } from "@/content/gallery";
import { home } from "@/content/home";
import { site } from "@/content/site";
import { findPhotoProblems, findSiteProblems } from "@/lib/content-checks";

const publicDir = fileURLToPath(new URL("../public", import.meta.url));

describe("content checks (every build)", () => {
  it("pass on the real content", () => {
    expect(findSiteProblems(site)).toEqual([]);
    const photos = [...home.services.items.map((item) => item.photo), ...gallery].map((photo, index) => ({ path: `p${index}`, photo }));
    expect(findPhotoProblems(photos, publicDir)).toEqual([]);
  });

  it.each([
    ["a phone without +1", { ...site, phone: { display: "612-840-7865", tel: "6128407865" } }, "must look like"],
    ["display and tel that disagree", { ...site, phone: { display: "612-840-7866", tel: "+16128407865" } }, "different numbers"],
    ["a malformed email", { ...site, email: "omar@" }, "not an email"],
    ["an http social link", { ...site, social: { ...site.social, facebook: "http://facebook.com/x" } }, "https://"],
    ["a trailing slash on the URL", { ...site, url: "https://www.example.com/" }, "trailing slash"],
  ])("catch %s", (_name, broken, message) => {
    expect(findSiteProblems(broken).join("\n")).toContain(message);
  });

  it("catch a photo that isn't in public/", () => {
    const photo = { ...gallery[0], src: "/images/gallery/missing.jpg" };
    expect(findPhotoProblems([{ path: "x", photo }], publicDir).join("\n")).toContain("is not in public");
  });
});
