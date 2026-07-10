import Image from "next/image";
import { ClosingCta } from "./components/ClosingCta";
import { GetStartedButton } from "./components/GetStartedButton";
import { SiteHeader } from "./components/SiteHeader";

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

function QRGraphic({ className = "" }: { className?: string }) {
  // Decorative QR-code-style pattern (finder-pattern corners + noise) — not a
  // real scannable code.
  const size = 7;
  const cells: boolean[] = [];
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const inCorner =
        (row < 2 && col < 2) ||
        (row < 2 && col > size - 3) ||
        (row > size - 3 && col < 2);
      cells.push(inCorner || (row * 3 + col * 7 + row * col) % 5 < 2);
    }
  }
  return (
    <div className={`grid grid-cols-7 gap-[3px] rounded-md bg-white p-2 ${className}`}>
      {cells.map((filled, i) => (
        <div
          key={i}
          className={`aspect-square rounded-[1px] ${filled ? "bg-zinc-950" : "bg-white"}`}
        />
      ))}
    </div>
  );
}

const HOW_IT_WORKS_STEPS = [
  {
    title: "Enter vehicle details",
    description:
      "Type in the VIN or pick your car from the lot — we pull the specs automatically.",
    icon: DocumentIcon,
  },
  {
    title: "AI writes & voices your script",
    description:
      "Our AI writes a natural, honest script and narrates it in a warm, human-sounding voice.",
    icon: MicIcon,
  },
  {
    title: "Get your QR code",
    description:
      "Print or stick the QR code on the windshield so any buyer can listen on the spot.",
    icon: QRIcon,
  },
];

const BAND_TAGS = ["Cars", "Motorcycles", "Boats", "RVs"];

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <SiteHeader />

      {/* Hero */}
      <section className="relative z-0 flex min-h-[85vh] items-center overflow-hidden px-6 py-28">
        <div className="absolute inset-0 -z-20">
          <Image
            src="/ivan-kazlouskij-euFJPwObDWI-unsplash.jpg"
            alt="Cars parked on a dealership lot"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[25%_45%]"
          />
        </div>
        <div
          className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(9,9,11,1)_0%,rgba(9,9,11,0.72)_45%,rgba(9,9,11,0.45)_100%)]"
          aria-hidden
        />

        {/* Floating QR code, positioned roughly over the black car's driver window */}
        <div
          className="absolute left-[13%] top-[26%] hidden sm:block"
          style={{ animation: "float-bob 3.6s ease-in-out infinite" }}
          aria-hidden
        >
          <QRGraphic className="w-16 shadow-[0_8px_30px_rgba(0,0,0,0.5)] sm:w-20" />
        </div>

        <div className="relative mx-auto max-w-3xl text-center">
          <span className="mb-6 inline-block rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-amber-300">
            AI voice tours for every listing
          </span>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Scan the tag. Hear the car.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-zinc-300">
            Turn any vehicle listing into a natural-sounding sales script
            buyers can hear before they ever pick up the phone.
          </p>
          <p className="mt-4 text-sm text-zinc-400">Free to try. No credit card required.</p>
          <GetStartedButton
            className="mt-10 px-8 py-4 text-base"
            label="Get your first tour free"
          />
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-white/10 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How it works</h2>
            <p className="mt-4 text-zinc-400">From VIN to voice tour in under a minute.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {HOW_IT_WORKS_STEPS.map((step) => (
              <div key={step.title} className="rounded-2xl border border-white/10 bg-zinc-900 p-8">
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

      {/* Band — future expansion */}
      <section
        className="relative overflow-hidden border-t border-white/10 px-6 py-28 sm:py-36"
        style={{
          backgroundColor: "#08090b",
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

      <ClosingCta />

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} VIN Voice. All rights reserved.
      </footer>
    </div>
  );
}
