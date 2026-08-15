import fs from "fs";
import path from "path";

export type FormFieldType =
  | "text" | "email" | "phone" | "textarea"
  | "select" | "radio" | "checkbox" | "date" | "number" | "file";

export type FormStep = { id: string; title: string };

export type FormField = {
  id: string;
  type: FormFieldType;
  label: string;
  placeholder: string;
  required: boolean;
  options: string[];
  width: "full" | "half";
  accept?: string;
  maxSizeMb?: number;
  stepId?: string;   // undefined = belongs to first step (backward compat)
};

export type FormConfig = {
  eventSlug: string;
  title: string;
  description: string;
  steps?: FormStep[];  // undefined/empty = single-step form
  fields: FormField[];
  submitLabel: string;
  coverImage?: string;
  updatedAt: string;
};

const FILE = path.join(process.cwd(), "data", "forms.json");

function read(): Record<string, FormConfig> {
  try {
    if (!fs.existsSync(FILE)) return {};
    return JSON.parse(fs.readFileSync(FILE, "utf-8"));
  } catch {
    return {};
  }
}

function write(data: Record<string, FormConfig>) {
  const dir = path.dirname(FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2), "utf-8");
}

export function getForm(slug: string): FormConfig | null {
  return read()[slug] ?? null;
}

export function saveForm(config: FormConfig): void {
  const all = read();
  all[config.eventSlug] = { ...config, updatedAt: new Date().toISOString() };
  write(all);
}
