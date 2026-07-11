import { VALID_VOICE_IDS } from "../../builder/voices";
import { fetchVoicePreviewUrl, synthesizeSpeech } from "../generate-audio/elevenlabs";

const SAMPLE_TEXT =
  "Hey, thanks for stopping by. This is just a quick sample so you can hear how I sound.";

// In-memory cache so repeat preview requests for the same voice (across
// users, across page loads) don't keep re-hitting ElevenLabs. Cleared on
// server restart, which is fine for a short sample clip.
const previewCache = new Map<string, ArrayBuffer>();

export async function GET(request: Request) {
  const voiceId = new URL(request.url).searchParams.get("voiceId");
  if (!voiceId || !VALID_VOICE_IDS.has(voiceId)) {
    return Response.json({ error: "Invalid voice requested." }, { status: 400 });
  }

  const cached = previewCache.get(voiceId);
  if (cached) {
    return new Response(cached, {
      headers: { "Content-Type": "audio/mpeg", "Cache-Control": "public, max-age=86400" },
    });
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.error("ELEVENLABS_API_KEY is not set.");
    return Response.json({ error: "Server is misconfigured. Please try again later." }, { status: 500 });
  }

  let audioBuffer: ArrayBuffer | null = null;

  const previewUrl = await fetchVoicePreviewUrl(apiKey, voiceId);
  if (previewUrl) {
    try {
      const previewResponse = await fetch(previewUrl);
      if (previewResponse.ok) {
        audioBuffer = await previewResponse.arrayBuffer();
      }
    } catch (error) {
      console.error("Error fetching ElevenLabs preview_url:", error);
    }
  }

  if (!audioBuffer) {
    const result = await synthesizeSpeech(apiKey, voiceId, SAMPLE_TEXT);
    if (!result.ok) {
      return Response.json({ error: result.message }, { status: result.status });
    }
    audioBuffer = result.audioBuffer;
  }

  previewCache.set(voiceId, audioBuffer);

  return new Response(audioBuffer, {
    headers: { "Content-Type": "audio/mpeg", "Cache-Control": "public, max-age=86400" },
  });
}
