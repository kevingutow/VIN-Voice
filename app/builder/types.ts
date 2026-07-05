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
