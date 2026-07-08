const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1";

export type SynthesizeResult =
  | { ok: true; audioBuffer: ArrayBuffer }
  | { ok: false; status: number; message: string };

export async function synthesizeSpeech(
  apiKey: string,
  voiceId: string,
  text: string
): Promise<SynthesizeResult> {
  let response: Response;
  try {
    response = await fetch(`${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`, {
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
    return { ok: false, status: 502, message: "Could not reach the audio generator. Please try again." };
  }

  if (!response.ok) {
    let message = "Could not generate audio.";
    try {
      const errorBody = await response.json();
      const detail = errorBody?.detail;
      const status = typeof detail === "object" ? detail?.status : undefined;
      if (status === "quota_exceeded") {
        message = "The audio generator is out of credits. Please try again later.";
      } else if (response.status === 401) {
        message = "Audio generation is temporarily unavailable.";
      } else if (typeof detail === "object" && typeof detail?.message === "string") {
        message = detail.message;
      } else if (typeof detail === "string") {
        message = detail;
      }
    } catch {
      // response body wasn't JSON — fall back to the generic message
    }
    console.error("ElevenLabs error:", response.status, message);
    return { ok: false, status: response.status === 401 ? 500 : 502, message };
  }

  const audioBuffer = await response.arrayBuffer();
  return { ok: true, audioBuffer };
}

export async function fetchVoicePreviewUrl(apiKey: string, voiceId: string): Promise<string | null> {
  try {
    const response = await fetch(`${ELEVENLABS_API_URL}/voices/${voiceId}`, {
      headers: { "xi-api-key": apiKey },
    });
    if (!response.ok) return null;
    const data = await response.json();
    return typeof data?.preview_url === "string" ? data.preview_url : null;
  } catch (error) {
    console.error("Error fetching voice preview URL:", error);
    return null;
  }
}
