"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Versioned so a future copy change can force the banner to reappear by
// bumping the suffix.
const DISMISSED_KEY = "vv_cookie_banner_dismissed_v2";

export function CookieBanner() {
  // Starts hidden to avoid an SSR/hydration flash; useEffect below decides
  // whether to actually show it based on localStorage.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // One-time hydration from localStorage on mount — localStorage is
    // unavailable during SSR, so this can't happen during render.
    if (localStorage.getItem(DISMISSED_KEY) !== "1") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, "1");
    setVisible(false);
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-zinc-950/95 px-6 py-4 text-sm text-zinc-300 backdrop-blur">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 text-center sm:flex-row sm:justify-center">
        <p>
          We use cookies to keep your session active and improve your experience.{" "}
          <Link href="/cookie-policy" className="text-amber-400 underline hover:text-amber-300">
            Learn more
          </Link>
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="inline-flex shrink-0 items-center justify-center rounded-lg bg-amber-400 px-5 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-amber-300"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
