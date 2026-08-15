import fs from "fs";
import path from "path";
import type { UserEvent } from "./user-events";

const FILE = path.join(process.cwd(), "data", "user-events.json");

export function readEvents(): UserEvent[] {
  try {
    if (!fs.existsSync(FILE)) return [];
    return JSON.parse(fs.readFileSync(FILE, "utf-8"));
  } catch {
    return [];
  }
}

export function writeEvents(events: UserEvent[]): void {
  const dir = path.dirname(FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(events, null, 2), "utf-8");
}
