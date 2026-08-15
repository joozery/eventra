"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { getUserEvents, type UserEvent } from "@/lib/user-events";
import { cn } from "@/lib/utils";
import { EventsTable } from "./events-table";

const TABS = [
  { key: "all",    label: "ทั้งหมด" },
  { key: "active", label: "เผยแพร่" },
  { key: "draft",  label: "ร่าง"    },
] as const;

type Tab = (typeof TABS)[number]["key"];

export function EventsPage() {
  const [events, setEvents]               = useState<UserEvent[] | null>(null);
  const [tab, setTab]   = useState<Tab>("all");
  const [query, setQuery] = useState("");

  useEffect(() => { getUserEvents().then(setEvents); }, []);

  const filtered = useMemo(() => {
    if (!events) return [];
    let list = events;
    if (tab !== "all") list = list.filter((e) => e.status === tab);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          (e.location ?? "").toLowerCase().includes(q) ||
          (e.category ?? "").toLowerCase().includes(q),
      );
    }
    return list;
  }, [events, tab, query]);

  const counts = useMemo(() => {
    if (!events) return { all: 0, active: 0, draft: 0 };
    return {
      all:    events.length,
      active: events.filter((e) => e.status === "active").length,
      draft:  events.filter((e) => e.status === "draft").length,
    };
  }, [events]);

  if (events === null) {
    return (
      <div className="space-y-2">
        <div className="h-12 animate-pulse rounded-lg bg-muted" />
        <div className="h-64 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-background">
        {/* Header row */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground">งานของฉัน</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">{events.length} รายการทั้งหมด</p>
          </div>
          <Link
            href="/organizer/events/create"
            className="flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background transition-opacity hover:opacity-80"
          >
            <Plus className="size-3.5" />
            สร้างงานใหม่
          </Link>
        </div>

        {/* Toolbar: tabs + search */}
        <div className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-2.5">
          <div className="flex items-center gap-0.5">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  tab === t.key
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 py-px text-[10px] font-semibold tabular-nums",
                    tab === t.key ? "bg-background/20 text-background" : "bg-muted text-muted-foreground",
                  )}
                >
                  {counts[t.key]}
                </span>
              </button>
            ))}
          </div>

          <div className="ml-auto">
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 size-3.5 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ค้นหางาน..."
                className="h-8 w-44 rounded-md border border-border bg-transparent pl-8 pr-3 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"
              />
            </div>
          </div>
        </div>

        {/* List */}
        <div className="overflow-x-auto">
          <EventsTable
            events={filtered}
            showEmpty={query === "" && tab === "all"}
          />
        </div>
      </div>
  );
}
