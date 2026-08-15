import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, Users } from "lucide-react";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getEventBySlug } from "@/lib/mock-data";
import { readEvents } from "@/lib/events-store";
import { getForm } from "@/lib/forms-store";
import { EventRegisterForm } from "@/components/events/event-register-form";

function getAnyEvent(slug: string) {
  return getEventBySlug(slug) ?? readEvents().find((e) => e.slug === slug) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ev = getAnyEvent(slug);
  if (!ev) return { title: "ลงทะเบียน" };
  return { title: `ลงทะเบียน — ${ev.title}` };
}

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ev = getAnyEvent(slug);
  if (!ev) notFound();

  const formConfig = getForm(slug);
  const coverImage = formConfig?.coverImage ?? ev.image ?? null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-muted/30 pb-20">

        {/* ── Hero banner ── */}
        <div className="relative h-56 w-full overflow-hidden sm:h-72 md:h-80">
          {coverImage ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={coverImage}
              alt={ev.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className={`h-full w-full bg-gradient-to-br ${ev.gradient}`} />
          )}
          {/* dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

          {/* back button */}
          <div className="absolute left-4 top-4 sm:left-6">
            <Link
              href={`/events/${slug}`}
              className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/25"
            >
              <ArrowLeft className="size-3.5" />
              กลับหน้างาน
            </Link>
          </div>

          {/* event info over image */}
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-6 sm:px-6">
            <span className="mb-2 inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
              {ev.category}
            </span>
            <h1 className="text-xl font-bold leading-tight text-white drop-shadow sm:text-2xl md:text-3xl">
              {ev.title}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="flex items-center gap-1 text-xs text-white/80">
                <Calendar className="size-3.5 shrink-0" />
                {ev.date}{ev.time ? ` · ${ev.time}` : ""}
              </span>
              <span className="flex items-center gap-1 text-xs text-white/80">
                <MapPin className="size-3.5 shrink-0" />
                {ev.location}
              </span>
              <span className="flex items-center gap-1 text-xs text-white/80">
                <Users className="size-3.5 shrink-0" />
                {ev.organizer}
              </span>
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="mx-auto max-w-2xl px-4 pt-6 sm:px-6">
          <div>

            {/* ── Form card ── */}
            <div className="rounded-xl bg-background">
              <div className="border-b border-border px-6 py-5">
                <h2 className="text-base font-bold text-foreground">
                  {formConfig?.title ?? "ลงทะเบียนเข้าร่วมงาน"}
                </h2>
                {formConfig?.description && (
                  <p className="mt-1 text-sm text-muted-foreground">{formConfig.description}</p>
                )}
              </div>
              <div className="px-6 py-6">
                <EventRegisterForm slug={slug} eventTitle={ev.title} />
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
