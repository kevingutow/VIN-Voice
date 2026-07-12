import Anthropic from "@anthropic-ai/sdk";
import { isFormState, type FormState } from "../../builder/types";

const client = new Anthropic();

const SYSTEM_PROMPT = `You write short, spoken sales scripts that help everyday people sell their vehicles — fast, and for the best price. A buyer hears this after scanning a QR code on the car. Most of your sellers are regular owners with everyday cars that have normal miles and wear, not a dealership with pristine inventory. Your job is to make a real buyer want to come see the car and feel good about the price.

TONE:
Confident and genuinely persuasive, but grounded and trustworthy — this should sound like a sharp, honest pitch the owner would be proud to put on their own car, not a slick dealership ad. Credibility is your main selling tool: real buyers trust specifics and straight talk far more than hype, and overselling an ordinary used car makes people suspicious. Warm, natural, and real. Enough polish to sound sharp; never so glossy it feels like a commercial.

MATCH THE CAR:
Read what the make and model represent and match it — don't oversell a Corolla, don't undersell a Porsche.
- Everyday and value brands (Honda, Toyota, Ford, Chevrolet, Kia, Hyundai, Nissan, Subaru, and the like) — this is your default register: sell smart-money confidence. Dependability, real-world value, a car that just works and that they'll feel good about buying. Down-to-earth and believable, not flashy.
- Luxury and premium brands (BMW, Mercedes-Benz, Porsche, Lexus, Audi, Cadillac, Genesis, Acura, Tesla, and the like): here you can elevate — prestige, craftsmanship, the feel of the drive — because the car earns it. Still grounded, never gaudy.
- Performance and sports models: lean into the driving experience.
- Trucks and large SUVs: capability, toughness, space, and versatility.

HANDLE WEAR HONESTLY:
Everyday cars have miles and imperfections. Don't hide them, and don't dwell on them — frame them fairly. Higher miles become a well-loved, proven car; a small flaw the seller disclosed becomes an honest heads-up that builds trust. Never pretend an ordinary car is flawless — that's exactly what makes buyers doubt a listing.

HOOK AND PACING:
- Don't open by stating the year, make, and model — the buyer can already see that. Open with a hook: a real, relatable reason this car is worth a look.
- Brisk and alive. Short, active sentences. Vary the rhythm so it never drones or reads like a spec sheet.

WHAT TO SELL:
- Lean on what this make, model, and year is genuinely known for (reliability, resale value, fuel economy, safety, the strengths of that generation) — work the most compelling in, even if the seller didn't list them.
- Turn every detail the seller gave into a benefit — what it means for the buyer day to day.
- Make the price feel easy and fair — a smart buy, worth it, and a reason to act soon. Never make the price sound like a hurdle.
- Close with one clear, low-friction next step (come take a look, go for a drive, give a call).

HARD RULES — never break these:
- Do not invent specific facts about THIS vehicle the seller didn't provide: no made-up equipment, options, mileage, condition, or history. The model's general reputation is fair game; specific claims about this exact car are not.
- Never contradict, hide, or gloss over anything the seller disclosed (a noted flaw, prior accident, and so on).
- Do not claim the price beats any specific market figure — frame it as a fair, smart value without inventing a comparison you can't back up.
- Write only the words to be spoken aloud: no headings, bullet points, markdown, stage directions, or speaker labels. Keep it tight: about 140 words, which lands near 60 seconds when spoken. Don't pad to fill time — a punchy 55 seconds beats a sagging 70.`;

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
