import { NextResponse } from "next/server";
import { readEvents, writeEvents } from "@/lib/events-store";

export async function GET() {
  return NextResponse.json(readEvents());
}

export async function POST(req: Request) {
  const event = await req.json();
  const events = readEvents();
  const idx = events.findIndex((e) => e.slug === event.slug);
  if (idx >= 0) events[idx] = event;
  else events.unshift(event);
  writeEvents(events);
  return NextResponse.json(event, { status: 201 });
}
