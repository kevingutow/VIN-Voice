"use client";

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

const CarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
    <path
      d="M3 16 4.5 9.5A2 2 0 0 1 6.5 8h11a2 2 0 0 1 2 1.5L21 16"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 16h18v3a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H6v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-3Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <circle cx="7.5" cy="16" r="1.2" fill="currentColor" />
    <circle cx="16.5" cy="16" r="1.2" fill="currentColor" />
  </svg>
);

const MotorcycleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
    <circle cx="5.5" cy="17" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="18.5" cy="17" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M8 17h5l2.5-5H12l-1.5-3H7M13 12l3 5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const RVIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
    <path
      d="M2 8h13v9H2zM15 11h4l3 3v3h-7z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <circle cx="6" cy="19" r="1.5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="18" cy="19" r="1.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M5 11h4v3H5z" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

// Idle bar heights (percent) for the waveform. Animates via the `soundbar`
// keyframes while playing (see globals.css).
const WAVEFORM_BAR_HEIGHTS = [35, 60, 100, 50, 80, 40, 65, 45, 75];

type DemoCard = {
  id: string;
  name: string;
  sub: string;
  src: string;
  icon: () => React.JSX.Element;
};

// The motorcycle and RV cards are placeholders sharing the Civic's real
// sample clip until we generate real audio for those categories — clearly
// labeled "(sample audio)" so it doesn't read as an error.
const DEMO_CARDS: DemoCard[] = [
  { id: "civic", name: "2019 Honda Civic EX", sub: "Voiced by Chris · 0:11", src: "/sample-tour.mp3", icon: CarIcon },
  {
    id: "harley",
    name: "2022 Harley-Davidson Street Glide",
    sub: "Voiced by Chris · 0:11 (sample audio)",
    src: "/sample-tour.mp3",
    icon: MotorcycleIcon,
  },
  {
    id: "winnebago",
    name: "2021 Winnebago View RV",
    sub: "Voiced by Chris · 0:11 (sample audio)",
    src: "/sample-tour.mp3",
    icon: RVIcon,
  },
];

function DemoCardView({
  card,
  isPlaying,
  onToggle,
  audioRef,
  onPlay,
  onPause,
}: {
  card: DemoCard;
  isPlaying: boolean;
  onToggle: () => void;
  audioRef: (el: HTMLAudioElement | null) => void;
  onPlay: () => void;
  onPause: () => void;
}) {
  return (
    <div className="mx-auto w-full max-w-sm rounded-3xl border border-blue-400/20 bg-[var(--warm-surface)] p-8">
      <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-400/10 text-blue-400">
        <card.icon />
      </div>
      <div className="mb-6 flex h-16 items-end justify-center gap-1.5" aria-hidden>
        {WAVEFORM_BAR_HEIGHTS.map((height, i) => (
          <div
            key={i}
            className="w-2 origin-bottom rounded-full bg-blue-400"
            style={{
              height: `${height}%`,
              animation: isPlaying ? `soundbar 0.9s ease-in-out ${i * 0.09}s infinite` : undefined,
            }}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={onToggle}
        aria-label={isPlaying ? `Pause ${card.name} sample` : `Play ${card.name} sample`}
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-500 text-zinc-950 transition-colors hover:bg-blue-400"
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>
      <p className="mt-4 text-center text-sm font-medium text-white">{card.name}</p>
      <p className="mt-1 text-center text-xs text-zinc-500">{card.sub}</p>
      <audio ref={audioRef} src={card.src} preload="none" onPlay={onPlay} onPause={onPause} onEnded={onPause} />
    </div>
  );
}

export function HearForYourself() {
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});

  function toggle(cardId: string) {
    const target = audioRefs.current[cardId];
    if (!target) return;
    if (currentlyPlayingId === cardId) {
      target.pause();
      return;
    }
    if (currentlyPlayingId) {
      audioRefs.current[currentlyPlayingId]?.pause();
    }
    // play() returns a promise that rejects with AbortError if pause() is
    // called before it resolves (e.g. rapid toggling) — safe to ignore.
    target.play().catch(() => {});
  }

  return (
    <section className="relative overflow-hidden border-t border-[var(--warm-border)] px-6 py-28 sm:py-36">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.15),_transparent_60%)]"
        aria-hidden
      />
      <div className="mx-auto max-w-3xl text-center">
        <span className="mb-6 inline-block text-xs font-semibold uppercase tracking-wider text-amber-400">
          Hear for Yourself
        </span>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Scan the tag. Hear the car.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-zinc-400">
          VIN Voice turns any vehicle listing into an AI-generated,
          natural-sounding sales script buyers can hear before they ever
          pick up the phone — just scan the QR code on the windshield.
        </p>
        <Link
          href="/builder"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-blue-500 px-8 py-4 text-base font-semibold text-zinc-950 transition-colors hover:bg-blue-400"
        >
          Get your first Tag free
        </Link>
      </div>

      <div className="mx-auto mt-16 grid max-w-6xl gap-6 sm:grid-cols-3">
        {DEMO_CARDS.map((card) => (
          <DemoCardView
            key={card.id}
            card={card}
            isPlaying={currentlyPlayingId === card.id}
            onToggle={() => toggle(card.id)}
            audioRef={(el) => {
              audioRefs.current[card.id] = el;
            }}
            onPlay={() => setCurrentlyPlayingId(card.id)}
            onPause={() => setCurrentlyPlayingId((id) => (id === card.id ? null : id))}
          />
        ))}
      </div>
    </section>
  );
}
