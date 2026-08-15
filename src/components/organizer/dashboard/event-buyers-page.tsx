"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Mail,
  MapPin,
  PartyPopper,
  Phone,
  Search,
  Ticket,
  Users,
  XCircle,
} from "lucide-react";
import { getUserEventBySlug, type UserEvent } from "@/lib/user-events";
import { getBuyersForEvent, type Buyer, type BuyerStatus } from "@/lib/mock-buyers";
import { EventSubNav } from "./event-sub-nav";
import { cn } from "@/lib/utils";

/* ─── Status config ──────────────────────────────────────── */

const STATUS_META: Record<BuyerStatus, { label: string; icon: React.ElementType; cls: string; bg: string }> = {
  confirmed: { label: "ยืนยันแล้ว",  icon: CheckCircle2, cls: "text-emerald-700", bg: "bg-emerald-50"  },
  pending:   { label: "รอดำเนินการ", icon: Clock,         cls: "text-amber-700",   bg: "bg-amber-50"    },
  cancelled: { label: "ยกเลิก",      icon: XCircle,       cls: "text-red-600",     bg: "bg-red-50"      },
};

const PKG: Record<string, { label: string; cls: string }> = {
  starter: { label: "Starter", cls: "bg-slate-100 text-slate-600" },
  growth:  { label: "Growth",  cls: "bg-indigo-50 text-indigo-700" },
  pro:     { label: "Pro",     cls: "bg-amber-50  text-amber-700"  },
};

/* ─── Buyer row ──────────────────────────────────────────── */

function BuyerRow({ b, index }: { b: Buyer; index: number }) {
  const meta = STATUS_META[b.status];
  const Icon = meta.icon;

  return (
    <tr className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
      <td className="py-3 pl-5 pr-3 text-xs tabular-nums text-muted-foreground/50">{index + 1}</td>
      <td className="py-3 pr-4">
        <p className="text-sm font-medium text-foreground">{b.name}</p>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-3">
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Mail className="size-3 shrink-0" />{b.email}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Phone className="size-3 shrink-0" />{b.phone}
          </span>
        </div>
      </td>
      <td className="py-3 pr-4">
        <p className="text-xs font-medium text-foreground">{b.ticketType}</p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">{b.qty} ใบ</p>
      </td>
      <td className="py-3 pr-4 text-right">
        <span className="font-mono text-sm font-semibold text-foreground tabular-nums">
          ฿{b.total.toLocaleString("th-TH")}
        </span>
      </td>
      <td className="py-3 pr-4 text-right text-xs text-muted-foreground">
        {new Date(b.purchasedAt).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "2-digit" })}
      </td>
      <td className="py-3 pr-5">
        <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium", meta.bg, meta.cls)}>
          <Icon className="size-3" />
          {meta.label}
        </span>
      </td>
    </tr>
  );
}

const PER_PAGE = 10;

/* ─── Compact pagination ─────────────────────────────────── */

function TablePager({
  page,
  totalPages,
  from,
  to,
  total,
  onChange,
}: {
  page: number;
  totalPages: number;
  from: number;
  to: number;
  total: number;
  onChange: (p: number) => void;
}) {
  const pages = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 4) return [1, 2, 3, 4, 5, "…", totalPages];
    if (page >= totalPages - 3) return [1, "…", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, "…", page - 1, page, page + 1, "…", totalPages];
  }, [page, totalPages]);

  return (
    <div className="flex items-center justify-between border-t border-border px-5 py-3">
      <p className="text-xs text-muted-foreground">
        แสดง <span className="font-medium text-foreground">{from}–{to}</span> จาก <span className="font-medium text-foreground">{total}</span> รายการ
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="flex size-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronLeft className="size-3.5" />
        </button>
        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`ellipsis-${i}`} className="flex size-7 items-center justify-center text-xs text-muted-foreground">…</span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p as number)}
              className={cn(
                "flex size-7 items-center justify-center rounded-md text-xs font-medium transition-colors",
                p === page
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              {p}
            </button>
          )
        )}
        <button
          type="button"
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          className="flex size-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronRight className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────── */

export function EventBuyersPage({ slug }: { slug: string }) {
  const [event, setEvent]           = useState<UserEvent | null | undefined>(undefined);
  const [query, setQuery]           = useState("");
  const [statusFilter, setStatus]   = useState<BuyerStatus | "all">("all");
  const [page, setPage]             = useState(1);

  useEffect(() => {
    getUserEventBySlug(slug).then(setEvent);
  }, [slug]);

  const allBuyers = useMemo(() => getBuyersForEvent(slug), [slug]);

  const filtered = useMemo(() => {
    let list = allBuyers;
    if (statusFilter !== "all") list = list.filter((b) => b.status === statusFilter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.email.toLowerCase().includes(q) ||
          b.phone.includes(q),
      );
    }
    return list;
  }, [allBuyers, query, statusFilter]);

  /* Reset to page 1 whenever filter/search changes */
  useEffect(() => { setPage(1); }, [query, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage   = Math.min(page, totalPages);
  const from       = filtered.length === 0 ? 0 : (safePage - 1) * PER_PAGE + 1;
  const to         = Math.min(safePage * PER_PAGE, filtered.length);
  const paginated  = filtered.slice(from - 1, to);

  const handlePage = useCallback((p: number) => setPage(Math.max(1, Math.min(p, totalPages))), [totalPages]);

  const confirmed  = allBuyers.filter((b) => b.status === "confirmed");
  const totalQty   = confirmed.reduce((s, b) => s + b.qty, 0);
  const totalRev   = confirmed.reduce((s, b) => s + b.total, 0);

  const tabCounts = {
    all:       allBuyers.length,
    confirmed: confirmed.length,
    pending:   allBuyers.filter((b) => b.status === "pending").length,
    cancelled: allBuyers.filter((b) => b.status === "cancelled").length,
  };

  /* Loading */
  if (event === undefined) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
        <div className="h-32 animate-pulse rounded-lg bg-muted" />
        <div className="h-64 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  /* Event card fallback values (works even if event not in JSON store) */
  const title    = event?.title    ?? slug;
  const category = event?.category ?? "";
  const date     = event?.date     ?? "";
  const location = event?.location ?? "";
  const gradient = event?.gradient ?? "from-indigo-500 to-purple-500";
  const image    = event?.image;
  const pkg      = event?.packageTier ? PKG[event.packageTier] : null;
  const isActive = event?.status === "active";

  return (
    <div className="flex flex-col gap-5">

      <EventSubNav slug={slug} eventTitle={title} />

      {/* Event summary card */}
      <div className="flex items-center gap-4 rounded-lg border border-border bg-background p-4">
        {/* Thumbnail */}
        <div className={cn("relative hidden shrink-0 overflow-hidden rounded-md sm:block h-16 w-[52px] bg-gradient-to-br", gradient)}>
          {image
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={image} alt="" className="size-full object-cover" />
            : <PartyPopper className="absolute -right-1 -bottom-1 size-6 text-white/20" />}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-base font-semibold text-foreground">{title}</h1>
            {pkg && (
              <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", pkg.cls)}>
                {pkg.label}
              </span>
            )}
            <span className={cn(
              "flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
              isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500",
            )}>
              <span className={cn("size-1.5 rounded-full", isActive ? "bg-emerald-500" : "bg-slate-300")} />
              {isActive ? "เผยแพร่" : "ร่าง"}
            </span>
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1">
            {category && <span className="text-xs text-muted-foreground">{category}</span>}
            {date && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <CalendarDays className="size-3.5 shrink-0" />{date}
              </span>
            )}
            {location && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3.5 shrink-0" />{location}
              </span>
            )}
          </div>
        </div>

        <Link
          href={`/organizer/events/${slug}`}
          className="hidden shrink-0 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted sm:block"
        >
          จัดการงาน
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 divide-x divide-border overflow-hidden rounded-lg border border-border bg-background">
        {[
          { label: "ผู้ซื้อทั้งหมด", value: `${allBuyers.length} คน`,                      icon: Users  },
          { label: "บัตรที่ขายได้",  value: `${totalQty} ใบ`,                               icon: Ticket },
          { label: "รายได้รวม",      value: `฿${totalRev.toLocaleString("th-TH")}`, icon: null   },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex flex-col gap-1 px-5 py-4">
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground/60">{label}</span>
            <div className="flex items-baseline gap-1.5">
              {Icon && <Icon className="mb-0.5 size-4 text-muted-foreground" />}
              <span className="text-xl font-bold tabular-nums text-foreground">{value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="rounded-lg border border-border bg-background">

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-3">
          <h2 className="text-sm font-semibold text-foreground">รายชื่อผู้ซื้อ</h2>

          {/* Status tabs */}
          <div className="flex items-center gap-0.5">
            {(["all", "confirmed", "pending", "cancelled"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  statusFilter === s
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {{ all: "ทั้งหมด", confirmed: "ยืนยัน", pending: "รอ", cancelled: "ยกเลิก" }[s]}
                <span className={cn(
                  "rounded-full px-1.5 py-px text-[10px] font-semibold tabular-nums",
                  statusFilter === s ? "bg-background/20 text-background" : "bg-muted text-muted-foreground",
                )}>
                  {tabCounts[s]}
                </span>
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Search */}
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 size-3.5 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ค้นหาชื่อ / อีเมล / เบอร์..."
                className="h-8 w-52 rounded-md border border-border bg-transparent pl-8 pr-3 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"
              />
            </div>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Download className="size-3.5" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="py-2.5 pl-5 pr-3 text-left text-[10px] font-medium uppercase tracking-wide text-muted-foreground/60 w-8">#</th>
                <th className="py-2.5 pr-4 text-left text-[10px] font-medium uppercase tracking-wide text-muted-foreground/60">ผู้ซื้อ</th>
                <th className="py-2.5 pr-4 text-left text-[10px] font-medium uppercase tracking-wide text-muted-foreground/60">ประเภทบัตร</th>
                <th className="py-2.5 pr-4 text-right text-[10px] font-medium uppercase tracking-wide text-muted-foreground/60">ราคารวม</th>
                <th className="py-2.5 pr-4 text-right text-[10px] font-medium uppercase tracking-wide text-muted-foreground/60">วันที่ซื้อ</th>
                <th className="py-2.5 pr-5 text-left text-[10px] font-medium uppercase tracking-wide text-muted-foreground/60">สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Users className="size-8 text-muted-foreground/30" strokeWidth={1.2} />
                      <div>
                        <p className="text-sm font-medium text-foreground">ไม่พบรายการ</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">ลองเปลี่ยน filter หรือคำค้นหา</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((b, i) => (
                  <BuyerRow key={b.id} b={b} index={from - 1 + i} />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        {filtered.length > 0 && (
          <TablePager
            page={safePage}
            totalPages={totalPages}
            from={from}
            to={to}
            total={filtered.length}
            onChange={handlePage}
          />
        )}
      </div>
    </div>
  );
}
