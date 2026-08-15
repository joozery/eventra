import { NextResponse } from "next/server";
import {
  getRegistrations,
  addRegistration,
  updateRegistrationStatus,
  type Registration,
  type RegStatus,
} from "@/lib/registrations-store";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  return NextResponse.json(getRegistrations(slug));
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const body = (await req.json()) as Omit<Registration, "id" | "eventSlug" | "submittedAt" | "status">;
  const reg: Registration = {
    ...body,
    id:          `REG-${slug.slice(0, 3).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`,
    eventSlug:   slug,
    submittedAt: new Date().toISOString(),
    status:      "pending",
  };
  addRegistration(reg);
  return NextResponse.json(reg, { status: 201 });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const { id, status } = (await req.json()) as { id: string; status: RegStatus };
  const updated = updateRegistrationStatus(slug, id, status);
  if (!updated) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(updated);
}
