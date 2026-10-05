"use client";

export type ShareOutcome = "shared" | "copied" | "cancelled" | "failed";

/** Share via the native sheet when available, otherwise copy to the clipboard. Never throws. */
export async function shareText(title: string, text: string): Promise<ShareOutcome> {
  if (navigator.share) {
    try {
      await navigator.share({ title, text });
      return "shared";
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return "cancelled";
      // Fall through to the clipboard when sharing is blocked or unsupported for this payload.
    }
  }

  try {
    await navigator.clipboard.writeText(text);
    return "copied";
  } catch {
    return "failed";
  }
}

export function shareLabel(outcome: ShareOutcome | null) {
  if (outcome === "shared") return "Shared";
  if (outcome === "copied") return "Copied";
  if (outcome === "failed") return "Share failed";
  return "Share";
}
