import Anthropic from "@anthropic-ai/sdk";
import type { FormState } from "../../builder/types";

const client = new Anthropic();

const SYSTEM_PROMPT = `You write short, natural-sounding voice tour scripts for vehicle listings. A buyer will hear this narrated aloud after scanning a QR code on the car's windshield, before they ever call the seller.

Write like the owner is casually telling a friend about their own car — not a salesperson pitching it. Grounded, first-person-ish, matter-of-fact. Say things the way a person actually talks: "This thing's been solid for me," not "This vehicle offers exceptional reliability." Mention the year/make/model/trim, mileage, and price naturally, like they'd come up in conversation, then work in the condition and feature details the seller provided — including any flaws or quirks — the same easy way you'd mention the good stuff. Do not invent details the seller didn't mention.

Never use car-ad language or salesy pressure: no "don't miss out," "won't last long," "priced to sell," "must see," or similar phrases. No exclamation points. No overselling — if something's just okay, let it sound just okay. Keep it to 3-4 short paragraphs, written to be spoken aloud (no bullet points, no headers, no markdown).`;

function buildUserMessage(vehicle: FormState): string {
  return `Vehicle details:
Year: ${vehicle.year}
Make: ${vehicle.make}
Model: ${vehicle.model}
Trim: ${vehicle.trim || "Not specified"}
Mileage: ${vehicle.mileage}
Asking price: ${vehicle.price}

Condition & features, in the seller's own words:
${vehicle.features || "Not provided"}

Write the voice tour script now.`;
}

function isFormState(value: unknown): value is FormState {
  if (typeof value !== "object" || value === null) return false;
  const required = ["year", "make", "model", "trim", "mileage", "price", "features"];
  return required.every((key) => typeof (value as Record<string, unknown>)[key] === "string");
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!isFormState(body)) {
    return Response.json(
      { error: "Request body must include year, make, model, trim, mileage, price, and features as strings." },
      { status: 400 }
    );
  }

  try {
    const message = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildUserMessage(body) }],
    });

    if (message.stop_reason === "refusal") {
      return Response.json(
        { error: "The script couldn't be generated for this listing. Try adjusting the details." },
        { status: 422 }
      );
    }

    const textBlock = message.content.find((block) => block.type === "text");
    if (!textBlock) {
      return Response.json({ error: "No script was returned." }, { status: 502 });
    }

    return Response.json({ script: textBlock.text });
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      console.error("Anthropic authentication error:", error.message);
      return Response.json({ error: "Server is misconfigured. Please try again later." }, { status: 500 });
    }
    if (error instanceof Anthropic.RateLimitError) {
      return Response.json({ error: "Too many requests right now. Please try again shortly." }, { status: 429 });
    }
    if (error instanceof Anthropic.BadRequestError) {
      console.error("Anthropic bad request error:", error.message);
      return Response.json({ error: "Could not generate a script for these details." }, { status: 400 });
    }
    if (error instanceof Anthropic.APIError) {
      console.error("Anthropic API error:", error.status, error.message);
      return Response.json({ error: "The script generator is temporarily unavailable." }, { status: 502 });
    }
    console.error("Unexpected error generating script:", error);
    return Response.json({ error: "Something went wrong generating the script." }, { status: 500 });
  }
}
