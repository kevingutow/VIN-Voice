"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 h-6 w-6">
    <path d="M8 5.5v13l11-6.5-11-6.5Z" />
  </svg>
);

const PauseIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
    <rect x="7" y="5" width="4" height="14" rx="1" />
    <rect x="13" y="5" width="4" height="14" rx="1" />
  </svg>
);

// Idle bar heights (percent) for the waveform — echoes the soundwave motif
// from the VIN Voice logo. Animates via the `soundbar` keyframes while playing.
const WAVEFORM_BAR_HEIGHTS = [35, 60, 100, 50, 80, 40, 65, 45, 75];

export function HeroDemo() {
  const [isSamplePlaying, setIsSamplePlaying] = useState(false);
  const sampleAudioRef = useRef<HTMLAudioElement>(null);

  function toggleSamplePlayback() {
    const audio = sampleAudioRef.current;
    if (!audio) return;
    if (isSamplePlaying) {
      audio.pause();
    } else {
      // play() returns a promise that rejects with AbortError if pause() is
      // called before it resolves (e.g. rapid toggling) — safe to ignore.
      audio.play().catch(() => {});
    }
  }

  return (
    <section className="relative overflow-hidden px-6 py-28 sm:py-36">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.15),_transparent_60%)]"
        aria-hidden
      />
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-12">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <div className="mb-8 w-full max-w-xs sm:max-w-sm lg:max-w-md">
            <Image
              src="/image.png"
              alt="VIN Voice — every vehicle has a story"
              width={1536}
              height={1024}
              priority
              className="h-auto w-full"
            />
          </div>
          <span className="mb-6 rounded-full border border-blue-400/20 bg-blue-400/5 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-blue-400">
            AI voice tours for every listing
          </span>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Scan the tag. Hear the car.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-400">
            VIN Voice turns any vehicle listing into an AI-generated,
            natural-sounding sales script buyers can hear before they ever
            pick up the phone — just scan the QR code on the windshield.
          </p>
          <p className="mt-4 text-sm text-zinc-500">
            Free to try. No credit card required.
          </p>
          <Link
            href="/builder"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-blue-500 px-8 py-4 text-base font-semibold text-zinc-950 transition-colors hover:bg-blue-400"
          >
            Get your first tour free
          </Link>
        </div>

        <div className="mx-auto w-full max-w-sm rounded-3xl border border-blue-400/20 bg-zinc-900 p-8">
          <p className="mb-6 text-center text-xs font-medium uppercase tracking-wider text-blue-400">
            Hear it in action
          </p>
          <div className="mb-6 flex h-16 items-end justify-center gap-1.5" aria-hidden>
            {WAVEFORM_BAR_HEIGHTS.map((height, i) => (
              <div
                key={i}
                className="w-2 origin-bottom rounded-full bg-blue-400"
                style={{
                  height: `${height}%`,
                  animation: isSamplePlaying
                    ? `soundbar 0.9s ease-in-out ${i * 0.09}s infinite`
                    : undefined,
                }}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={toggleSamplePlayback}
            aria-label={isSamplePlaying ? "Pause sample tour" : "Play sample tour"}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-500 text-zinc-950 transition-colors hover:bg-blue-400"
          >
            {isSamplePlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <p className="mt-4 text-center text-sm font-medium text-white">
            2019 Honda Civic EX
          </p>
          <p className="mt-1 text-center text-xs text-zinc-500">
            Voiced by Chris · 0:11
          </p>
          <audio
            ref={sampleAudioRef}
            src="/sample-tour.mp3"
            preload="none"
            onPlay={() => setIsSamplePlaying(true)}
            onPause={() => setIsSamplePlaying(false)}
            onEnded={() => setIsSamplePlaying(false)}
          />
        </div>
      </div>
    </section>
  );
}
