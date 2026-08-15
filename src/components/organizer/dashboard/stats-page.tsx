"use client";

import { useEffect, useState } from "react";
import {
  AreaChart, Area,
  BarChart, Bar, LabelList,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  CalendarDays,
  PartyPopper,
  Ticket,
  Users,
  Wallet,
} from "lucide-react";
import type { UserEvent } from "@/lib/user-events";
import { cn } from "@/lib/utils";

/* ─── Helpers ──────────────────────────────────────────────────── */

function fmt(n: number) { return n.toLocaleString("th-TH"); }
function fmtBaht(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`;
  return fmt(n);
}

/* ─── KPI Cards ────────────────────────────────────────────────── */

function KpiCards({ total, revenue, pax, active }: {
  total: number; revenue: number; pax: number; active: number;
}) {
  const cards = [
    { label: "งานทั้งหมด",   value: fmt(total),             unit: "งาน", icon: CalendarDays },
    { label: "รายได้รวม",    value: `฿${fmtBaht(revenue)}`, unit: "",    icon: Wallet       },
    { label: "ผู้เข้าร่วม",  value: fmt(pax),               unit: "คน",  icon: Users        },
    { label: "กำลังเผยแพร่", value: fmt(active),            unit: "งาน", icon: Ticket       },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map(({ label, value, unit, icon: Icon }) => (
        <div key={label} className="flex flex-col gap-4 rounded-xl border border-border bg-background p-5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-muted-foreground">{label}</p>
            <Icon className="size-4 text-muted-foreground/40" />
          </div>
          <p className="text-3xl font-semibold tabular-nums text-foreground">
            {value}
            {unit && <span className="ml-1 text-base font-normal text-muted-foreground">{unit}</span>}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ─── Custom tooltip ───────────────────────────────────────────── */

function ChartTooltip({ active, payload, label, formatVal }: {
  active?: boolean; payload?: { value: number; name?: string }[]; label?: string;
  formatVal?: (v: number) => string;
}) {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  return (
    <div className="rounded-lg border border-border bg-background px-3 py-2 shadow-md">
      {label && <p className="mb-0.5 text-[11px] text-muted-foreground">{label}</p>}
      <p className="text-sm font-semibold tabular-nums text-foreground">
        {formatVal ? formatVal(val) : fmt(val)}
      </p>
    </div>
  );
}

/* ─── Fake monthly series (derived from events) ───────────────── */

function buildMonthlySeries(events: UserEvent[]) {
  const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  const seed   = events.length || 1;
  return months.slice(0, 8).map((name, i) => ({
    name,
    งาน:      Math.max(0, Math.round(Math.sin(i * 0.9 + seed) * 1.5 + seed * 0.5 + i * 0.3)),
    รายได้:   Math.max(0, Math.round((Math.sin(i * 0.7 + seed * 0.3) + 1.2) * seed * 3500)),
    ผู้เข้าร่วม: Math.max(0, Math.round((Math.cos(i * 0.8 + seed * 0.2) + 1.3) * seed * 45)),
  }));
}

/* ─── Card wrapper ─────────────────────────────────────────────── */

function Card({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-background">
      <div className="border-b border-border px-5 py-3.5">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        {sub && <p className="mt-0.5 text-[11px] text-muted-foreground">{sub}</p>}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

/* ─── Status donut ─────────────────────────────────────────────── */

const DONUT_COLORS = ["hsl(var(--foreground))", "hsl(var(--border))"];

function StatusDonut({ active, draft }: { active: number; draft: number }) {
  const data = [
    { name: "เผยแพร่", value: Math.max(active, 0.001) },
    { name: "ร่าง",    value: Math.max(draft,  0.001) },
  ];
  const pct = Math.round((active / Math.max(active + draft, 1)) * 100);

  return (
    <Card title="สถานะงาน" sub={`${active + draft} งานทั้งหมด`}>
      <div className="flex items-center gap-8">
        {/* Donut */}
        <div className="relative size-[110px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data} cx="50%" cy="50%"
                innerRadius={36} outerRadius={52}
                startAngle={90} endAngle={-270}
                dataKey="value" strokeWidth={0}
              >
                {data.map((_, i) => <Cell key={i} fill={DONUT_COLORS[i]} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* Center label — lives outside Recharts SVG */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-xl font-bold leading-none tabular-nums text-foreground">{pct}<span className="text-xs font-normal text-muted-foreground">%</span></p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-3">
          {[
            { label: "เผยแพร่", count: active,  color: DONUT_COLORS[0] },
            { label: "ร่าง",    count: draft,   color: DONUT_COLORS[1] },
          ].map((d) => (
            <div key={d.label} className="flex items-center gap-2.5">
              <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: d.color }} />
              <p className="text-xs text-muted-foreground">{d.label}</p>
              <p className="ml-auto pl-6 text-sm font-semibold tabular-nums text-foreground">{d.count}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

/* ─── Category bar (vertical + top labels) ─────────────────────── */

function truncate(s: string, n = 5) { return s.length > n ? s.slice(0, n) + "…" : s; }

function CategoryBar({ data }: { data: { name: string; value: number }[] }) {
  const display = data.map((d) => ({ ...d, short: truncate(d.name) }));
  return (
    <Card title="งานตามหมวดหมู่">
      <ResponsiveContainer width="100%" height={180}>
        <BarChart
          data={display} barSize={28}
          margin={{ top: 20, right: 4, left: -28, bottom: 0 }}
        >
          <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 3" />
          <XAxis
            dataKey="short"
            tick={{ fontSize: 11, fill: "hsl(var(--foreground))" }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false} tickLine={false}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload as { name: string; value: number };
              return (
                <div className="rounded-lg border border-border bg-background px-3 py-2 shadow-md">
                  <p className="text-[11px] text-muted-foreground">{d.name}</p>
                  <p className="text-sm font-semibold text-foreground">{d.value} งาน</p>
                </div>
              );
            }}
            cursor={false}
          />
          <Bar dataKey="value" fill="hsl(var(--foreground))" radius={[4, 4, 0, 0]}>
            <LabelList
              dataKey="value"
              position="top"
              style={{ fontSize: 11, fontWeight: 600, fill: "hsl(var(--foreground))" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

/* ─── Revenue area ─────────────────────────────────────────────── */

function RevenueArea({ data }: { data: { name: string; รายได้: number }[] }) {
  return (
    <Card title="รายได้รายเดือน (โดยประมาณ)">
      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={data} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="hsl(var(--foreground))" stopOpacity={0.15} />
              <stop offset="95%" stopColor="hsl(var(--foreground))" stopOpacity={0}    />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false}
            tickFormatter={(v: number) => fmtBaht(v)} />
          <Tooltip content={<ChartTooltip formatVal={(v) => `฿${fmtBaht(v)}`} />} />
          <Area
            type="monotone" dataKey="รายได้"
            stroke="hsl(var(--foreground))" strokeWidth={1.5}
            fill="url(#revGrad)"
            dot={false} activeDot={{ r: 4, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}

/* ─── Attendees area ───────────────────────────────────────────── */

function AttendeesArea({ data }: { data: { name: string; ผู้เข้าร่วม: number }[] }) {
  return (
    <Card title="ผู้เข้าร่วมรายเดือน (โดยประมาณ)">
      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={data} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
          <defs>
            <linearGradient id="paxGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="hsl(221 83% 53%)" stopOpacity={0.2} />
              <stop offset="95%" stopColor="hsl(221 83% 53%)" stopOpacity={0}   />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip content={<ChartTooltip formatVal={(v) => `${fmt(v)} คน`} />} />
          <Area
            type="monotone" dataKey="ผู้เข้าร่วม"
            stroke="hsl(221 83% 53%)" strokeWidth={1.5}
            fill="url(#paxGrad)"
            dot={false} activeDot={{ r: 4, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}

/* ─── Events table ─────────────────────────────────────────────── */

function EventsList({ events }: { events: UserEvent[] }) {
  return (
    <div className="rounded-xl border border-border bg-background">
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <p className="text-sm font-semibold text-foreground">งานล่าสุด</p>
        <p className="text-[11px] text-muted-foreground">{events.length} งาน</p>
      </div>
      <div className="grid grid-cols-[1fr_80px_70px_64px] gap-3 border-b border-border/50 bg-muted/20 px-5 py-2">
        {["งาน", "ผู้เข้าร่วม", "ราคา", "สถานะ"].map((h) => (
          <p key={h} className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 last:text-right">{h}</p>
        ))}
      </div>
      <div className="divide-y divide-border/40">
        {events.slice(0, 8).map((e) => (
          <div key={e.slug} className="grid grid-cols-[1fr_80px_70px_64px] items-center gap-3 px-5 py-3 transition-colors hover:bg-muted/20">
            <div className="flex min-w-0 items-center gap-3">
              <div className={cn("relative hidden size-8 shrink-0 overflow-hidden rounded-lg sm:flex items-center justify-center", e.gradient)}>
                {e.image ? <img src={e.image} alt="" className="size-full object-cover" /> : <PartyPopper className="size-3.5 text-white/40" />}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-foreground">{e.title}</p>
                <p className="text-[11px] text-muted-foreground">{e.category}</p>
              </div>
            </div>
            <p className="text-xs tabular-nums text-muted-foreground">{fmt(e.attendees ?? 0)}</p>
            <p className="text-xs font-medium tabular-nums text-foreground">
              {e.price === 0 ? "ฟรี" : `฿${e.price.toLocaleString("th-TH")}`}
            </p>
            <div className="flex justify-end">
              <span className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
                e.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-muted text-muted-foreground",
              )}>
                <span className={cn("size-1 rounded-full", e.status === "active" ? "bg-emerald-500" : "bg-muted-foreground/40")} />
                {e.status === "active" ? "เผยแพร่" : "ร่าง"}
              </span>
            </div>
          </div>
        ))}
        {events.length === 0 && (
          <p className="py-12 text-center text-sm text-muted-foreground">ยังไม่มีงาน</p>
        )}
      </div>
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────────────────── */

export function StatsPage() {
  const [events, setEvents] = useState<UserEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/events", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: UserEvent[]) => setEvents(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const total   = events.length;
  const active  = events.filter((e) => e.status === "active").length;
  const draft   = events.filter((e) => e.status === "draft").length;
  const revenue = events.reduce((s, e) => s + e.price * (e.attendees ?? 0), 0);
  const pax     = events.reduce((s, e) => s + (e.attendees ?? 0), 0);

  const byCat = Object.entries(
    events.reduce<Record<string, number>>((acc, e) => {
      acc[e.category] = (acc[e.category] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value).slice(0, 6);

  const monthly = buildMonthlySeries(events);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="size-5 animate-spin rounded-full border-2 border-border border-t-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <KpiCards total={total} revenue={revenue} pax={pax} active={active} />

      {/* Row 2: donut + category bar */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <StatusDonut active={active} draft={draft} />
        <div className="lg:col-span-2">
          <CategoryBar data={byCat} />
        </div>
      </div>

      {/* Row 3: area charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RevenueArea   data={monthly} />
        <AttendeesArea data={monthly} />
      </div>

      {/* Events table */}
      <EventsList events={[...events].reverse()} />
    </div>
  );
}
