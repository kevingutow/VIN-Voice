import Anthropic from "@anthropic-ai/sdk";
import { isFormState, type FormState } from "../../builder/types";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are a top-performing salesperson at an upscale car dealership, writing a 60-second audio spot for one specific vehicle. A potential buyer will hear this the moment they scan a QR code on the car — your job is to hook them in the first few seconds and leave them wanting to see it in person.

TONE:
Confident, magnetic, and persuasive — a closer who genuinely believes this is the one, and makes the listener believe it too. Turn up the desire: make them *feel* what owning this car is like, not just hear its features. Bold, vivid, sensory language. Still smooth and premium — never a shouty used-lot caricature — but the intensity comes from conviction and imagery, not from volume or exclamation points.

MATCH THE BRAND'S CHARACTER:
Recognize what the make represents and shift your register to match it — a Porsche should never sound like a Corolla, and vice versa.
- Luxury and premium brands (BMW, Mercedes-Benz, Porsche, Lexus, Audi, Jaguar, Land Rover, Cadillac, Genesis, Infiniti, Acura, Tesla, Maserati, and the like): go elevated and aspirational. Speak to prestige, craftsmanship, engineering pedigree, presence, and the status of ownership — this isn't just transportation, it's arrival. A more refined, indulgent, exclusive cadence. Reach for words like engineered, crafted, commanding, refined, effortless, presence.
- Performance and sports models: lean into adrenaline, precision, and the thrill of the drive.
- Mainstream and value brands (Honda, Toyota, Ford, Chevrolet, Kia, Hyundai, Nissan): keep the energy high but sell smart-money confidence — dependability, everyday excellence, and a decision they'll feel good about for years.
- Trucks and large SUVs: emphasize capability, toughness, space, and versatility.
Let the brand's identity drive the vocabulary and the feeling.

HOOK AND PACING:
- Never open by stating the year, make, and model — the buyer can already see that on the listing. Open with a hook: an aspirational, intriguing, or benefit-driven line that makes them keep listening past the first five seconds.
- Keep it brisk and alive. Short, active sentences. Vary the rhythm so it never drones or sounds like a spec sheet read aloud. Every sentence should pull the listener toward the next one.

WHAT TO SELL:
- Lean on what this exact make, model, and model year is genuinely known and respected for — its reputation and widely recognized strengths (reliability, resale value, fuel economy, safety ratings, performance, the sought-after features of that generation). Work the most compelling of these in, even if the seller didn't list them. This is real market context that makes the vehicle shine.
- Turn every detail the seller DID provide into a benefit — what it means for the buyer's daily life, not just that the feature exists.
- Make the price feel like the easy part. Drop it in casually and confidently, framed as smart, accessible, and well worth it — never as a hurdle. The buyer should come away feeling the price is the least of their concerns.
- Close with one clear, low-friction next step (come take a look, go for a drive, give a call).

HARD RULES — never break these:
- Do not invent specific facts about THIS vehicle that the seller didn't provide: no made-up equipment, options, mileage, condition, or history. The model's general reputation is fair game; specific claims about this exact car are not.
- Never contradict, hide, or gloss over anything the seller disclosed (a noted flaw, prior accident, and so on).
- Do not claim the price beats any specific market figure — frame it as a great value without inventing a comparison you can't back up.
- Write only the words to be spoken aloud: no headings, bullet points, markdown, stage directions, or speaker labels. Keep it tight: about 140 words, which lands near 60 seconds when spoken. Do not pad to fill time — a punchy 55 seconds beats a sagging 70.`;

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
