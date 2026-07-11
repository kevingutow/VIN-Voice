import { DEFAULT_VOICE_ID, VALID_VOICE_IDS } from "../../builder/voices";
import { synthesizeSpeech } from "./elevenlabs";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const text = (body as { text?: unknown })?.text;
  if (!isNonEmptyString(text)) {
    return Response.json({ error: "Request body must include non-empty text." }, { status: 400 });
  }

  const requestedVoiceId = (body as { voiceId?: unknown })?.voiceId;
  let voiceId = DEFAULT_VOICE_ID;
  if (requestedVoiceId !== undefined) {
    if (!isNonEmptyString(requestedVoiceId) || !VALID_VOICE_IDS.has(requestedVoiceId)) {
      return Response.json({ error: "Invalid voice selected." }, { status: 400 });
    }
    voiceId = requestedVoiceId;
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.error("ELEVENLABS_API_KEY is not set.");
    return Response.json({ error: "Server is misconfigured. Please try again later." }, { status: 500 });
  }

  const result = await synthesizeSpeech(apiKey, voiceId, text);
  if (!result.ok) {
    return Response.json({ error: result.message }, { status: result.status });
  }

  return new Response(result.audioBuffer, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "no-store",
    },
  });
}
