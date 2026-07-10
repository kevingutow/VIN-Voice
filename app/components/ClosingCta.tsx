import { GetStartedButton } from "./GetStartedButton";

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

export function ClosingCta() {
  return (
    <section className="border-t border-white/10 px-6 py-24">
      <div className="mx-auto flex max-w-3xl flex-col items-center rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 to-zinc-950 px-8 py-16 text-center">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-amber-400/10 text-amber-400">
          <CheckmarkBadge />
        </div>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Give every listing a voice
        </h2>
        <p className="mt-4 max-w-md text-zinc-400">Free to start. No credit card required.</p>
        <GetStartedButton className="mt-8 px-8 py-4 text-base" />
      </div>
    </section>
  );
}
