"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Coffee, Music2, Sparkles, Zap } from "lucide-react";
import type { DaySchedule, ScheduleItem } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { CrossFade, StaggerIn, StaggerItem } from "@/components/ui/motion";

const TYPE_CONFIG = {
  main: {
    accent: "bg-amber-400",
    badge: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40",
    card: "bg-gradient-to-r from-amber-50/80 to-transparent border-amber-200/60 dark:from-amber-950/20 dark:border-amber-800/30",
    Icon: Sparkles,
    label: "HIGHLIGHT",
  },
  side: {
    accent: "bg-indigo-400",
    badge: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/40",
    card: "bg-card border-border",
    Icon: Music2,
    label: "SHOW",
  },
  break: {
    accent: "bg-muted-foreground/30",
    badge: "bg-muted text-muted-foreground border-border",
    card: "bg-muted/30 border-border",
    Icon: Coffee,
    label: "BREAK",
  },
};

function ScheduleItem({ item, isLast }: { item: ScheduleItem; isLast: boolean }) {
  const cfg = TYPE_CONFIG[item.type ?? "side"];
  const isMain = item.type === "main";

  return (
    <div className="flex gap-4">
      {/* Time + line */}
      <div className="flex w-14 shrink-0 flex-col items-end">
        <span className="mt-3.5 font-mono text-xs font-medium text-muted-foreground tabular-nums">
          {item.time}
        </span>
        {!isLast && <div className="mt-2 w-px flex-1 bg-border" />}
      </div>

      {/* Dot */}
      <div className="flex flex-col items-center">
        <div className={cn("mt-3 size-2.5 shrink-0 rounded-full ring-2 ring-background", cfg.accent)} />
        {!isLast && <div className="mt-2 w-px flex-1 bg-border" />}
      </div>

      {/* Card */}
      <div className={cn("mb-3 flex-1 overflow-hidden rounded-xl border", cfg.card)}>
        {/* Colored top accent for main */}
        {isMain && <div className="h-0.5 w-full bg-gradient-to-r from-amber-400 to-orange-400" />}
        <div className="flex items-start gap-3 p-3.5">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className={cn(
                "font-semibold leading-snug",
                isMain ? "text-sm text-foreground sm:text-base" : "text-sm text-foreground"
              )}>
                {item.title}
              </span>
              <span className={cn(
                "shrink-0 rounded-full border px-2 py-0.5 font-mono text-[9px] font-bold tracking-widest",
                cfg.badge
              )}>
                {cfg.label}
              </span>
            </div>
            {item.description && (
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            )}
          </div>
          <cfg.Icon className={cn(
            "mt-0.5 shrink-0",
            isMain ? "size-4 text-amber-400" : "size-3.5 text-muted-foreground/50"
          )} />
        </div>
      </div>
    </div>
  );
}

export function EventSchedule({ schedule }: { schedule: DaySchedule[] }) {
  const [active, setActive] = useState(0);
  const day = schedule[active];

  return (
    <div>
      {/* Day tabs */}
      <div className="relative mb-5">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {schedule.map((d, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "group relative flex shrink-0 flex-col gap-0.5 rounded-xl border px-5 py-3 text-left transition-all",
                i === active
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card text-foreground hover:border-foreground/40 hover:bg-muted"
              )}
            >
              <span className="text-xs font-bold tracking-wide">{d.day}</span>
              <span className={cn("text-[11px]", i === active ? "text-background/70" : "text-muted-foreground")}>
                {d.date}
              </span>
              {/* Item count badge */}
              <span className={cn(
                "absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full text-[9px] font-bold",
                i === active ? "bg-background text-foreground" : "bg-muted text-muted-foreground"
              )}>
                {d.items.filter((it) => it.type === "main").length}
                <Zap className="size-2.5 ml-px" />
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Summary bar */}
      <div className="mb-4 flex items-center gap-4 rounded-xl border border-border bg-muted/30 px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <div className="size-2 rounded-full bg-amber-400" />
          <span className="text-xs text-muted-foreground">
            {day.items.filter((it) => it.type === "main").length} Highlight
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="size-2 rounded-full bg-indigo-400" />
          <span className="text-xs text-muted-foreground">
            {day.items.filter((it) => it.type === "side").length} Show
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="size-2 rounded-full bg-muted-foreground/40" />
          <span className="text-xs text-muted-foreground">
            {day.items.filter((it) => it.type === "break").length} Break
          </span>
        </div>
        <div className="ml-auto font-mono text-xs text-muted-foreground">
          {day.items[0]?.time} – {day.items[day.items.length - 1]?.time}
        </div>
      </div>

      {/* Timeline */}
      <AnimatePresence mode="wait">
        <CrossFade id={active} className="origin-top">
          <StaggerIn>
            {day.items.map((item, i) => (
              <StaggerItem key={i}>
                <ScheduleItem item={item} isLast={i === day.items.length - 1} />
              </StaggerItem>
            ))}
          </StaggerIn>
        </CrossFade>
      </AnimatePresence>
    </div>
  );
}
