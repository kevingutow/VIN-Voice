"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BUILDER_FORM_STORAGE_KEY, FormState } from "../types";

function formatMileage(value: string) {
  const n = Number(value);
  return Number.isFinite(n) ? `${n.toLocaleString()} mi` : value;
}

function formatPrice(value: string) {
  const n = Number(value);
  return Number.isFinite(n)
    ? `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
    : value;
}

function SummaryField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-sm font-medium text-zinc-300">{label}</p>
      <p className={value ? "text-white" : "italic text-zinc-500"}>
        {value || "Not provided"}
      </p>
    </div>
  );
}

export default function BuilderReview() {
  const router = useRouter();
  const [form, setForm] = useState<FormState | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(BUILDER_FORM_STORAGE_KEY);
      if (raw) {
        // One-time hydration from sessionStorage on mount — sessionStorage
        // is unavailable during SSR, so this can't happen during render.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setForm(JSON.parse(raw));
        return;
      }
    } catch {
      // fall through to redirect
    }
    router.replace("/builder");
  }, [router]);

  if (!form) return null;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-white/10 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <span className="text-amber-400">VIN</span> Voice
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
          >
            ← Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Review your listing
          </h1>
          <p className="mt-3 text-zinc-400">
            Double-check the details below before we generate your voice tour
            script.
          </p>
        </div>

        <div className="space-y-8">
          <section className="rounded-2xl border border-white/10 bg-zinc-900 p-6 sm:p-8">
            <h2 className="mb-6 text-xl font-semibold">Vehicle Basics</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <SummaryField label="Year" value={form.year} />
              <SummaryField label="Make" value={form.make} />
              <SummaryField label="Model" value={form.model} />
              <SummaryField label="Trim" value={form.trim} />
              <SummaryField label="Mileage" value={formatMileage(form.mileage)} />
              <SummaryField label="Asking Price" value={formatPrice(form.price)} />
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-zinc-900 p-6 sm:p-8">
            <h2 className="mb-6 text-xl font-semibold">Condition & Features</h2>
            <SummaryField label="Tell us about the car" value={form.features} />
          </section>

          <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/builder"
              className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
            >
              ← Edit details
            </Link>
            <div className="flex flex-col items-end gap-3">
              <p className="text-sm text-amber-400">
                Voice script generation is coming soon.
              </p>
              <button
                type="button"
                disabled
                className="inline-flex w-full cursor-not-allowed items-center justify-center rounded-full bg-amber-400/40 px-8 py-3.5 text-sm font-semibold text-zinc-950/70 sm:w-auto"
              >
                Generate Script
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
