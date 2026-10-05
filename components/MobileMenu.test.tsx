// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it } from "vitest";
import { MobileMenu } from "@/components/MobileMenu";

beforeAll(() => {
  // jsdom has no matchMedia.
  window.matchMedia ??= ((query: string) =>
    ({ matches: false, media: query, addEventListener: () => {}, removeEventListener: () => {} }) as unknown as MediaQueryList);
});

const links = [
  { label: "Services", href: "/en#services" },
  { label: "FAQ", href: "/en#faq" },
];

function setup() {
  render(<MobileMenu links={links} cta={{ label: "Request availability", href: "/en#contact" }} label="Menu" navLabel="Main navigation" />);
  return { user: userEvent.setup(), button: screen.getByRole("button", { name: "Menu" }) };
}

describe("MobileMenu", () => {
  it("opens and closes with the same accessible name, state in aria-expanded", async () => {
    const { user, button } = setup();
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByRole("navigation")).toBeNull();

    await user.click(button);
    expect(screen.getByRole("button", { name: "Menu" }).getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("navigation", { name: "Main navigation" })).toBeTruthy();
  });

  it("closes on Escape and returns focus to the button", async () => {
    const { user, button } = setup();
    await user.click(button);
    await user.tab();
    expect(document.activeElement?.textContent).toBe("Services");

    await user.keyboard("{Escape}");
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(button);
  });

  it("keeps Tab focus inside the open menu", async () => {
    const { user, button } = setup();
    await user.click(button);
    await user.tab(); // Services
    await user.tab(); // FAQ
    await user.tab(); // Request availability
    await user.tab(); // wraps to the button
    expect(document.activeElement).toBe(button);
    await user.tab({ shift: true }); // back to the last link
    expect(document.activeElement?.textContent).toBe("Request availability");
  });

  it("closes on a click outside", async () => {
    const { user, button } = setup();
    await user.click(button);
    await user.click(document.body);
    expect(button.getAttribute("aria-expanded")).toBe("false");
  });
});
