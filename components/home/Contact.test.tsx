// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Contact } from "@/components/home/Contact";
import { home } from "@/content/home";
import { site } from "@/content/site";
import { t } from "@/lib/i18n";

const { contact } = home;
const withEmail = { ...site, email: "projects@example.com" };

describe("Contact block", () => {
  it.each(["es", "en"] as const)("calls and texts the same number (%s)", (locale) => {
    render(<Contact locale={locale} />);
    const call = screen.getByRole("link", { name: `${t(contact.call, locale)} ${site.phone.display}` });
    const text = screen.getByRole("link", { name: `${t(contact.text, locale)} ${site.phone.display}` });
    expect(call.getAttribute("href")).toBe(`tel:${site.phone.tel}`);
    expect(text.getAttribute("href")).toBe(`sms:${site.phone.tel}`);
    expect(screen.getByText(site.contactName)).toBeTruthy();
  });

  it("has no form", () => {
    const { container } = render(<Contact locale="en" />);
    expect(container.querySelector("form, input, textarea")).toBeNull();
  });

  it("leaves out the email row and Copy button while site.email is null", () => {
    render(<Contact locale="en" content={{ ...site, email: null }} />);
    expect(screen.queryByText(t(contact.email, "en"))).toBeNull();
    expect(screen.queryByRole("button", { name: t(contact.copy, "en") })).toBeNull();
    expect(document.querySelector('a[href^="mailto:"]')).toBeNull();
  });

  it.each([
    ["es", "Solicitud%20de%20proyecto"],
    ["en", "Project%20request"],
  ] as const)("shows the email as text with a pre-filled subject once it's set (%s)", (locale, subject) => {
    render(<Contact locale={locale} content={withEmail} />);
    const link = screen.getByRole("link", { name: withEmail.email });
    expect(link.getAttribute("href")).toBe(`mailto:${withEmail.email}?subject=${subject}`);
  });

  it.each([
    ["es", "Copiado"],
    ["en", "Copied"],
  ] as const)("Copy puts the address on the clipboard and says %s", async (locale, copied) => {
    const user = userEvent.setup();
    // userEvent.setup() installs its own clipboard stub; spy on it after setup.
    const writeText = vi.spyOn(navigator.clipboard, "writeText");
    render(<Contact locale={locale} content={withEmail} />);
    const button = screen.getByRole("button", { name: t(contact.copy, locale) });
    const live = button.nextElementSibling as HTMLElement;
    expect(live.getAttribute("aria-live")).toBe("polite");
    expect(live.textContent).toBe("");

    await user.click(button);
    expect(writeText).toHaveBeenCalledWith(withEmail.email);
    expect(await screen.findByText(copied)).toBe(live);
  });

  it("says so when the browser blocks the clipboard, instead of claiming it copied", async () => {
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValue(new Error("denied"));
    render(<Contact locale="en" content={withEmail} />);
    await user.click(screen.getByRole("button", { name: t(contact.copy, "en") }));
    expect(await screen.findByText(t(contact.copyFailed, "en"))).toBeTruthy();
    expect(screen.queryByText(t(contact.copied, "en"))).toBeNull();
  });
});
