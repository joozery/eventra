"use client";

import Link from "next/link";
import { CalendarPlus, ChevronRight, Crown, ExternalLink, Package, Zap } from "lucide-react";
import type { UserEvent } from "@/lib/user-events";
import { cn } from "@/lib/utils";

const PKG: Record<string, { label: string; cls: string; tier: number }> = {
  starter: { label: "Starter", cls: "bg-slate-100 text-slate-600",  tier: 0 },
  growth:  { label: "Growth",  cls: "bg-indigo-50 text-indigo-700", tier: 1 },
  pro:     { label: "Pro",     cls: "bg-amber-50  text-amber-700",  tier: 2 },
};

export function RightPanel({ events }: { events: UserEvent[] }) {
  const topPkg = events.reduce<string | null>((best, e) => {
    if (!e.packageTier) return best;
    return (PKG[e.packageTier]?.tier ?? -1) > (best ? (PKG[best]?.tier ?? -1) : -1)
      ? e.packageTier : best;
  }, null);

  const active = events.filter((e) => e.status === "active").slice(0, 4);

  return (
    <div className="flex flex-col gap-4">

      {/* Package status */}
      <div className="rounded-lg border border-border bg-background p-4">
        <p className="mb-3 text-xs font-semibold text-muted-foreground">แพ็กเกจปัจจุบัน</p>
        <div className="flex items-center justify-between">
          {topPkg
            ? <span className={cn("rounded-full px-3 py-1 text-sm font-semibold", PKG[topPkg].cls)}>{PKG[topPkg].label}</span>
            : <span className="text-sm text-muted-foreground">ยังไม่ได้เลือก</span>}
          <Link href="/organizer/package" className="text-xs text-indigo-600 hover:underline">
            {topPkg ? "อัปเกรด" : "เลือกแพ็กเกจ"} →
          </Link>
        </div>
        <div className="mt-3 flex gap-1">
          {["starter", "growth", "pro"].map((t) => (
            <div key={t} className={cn("h-1 flex-1 rounded-full",
              topPkg && PKG[topPkg].tier >= PKG[t].tier ? "bg-indigo-500" : "bg-border")} />
          ))}
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-muted-foreground/40">
          <span>Starter</span><span>Growth</span><span>Pro</span>
        </div>
      </div>

      {/* Active events */}
      <div className="rounded-lg border border-border bg-background p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold text-muted-foreground">งานที่เผยแพร่</p>
          <Link href="/organizer/events/create" className="text-[11px] text-indigo-600 hover:underline">
            + สร้างงาน
          </Link>
        </div>
        {active.length === 0 ? (
          <p className="text-xs text-muted-foreground">ยังไม่มีงานที่เผยแพร่</p>
        ) : (
          <div className="flex flex-col divide-y divide-border">
            {active.map((e) => (
              <Link key={e.slug} href={`/organizer/events/${e.slug}`}
                className="flex items-center gap-2.5 py-2.5 hover:opacity-70 transition-opacity">
                <div className={`flex size-7 shrink-0 items-center justify-center overflow-hidden rounded bg-gradient-to-br ${e.gradient}`}>
                  {e.organizerLogo
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={e.organizerLogo} alt="" className="size-full object-cover" />
                    : <Zap className="size-3 text-white/60" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-foreground">{e.title}</p>
                  <p className="text-[10px] text-muted-foreground">{e.date}</p>
                </div>
                <ChevronRight className="size-3.5 text-muted-foreground/30" />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="rounded-lg border border-border bg-background p-4">
        <p className="mb-2 text-xs font-semibold text-muted-foreground">ทางลัด</p>
        {[
          { label: "สร้างอีเวนต์ใหม่", href: "/organizer/events/create", icon: CalendarPlus },
          { label: "ดู Events สาธารณะ", href: "/events",                  icon: ExternalLink },
          { label: "เลือกแพ็กเกจ",     href: "/organizer/package",       icon: Crown },
          { label: "เลือกแพ็กเกจ",     href: "/organizer/package",       icon: Package },
        ]
          .filter((item, idx, arr) => arr.findIndex((x) => x.href === item.href) === idx)
          .map(({ label, href, icon: Icon }) => (
            <Link key={href} href={href}
              className="flex items-center gap-2 rounded-md px-2 py-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <Icon className="size-3.5 shrink-0" />{label}
            </Link>
          ))}
      </div>
    </div>
  );
}
