import { put } from "@vercel/blob";
import { randomUUID } from "node:crypto";
import QRCode from "qrcode";
import { isFormState } from "../../builder/types";
import { VALID_VOICE_IDS } from "../../builder/voices";
import {
  listingAudioPath,
  listingMetadataPath,
  listingQrPath,
  type ListingMetadata,
} from "../../lib/listing";
import { getSiteOrigin } from "../../lib/site-origin";

const MAX_AUDIO_BYTES = 20 * 1024 * 1024;

export async function POST(request: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("BLOB_READ_WRITE_TOKEN is not set.");
    return Response.json({ error: "Server is misconfigured. Please try again later." }, { status: 500 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: "Invalid form data." }, { status: 400 });
  }

  let form: unknown;
  try {
    form = JSON.parse(String(formData.get("form")));
  } catch {
    return Response.json({ error: "Request must include valid vehicle details." }, { status: 400 });
  }
  if (!isFormState(form)) {
    return Response.json(
      { error: "Request body must include year, make, model, trim, mileage, price, and features as strings." },
      { status: 400 }
    );
  }

  const script = formData.get("script");
  if (typeof script !== "string" || script.trim().length === 0) {
    return Response.json({ error: "Request must include a non-empty script." }, { status: 400 });
  }

  const voiceId = formData.get("voiceId");
  if (typeof voiceId !== "string" || !VALID_VOICE_IDS.has(voiceId)) {
    return Response.json({ error: "Invalid voice selected." }, { status: 400 });
  }

  const audio = formData.get("audio");
  if (!(audio instanceof File) || audio.size === 0) {
    return Response.json({ error: "Request must include an audio file." }, { status: 400 });
  }
  if (audio.size > MAX_AUDIO_BYTES) {
    return Response.json({ error: "Audio file is too large." }, { status: 400 });
  }

  const id = randomUUID();
  const listingUrl = `${getSiteOrigin(request)}/listing/${id}`;

  try {
    const audioBlob = await put(listingAudioPath(id), audio, {
      access: "public",
      addRandomSuffix: false,
      contentType: "audio/mpeg",
    });

    let qrBuffer: Buffer;
    try {
      qrBuffer = await QRCode.toBuffer(listingUrl, {
        type: "png",
        errorCorrectionLevel: "M",
        margin: 2,
        width: 512,
      });
    } catch (error) {
      console.error("Error generating QR code:", error);
      return Response.json({ error: "Server is misconfigured. Please try again later." }, { status: 500 });
    }

    const qrBlob = await put(listingQrPath(id), qrBuffer, {
      access: "public",
      addRandomSuffix: false,
      contentType: "image/png",
    });

    const metadata: ListingMetadata = {
      id,
      createdAt: new Date().toISOString(),
      form,
      script,
      voiceId,
      audioUrl: audioBlob.url,
      qrUrl: qrBlob.url,
      qrDownloadUrl: qrBlob.downloadUrl,
    };

    await put(listingMetadataPath(id), JSON.stringify(metadata), {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json",
    });

    return Response.json({
      id,
      listingUrl,
      audioUrl: metadata.audioUrl,
      qrUrl: metadata.qrUrl,
      qrDownloadUrl: metadata.qrDownloadUrl,
    });
  } catch (error) {
    console.error("Error saving listing:", error);
    return Response.json({ error: "Could not save your listing right now. Please try again." }, { status: 502 });
  }
}
