"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Crown,
  Edit,
  ExternalLink,
  MapPin,
  PartyPopper,
  Settings,
  Ticket,
  Users,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { EventSchedule } from "@/components/events/event-schedule";
import { EventGallery } from "@/components/events/event-gallery";
import { getUserEventBySlug, type UserEvent } from "@/lib/user-events";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const PACKAGE_LABELS: Record<string, { label: string; color: string }> = {
  starter: { label: "Starter", color: "from-slate-500 to-gray-600" },
  growth: { label: "Growth", color: "from-indigo-500 to-purple-600" },
  pro: { label: "Pro", color: "from-amber-500 to-orange-500" },
};

const ORGANIZER_GRADIENTS = [
  "from-indigo-500 to-purple-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-teal-500 to-emerald-600",
  "from-sky-500 to-blue-600",
];

function organizerGradient(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) & 0xffff;
  return ORGANIZER_GRADIENTS[hash % ORGANIZER_GRADIENTS.length];
}

export default function OrganizerEventPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [event, setEvent] = useState<UserEvent | null | "loading">("loading");

  useEffect(() => {
    getUserEventBySlug(slug).then(setEvent);
  }, [slug]);

  if (event === "loading") {
    return (
      <div className="flex min-h-full flex-1 flex-col">
        <Navbar />
        <main className="flex-1">
          <div className="mx-auto max-w-7xl animate-pulse px-4 py-8 sm:px-6">
            <div className="h-64 rounded-2xl bg-muted" />
            <div className="mt-6 h-8 w-64 rounded-xl bg-muted" />
          </div>
        </main>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex min-h-full flex-1 flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center py-24">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">ไม่พบงานนี้</p>
            <Button onClick={() => router.push("/organizer/events/create")} className="mt-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 hover:bg-none">
              สร้างงานใหม่
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const pkg = event.packageTier ? PACKAGE_LABELS[event.packageTier] : null;

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Navbar />

      {/* Organizer toolbar */}
      <div className="border-b border-border bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="size-5 text-white" />
            <div>
              <p className="text-sm font-semibold text-white">งานของฉัน — แดชบอร์ดผู้จัด</p>
              <p className="text-xs text-indigo-200">
                {event.status === "active" ? "เผยแพร่แล้ว · มองเห็นสาธารณะ" : "ร่าง · ยังไม่เผยแพร่"}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {pkg && (
              <span className={cn("flex items-center gap-1.5 rounded-full bg-gradient-to-r px-3 py-1 text-xs font-semibold text-white", pkg.color)}>
                <Crown className="size-3" />{pkg.label}
              </span>
            )}
            <Link
              href="/organizer/events/create"
              className="flex h-8 items-center gap-1.5 rounded-full bg-white/15 px-3 text-xs font-medium text-white hover:bg-white/25 transition-colors"
            >
              <Edit className="size-3.5" />แก้ไข
            </Link>
            <Link
              href="/organizer/package"
              className="flex h-8 items-center gap-1.5 rounded-full bg-white/15 px-3 text-xs font-medium text-white hover:bg-white/25 transition-colors"
            >
              <Settings className="size-3.5" />แพ็กเกจ
            </Link>
          </div>
        </div>
      </div>

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 pb-28 sm:px-6 lg:px-8 lg:pb-8">
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            กลับไปหน้า Events
          </Link>

          <div className="mt-5 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
            <div>
              {/* Cover image */}
              <div className={`relative flex aspect-[16/9] items-end overflow-hidden rounded-2xl bg-gradient-to-br p-5 ${event.gradient}`}>
                {event.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={event.image}
                    alt={event.title}
                    className="absolute inset-0 size-full object-cover"
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
                  {event.endDate ? `${event.date} — ${event.endDate}` : `${event.date} · ${event.time}`}
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

              {/* Organizer pill */}
              <div className="group mt-5 flex w-full items-center gap-3.5 rounded-2xl border border-border bg-card p-3.5">
                <div className={`flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br text-base font-bold text-white shadow-sm ${organizerGradient(event.organizer)}`}>
                  {event.organizerLogo
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={event.organizerLogo} alt={event.organizer} className="size-full object-cover" />
                    : event.organizer.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-muted-foreground">ผู้จัดงาน</p>
                  <p className="truncate text-sm font-semibold text-foreground">{event.organizer}</p>
                </div>
                <span className="flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-medium text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
                  <Crown className="size-3" />คุณ
                </span>
              </div>

              {/* Description */}
              <div className="mt-8 border-t border-border pt-8">
                <h2 className="text-lg font-semibold text-foreground">รายละเอียดงาน</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {event.description ||
                    `ร่วมเป็นส่วนหนึ่งของ "${event.title}" งานอีเวนต์หมวด${event.category}ที่ไม่ควรพลาด จัดขึ้น${event.endDate ? `วันที่ ${event.date} — ${event.endDate}` : `วันที่ ${event.date} เวลา ${event.time}`} ณ ${event.location} เตรียมพบกับบรรยากาศสุดพิเศษ`}
                </p>
                {event.gallery && event.gallery.length > 0 && (
                  <EventGallery images={event.gallery} title={event.title} />
                )}
              </div>

              {/* Schedule */}
              {event.schedule && event.schedule.length > 0 && (
                <div className="mt-8 border-t border-border pt-8">
                  <h2 className="text-lg font-semibold text-foreground">ตารางกิจกรรม</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    กำหนดการ {event.schedule.length} วัน
                  </p>
                  <div className="mt-4">
                    <EventSchedule schedule={event.schedule} />
                  </div>
                </div>
              )}

              {/* Map */}
              <div className="mt-8 border-t border-border pt-8">
                <h2 className="text-lg font-semibold text-foreground">สถานที่จัดงาน</h2>
                <div className="mt-3 flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
                    <MapPin className="size-4.5" />
                  </span>
                  <span className="text-sm font-medium text-foreground">{event.location}</span>
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
            </div>

            {/* Sidebar */}
            <div className="lg:sticky lg:top-24 lg:self-start space-y-4">
              {/* Stats */}
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="mb-4 text-sm font-semibold text-foreground">สถิติงาน</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "ยอดขายบัตร", value: "0", icon: Ticket, color: "text-indigo-600" },
                    { label: "ผู้เข้าร่วม", value: "0", icon: Users, color: "text-purple-600" },
                  ].map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="rounded-xl bg-muted/40 p-3 text-center">
                      <Icon className={cn("mx-auto mb-1 size-5", color)} />
                      <p className="text-xl font-bold text-foreground">{value}</p>
                      <p className="text-[11px] text-muted-foreground">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ticket preview */}
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">ตัวอย่างบัตร</h3>
                  <Link
                    href={`/events/${event.slug}`}
                    className="flex items-center gap-1 text-xs text-indigo-600 hover:underline"
                    target="_blank"
                  >
                    ดูหน้าสาธารณะ <ExternalLink className="size-3" />
                  </Link>
                </div>
                {event.price === 0 ? (
                  <div className="flex flex-col divide-y divide-border overflow-hidden rounded-xl border border-border">
                    <div className="flex items-center justify-between px-4 py-3">
                      <span className="text-sm font-medium text-foreground">บัตรฟรี</span>
                      <span className="text-sm font-bold text-foreground">ฟรี</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col divide-y divide-border overflow-hidden rounded-xl border border-border">
                    {[
                      { name: "Early Bird", price: Math.round((event.price * 0.8) / 10) * 10 },
                      { name: "Regular", price: event.price },
                      { name: "VIP", price: event.price * 2 },
                    ].map((t) => (
                      <div key={t.name} className="flex items-center justify-between px-4 py-3">
                        <span className="text-sm font-medium text-foreground">{t.name}</span>
                        <span className="text-sm font-bold text-foreground">฿{t.price.toLocaleString("th-TH")}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick actions */}
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="mb-3 text-sm font-semibold text-foreground">การจัดการ</h3>
                <div className="flex flex-col gap-2">
                  {[
                    { label: "แชร์งานไปยัง Social", href: "#", icon: ExternalLink },
                    { label: "ดาวน์โหลด QR Check-in", href: "#", icon: Ticket },
                    { label: "อัปเกรดแพ็กเกจ", href: `/organizer/package?slug=${event.slug}`, icon: Crown },
                  ].map(({ label, href, icon: Icon }) => (
                    <Link
                      key={label}
                      href={href}
                      className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Icon className="size-4 text-muted-foreground" />
                        {label}
                      </span>
                      <ChevronRight className="size-4 text-muted-foreground/60" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
