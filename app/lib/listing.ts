import type { FormState } from "../builder/types";

export type ListingMetadata = {
  id: string;
  createdAt: string;
  form: FormState;
  script: string;
  voiceId: string;
  audioUrl: string;
  qrUrl: string;
  qrDownloadUrl: string;
};

export function listingAudioPath(id: string): string {
  return `listings/${id}/audio.mp3`;
}

export function listingMetadataPath(id: string): string {
  return `listings/${id}/metadata.json`;
}

export function listingQrPath(id: string): string {
  return `listings/${id}/qr.png`;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isValidListingId(id: string): boolean {
  return UUID_RE.test(id);
}
