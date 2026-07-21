import Image from "next/image";
import Link from "next/link";
import { ClosingCta } from "./components/ClosingCta";
import { HearForYourself } from "./components/HearForYourself";
import { PlaceholderSection } from "./components/PlaceholderSection";
import { PricingTeaser } from "./components/PricingTeaser";
import { SiteHeader } from "./components/SiteHeader";
import { WarmThemeZone } from "./components/WarmThemeZone";

const DocumentIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
    <path
      d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path
      d="M9 13h6M9 17h6M9 9h2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const MicIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
    <rect x="9" y="3" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M5 11a7 7 0 0 0 14 0M12 18v3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const QRIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
    <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <path d="M14 14h3v3h-3zM19 14h2v2h-2zM14 19h2v2h-2zM19 19h2v2h-2z" fill="currentColor" />
  </svg>
);

const HOW_IT_WORKS_STEPS = [
  {
    title: "Tell Us the VIN",
    description:
      "Punch in the VIN or pick your ride from the lot — specs, trims, and history land in seconds.",
    icon: DocumentIcon,
  },
  {
    title: "AI Writes It. AI Says It.",
    description:
      "Our AI drafts an honest, upbeat script and narrates it in a voice so natural, buyers will swear a real salesperson recorded it.",
    icon: MicIcon,
  },
  {
    title: "Stick It. Scan It. Sell It.",
    description:
      "Slap the QR code on the windshield and let every walk-up buyer hit play — no salesperson required, available 24/7.",
    icon: QRIcon,
  },
];

const BAND_TAGS = ["Cars", "Motorcycles", "Boats", "RVs"];

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <SiteHeader transparent />

      {/* Hero — a single pre-composed banner image (headline, subhead, CTA,
          trio icon row, and phone mockup are all part of the artwork
          itself). Starts at the very top of the page (no gap) so the fixed,
          transparent-by-default header floats directly over it, reading as
          part of the artwork rather than a separate bar. Height is pinned to
          the full viewport (not derived from the image's own aspect ratio) so
          it always fills the first screen exactly, even on 16:10 displays
          (most MacBooks) where the source's 16:9 shape would otherwise fall
          short at the bottom — object-cover crops the width to compensate. */}
      <section className="relative z-0 w-full">
        <div className="relative h-[100dvh] w-full overflow-hidden">
          <Image
            src="/hero-voicetag-v3.png"
            alt="Every Vehicle Has a Story. Create your Voice Tag in under 60 seconds."
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: "30% 40%" }}
          />
          <Link
            href="/builder"
            aria-label="Create Your Voice Tag"
            className="absolute left-[2.3%] top-[46.2%] h-[6.4%] w-[22.6%]"
          />
        </div>
      </section>

      <WarmThemeZone className="bg-[var(--warm-bg)]">
        {/* 2. How it works */}
        <section className="border-t border-[var(--warm-border)] px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-wider text-amber-400">
                The Magic Behind the Mic
              </span>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Three Steps. One Unforgettable Test Drive Story.
              </h2>
              <p className="mt-4 text-zinc-400">
                No scripts to write, no mic to hold — just answers, waiting
                for the next buyer who scans your tag.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {HOW_IT_WORKS_STEPS.map((step) => (
                <div
                  key={step.title}
                  className="rounded-2xl border border-[var(--warm-border)] bg-[var(--warm-surface)] p-8"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400">
                    <step.icon />
                  </div>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="mt-3 leading-7 text-zinc-400">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Scan the Tag. Hear the Car. */}
        <HearForYourself />

        {/* 4. Pricing intro */}
        <PricingTeaser />

        {/* 5. Band — future expansion */}
        <section
          className="relative overflow-hidden border-t border-[var(--warm-border)] px-6 py-28 sm:py-36"
          style={{
            backgroundColor: "#2b2420",
            backgroundImage:
              "radial-gradient(circle at 18% 30%, rgba(251,191,36,0.22), transparent 16%)," +
              "radial-gradient(circle at 82% 22%, rgba(96,165,250,0.18), transparent 14%)," +
              "radial-gradient(circle at 62% 72%, rgba(251,191,36,0.14), transparent 11%)," +
              "radial-gradient(circle at 30% 78%, rgba(255,255,255,0.08), transparent 9%)," +
              "radial-gradient(circle at 90% 80%, rgba(96,165,250,0.12), transparent 10%)",
          }}
        >
          <div className="relative mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
              Every vehicle has a story. Give it a voice.
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {BAND_TAGS.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-sm text-zinc-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 6-7. Blank placeholders, to be filled in a future session */}
        <PlaceholderSection />
        <PlaceholderSection />

        {/* 8. Closing CTA */}
        <ClosingCta />

        <footer className="border-t border-[var(--warm-border)] px-6 py-8 text-center text-sm text-zinc-500">
          © {new Date().getFullYear()} VIN Voice. All rights reserved.
        </footer>
      </WarmThemeZone>
    </div>
  );
}
