import type { MockEvent } from "./mock-data";

export type UserEvent = MockEvent & {
  description?: string;
  organizerLogo?: string;
  createdAt: string;
  status: "draft" | "active";
  packageTier?: "starter" | "growth" | "pro";
  packagePaidAt?: string;
};

export async function getUserEvents(): Promise<UserEvent[]> {
  try {
    const res = await fetch("/api/events", { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function getUserEventBySlug(slug: string): Promise<UserEvent | null> {
  try {
    const res = await fetch(`/api/events/${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function saveUserEvent(event: UserEvent): Promise<void> {
  await fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  });
}

export async function updateUserEvent(slug: string, patch: Partial<UserEvent>): Promise<void> {
  await fetch(`/api/events/${slug}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
}
