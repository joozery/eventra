import Image from "next/image";
import Link from "next/link";
import { popularEvents } from "@/lib/mock-data";

export function PromotedEvents() {
  const events = popularEvents.slice(0, 5);

  return (
    <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
      <h2 className="mb-5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        อีเวนต์แนะนำ
      </h2>

      <div className="grid grid-cols-3 gap-4 sm:grid-cols-5">
        {events.map((event) => (
          <Link
            key={event.id}
            href={`/events/${event.slug}`}
            className="group relative aspect-[212/265] overflow-hidden rounded-md shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-black/10"
          >
            {event.image && (
              <Image
                src={event.image}
                alt={event.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(min-width: 640px) 20vw, 33vw"
              />
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
