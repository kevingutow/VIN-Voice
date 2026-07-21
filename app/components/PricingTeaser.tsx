import Link from "next/link";

// Placeholder numbers matching app/pricing/page.tsx — "let's start with this
// and see how it goes," per the user, not final pricing.
const TEASER_TIERS = [
  { name: "Free", price: "$0", description: "Perfect for selling one car.", highlighted: false },
  { name: "Pro", price: "$19/mo", description: "For sellers who list often.", highlighted: true },
  { name: "Dealer", price: "Custom", description: "For dealerships & lots.", highlighted: false },
];

export function PricingTeaser() {
  return (
    <section className="border-t border-[var(--warm-border)] px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Simple, honest pricing</h2>
          <p className="mt-4 text-zinc-400">Start free. Upgrade when you need more.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {TEASER_TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl border bg-[var(--warm-surface)] p-8 text-center ${
                tier.highlighted ? "border-amber-400/50" : "border-[var(--warm-border)]"
              }`}
            >
              {tier.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-zinc-950">
                  Most Popular
                </span>
              )}
              <h3 className="text-lg font-semibold">{tier.name}</h3>
              <p className="mt-4 text-3xl font-bold tracking-tight">{tier.price}</p>
              <p className="mt-3 text-sm text-zinc-400">{tier.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/pricing"
            className="text-sm font-semibold text-amber-400 transition-colors hover:text-amber-300"
          >
            See full pricing →
          </Link>
        </div>
      </div>
    </section>
  );
}
