import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Calendar,
  MapPin,
  PartyPopper,
  Users,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { EventCard } from "@/components/event/event-card";
import { TicketSelector } from "@/components/events/ticket-selector";
import { MerchandiseSection } from "@/components/events/merchandise-section";
import { EventGallery } from "@/components/events/event-gallery";
import { allEvents, getEventBySlug, slugify } from "@/lib/mock-data";

export function generateStaticParams() {
  return allEvents.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) return {};
  return {
    title: `${event.title} — EVENTRA`,
    description: `${event.title} วันที่ ${event.date} ที่ ${event.location}`,
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) notFound();

  const relatedEvents = allEvents
    .filter((e) => e.category === event.category && e.id !== event.id)
    .slice(0, 4);

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            กลับไปหน้าค้นหา Event
          </Link>

          <div className="mt-5 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
            <div>
              <div
                className={`relative flex aspect-[16/9] items-end overflow-hidden rounded-2xl bg-gradient-to-br p-5 ${event.gradient}`}
              >
                {event.image ? (
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    priority
                    className="object-cover"
                    sizes="(min-width: 1024px) 66vw, 100vw"
                  />
                ) : (
                  <>
                    <PartyPopper className="pointer-events-none absolute -right-8 -bottom-8 size-40 text-white/10" />
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.12)_1px,transparent_0)] bg-[length:20px_20px]" />
                  </>
                )}
                <span className="relative rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-indigo-700 backdrop-blur-sm">
                  {event.category}
                </span>
              </div>

              <h1 className="mt-6 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {event.title}
              </h1>

              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar className="size-4 shrink-0" />
                  {event.date} · {event.time}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-4 shrink-0" />
                  {event.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="size-4 shrink-0" />
                  {event.attendees.toLocaleString("th-TH")} เข้าร่วม
                </span>
              </div>

              <Link
                href={`/organizers/${slugify(event.organizer)}`}
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Building2 className="size-3.5" />
                จัดโดย {event.organizer}
              </Link>

              <div className="mt-8 border-t border-border pt-8">
                <h2 className="text-lg font-semibold text-foreground">
                  รายละเอียดงาน
                </h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  ร่วมเป็นส่วนหนึ่งของ &ldquo;{event.title}&rdquo; งานอีเวนต์หมวด
                  {event.category}ที่ไม่ควรพลาด จัดขึ้นวันที่ {event.date}{" "}
                  เวลา {event.time} ณ {event.location} เตรียมพบกับบรรยากาศสุดพิเศษ
                  พร้อมกิจกรรมที่คัดสรรมาเพื่อผู้เข้าร่วมงานทุกคนโดยเฉพาะ
                  จองบัตรตั้งแต่วันนี้เพื่อไม่ให้พลาดที่นั่ง
                </p>
                {event.gallery && event.gallery.length > 0 && (
                  <EventGallery images={event.gallery} title={event.title} />
                )}
              </div>

              <div className="mt-8 border-t border-border pt-8">
                <h2 className="text-lg font-semibold text-foreground">
                  สถานที่จัดงาน
                </h2>
                <div className="mt-3 flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
                    <MapPin className="size-4.5" />
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {event.location}
                  </span>
                </div>
                <div className="mt-3 overflow-hidden rounded-xl border border-border">
                  <iframe
                    src={`https://www.google.com/maps?q=${encodeURIComponent(event.location)}&output=embed`}
                    className="h-64 w-full sm:h-80"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`แผนที่ ${event.location}`}
                  />
                </div>
              </div>

              {event.merchandise && event.merchandise.length > 0 && (
                <MerchandiseSection items={event.merchandise} slug={event.slug} />
              )}
            </div>

            <div className="lg:sticky lg:top-24 lg:self-start">
              <TicketSelector slug={event.slug} basePrice={event.price} />
            </div>
          </div>

          {relatedEvents.length > 0 && (
            <div className="mt-16 border-t border-border pt-10">
              <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Event ที่เกี่ยวข้อง
              </h2>
              <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                {relatedEvents.map((related) => (
                  <EventCard key={related.id} event={related} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
