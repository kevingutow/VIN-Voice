export type FormState = {
  year: string;
  make: string;
  model: string;
  trim: string;
  mileage: string;
  price: string;
  features: string;
};

export const initialForm: FormState = {
  year: "",
  make: "",
  model: "",
  trim: "",
  mileage: "",
  price: "",
  features: "",
};

export const BUILDER_FORM_STORAGE_KEY = "vinvoice:builder-form";

export function isFormState(value: unknown): value is FormState {
  if (typeof value !== "object" || value === null) return false;
  const required = ["year", "make", "model", "trim", "mileage", "price", "features"];
  return required.every((key) => typeof (value as Record<string, unknown>)[key] === "string");
}
