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
  const [isGenerating, setIsGenerating] = useState(false);
  const [script, setScript] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  async function handleGenerateScript() {
    setIsGenerating(true);
    setError(null);
    try {
      const response = await fetch("/api/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Something went wrong generating the script.");
      }
      setScript(data.script);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong generating the script.");
    } finally {
      setIsGenerating(false);
    }
  }

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

          {script && (
            <section className="rounded-2xl border border-white/10 bg-zinc-900 p-6 sm:p-8">
              <h2 className="mb-6 text-xl font-semibold">Your Voice Tour Script</h2>
              <p className="whitespace-pre-line leading-7 text-zinc-200">{script}</p>
            </section>
          )}

          <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/builder"
              className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
            >
              ← Edit details
            </Link>
            <div className="flex flex-col items-end gap-3">
              {error && <p className="text-sm text-red-400">{error}</p>}
              <button
                type="button"
                onClick={handleGenerateScript}
                disabled={isGenerating}
                className="inline-flex w-full items-center justify-center rounded-full bg-amber-400 px-8 py-3.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-amber-400/40 disabled:text-zinc-950/70 disabled:hover:bg-amber-400/40 sm:w-auto"
              >
                {isGenerating ? "Generating…" : script ? "Regenerate Script" : "Generate Script"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
