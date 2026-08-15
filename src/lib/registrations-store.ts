import fs from "fs";
import path from "path";

export type RegStatus = "confirmed" | "pending" | "waitlist" | "cancelled";

export type Registration = {
  id: string;
  eventSlug: string;
  submittedAt: string;
  status: RegStatus;
  answers: Record<string, string | string[]>; // fieldId → value(s)
  // Convenience fields extracted from answers for display
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  position?: string;
  fileUrls?: Record<string, string>; // fieldId → filename
};

const FILE = path.join(process.cwd(), "data", "registrations.json");

function read(): Record<string, Registration[]> {
  try {
    if (!fs.existsSync(FILE)) return {};
    return JSON.parse(fs.readFileSync(FILE, "utf-8"));
  } catch {
    return {};
  }
}

function write(data: Record<string, Registration[]>) {
  const dir = path.dirname(FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2), "utf-8");
}

export function getRegistrations(slug: string): Registration[] {
  return read()[slug] ?? [];
}

export function addRegistration(reg: Registration): void {
  const all = read();
  if (!all[reg.eventSlug]) all[reg.eventSlug] = [];
  all[reg.eventSlug].unshift(reg);
  write(all);
}

export function updateRegistrationStatus(slug: string, id: string, status: RegStatus): Registration | null {
  const all = read();
  const list = all[slug] ?? [];
  const idx  = list.findIndex((r) => r.id === id);
  if (idx < 0) return null;
  list[idx] = { ...list[idx], status };
  all[slug] = list;
  write(all);
  return list[idx];
}
