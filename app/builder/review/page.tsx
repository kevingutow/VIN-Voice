"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { formatMileage, formatPrice } from "../../lib/format";
import { BUILDER_FORM_STORAGE_KEY, FormState } from "../types";
import { DEFAULT_VOICE_ID, suggestVoiceId, VOICE_OPTIONS, VoiceOption } from "../voices";

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

function VoiceCard({
  voice,
  isSelected,
  isSuggested,
  previewState,
  onSelect,
  onPlaySample,
}: {
  voice: VoiceOption;
  isSelected: boolean;
  isSuggested: boolean;
  previewState: "idle" | "loading" | "playing" | "error";
  onSelect: () => void;
  onPlaySample: () => void;
}) {
  const sampleLabel =
    previewState === "loading" ? "Loading…" : previewState === "playing" ? "Playing…" : "▶ Play Sample";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`cursor-pointer rounded-xl border p-4 text-left transition-colors ${
        isSelected
          ? "border-amber-400 bg-amber-400/10"
          : "border-white/10 bg-zinc-950 hover:border-white/20"
      }`}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className={`text-sm font-semibold ${isSelected ? "text-amber-400" : "text-white"}`}>
          {voice.label}
        </p>
        {isSuggested && (
          <span className="shrink-0 rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-amber-300">
            Suggested
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onPlaySample();
        }}
        className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-white/30 hover:text-white"
      >
        {sampleLabel}
      </button>
      {previewState === "error" && (
        <p className="mt-2 text-xs text-red-400">Couldn&apos;t play this sample.</p>
      )}
    </div>
  );
}

export default function BuilderReview() {
  const router = useRouter();
  const [form, setForm] = useState<FormState | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [script, setScript] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [voiceId, setVoiceId] = useState(DEFAULT_VOICE_ID);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedListing, setSavedListing] = useState<{
    listingUrl: string;
    qrUrl: string;
    qrDownloadUrl: string;
  } | null>(null);
  const [previewStatus, setPreviewStatus] = useState<{
    voiceId: string;
    state: "loading" | "playing" | "error";
  } | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  useEffect(() => {
    return () => {
      previewAudioRef.current?.pause();
    };
  }, []);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(BUILDER_FORM_STORAGE_KEY);
      if (raw) {
        // One-time hydration from sessionStorage on mount — sessionStorage
        // is unavailable during SSR, so this can't happen during render.
        const parsed: FormState = JSON.parse(raw);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setForm(parsed);
        // Pre-select the voice that fits the vehicle's character (luxury →
        // deep/calm, truck/cruiser → regular guy); the user can override.
        setVoiceId(suggestVoiceId(parsed.make, parsed.model));
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
      setAudioUrl(null);
      setAudioBlob(null);
      setAudioError(null);
      setSavedListing(null);
      setSaveError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong generating the script.");
    } finally {
      setIsGenerating(false);
    }
  }

  function handlePlaySample(id: string) {
    previewAudioRef.current?.pause();
    setPreviewStatus({ voiceId: id, state: "loading" });

    const audio = new Audio(`/api/voice-preview?voiceId=${encodeURIComponent(id)}`);
    previewAudioRef.current = audio;
    audio.addEventListener("playing", () => setPreviewStatus({ voiceId: id, state: "playing" }));
    audio.addEventListener("ended", () => setPreviewStatus(null));
    audio.addEventListener("error", () => setPreviewStatus({ voiceId: id, state: "error" }));
    audio.play().catch(() => setPreviewStatus({ voiceId: id, state: "error" }));
  }

  async function handleGenerateAudio() {
    if (!script) return;
    setIsGeneratingAudio(true);
    setAudioError(null);
    setSavedListing(null);
    setSaveError(null);
    try {
      const response = await fetch("/api/generate-audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: script, voiceId }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong generating the audio.");
      }
      const blob = await response.blob();
      setAudioUrl(URL.createObjectURL(blob));
      setAudioBlob(blob);
    } catch (err) {
      setAudioError(err instanceof Error ? err.message : "Something went wrong generating the audio.");
    } finally {
      setIsGeneratingAudio(false);
    }
  }

  async function handleSaveListing() {
    if (!script || !audioBlob) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      const body = new FormData();
      body.append("form", JSON.stringify(form));
      body.append("script", script);
      body.append("voiceId", voiceId);
      body.append("audio", audioBlob, "voice-tour.mp3");
      const response = await fetch("/api/save-listing", { method: "POST", body });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Something went wrong saving your listing.");
      }
      setSavedListing(data);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Something went wrong saving your listing.");
    } finally {
      setIsSaving(false);
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

              <div className="mt-6 border-t border-white/10 pt-6">
                <p className="mb-4 text-sm font-medium text-zinc-300">Voice</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {VOICE_OPTIONS.map((voice) => (
                    <VoiceCard
                      key={voice.id}
                      voice={voice}
                      isSelected={voiceId === voice.id}
                      isSuggested={voice.id === suggestVoiceId(form.make, form.model)}
                      previewState={
                        previewStatus?.voiceId === voice.id ? previewStatus.state : "idle"
                      }
                      onSelect={() => setVoiceId(voice.id)}
                      onPlaySample={() => handlePlaySample(voice.id)}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex w-full flex-col gap-3 sm:w-auto">
                  {audioError && <p className="text-sm text-red-400">{audioError}</p>}
                  {audioUrl && (
                    <audio controls src={audioUrl} className="w-full sm:w-80">
                      Your browser does not support the audio element.
                    </audio>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleGenerateAudio}
                  disabled={isGeneratingAudio}
                  className="inline-flex w-full items-center justify-center rounded-full border border-amber-400/50 px-6 py-3 text-sm font-semibold text-amber-400 transition-colors hover:bg-amber-400/10 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  {isGeneratingAudio
                    ? "Generating audio…"
                    : audioUrl
                      ? "Regenerate Audio"
                      : "Generate Audio"}
                </button>
              </div>

              {audioBlob && (
                <div className="mt-6 border-t border-white/10 pt-6">
                  {!savedListing ? (
                    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-medium text-zinc-300">Ready to print</p>
                        <p className="mt-1 text-sm text-zinc-500">
                          Save this listing to get a QR code buyers can scan.
                        </p>
                        {saveError && <p className="mt-2 text-sm text-red-400">{saveError}</p>}
                      </div>
                      <button
                        type="button"
                        onClick={handleSaveListing}
                        disabled={isSaving}
                        className="inline-flex w-full items-center justify-center rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-zinc-950 transition-colors hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-amber-400/40 disabled:text-zinc-950/70 sm:w-auto"
                      >
                        {isSaving ? "Saving…" : "Save & Get QR Code"}
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
                      {/* eslint-disable-next-line @next/next/no-img-element -- Vercel Blob URL, not a static asset */}
                      <img
                        src={savedListing.qrUrl}
                        alt="QR code linking to this vehicle's voice tour"
                        className="h-32 w-32 rounded-lg border border-white/10 bg-white p-2"
                      />
                      <div className="flex flex-col items-center gap-3 sm:items-start">
                        <p className="text-sm font-medium text-zinc-300">Your listing is live</p>
                        <a
                          href={savedListing.listingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="break-all text-sm text-amber-400 hover:underline"
                        >
                          {savedListing.listingUrl}
                        </a>
                        <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                          <button
                            type="button"
                            onClick={() => navigator.clipboard.writeText(savedListing.listingUrl)}
                            className="inline-flex items-center justify-center rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-zinc-300 transition-colors hover:border-white/30 hover:text-white"
                          >
                            Copy link
                          </button>
                          <a
                            href={savedListing.qrDownloadUrl}
                            download
                            className="inline-flex items-center justify-center rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-zinc-300 transition-colors hover:border-white/30 hover:text-white"
                          >
                            Download QR
                          </a>
                          <button
                            type="button"
                            onClick={() => window.print()}
                            className="inline-flex items-center justify-center rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-zinc-300 transition-colors hover:border-white/30 hover:text-white"
                          >
                            Print
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
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
