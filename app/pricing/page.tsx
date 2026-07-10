import Link from "next/link";
import { ClosingCta } from "../components/ClosingCta";
import { SiteHeader } from "../components/SiteHeader";

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0">
    <path
      d="m5 13 4 4 10-10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PRICING_TIERS = [
  {
    name: "Free",
    price: "$0",
    cadence: "",
    description: "Perfect for selling one car.",
    features: ["1 active listing", "AI-generated script", "Standard voice", "QR code included"],
    ctaLabel: "Get Started Free",
    href: "/builder",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19",
    cadence: "/mo",
    description: "For sellers who list often.",
    features: [
      "10 active listings",
      "Priority script generation",
      "Voice presets (coming soon)",
      "Email support",
    ],
    ctaLabel: "Start Pro",
    href: "/builder",
    highlighted: true,
  },
  {
    name: "Dealer",
    price: "Custom",
    cadence: "",
    description: "For dealerships & lots.",
    features: ["Unlimited listings", "Bulk generation", "Team accounts", "Dedicated support"],
    ctaLabel: "Contact Sales",
    href: "#",
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <SiteHeader />

      <section className="px-6 pb-24 pt-20 sm:pt-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Simple, honest pricing
            </h1>
            <p className="mt-4 text-zinc-400">Start free. Upgrade when you need more.</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`relative flex flex-col rounded-2xl border p-8 ${
                  tier.highlighted
                    ? "border-amber-400/50 bg-zinc-900"
                    : "border-white/10 bg-zinc-900"
                }`}
              >
                {tier.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-zinc-950">
                    Most Popular
                  </span>
                )}
                <h2 className="text-lg font-semibold">{tier.name}</h2>
                <p className="mt-1 text-sm text-zinc-400">{tier.description}</p>
                <p className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight">{tier.price}</span>
                  {tier.cadence && <span className="text-sm text-zinc-400">{tier.cadence}</span>}
                </p>
                <ul className="mt-8 flex-1 space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-zinc-300">
                      <span className="mt-0.5 text-amber-400">
                        <CheckIcon />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={tier.href}
                  className={`mt-8 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-colors ${
                    tier.highlighted
                      ? "bg-amber-400 text-zinc-950 hover:bg-amber-300"
                      : "border border-white/15 text-white hover:bg-white/5"
                  }`}
                >
                  {tier.ctaLabel}
                </Link>
              </div>
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
