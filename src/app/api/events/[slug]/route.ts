import { NextResponse } from "next/server";
import { readEvents, writeEvents } from "@/lib/events-store";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = readEvents().find((e) => e.slug === slug);
  if (!event) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(event);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const patch = await req.json();
  const events = readEvents();
  const idx = events.findIndex((e) => e.slug === slug);
  if (idx < 0) return NextResponse.json({ error: "not found" }, { status: 404 });
  events[idx] = { ...events[idx], ...patch };
  writeEvents(events);
  return NextResponse.json(events[idx]);
}
