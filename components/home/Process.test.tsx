// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Process } from "@/components/home/Process";
import { home } from "@/content/home";
import { t } from "@/lib/i18n";

describe("Process", () => {
  it.each(["es", "en"] as const)("renders every step without a photo or placeholder box while photos are none (%s)", (locale) => {
    const { container } = render(<Process locale={locale} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(home.process.steps.length);
    for (const step of home.process.steps) expect(screen.getByText(t(step.title, locale))).toBeTruthy();
    expect(container.querySelector("img")).toBeNull();
    expect(container.textContent).not.toContain("[PLACEHOLDER");
  });
});
