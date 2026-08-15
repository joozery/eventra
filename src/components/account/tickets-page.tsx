"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CalendarDays,
  Camera,
  MapPin,
  QrCode,
  ShieldCheck,
  Ticket,
  User,
  ArrowUpRight,
  Download,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Types ──────────────────────────────────────────────── */

type SessionUser = {
  name: string;
  email: string;
  createdAt: string | null;
  avatarUrl: string | null;
};

type TicketStatus = "upcoming" | "past" | "cancelled";

type MockTicket = {
  id: string;
  eventTitle: string;
  eventSlug: string;
  category: string;
  date: string;
  time: string;
  location: string;
  gradient: string;
  ticketType: string;
  qty: number;
  totalPrice: number;
  status: TicketStatus;
  purchasedAt: string;
};

/* ─── Mock data ──────────────────────────────────────────── */

const TICKETS: MockTicket[] = [
  {
    id: "EVT-2026-001234",
    eventTitle: "Bangkok Music Festival 2026",
    eventSlug: "bangkok-music-festival",
    category: "ดนตรี",
    date: "12–13 ก.ย. 2026",
    time: "17:00 น.",
    location: "Impact Arena, เมืองทองธานี",
    gradient: "from-indigo-500 to-purple-600",
    ticketType: "บัตรทั่วไป",
    qty: 2,
    totalPrice: 3000,
    status: "upcoming",
    purchasedAt: "2026-06-15",
  },
  {
    id: "EVT-2027-005678",
    eventTitle: "Maroon 5 Asia 2027 in Bangkok",
    eventSlug: "maroon-5-asia-2027-in-bangkok",
    category: "ดนตรี",
    date: "14 ก.พ. 2027",
    time: "19:00 น.",
    location: "ราชมังคลากีฬาสถาน, กรุงเทพฯ",
    gradient: "from-rose-500 to-pink-600",
    ticketType: "VIP Standing",
    qty: 1,
    totalPrice: 4500,
    status: "upcoming",
    purchasedAt: "2026-07-20",
  },
  {
    id: "EVT-2025-009900",
    eventTitle: "Thailand Tech Summit 2025",
    eventSlug: "thailand-tech-summit",
    category: "เทคโนโลยี",
    date: "20 พ.ย. 2025",
    time: "09:00 น.",
    location: "True ICON HALL, ไอคอนสยาม",
    gradient: "from-sky-500 to-blue-600",
    ticketType: "General Admission",
    qty: 1,
    totalPrice: 890,
    status: "past",
    purchasedAt: "2025-10-05",
  },
  {
    id: "EVT-2025-004422",
    eventTitle: "Songkran Music & Arts Festival",
    eventSlug: "songkran-festival-2025",
    category: "ดนตรี",
    date: "13–15 เม.ย. 2025",
    time: "14:00 น.",
    location: "One Bangkok, ใจกลางกรุงเทพฯ",
    gradient: "from-cyan-500 to-teal-500",
    ticketType: "บัตรทั่วไป",
    qty: 3,
    totalPrice: 2700,
    status: "past",
    purchasedAt: "2025-02-20",
  },
];

const STATUS_META: Record<
  TicketStatus,
  { label: string; dot: string; cls: string; bg: string }
> = {
  upcoming:  { label: "กำลังมา",     dot: "bg-emerald-500", cls: "text-emerald-700", bg: "bg-emerald-50"  },
  past:      { label: "ผ่านมาแล้ว",  dot: "bg-slate-400",   cls: "text-slate-500",   bg: "bg-slate-100"   },
  cancelled: { label: "ยกเลิกแล้ว",  dot: "bg-red-400",     cls: "text-red-600",     bg: "bg-red-50"      },
};

/* ─── QR placeholder ─────────────────────────────────────── */

function QrPlaceholder({ dim }: { dim?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/40 text-muted-foreground/40", dim ?? "size-16")}>
      <QrCode className="size-7" strokeWidth={1.2} />
    </div>
  );
}

/* ─── Ticket card ────────────────────────────────────────── */

function TicketCard({ t }: { t: MockTicket }) {
  const meta = STATUS_META[t.status];

  return (
    <div className="group relative overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-shadow hover:shadow-md">

      {/* Colored top strip */}
      <div className={cn("h-1.5 w-full bg-gradient-to-r", t.gradient)} />

      <div className="flex flex-col gap-0 sm:flex-row">

        {/* Left: event info */}
        <div className="flex flex-1 flex-col gap-3 p-5">
          {/* Category + status */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              {t.category}
            </span>
            <span className={cn("flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold", meta.bg, meta.cls)}>
              <span className={cn("size-1.5 rounded-full", meta.dot)} />
              {meta.label}
            </span>
          </div>

          {/* Title */}
          <div>
            <h3 className="text-base font-semibold leading-snug text-foreground">
              {t.eventTitle}
            </h3>
          </div>

          {/* Meta */}
          <div className="flex flex-col gap-1.5">
            <span className="flex items-center gap-2 text-xs text-muted-foreground">
              <CalendarDays className="size-3.5 shrink-0 text-muted-foreground/60" />
              {t.date} · {t.time}
            </span>
            <span className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="size-3.5 shrink-0 text-muted-foreground/60" />
              {t.location}
            </span>
          </div>

          {/* Ticket details row */}
          <div className="mt-1 flex flex-wrap items-center gap-4 border-t border-border/60 pt-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground/60">ประเภทบัตร</span>
              <span className="text-xs font-semibold text-foreground">{t.ticketType}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground/60">จำนวน</span>
              <span className="text-xs font-semibold text-foreground">{t.qty} ใบ</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground/60">ราคารวม</span>
              <span className="text-xs font-semibold text-foreground">
                ฿{t.totalPrice.toLocaleString("th-TH")}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground/60">เลขบัตร</span>
              <span className="font-mono text-xs text-muted-foreground">{t.id}</span>
            </div>
          </div>
        </div>

        {/* Divider (dashed perforated edge) */}
        <div className="relative flex items-stretch">
          <div className="hidden w-px border-l border-dashed border-border/80 sm:block" />
          {/* Notch top */}
          <div className="absolute left-1/2 top-0 hidden size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border bg-background sm:block" />
          {/* Notch bottom */}
          <div className="absolute bottom-0 left-1/2 hidden size-3 -translate-x-1/2 translate-y-1/2 rounded-full border border-border bg-background sm:block" />
        </div>

        {/* Right: QR + actions */}
        <div className="flex flex-row items-center justify-between gap-4 p-5 sm:w-44 sm:flex-col sm:items-center sm:justify-center">
          <QrPlaceholder dim="size-20" />

          <div className="flex flex-col items-center gap-2 sm:w-full">
            {t.status === "upcoming" ? (
              <>
                <Link
                  href={`/events/${t.eventSlug}`}
                  className="flex w-full items-center justify-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                >
                  ดูงาน <ArrowUpRight className="size-3" />
                </Link>
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
                >
                  <Download className="size-3" />
                  บันทึก PDF
                </button>
              </>
            ) : (
              <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground/60">
                <CheckCircle2 className="size-3.5" />
                ใช้งานแล้ว
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Sidebar nav ────────────────────────────────────────── */

const NAV = [
  { href: "/account",         label: "ข้อมูลส่วนตัว",  icon: User       },
  { href: "/account",         label: "ความปลอดภัย",    icon: ShieldCheck },
  { href: "/account/tickets", label: "บัตรของฉัน",     icon: Ticket     },
];

/* ─── Main ───────────────────────────────────────────────── */

export function TicketsPage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (!d.user) { router.push("/auth/login"); return; }
        setUser(d.user);
      })
      .finally(() => setLoading(false));
  }, [router]);

  const filtered = useMemo(() => {
    if (filter === "all") return TICKETS;
    return TICKETS.filter((t) => t.status === filter);
  }, [filter]);

  const counts = useMemo(() => ({
    all:      TICKETS.length,
    upcoming: TICKETS.filter((t) => t.status === "upcoming").length,
    past:     TICKETS.filter((t) => t.status === "past").length,
  }), []);

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <div className="h-48 animate-pulse bg-muted" />
        <div className="mx-auto max-w-4xl space-y-3 px-4 py-8 sm:px-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-36 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (!user) return null;

  const initials = user.name.split(" ").map((w) => w.charAt(0)).join("").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-muted/30">

      {/* Hero banner */}
      <div className="border-b border-border bg-background">
        <div className="mx-auto max-w-4xl px-4 pb-6 pt-8 sm:px-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-5">
            {/* Avatar */}
            <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted sm:size-[88px]">
              {user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatarUrl} alt={user.name} className="size-full object-cover" />
              ) : (
                <span className="flex size-full items-center justify-center text-3xl font-bold text-foreground sm:text-4xl">
                  {initials}
                </span>
              )}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-xl font-bold text-foreground sm:text-2xl">{user.name}</h1>
              <p className="mt-0.5 text-sm text-muted-foreground">{user.email}</p>
              <p className="mt-1.5 flex items-center justify-center gap-1.5 text-xs text-muted-foreground sm:justify-start">
                <Ticket className="size-3" />
                {counts.upcoming} บัตรที่กำลังมา · {counts.past} ที่ผ่านมา
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:gap-6">

          {/* Sidebar */}
          <aside className="w-full shrink-0 lg:w-48">
            <nav className="flex flex-row gap-1 rounded-lg border border-border bg-card p-1.5 lg:flex-col">
              {NAV.map(({ href, label, icon: Icon }) => {
                const isActive = label === "บัตรของฉัน";
                return (
                  <Link
                    key={label}
                    href={href}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors lg:justify-start",
                      isActive
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span className="hidden sm:inline lg:inline">{label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">

            {/* Header + filter tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-foreground">บัตรของฉัน</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">{TICKETS.length} รายการทั้งหมด</p>
              </div>
              <div className="flex items-center gap-0.5 rounded-md border border-border bg-card p-1">
                {(["all", "upcoming", "past"] as const).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFilter(key)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                      filter === key
                        ? "bg-foreground text-background shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {{ all: "ทั้งหมด", upcoming: "กำลังมา", past: "ผ่านมาแล้ว" }[key]}
                    <span className={cn(
                      "rounded-full px-1.5 py-px text-[10px] font-semibold tabular-nums",
                      filter === key ? "bg-background/20 text-background" : "bg-muted text-muted-foreground",
                    )}>
                      {counts[key]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Ticket list */}
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center gap-4 rounded-lg border border-border bg-card py-20 text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                  <Ticket className="size-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">ไม่มีบัตรในหมวดนี้</p>
                  <p className="mt-1 text-xs text-muted-foreground">ลองเปลี่ยน filter หรือไปดูงานที่น่าสนใจ</p>
                </div>
                <Link
                  href="/events"
                  className="flex items-center gap-1.5 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  ดูงานทั้งหมด <ArrowUpRight className="size-3.5" />
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filtered.map((t) => <TicketCard key={t.id} t={t} />)}
              </div>
            )}

            {/* CTA */}
            <div className="flex items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-card/50 py-6">
              <div className="flex size-8 items-center justify-center rounded-full bg-muted">
                <Clock className="size-4 text-muted-foreground" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm font-medium text-foreground">อยากไปงานใหม่?</p>
                <p className="text-xs text-muted-foreground">ค้นหาอีเวนต์ที่น่าสนใจและซื้อบัตรได้เลย</p>
              </div>
              <Link
                href="/events"
                className="flex shrink-0 items-center gap-1.5 rounded-md bg-foreground px-4 py-2 text-xs font-medium text-background transition-opacity hover:opacity-80"
              >
                ดูงาน <ArrowUpRight className="size-3.5" />
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
