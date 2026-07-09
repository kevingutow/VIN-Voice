"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

const MenuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
    <path
      d="M4 6h16M4 12h16M4 18h16"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
    <path
      d="m6 6 12 12M18 6 6 18"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const CheckmarkBadge = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
    <path
      d="M12 2 3 6v6c0 5 3.8 8.7 9 10 5.2-1.3 9-5 9-10V6l-9-4Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="m8.5 12 2.3 2.3L15.5 9.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const KeyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
    <circle cx="8" cy="15" r="4" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M11 12 19 4M19 4v4M19 4h-4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LotIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
    <path
      d="M3 20h18M4 20V9l4-4h8l4 4v11"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 20v-6h6v6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function NavLink({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <a
      href="#"
      onClick={onClick}
      className={`text-sm font-medium text-zinc-400 transition-colors hover:text-white ${className}`}
    >
      {children}
    </a>
  );
}

function GetStartedButton({
  className = "",
  onClick,
  label = "Get Started Free",
}: {
  className?: string;
  onClick?: () => void;
  label?: string;
}) {
  return (
    <Link
      href="/builder"
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-zinc-950 transition-colors hover:bg-amber-300 ${className}`}
    >
      {label}
    </Link>
  );
}

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

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#" className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <span className="text-amber-400">VIN</span> Voice
          </a>
          <div className="flex items-center gap-4 sm:gap-8">
            <div className="hidden items-center gap-8 sm:flex">
              <NavLink>How it works</NavLink>
              <NavLink>Pricing</NavLink>
              <NavLink>Log in</NavLink>
            </div>
            <span className="hidden sm:inline-flex">
              <GetStartedButton />
            </span>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle menu"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-300 transition-colors hover:text-white sm:hidden"
            >
              {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </nav>
        {mobileMenuOpen && (
          <div className="border-t border-white/10 px-6 py-5 sm:hidden">
            <div className="flex flex-col items-start gap-4">
              <NavLink onClick={() => setMobileMenuOpen(false)}>How it works</NavLink>
              <NavLink onClick={() => setMobileMenuOpen(false)}>Pricing</NavLink>
              <NavLink onClick={() => setMobileMenuOpen(false)}>Log in</NavLink>
              <GetStartedButton
                className="mt-2 w-full"
                onClick={() => setMobileMenuOpen(false)}
              />
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
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

      {/* Who it's for */}
      <section className="border-t border-white/10 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Built for how you sell
            </h2>
            <p className="mt-4 text-zinc-400">
              Whether it&apos;s one car in your driveway or a hundred on the lot.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-zinc-900 p-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400">
                <KeyIcon />
              </div>
              <h3 className="text-xl font-semibold">Private Sellers</h3>
              <p className="mt-3 leading-7 text-zinc-400">
                Sell your car faster and with more trust. Give buyers a
                confident, detailed walkthrough of your vehicle&apos;s history
                and features, no back-and-forth texts required.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-zinc-900 p-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400">
                <LotIcon />
              </div>
              <h3 className="text-xl font-semibold">Dealerships &amp; Lots</h3>
              <p className="mt-3 leading-7 text-zinc-400">
                Turn every windshield into a salesperson. Generate voice
                tours across your entire inventory in minutes and let buyers
                self-serve after hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-white/10 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              How it works
            </h2>
            <p className="mt-4 text-zinc-400">
              From VIN to voice tour in under a minute.
            </p>
          </div>
          <div className="grid gap-10 sm:grid-cols-3">
            {[
              {
                title: "Enter vehicle details",
                description:
                  "Type in the VIN or pick your car from the lot — we pull the specs automatically.",
              },
              {
                title: "AI writes & voices your script",
                description:
                  "Our AI writes a natural, honest script and narrates it in a warm, human-sounding voice.",
              },
              {
                title: "Get your QR code",
                description:
                  "Print or stick the QR code on the windshield so any buyer can listen on the spot.",
              },
            ].map((step, i) => (
              <div key={step.title} className="relative">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-amber-400/30 text-lg font-bold text-amber-400">
                  {i + 1}
                </div>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 leading-7 text-zinc-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="border-t border-white/10 px-6 py-24">
        <div className="mx-auto flex max-w-3xl flex-col items-center rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 to-zinc-950 px-8 py-16 text-center">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-amber-400/10 text-amber-400">
            <CheckmarkBadge />
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Give every listing a voice
          </h2>
          <p className="mt-4 max-w-md text-zinc-400">
            Free to start. No credit card required.
          </p>
          <GetStartedButton className="mt-8 px-8 py-4 text-base" />
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} VIN Voice. All rights reserved.
      </footer>
    </div>
  );
}
