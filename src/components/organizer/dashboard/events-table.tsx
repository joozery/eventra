"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  CalendarPlus,
  ChevronDown,
  ClipboardList,
  FileText,
  MapPin,
  PartyPopper,
  Plus,
  Settings2,
  Users,
} from "lucide-react";
import type { UserEvent } from "@/lib/user-events";
import { cn } from "@/lib/utils";

/* ─── Lookup maps ────────────────────────────────────────── */

const PKG: Record<string, { label: string; cls: string }> = {
  starter: { label: "Starter", cls: "bg-slate-100 text-slate-600" },
  growth:  { label: "Growth",  cls: "bg-indigo-50 text-indigo-700" },
  pro:     { label: "Pro",     cls: "bg-amber-50  text-amber-700"  },
};

const STATUS: Record<string, { label: string; dot: string; cls: string }> = {
  active: { label: "เผยแพร่", dot: "bg-emerald-500", cls: "text-emerald-600" },
  draft:  { label: "ร่าง",    dot: "bg-slate-300",   cls: "text-slate-400"   },
};

/* ─── Dropdown menu ──────────────────────────────────────── */

const MENU_ITEMS = [
  { label: "ผู้ซื้อบัตร",      icon: Users,         suffix: ""               },
  { label: "ฟอร์มลงทะเบียน",  icon: FileText,      suffix: "/form"          },
  { label: "ผู้ลงทะเบียน",     icon: ClipboardList, suffix: "/registrations" },
];

function EventMenu({ slug }: { slug: string }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos]   = useState({ top: 0, right: 0 });
  const btnRef  = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    if (!open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + window.scrollY + 4, right: window.innerWidth - r.right });
    }
    setOpen((v) => !v);
  };

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (
        btnRef.current?.contains(e.target as Node) ||
        menuRef.current?.contains(e.target as Node)
      ) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={toggle}
        className={cn(
          "flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-[11px] font-medium transition-colors",
          open
            ? "border-foreground/20 bg-muted text-foreground"
            : "border-border text-muted-foreground hover:bg-muted hover:text-foreground",
        )}
      >
        จัดการ
        <ChevronDown className={cn("size-3 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div
          ref={menuRef}
          style={{ top: pos.top, right: pos.right }}
          className="fixed z-50 w-44 overflow-hidden rounded-lg border border-border bg-background shadow-lg"
        >
          <Link
            href={`/organizer/events/${slug}`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          >
            <Settings2 className="size-3.5 text-muted-foreground" />
            แก้ไขงาน
          </Link>

          <div className="my-1 border-t border-border/60" />
          <p className="px-3 pb-1 pt-0.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
            รายงาน
          </p>

          {MENU_ITEMS.map((item) => (
            <Link
              key={item.suffix}
              href={`/organizer/dashboard/events/${slug}${item.suffix}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs text-foreground transition-colors hover:bg-muted"
            >
              <item.icon className="size-3.5 text-muted-foreground" />
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

/* ─── Empty state ────────────────────────────────────────── */

function EmptyState({ filtered }: { filtered: boolean }) {
  if (filtered) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <div className="flex size-10 items-center justify-center rounded-full bg-muted">
          <CalendarPlus className="size-4 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">ไม่พบงานที่ตรงกัน</p>
          <p className="mt-1 text-xs text-muted-foreground">ลองเปลี่ยน filter หรือคำค้นหา</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <CalendarPlus className="size-5 text-muted-foreground" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">ยังไม่มีงาน</p>
        <p className="mt-1 text-xs text-muted-foreground">สร้างอีเวนต์แรกเพื่อเริ่มต้นจัดการงาน</p>
      </div>
      <Link
        href="/organizer/events/create"
        className="flex items-center gap-1.5 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-80"
      >
        <Plus className="size-4" />
        สร้างอีเวนต์แรก
      </Link>
    </div>
  );
}

/* ─── Row ────────────────────────────────────────────────── */

function EventRow({ e }: { e: UserEvent }) {
  const pkg    = e.packageTier ? PKG[e.packageTier] : null;
  const status = STATUS[e.status] ?? STATUS.draft;

  return (
    <div className="group flex items-center gap-4 border-b border-border/60 px-5 py-3.5 last:border-0 hover:bg-muted/20 transition-colors">

      {/* Portrait thumbnail */}
      <div className={cn(
        "relative hidden shrink-0 overflow-hidden rounded-md sm:block h-[52px] w-[42px]",
        e.gradient,
      )}>
        {e.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={e.image} alt="" className="size-full object-cover" />
        ) : (
          <PartyPopper className="absolute -right-1 -bottom-1 size-5 text-white/25" />
        )}
      </div>

      {/* Title + meta */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{e.title}</p>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-[11px] text-muted-foreground">{e.category}</span>
          {e.date && (
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <CalendarDays className="size-3 shrink-0" />
              {e.date}
            </span>
          )}
          {e.location && (
            <span className="hidden items-center gap-1 text-[11px] text-muted-foreground md:flex">
              <MapPin className="size-3 shrink-0" />
              <span className="max-w-[120px] truncate">{e.location}</span>
            </span>
          )}
        </div>
      </div>

      {/* Status */}
      <div className="hidden shrink-0 sm:block">
        <span className={cn("flex items-center gap-1.5 text-xs font-medium", status.cls)}>
          <span className={cn("size-1.5 rounded-full", status.dot)} />
          {status.label}
        </span>
      </div>

      {/* Package */}
      <div className="shrink-0">
        {pkg ? (
          <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", pkg.cls)}>
            {pkg.label}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground/40">—</span>
        )}
      </div>

      {/* Price + actions */}
      <div className="flex shrink-0 items-center gap-2.5">
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {e.price === 0 ? "ฟรี" : `฿${e.price.toLocaleString("th-TH")}`}
        </span>
        <EventMenu slug={e.slug} />
      </div>
    </div>
  );
}

/* ─── Table header ───────────────────────────────────────── */

function TableHeader() {
  return (
    <div className="flex items-center gap-4 border-b border-border bg-muted/20 px-5 py-2.5">
      <div className="hidden w-[42px] shrink-0 sm:block" />
      <div className="flex-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground/60">งาน</div>
      <div className="hidden w-16 shrink-0 text-[11px] font-medium uppercase tracking-wide text-muted-foreground/60 sm:block">สถานะ</div>
      <div className="w-16 shrink-0 text-[11px] font-medium uppercase tracking-wide text-muted-foreground/60">แพ็กเกจ</div>
      <div className="w-28 shrink-0 text-right text-[11px] font-medium uppercase tracking-wide text-muted-foreground/60">ราคา / การจัดการ</div>
    </div>
  );
}

/* ─── Export ─────────────────────────────────────────────── */

export function EventsTable({ events, showEmpty = true }: { events: UserEvent[]; showEmpty?: boolean }) {
  if (events.length === 0) return <EmptyState filtered={!showEmpty} />;
  return (
    <div>
      <TableHeader />
      {events.map((e) => <EventRow key={e.slug} e={e} />)}
    </div>
  );
}
