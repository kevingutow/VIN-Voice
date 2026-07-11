import Link from "next/link";

export default function ListingNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-6 text-center text-white">
      <span className="mb-4 inline-block rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-amber-300">
        404
      </span>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        This listing doesn&apos;t exist or was removed
      </h1>
      <p className="mt-4 max-w-md text-zinc-400">
        The link or QR code you used doesn&apos;t point to an active VIN Voice listing.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-zinc-950 transition-colors hover:bg-amber-300"
      >
        Back to home
      </Link>
    </div>
  );
}
