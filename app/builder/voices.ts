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

export const DEFAULT_VOICE_ID = VOICE_OPTIONS[0].id;
