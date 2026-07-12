export type VoiceOption = {
  id: string;
  label: string;
};

export const VOICE_OPTIONS: VoiceOption[] = [
  { id: "iP95p4xoKVk53GoZ742B", label: "Chris - Friendly" },
  { id: "Gubgw9l4dtIoQA9YZHgx", label: "Brian - Deep & Calm" },
  { id: "IXa3pM2v3YjF2UVeGPGR", label: "Chuck - Regular Guy" },
  { id: "EST9Ui6982FZPSi7gCHi", label: "Elise - Warm" },
  { id: "lLgB6ZeIe84FSJa9pO1a", label: "Jessica - Instructive" },
  { id: "uYXf8XasLslADfZ2MB4u", label: "Hope - Bubbly" },
];

export const DEFAULT_VOICE_ID = VOICE_OPTIONS[0].id; // Chris - Friendly

export const VALID_VOICE_IDS = new Set(VOICE_OPTIONS.map((voice) => voice.id));

const BRIAN_DEEP_CALM = "Gubgw9l4dtIoQA9YZHgx";
const CHUCK_REGULAR_GUY = "IXa3pM2v3YjF2UVeGPGR";

// Voice-pairing heuristics. Unlike the script prompt (where brand
// recognition is deliberately left to the model), a small hardcoded list
// is fine here: this only picks the pre-selected default in the voice
// picker, the user can always override, and a miss just means the
// standard default. Keep entries lowercase.
const LUXURY_MAKES = new Set([
  "mercedes-benz",
  "mercedes",
  "benz",
  "bmw",
  "porsche",
  "lexus",
  "audi",
  "jaguar",
  "land rover",
  "range rover",
  "cadillac",
  "genesis",
  "infiniti",
  "acura",
  "tesla",
  "maserati",
  "bentley",
  "rolls-royce",
  "rolls royce",
  "aston martin",
  "lincoln",
  "volvo",
  "alfa romeo",
]);

const CRUISER_MOTO_MAKES = new Set(["harley-davidson", "harley davidson", "harley", "indian"]);

const TRUCK_MODEL_HINTS = [
  /\bf-?[123]50\b/,
  /\bsilverado\b/,
  /\bsierra\b/,
  /\btundra\b/,
  /\btacoma\b/,
  /\btitan\b/,
  /\bram\b/,
  /\branger\b/,
  /\bcolorado\b/,
  /\bcanyon\b/,
  /\bfrontier\b/,
  /\bgladiator\b/,
  /\bridgeline\b/,
  /\bmaverick\b/,
  /\bsuper ?duty\b/,
];

/**
 * Suggest a default voice that matches the vehicle's character:
 * luxury makes get the deep/calm read, trucks and cruiser bikes get the
 * regular-guy read, everything else keeps the friendly default.
 */
export function suggestVoiceId(make: string, model: string): string {
  const normalizedMake = make.trim().toLowerCase();
  const normalizedModel = model.trim().toLowerCase();

  if (LUXURY_MAKES.has(normalizedMake)) return BRIAN_DEEP_CALM;
  if (CRUISER_MOTO_MAKES.has(normalizedMake)) return CHUCK_REGULAR_GUY;
  if (normalizedMake === "ram" || TRUCK_MODEL_HINTS.some((re) => re.test(normalizedModel))) {
    return CHUCK_REGULAR_GUY;
  }
  return DEFAULT_VOICE_ID;
}
