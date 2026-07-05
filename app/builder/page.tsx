"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BUILDER_FORM_STORAGE_KEY, FormState, initialForm } from "./types";

type FormErrors = Partial<Record<keyof FormState, string>>;

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};

  if (!form.year.trim()) errors.year = "Year is required.";
  else if (!/^\d{4}$/.test(form.year.trim()))
    errors.year = "Enter a valid 4-digit year.";

  if (!form.make.trim()) errors.make = "Make is required.";

  if (!form.model.trim()) errors.model = "Model is required.";

  if (!form.mileage.trim()) errors.mileage = "Mileage is required.";
  else if (!/^\d+$/.test(form.mileage.trim()))
    errors.mileage = "Mileage must be a number.";

  if (!form.price.trim()) errors.price = "Asking price is required.";
  else if (!/^\d+(\.\d{1,2})?$/.test(form.price.trim()))
    errors.price = "Price must be a number.";

  return errors;
}

function inputClasses(hasError?: boolean) {
  return `w-full rounded-lg border bg-zinc-950 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 transition-colors ${
    hasError
      ? "border-red-500/60 focus:border-red-500/60 focus:ring-red-500/40"
      : "border-white/10 focus:border-amber-400/50 focus:ring-amber-400/40"
  }`;
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-zinc-300">
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-sm text-red-400">{error}</p>}
    </div>
  );
}

export default function Builder() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(BUILDER_FORM_STORAGE_KEY);
      // One-time hydration from sessionStorage on mount (e.g. returning via
      // "Edit"), not a derived-state sync — sessionStorage is unavailable
      // during SSR, so this can't run as a lazy useState initializer without
      // risking a hydration mismatch.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setForm(JSON.parse(raw));
    } catch {
      // malformed or inaccessible storage — keep initialForm
    }
  }, []);

  function handleChange(field: keyof FormState) {
    return (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors = validate(form);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      try {
        sessionStorage.setItem(BUILDER_FORM_STORAGE_KEY, JSON.stringify(form));
      } catch {
        // storage unavailable — proceed anyway, review page handles missing data
      }
      router.push("/builder/review");
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
            List your vehicle
          </h1>
          <p className="mt-3 text-zinc-400">
            Tell us about the car — we&apos;ll turn these details into a voice
            tour buyers can hear before they call.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-8">
          <section className="rounded-2xl border border-white/10 bg-zinc-900 p-6 sm:p-8">
            <h2 className="mb-6 text-xl font-semibold">Vehicle Basics</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Field label="Year" htmlFor="year" error={errors.year}>
                <input
                  id="year"
                  type="number"
                  inputMode="numeric"
                  placeholder="2019"
                  value={form.year}
                  onChange={handleChange("year")}
                  className={inputClasses(!!errors.year)}
                />
              </Field>
              <Field label="Make" htmlFor="make" error={errors.make}>
                <input
                  id="make"
                  type="text"
                  placeholder="Toyota"
                  value={form.make}
                  onChange={handleChange("make")}
                  className={inputClasses(!!errors.make)}
                />
              </Field>
              <Field label="Model" htmlFor="model" error={errors.model}>
                <input
                  id="model"
                  type="text"
                  placeholder="Camry"
                  value={form.model}
                  onChange={handleChange("model")}
                  className={inputClasses(!!errors.model)}
                />
              </Field>
              <Field label="Trim" htmlFor="trim" error={errors.trim}>
                <input
                  id="trim"
                  type="text"
                  placeholder="SE (optional)"
                  value={form.trim}
                  onChange={handleChange("trim")}
                  className={inputClasses(!!errors.trim)}
                />
              </Field>
              <Field label="Mileage" htmlFor="mileage" error={errors.mileage}>
                <input
                  id="mileage"
                  type="number"
                  inputMode="numeric"
                  min="0"
                  placeholder="45000"
                  value={form.mileage}
                  onChange={handleChange("mileage")}
                  className={inputClasses(!!errors.mileage)}
                />
              </Field>
              <Field label="Asking Price" htmlFor="price" error={errors.price}>
                <input
                  id="price"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  placeholder="18500"
                  value={form.price}
                  onChange={handleChange("price")}
                  className={inputClasses(!!errors.price)}
                />
              </Field>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-zinc-900 p-6 sm:p-8">
            <h2 className="mb-6 text-xl font-semibold">Condition & Features</h2>
            <Field label="Tell us about the car" htmlFor="features" error={errors.features}>
              <textarea
                id="features"
                rows={6}
                placeholder="Any recent repairs? Standout features? Why are you selling?"
                value={form.features}
                onChange={handleChange("features")}
                className={inputClasses(!!errors.features)}
              />
            </Field>
          </section>

          <div className="flex flex-col items-end gap-3">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-full bg-amber-400 px-8 py-3.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-amber-300 sm:w-auto"
            >
              Continue
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
