"use client";

import { useEffect, useRef, useState } from "react";
import { buttonClasses } from "@/components/ButtonLink";
import type { NavLink } from "@/lib/nav";

const focusableSelector = "a[href], button:not([disabled])";

/**
 * Phone and tablet menu (hidden from lg up). Ported from casa-del-cordero: focus stays inside the open menu,
 * Escape returns focus to the button, it closes on outside click and when the screen widens,
 * and the button keeps one accessible name with aria-expanded carrying the state.
 */
export function MobileMenu({ links, cta, label, navLabel }: { links: NavLink[]; cta: NavLink; label: string; navLabel: string }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const container = containerRef.current;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !container) return;
      const focusable = [...container.querySelectorAll<HTMLElement>(focusableSelector)];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (container && !container.contains(event.target as Node)) setOpen(false);
    };
    const wide = window.matchMedia("(min-width: 64rem)");
    const onWiden = () => wide.matches && setOpen(false);

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    wide.addEventListener("change", onWiden);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      wide.removeEventListener("change", onWiden);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div ref={containerRef} className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen((value) => !value)}
        className="flex size-11 items-center justify-center rounded-full text-navy hover:bg-paper"
      >
        <span className="sr-only">{label}</span>
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      <nav
        id="mobile-navigation"
        aria-label={navLabel}
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-line bg-white px-4 pb-6 pt-2 shadow-md"
      >
        <ul>
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={close} className="flex min-h-12 items-center border-b border-line text-base font-bold text-navy">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a href={cta.href} onClick={close} className={`${buttonClasses("primary")} mt-5 w-full`}>
          {cta.label}
        </a>
      </nav>
    </div>
  );
}
