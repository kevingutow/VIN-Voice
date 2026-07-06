const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1/text-to-speech";

// "Chris" — a charming, down-to-earth premade ElevenLabs voice, a good match
// for the casual, owner-telling-a-friend tone of the generated scripts.
const DEFAULT_VOICE_ID = "iP95p4xoKVk53GoZ742B";

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

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.error("ELEVENLABS_API_KEY is not set.");
    return Response.json({ error: "Server is misconfigured. Please try again later." }, { status: 500 });
  }

  let elevenLabsResponse: Response;
  try {
    elevenLabsResponse = await fetch(`${ELEVENLABS_API_URL}/${DEFAULT_VOICE_ID}`, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    });
  } catch (error) {
    console.error("Network error calling ElevenLabs:", error);
    return Response.json(
      { error: "Could not reach the audio generator. Please try again." },
      { status: 502 }
    );
  }

  if (!elevenLabsResponse.ok) {
    let message = "Could not generate audio for this script.";
    try {
      const errorBody = await elevenLabsResponse.json();
      const detail = errorBody?.detail;
      const status = typeof detail === "object" ? detail?.status : undefined;
      if (status === "quota_exceeded") {
        message = "The audio generator is out of credits. Please try again later.";
      } else if (elevenLabsResponse.status === 401) {
        message = "Audio generation is temporarily unavailable.";
      } else if (typeof detail === "object" && typeof detail?.message === "string") {
        message = detail.message;
      } else if (typeof detail === "string") {
        message = detail;
      }
    } catch {
      // response body wasn't JSON — fall back to the generic message
    }
    console.error("ElevenLabs error:", elevenLabsResponse.status, message);
    return Response.json(
      { error: message },
      { status: elevenLabsResponse.status === 401 ? 500 : 502 }
    );
  }

  const audioBuffer = await elevenLabsResponse.arrayBuffer();
  return new Response(audioBuffer, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "no-store",
    },
  });
}
