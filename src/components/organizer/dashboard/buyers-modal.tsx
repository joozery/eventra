"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock,
  Download,
  Mail,
  Phone,
  Search,
  Ticket,
  Users,
  X,
  XCircle,
} from "lucide-react";
import type { UserEvent } from "@/lib/user-events";
import { cn } from "@/lib/utils";

/* ─── Types ──────────────────────────────────────────────── */

type BuyerStatus = "confirmed" | "pending" | "cancelled";

type Buyer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  ticketType: string;
  qty: number;
  total: number;
  purchasedAt: string;
  status: BuyerStatus;
};

/* ─── Mock data keyed by event slug ─────────────────────── */

const MOCK_BUYERS: Record<string, Buyer[]> = {
  "maroon-5-asia-2027-in-bangkok": [
    { id: "B001", name: "สมชาย ใจดี",        email: "somchai.j@gmail.com",    phone: "081-234-5678", ticketType: "VIP Standing",  qty: 2, total: 9000,  purchasedAt: "2026-07-15", status: "confirmed" },
    { id: "B002", name: "วรรณิษา พรมดี",     email: "wannisa.p@gmail.com",    phone: "089-876-5432", ticketType: "บัตรทั่วไป",    qty: 3, total: 7500,  purchasedAt: "2026-07-18", status: "confirmed" },
    { id: "B003", name: "ธนกร มั่นคง",       email: "thanakorn.m@email.com",  phone: "085-111-2233", ticketType: "VIP Standing",  qty: 1, total: 4500,  purchasedAt: "2026-07-20", status: "confirmed" },
    { id: "B004", name: "ปรียา สุขสวัสดิ์",  email: "priya.s@yahoo.com",      phone: "062-445-6677", ticketType: "บัตรทั่วไป",    qty: 2, total: 5000,  purchasedAt: "2026-07-22", status: "pending"   },
    { id: "B005", name: "กิตติพัทธ์ ทองใบ",  email: "kittipat.t@outlook.com", phone: "091-333-4455", ticketType: "VIP Standing",  qty: 4, total: 18000, purchasedAt: "2026-08-01", status: "confirmed" },
    { id: "B006", name: "นภัสสร ดีมาก",      email: "naphatson.d@gmail.com",  phone: "086-778-9900", ticketType: "บัตรทั่วไป",    qty: 1, total: 2500,  purchasedAt: "2026-08-03", status: "cancelled" },
    { id: "B007", name: "วิชัย แสงทอง",      email: "wichai.s@gmail.com",     phone: "083-654-3210", ticketType: "บัตรทั่วไป",    qty: 2, total: 5000,  purchasedAt: "2026-08-05", status: "confirmed" },
    { id: "B008", name: "มณีรัตน์ โชคดี",    email: "manirat.c@email.com",    phone: "098-222-3344", ticketType: "VIP Standing",  qty: 1, total: 4500,  purchasedAt: "2026-08-07", status: "confirmed" },
  ],
  "bangkok-music-festival": [
    { id: "B101", name: "อานนท์ วงค์ศรี",    email: "arnon.w@gmail.com",      phone: "081-555-6677", ticketType: "บัตรทั่วไป",    qty: 2, total: 3000,  purchasedAt: "2026-06-10", status: "confirmed" },
    { id: "B102", name: "สุภาวดี ทรัพย์มาก", email: "supawadee.s@gmail.com",  phone: "089-444-5566", ticketType: "VVIP",          qty: 1, total: 4500,  purchasedAt: "2026-06-12", status: "confirmed" },
    { id: "B103", name: "ชัยวัฒน์ เพชรรัตน์",email: "chaiwat.p@email.com",    phone: "063-789-0011", ticketType: "บัตรทั่วไป",    qty: 4, total: 6000,  purchasedAt: "2026-06-14", status: "confirmed" },
    { id: "B104", name: "ธิดารัตน์ สมใจ",    email: "thidarat.s@yahoo.com",   phone: "092-123-4567", ticketType: "VVIP",          qty: 2, total: 9000,  purchasedAt: "2026-06-18", status: "pending"   },
    { id: "B105", name: "ปัณณธร อินทร์ดำ",   email: "pannathon.i@gmail.com",  phone: "087-654-3219", ticketType: "บัตรทั่วไป",    qty: 1, total: 1500,  purchasedAt: "2026-06-20", status: "confirmed" },
  ],
};

function generateBuyers(slug: string, count: number): Buyer[] {
  const thaiNames = [
    ["สมศักดิ์","รักดี"],["ณัฐพล","สมบูรณ์"],["พิมพ์ชนก","ศรีสุข"],
    ["อรุณี","แก้วมณี"],["ภาคภูมิ","โกมล"],["ศิริพร","เจริญสุข"],
    ["ธีรวัฒน์","ประทุม"],["กนกวรรณ","บุญมี"],
  ];
  return Array.from({ length: count }, (_, i) => {
    const [first, last] = thaiNames[i % thaiNames.length];
    return {
      id: `AUTO-${slug.slice(0, 4).toUpperCase()}-${i + 1}`,
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}${i + 1}@gmail.com`,
      phone: `08${i}-${String(100 + i).padStart(3, "0")}-${String(4000 + i).padStart(4, "0")}`,
      ticketType: i % 3 === 0 ? "VIP" : "บัตรทั่วไป",
      qty: (i % 3) + 1,
      total: ((i % 3) + 1) * 1500,
      purchasedAt: `2026-0${(i % 6) + 1}-${String((i % 28) + 1).padStart(2, "0")}`,
      status: i % 7 === 0 ? "cancelled" : i % 5 === 0 ? "pending" : "confirmed",
    } as Buyer;
  });
}

function getBuyers(slug: string): Buyer[] {
  return MOCK_BUYERS[slug] ?? generateBuyers(slug, 4);
}

/* ─── Status meta ────────────────────────────────────────── */

const STATUS_META: Record<BuyerStatus, { label: string; icon: React.ElementType; cls: string; bg: string }> = {
  confirmed: { label: "ยืนยันแล้ว",  icon: CheckCircle2, cls: "text-emerald-700", bg: "bg-emerald-50" },
  pending:   { label: "รอดำเนินการ", icon: Clock,         cls: "text-amber-700",   bg: "bg-amber-50"   },
  cancelled: { label: "ยกเลิก",      icon: XCircle,       cls: "text-red-600",     bg: "bg-red-50"     },
};

/* ─── Buyer row ──────────────────────────────────────────── */

function BuyerRow({ b, index }: { b: Buyer; index: number }) {
  const meta = STATUS_META[b.status];
  const Icon = meta.icon;

  return (
    <div className={cn(
      "grid grid-cols-[auto_1fr_auto] items-center gap-x-4 border-b border-border/50 px-5 py-3 last:border-0",
      "sm:grid-cols-[24px_1fr_120px_80px_80px_100px]",
    )}>
      {/* Index */}
      <span className="hidden text-xs tabular-nums text-muted-foreground/50 sm:block">{index + 1}</span>

      {/* Name + contact */}
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{b.name}</p>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5">
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Mail className="size-2.5 shrink-0" />{b.email}
          </span>
          <span className="hidden items-center gap-1 text-[11px] text-muted-foreground sm:flex">
            <Phone className="size-2.5 shrink-0" />{b.phone}
          </span>
        </div>
      </div>

      {/* Ticket type + qty */}
      <div className="hidden sm:block">
        <p className="text-xs font-medium text-foreground">{b.ticketType}</p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">{b.qty} ใบ</p>
      </div>

      {/* Total */}
      <div className="hidden text-right sm:block">
        <span className="font-mono text-xs font-semibold text-foreground tabular-nums">
          ฿{b.total.toLocaleString("th-TH")}
        </span>
      </div>

      {/* Purchase date */}
      <div className="hidden text-right sm:block">
        <span className="text-[11px] text-muted-foreground">
          {new Date(b.purchasedAt).toLocaleDateString("th-TH", { day: "numeric", month: "short" })}
        </span>
      </div>

      {/* Status */}
      <div className="flex justify-end sm:justify-center">
        <span className={cn("flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium", meta.bg, meta.cls)}>
          <Icon className="size-3" />
          <span className="hidden sm:inline">{meta.label}</span>
        </span>
      </div>
    </div>
  );
}

/* ─── Modal ──────────────────────────────────────────────── */

export function BuyersModal({
  event,
  onClose,
}: {
  event: UserEvent;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<BuyerStatus | "all">("all");

  const allBuyers = getBuyers(event.slug);

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

  const confirmed = allBuyers.filter((b) => b.status === "confirmed");
  const totalTickets = confirmed.reduce((s, b) => s + b.qty, 0);
  const totalRevenue = confirmed.reduce((s, b) => s + b.total, 0);

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Panel */}
      <div className="flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-border bg-background shadow-xl">

        {/* Header */}
        <div className="flex items-start justify-between border-b border-border px-5 py-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="size-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">รายชื่อผู้ซื้อบัตร</h2>
            </div>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{event.title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Stats bar */}
        <div className="flex items-center divide-x divide-border border-b border-border">
          {[
            { label: "ผู้ซื้อทั้งหมด", value: `${allBuyers.length} คน`,           icon: Users  },
            { label: "บัตรที่ขายได้",  value: `${totalTickets} ใบ`,                icon: Ticket },
            { label: "รายได้รวม",      value: `฿${totalRevenue.toLocaleString("th-TH")}`, icon: null  },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-1 flex-col gap-0.5 px-5 py-3">
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground/60">{label}</span>
              <span className="text-sm font-semibold text-foreground tabular-nums">{value}</span>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-2.5">
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

          {/* Status filter */}
          <div className="flex items-center gap-0.5">
            {(["all", "confirmed", "pending", "cancelled"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors",
                  statusFilter === s
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {{ all: "ทั้งหมด", confirmed: "ยืนยัน", pending: "รอ", cancelled: "ยกเลิก" }[s]}
              </button>
            ))}
          </div>

          <div className="ml-auto">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Download className="size-3" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Table header */}
        <div className="hidden grid-cols-[24px_1fr_120px_80px_80px_100px] gap-x-4 border-b border-border bg-muted/20 px-5 py-2 sm:grid">
          <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground/50">#</span>
          <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground/50">ผู้ซื้อ</span>
          <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground/50">ประเภทบัตร</span>
          <span className="text-right text-[10px] font-medium uppercase tracking-wide text-muted-foreground/50">ราคารวม</span>
          <span className="text-right text-[10px] font-medium uppercase tracking-wide text-muted-foreground/50">วันที่ซื้อ</span>
          <span className="text-center text-[10px] font-medium uppercase tracking-wide text-muted-foreground/50">สถานะ</span>
        </div>

        {/* List */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-14 text-center">
              <Users className="size-8 text-muted-foreground/30" strokeWidth={1.2} />
              <div>
                <p className="text-sm font-medium text-foreground">ไม่พบรายการ</p>
                <p className="mt-0.5 text-xs text-muted-foreground">ลองเปลี่ยน filter หรือคำค้นหา</p>
              </div>
            </div>
          ) : (
            filtered.map((b, i) => <BuyerRow key={b.id} b={b} index={i} />)
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border px-5 py-3">
          <p className="text-xs text-muted-foreground">
            แสดง {filtered.length} จาก {allBuyers.length} รายการ
          </p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-border px-4 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
}
