"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ClipboardList, FileText, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { label: "ผู้ซื้อบัตร",       icon: Users,          suffix: ""               },
  { label: "ฟอร์มลงทะเบียน",   icon: FileText,       suffix: "/form"          },
  { label: "ผู้ลงทะเบียน",      icon: ClipboardList,  suffix: "/registrations" },
];

export function EventSubNav({
  slug,
  eventTitle,
}: {
  slug: string;
  eventTitle: string;
}) {
  const pathname = usePathname();
  const base     = `/organizer/dashboard/events/${slug}`;

  return (
    <div className="flex flex-col gap-3">
      {/* Back + title row */}
      <div className="flex items-center gap-3">
        <Link
          href="/organizer/dashboard/events"
          className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          กลับ
        </Link>
        <span className="text-muted-foreground/40">/</span>
        <p className="truncate text-sm font-medium text-foreground">{eventTitle}</p>
      </div>

      {/* Tab strip */}
      <div className="flex items-center gap-1 border-b border-border">
        {TABS.map(({ label, icon: Icon, suffix }) => {
          const href    = `${base}${suffix}`;
          const active  = pathname === href;
          return (
            <Link
              key={suffix}
              href={href}
              className={cn(
                "flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-xs font-medium transition-colors",
                active
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-3.5" />
              {label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
