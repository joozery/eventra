"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Mail,
  Phone,
  Search,
  Users,
  XCircle,
  Bookmark,
} from "lucide-react";
import { getUserEventBySlug } from "@/lib/user-events";

type RegStatus = "confirmed" | "pending" | "waitlist" | "cancelled";
type Registration = {
  id: string;
  eventSlug: string;
  submittedAt: string;
  status: RegStatus;
  answers?: Record<string, string | string[]>;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  position?: string;
};
import { EventSubNav } from "./event-sub-nav";
import { cn } from "@/lib/utils";

/* ─── Status config ──────────────────────────────────────── */

const STATUS_META: Record<RegStatus, { label: string; icon: React.ElementType; cls: string; bg: string }> = {
  confirmed: { label: "ยืนยันแล้ว",       icon: CheckCircle2, cls: "text-emerald-700", bg: "bg-emerald-50"  },
  pending:   { label: "รอการยืนยัน",      icon: Clock,         cls: "text-amber-700",   bg: "bg-amber-50"    },
  waitlist:  { label: "รายชื่อสำรอง",     icon: Bookmark,      cls: "text-blue-700",    bg: "bg-blue-50"     },
  cancelled: { label: "ยกเลิก",           icon: XCircle,       cls: "text-red-600",     bg: "bg-red-50"      },
};

const PER_PAGE = 10;

/* ─── Pagination ─────────────────────────────────────────── */

function TablePager({ page, totalPages, from, to, total, onChange }: {
  page: number; totalPages: number; from: number; to: number; total: number;
  onChange: (p: number) => void;
}) {
  const pages = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 4)             return [1, 2, 3, 4, 5, "…", totalPages];
    if (page >= totalPages - 3) return [1, "…", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, "…", page - 1, page, page + 1, "…", totalPages];
  }, [page, totalPages]);

  return (
    <div className="flex items-center justify-between border-t border-border px-5 py-3">
      <p className="text-xs text-muted-foreground">
        แสดง <span className="font-medium text-foreground">{from}–{to}</span> จาก <span className="font-medium text-foreground">{total}</span> รายการ
      </p>
      <div className="flex items-center gap-1">
        <button type="button" onClick={() => onChange(page - 1)} disabled={page === 1}
          className="flex size-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40">
          <ChevronLeft className="size-3.5" />
        </button>
        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`el-${i}`} className="flex size-7 items-center justify-center text-xs text-muted-foreground">…</span>
          ) : (
            <button key={p} type="button" onClick={() => onChange(p as number)}
              className={cn("flex size-7 items-center justify-center rounded-md text-xs font-medium transition-colors",
                p === page ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted")}>
              {p}
            </button>
          )
        )}
        <button type="button" onClick={() => onChange(page + 1)} disabled={page === totalPages}
          className="flex size-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40">
          <ChevronRight className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ─── Row ────────────────────────────────────────────────── */

function RegRow({ r, index }: { r: Registration; index: number }) {
  const meta = STATUS_META[r.status];
  const Icon = meta.icon;
  const dateStr = new Date(r.submittedAt).toLocaleDateString("th-TH", {
    day: "numeric", month: "short", year: "2-digit",
  });
  const timeStr = new Date(r.submittedAt).toLocaleTimeString("th-TH", {
    hour: "2-digit", minute: "2-digit",
  });

  return (
    <tr className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
      <td className="py-3 pl-5 pr-3 text-xs tabular-nums text-muted-foreground/50">{index + 1}</td>
      <td className="py-3 pr-4">
        <p className="text-sm font-medium text-foreground">{r.name ?? "—"}</p>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-3">
          {r.email && (
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Mail className="size-2.5 shrink-0" />{r.email}
            </span>
          )}
          {r.phone && (
            <span className="hidden items-center gap-1 text-[11px] text-muted-foreground sm:flex">
              <Phone className="size-2.5 shrink-0" />{r.phone}
            </span>
          )}
        </div>
      </td>
      <td className="hidden py-3 pr-4 md:table-cell">
        <p className="text-xs font-medium text-foreground">{r.company ?? "—"}</p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">{r.position ?? ""}</p>
      </td>
      <td className="py-3 pr-4 text-right">
        <p className="text-xs text-foreground">{dateStr}</p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">{timeStr}</p>
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

/* ─── Main ───────────────────────────────────────────────── */

export function RegistrationsPage({ slug }: { slug: string }) {
  const [eventTitle, setEventTitle] = useState(slug);
  const [allRegs, setAllRegs]       = useState<Registration[]>([]);
  const [query, setQuery]           = useState("");
  const [statusFilter, setStatus]   = useState<RegStatus | "all">("all");
  const [page, setPage]             = useState(1);

  useEffect(() => {
    getUserEventBySlug(slug).then((ev) => { if (ev) setEventTitle(ev.title); });
    fetch(`/api/registrations/${slug}`)
      .then((r) => r.json())
      .then((data: Registration[]) => setAllRegs(data))
      .catch(() => { /* stay empty */ });
  }, [slug]);

  const filtered = useMemo(() => {
    let list = allRegs;
    if (statusFilter !== "all") list = list.filter((r) => r.status === statusFilter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (r) =>
          (r.name ?? "").toLowerCase().includes(q) ||
          (r.email ?? "").toLowerCase().includes(q) ||
          (r.company ?? "").toLowerCase().includes(q) ||
          (r.position ?? "").toLowerCase().includes(q),
      );
    }
    return list;
  }, [allRegs, query, statusFilter]);

  useEffect(() => { setPage(1); }, [query, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage   = Math.min(page, totalPages);
  const from       = filtered.length === 0 ? 0 : (safePage - 1) * PER_PAGE + 1;
  const to         = Math.min(safePage * PER_PAGE, filtered.length);
  const paginated  = filtered.slice(from - 1, to);

  const handlePage = useCallback((p: number) => setPage(Math.max(1, Math.min(p, totalPages))), [totalPages]);

  const counts = {
    all:       allRegs.length,
    confirmed: allRegs.filter((r) => r.status === "confirmed").length,
    pending:   allRegs.filter((r) => r.status === "pending").length,
    waitlist:  allRegs.filter((r) => r.status === "waitlist").length,
    cancelled: allRegs.filter((r) => r.status === "cancelled").length,
  };

  return (
    <div className="flex flex-col gap-5">
      <EventSubNav slug={slug} eventTitle={eventTitle} />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(["confirmed", "pending", "waitlist", "cancelled"] as RegStatus[]).map((s) => {
          const meta = STATUS_META[s];
          const Icon = meta.icon;
          return (
            <button
              key={s}
              type="button"
              onClick={() => setStatus((prev) => prev === s ? "all" : s)}
              className={cn(
                "flex flex-col gap-1.5 rounded-lg border p-4 text-left transition-all",
                statusFilter === s
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background hover:bg-muted/40",
              )}
            >
              <div className="flex items-center gap-1.5">
                <Icon className={cn("size-3.5", statusFilter === s ? "text-background" : meta.cls)} />
                <span className={cn("text-[11px] font-medium", statusFilter === s ? "text-background/80" : "text-muted-foreground")}>
                  {meta.label}
                </span>
              </div>
              <span className={cn("text-2xl font-bold tabular-nums", statusFilter === s ? "text-background" : "text-foreground")}>
                {counts[s]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table card */}
      <div className="rounded-lg border border-border bg-background">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-3">
          <h2 className="text-sm font-semibold text-foreground">
            ผู้ลงทะเบียน
            <span className="ml-2 text-xs font-normal text-muted-foreground">{allRegs.length} คน</span>
          </h2>

          {/* Status tabs */}
          <div className="flex items-center gap-0.5">
            {(["all", "confirmed", "pending", "waitlist", "cancelled"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={cn(
                  "flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  statusFilter === s ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {{ all: "ทั้งหมด", confirmed: "ยืนยัน", pending: "รอ", waitlist: "สำรอง", cancelled: "ยกเลิก" }[s]}
                <span className={cn("rounded-full px-1.5 py-px text-[10px] font-semibold tabular-nums",
                  statusFilter === s ? "bg-background/20 text-background" : "bg-muted text-muted-foreground")}>
                  {counts[s]}
                </span>
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 size-3.5 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ค้นหาชื่อ / อีเมล / บริษัท..."
                className="h-8 w-52 rounded-md border border-border bg-transparent pl-8 pr-3 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"
              />
            </div>
            <button type="button" className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <Download className="size-3.5" />Export CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="w-8 py-2.5 pl-5 pr-3 text-left text-[10px] font-medium uppercase tracking-wide text-muted-foreground/60">#</th>
                <th className="py-2.5 pr-4 text-left text-[10px] font-medium uppercase tracking-wide text-muted-foreground/60">ผู้ลงทะเบียน</th>
                <th className="hidden py-2.5 pr-4 text-left text-[10px] font-medium uppercase tracking-wide text-muted-foreground/60 md:table-cell">บริษัท / ตำแหน่ง</th>
                <th className="py-2.5 pr-4 text-right text-[10px] font-medium uppercase tracking-wide text-muted-foreground/60">วันที่ลงทะเบียน</th>
                <th className="py-2.5 pr-5 text-left text-[10px] font-medium uppercase tracking-wide text-muted-foreground/60">สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
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
                paginated.map((r, i) => <RegRow key={r.id} r={r} index={from - 1 + i} />)
              )}
            </tbody>
          </table>
        </div>

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
