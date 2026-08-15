"use client";

import Link from "next/link";
import { CalendarDays, Plus, Ticket, TrendingUp, Users } from "lucide-react";
import type { UserEvent } from "@/lib/user-events";
import { StatCard } from "./stat-card";
import { EventsTable } from "./events-table";
import { RightPanel } from "./right-panel";

function baht(n: number) {
  if (n >= 1_000_000) return `฿${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `฿${(n / 1_000).toFixed(1)}K`;
  return `฿${n.toLocaleString("th-TH")}`;
}

export function OverviewTab({ events }: { events: UserEvent[] }) {
  const total     = events.length;
  const active    = events.filter((e) => e.status === "active").length;
  const attendees = events.reduce((s, e) => s + (e.attendees ?? 0), 0);
  const revenue   = events.reduce((s, e) => s + (e.price ?? 0) * (e.attendees ?? 0), 0);

  return (
    <div className="flex flex-col gap-5">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard label="งานทั้งหมด"     value={String(total)}    sub={`${active} active · ${total - active} ร่าง`} icon={CalendarDays} />
        <StatCard label="งาน Active"      value={String(active)}   sub="เผยแพร่แล้ว"                                 icon={TrendingUp}   />
        <StatCard label="ผู้เข้าร่วมรวม" value={attendees.toLocaleString("th-TH")} sub="ทุกงานรวมกัน"              icon={Users}        />
        <StatCard label="รายได้รวม"       value={baht(revenue)}    sub="ประมาณการจากยอดบัตร"                         icon={Ticket}       />
      </div>

      {/* Table + right panel */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_220px]">
        <div className="rounded-lg border border-border bg-background">
          <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
            <p className="text-sm font-semibold text-foreground">งานของฉัน</p>
            <Link
              href="/organizer/events/create"
              className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
            >
              <Plus className="size-3.5" />สร้างงาน
            </Link>
          </div>
          <div className="overflow-x-auto">
            <EventsTable events={events} />
          </div>
        </div>
        <RightPanel events={events} />
      </div>
    </div>
  );
}
