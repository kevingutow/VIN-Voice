"use client";

import { useEffect, useRef } from "react";

export function WarmThemeZone({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Observing this whole (tall) wrapper rather than a thin sentinel line is
    // deliberate: isIntersecting stays true for as long as any part of it is
    // on screen — i.e. "scrolled to or past How It Works" — whereas a 1px
    // sentinel would flip back to false moments after being scrolled past.
    const observer = new IntersectionObserver(
      ([entry]) => {
        document.documentElement.dataset.theme = entry.isIntersecting ? "warm" : "";
      },
      { rootMargin: "-80px 0px -40% 0px", threshold: 0 }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      // document.documentElement persists across client-side route changes,
      // so without this, navigating away while scrolled into the warm zone
      // would leave the next page stuck warm.
      delete document.documentElement.dataset.theme;
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
