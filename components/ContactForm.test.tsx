// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ContactForm } from "@/components/ContactForm";
import { contact } from "@/content/contact";
import { site } from "@/content/site";
import { t } from "@/lib/i18n";

// FORM_UI: every field labelled, a visible pending state, "sent" only on a confirmed reply,
// and any failure (including today's missing /api/contact) shows the phone number.

afterEach(() => vi.unstubAllGlobals());

const label = (name: string) => t(contact.fields.find((field) => field.name === name)!.label, "en");

async function fillRequired(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(label("company")), "Acme Builders");
  await user.type(screen.getByLabelText(label("name")), "Pat Doe");
  await user.type(screen.getByLabelText(label("phone")), "555-0100");
  await user.type(screen.getByLabelText(label("scope")), "Tear-off, 32 squares, asphalt");
}

describe("ContactForm", () => {
  it.each(["es", "en"] as const)("labels all seven fields in %s, marking the optional ones", (locale) => {
    render(<ContactForm locale={locale} />);
    for (const field of contact.fields) {
      const input = screen.getByLabelText(new RegExp(`^${t(field.label, locale)}`));
      expect(input.getAttribute("name")).toBe(field.name);
      expect(input.hasAttribute("required")).toBe(field.required);
    }
    expect(screen.getAllByText(`(${t(contact.optional, locale)})`)).toHaveLength(contact.fields.filter((f) => !f.required).length);
  });

  it("keeps the honeypot out of reach for people", () => {
    const { container } = render(<ContactForm locale="en" />);
    const trap = container.querySelector<HTMLInputElement>('input[name="website"]')!;
    expect(trap.tabIndex).toBe(-1);
    expect(trap.closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it("doesn't send while a required field is empty", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    render(<ContactForm locale="en" />);
    await userEvent.setup().click(screen.getByRole("button", { name: t(contact.submit, "en") }));
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("shows pending, then the error with a tap-to-call link when /api/contact is missing; fields stay filled", async () => {
    let finish: (response: Response) => void = () => {};
    const fetchMock = vi.fn(() => new Promise<Response>((resolve) => (finish = resolve)));
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<ContactForm locale="es" />);
    const esLabel = (name: string) => t(contact.fields.find((field) => field.name === name)!.label, "es");
    await user.type(screen.getByLabelText(esLabel("company")), "Acme");
    await user.type(screen.getByLabelText(esLabel("name")), "Pat");
    await user.type(screen.getByLabelText(esLabel("phone")), "555-0100");
    await user.type(screen.getByLabelText(esLabel("scope")), "Remoción");
    await user.click(screen.getByRole("button", { name: t(contact.submit, "es") }));

    const pending = screen.getByRole("button", { name: t(contact.pending, "es") });
    expect((pending as HTMLButtonElement).disabled).toBe(true);

    finish(new Response("Not found", { status: 404 }));
    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toContain(t(contact.failure, "es"));
    expect(alert.querySelector("a")?.getAttribute("href")).toBe(`tel:${site.phone.tel}`);
    expect(screen.queryByRole("status")).toBeNull();
    expect((screen.getByLabelText(esLabel("company")) as HTMLInputElement).value).toBe("Acme");

    const body = JSON.parse((fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1].body as string);
    expect(body).toMatchObject({ company: "Acme", name: "Pat", phone: "555-0100", scope: "Remoción", locale: "es", website: "" });
  });

  it("shows the error on a network failure too", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new TypeError("offline"))));
    const user = userEvent.setup();
    render(<ContactForm locale="en" />);
    await fillRequired(user);
    await user.click(screen.getByRole("button", { name: t(contact.submit, "en") }));
    expect((await screen.findByRole("alert")).textContent).toContain(site.phone.display);
  });

  it("shows success only after a confirmed { ok: true }, then clears the form", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve(new Response('{"ok":true}', { status: 200 }))));
    const user = userEvent.setup();
    render(<ContactForm locale="en" />);
    await fillRequired(user);
    await user.click(screen.getByRole("button", { name: t(contact.submit, "en") }));
    expect((await screen.findByRole("status")).textContent).toContain(t(contact.success, "en"));
    expect(screen.queryByRole("alert")).toBeNull();
    expect((screen.getByLabelText(label("company")) as HTMLInputElement).value).toBe("");
  });
});
