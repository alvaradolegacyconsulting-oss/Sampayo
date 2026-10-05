"use client";

import { useEffect, useState } from "react";

type CopyStatus = "idle" | "pending" | "copied" | "failed";

/**
 * Copies `value` to the clipboard. The button is disabled while the copy runs, then the live region
 * says "Copied" (or why it couldn't, since some browsers block the clipboard). The feedback clears after a few seconds.
 */
export function CopyButton({
  value,
  label,
  copiedLabel,
  failedLabel,
  className = "",
}: {
  value: string;
  label: string;
  copiedLabel: string;
  failedLabel: string;
  className?: string;
}) {
  const [status, setStatus] = useState<CopyStatus>("idle");

  useEffect(() => {
    if (status !== "copied" && status !== "failed") return;
    const timer = setTimeout(() => setStatus("idle"), 4000);
    return () => clearTimeout(timer);
  }, [status]);

  async function copy() {
    setStatus("pending");
    try {
      if (!navigator.clipboard) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(value);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <>
      <button type="button" onClick={copy} disabled={status === "pending"} className={`disabled:cursor-wait disabled:opacity-70 ${className}`}>
        {label}
      </button>
      <span aria-live="polite" className={`text-sm font-semibold ${status === "failed" ? "text-alert" : "text-navy"}`}>
        {status === "copied" && copiedLabel}
        {status === "failed" && failedLabel}
      </span>
    </>
  );
}
