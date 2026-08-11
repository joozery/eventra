import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, PartyPopper, Ticket } from "lucide-react";
import type { MockEvent } from "@/lib/mock-data";

export function EventCard({ event }: { event: MockEvent }) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-lg hover:shadow-indigo-950/5">
      <Link
        href={`/events/${event.slug}`}
        aria-label={event.title}
        className="absolute inset-0 z-10"
      />

      <div
        className={`relative flex aspect-[212/265] items-end overflow-hidden bg-gradient-to-br p-4 ${event.gradient}`}
      >
        {event.image ? (
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(min-width: 1024px) 20vw, (min-width: 640px) 45vw, 75vw"
          />
        ) : (
          <>
            <PartyPopper className="pointer-events-none absolute -right-6 -bottom-6 size-28 text-white/10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.12)_1px,transparent_0)] bg-[length:16px_16px]" />
          </>
        )}
        <span className="relative rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-indigo-700 backdrop-blur-sm">
          {event.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <h3 className="line-clamp-1 text-sm font-semibold text-foreground group-hover:text-primary">
          {event.title}
        </h3>
        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="size-3.5 shrink-0" />
            {event.date} · {event.time}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="size-3.5 shrink-0" />
            <span className="truncate">{event.location}</span>
          </span>
        </div>

        <div className="mt-1 flex items-center justify-between gap-3 border-t border-border pt-2">
          <span className="text-sm font-bold text-foreground">
            ฿{event.price.toLocaleString("th-TH")}
          </span>
          <Link
            href={`/checkout/${event.slug}`}
            className="relative z-20 inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-black px-3 text-xs font-medium text-white transition-opacity hover:opacity-90"
          >
            <Ticket className="size-3.5" />
            ซื้อตั๋ว
          </Link>
        </div>
      </div>
    </div>
  );
}
