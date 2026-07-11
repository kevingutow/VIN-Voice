import { head } from "@vercel/blob";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatMileage, formatPrice } from "../../lib/format";
import { isValidListingId, listingMetadataPath, type ListingMetadata } from "../../lib/listing";

async function getListing(id: string): Promise<ListingMetadata | null> {
  if (!isValidListingId(id)) return null;

  let metadataUrl: string;
  try {
    const blob = await head(listingMetadataPath(id));
    metadataUrl = blob.url;
  } catch (error) {
    console.error("Error resolving listing metadata blob:", error);
    return null;
  }

  const response = await fetch(metadataUrl, { cache: "no-store" });
  if (!response.ok) return null;
  return response.json();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const listing = await getListing(id);
  if (!listing) return { title: "Listing not found — VIN Voice" };
  const { year, make, model } = listing.form;
  return { title: `${year} ${make} ${model} — VIN Voice` };
}

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await getListing(id);
  if (!listing) notFound();

  const { form } = listing;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-white/10 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <span className="text-amber-400">VIN</span> Voice
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <div className="mb-10">
          <span className="mb-4 inline-block rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-amber-300">
            Voice tour
          </span>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {form.year} {form.make} {form.model} {form.trim}
          </h1>
          <p className="mt-3 text-zinc-400">
            {formatMileage(form.mileage)} · {formatPrice(form.price)}
          </p>
        </div>

        <div className="space-y-8">
          <section className="rounded-2xl border border-white/10 bg-zinc-900 p-6 sm:p-8">
            <h2 className="mb-4 text-xl font-semibold">Listen</h2>
            <audio controls src={listing.audioUrl} className="w-full">
              Your browser does not support the audio element.
            </audio>
          </section>

          <section className="rounded-2xl border border-white/10 bg-zinc-900 p-6 sm:p-8">
            <h2 className="mb-4 text-xl font-semibold">About this vehicle</h2>
            <p className="whitespace-pre-line leading-7 text-zinc-200">{listing.script}</p>
          </section>
        </div>
      </main>
    </div>
  );
}
