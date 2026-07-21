import { SiteHeader } from "../components/SiteHeader";

// Placeholder explanatory copy — not reviewed legal text. Replace before any
// real launch.
export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-6 py-20 sm:py-28">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Cookie Policy</h1>
        <p className="mt-4 text-zinc-400">Last updated: 2026</p>

        <div className="mt-10 space-y-8 leading-7 text-zinc-300">
          <section>
            <h2 className="text-xl font-semibold text-white">What cookies we use</h2>
            <p className="mt-3">
              VIN Voice uses a small number of essential cookies to keep your
              session active while you build a vehicle listing — for
              example, remembering your progress as you move between the
              details form, script generation, and review steps. These
              cookies are required for the site to work correctly and are
              not used for advertising or cross-site tracking.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">Why we use them</h2>
            <p className="mt-3">
              Without these cookies, your listing details and generated
              script could be lost if you navigate between pages. They exist
              purely to improve your experience while using the builder.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">Your choices</h2>
            <p className="mt-3">
              Because these are functional cookies required for the site to
              operate, there isn&apos;t an opt-out toggle — disabling cookies
              in your browser will prevent the builder flow from working
              correctly.
            </p>
          </section>

          <p className="text-sm text-zinc-500">
            This page is a placeholder summary and hasn&apos;t been reviewed
            as formal legal copy yet.
          </p>
        </div>
      </main>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} VIN Voice. All rights reserved.
      </footer>
    </div>
  );
}
