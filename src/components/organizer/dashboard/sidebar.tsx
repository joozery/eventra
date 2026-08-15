"use client";

import Link from "next/link";
import {
  BarChart3,
  CalendarDays,
  ExternalLink,
  LayoutDashboard,
  Package,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { id: "overview", icon: LayoutDashboard, label: "ภาพรวม" },
  { id: "events",   icon: CalendarDays,    label: "งานของฉัน" },
  { id: "package",  icon: Package,         label: "แพ็กเกจ" },
  { id: "stats",    icon: BarChart3,       label: "สถิติ",    soon: true },
  { id: "settings", icon: Settings,        label: "ตั้งค่า",  soon: true },
];

interface Props {
  active: string;
  setActive: (id: string) => void;
  count: number;
}

export function Sidebar({ active, setActive, count }: Props) {
  return (
    <aside className="flex w-52 shrink-0 flex-col border-r border-border bg-background">
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-border px-4">
        <Link href="/" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo/logo.svg" alt="EVENTRA" className="h-6 w-auto" />
        </Link>
      </div>

      {/* Section label */}
      <div className="px-4 pt-5 pb-1">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
          Organizer
        </p>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-0.5 px-2 pb-2">
        {NAV.map(({ id, icon: Icon, label, soon }) => {
          const on = active === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => !soon && setActive(id)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                on
                  ? "bg-muted font-medium text-foreground"
                  : soon
                  ? "cursor-default text-muted-foreground/30"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span className="flex-1 text-left">{label}</span>
              {id === "events" && count > 0 && (
                <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                  {count}
                </span>
              )}
              {soon && (
                <span className="rounded-full border border-border px-1.5 py-0.5 text-[9px] text-muted-foreground/30">
                  soon
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-3">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <ExternalLink className="size-3.5" />
          กลับสู่หน้าหลัก
        </Link>
      </div>
    </aside>
  );
}
