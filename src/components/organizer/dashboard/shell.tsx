"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  LayoutDashboard,
  Package,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Wallet,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SupportDialog } from "./support-dialog";

/* ─── Nav config ──────────────────────────────────────────────── */

const NAV = [
  { href: "/organizer/dashboard",         icon: LayoutDashboard, label: "ภาพรวม"   },
  { href: "/organizer/dashboard/events",  icon: CalendarDays,    label: "งานของฉัน", badge: 3 },
  { href: "/organizer/dashboard/stats",   icon: BarChart3,       label: "สถิติ"      },
  { href: "/organizer/dashboard/finance", icon: Wallet,          label: "การเงิน",   badge: 1 },
  { href: "/organizer/dashboard/package", icon: Package,         label: "แพ็กเกจ"    },
  { href: "/organizer/dashboard/settings",icon: Settings,        label: "ตั้งค่า", soon: true },
];

/* ─── Sidebar ─────────────────────────────────────────────────── */

function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();

  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch]       = useState("");
  const [searching, setSearching] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  /* persist collapse state */
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved === "true") setCollapsed(true);
  }, []);
  const toggleCollapse = () => {
    setCollapsed((v) => {
      localStorage.setItem("sidebar-collapsed", String(!v));
      return !v;
    });
  };

  /* open search */
  const openSearch = () => {
    if (collapsed) { setCollapsed(false); localStorage.setItem("sidebar-collapsed", "false"); }
    setSearching(true);
    setTimeout(() => searchRef.current?.focus(), 80);
  };
  const closeSearch = () => { setSearch(""); setSearching(false); };

  /* submit search → go to events */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/organizer/dashboard/events?q=${encodeURIComponent(search.trim())}`);
      closeSearch();
    }
  };

  const totalBadge = NAV.reduce((s, n) => s + (n.badge ?? 0), 0);

  return (
    <aside
      className={cn(
        "relative flex shrink-0 flex-col border-r border-border bg-background transition-all duration-300",
        collapsed ? "w-[68px]" : "w-60",
      )}
    >
      {/* Logo row */}
      <div className="flex h-16 items-center justify-between px-4">
        {!collapsed && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/logo/logo.svg" alt="EVENTRA" className="h-5 w-auto" />
        )}
        <button
          type="button"
          onClick={toggleCollapse}
          title={collapsed ? "ขยาย sidebar" : "ย่อ sidebar"}
          className={cn(
            "flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
            collapsed && "mx-auto",
          )}
        >
          {collapsed
            ? <ChevronRight className="size-3.5" />
            : <ChevronLeft  className="size-3.5" />
          }
        </button>
      </div>

      {/* Search bar */}
      {!collapsed && (
        <div className="px-3 pb-3">
          {searching ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 ring-1 ring-border">
              <Search className="size-3.5 shrink-0 text-muted-foreground" />
              <input
                ref={searchRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ค้นหางาน..."
                className="flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
              />
              <button type="button" onClick={closeSearch} className="text-muted-foreground hover:text-foreground">
                <X className="size-3.5" />
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={openSearch}
              className="flex w-full items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-border hover:bg-muted hover:text-foreground"
            >
              <Search className="size-3.5 shrink-0" />
              <span className="flex-1 text-left">ค้นหา...</span>
              <kbd className="rounded border border-border px-1 text-[9px]">⌘K</kbd>
            </button>
          )}
        </div>
      )}

      {/* Collapsed search icon */}
      {collapsed && (
        <div className="px-2 pb-2">
          <button
            type="button"
            onClick={openSearch}
            className="flex w-full items-center justify-center rounded-xl py-2.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Search className="size-4" />
          </button>
        </div>
      )}

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-0.5 px-2">
        {!collapsed && (
          <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/40">
            เมนู
          </p>
        )}

        {NAV.map(({ href, icon: Icon, label, badge, soon }) => {
          const active =
            pathname === href ||
            (href !== "/organizer/dashboard" && pathname.startsWith(href + "/"));

          return (
            <Link
              key={href}
              href={soon ? "#" : href}
              aria-disabled={soon}
              title={collapsed ? label : undefined}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm transition-all",
                collapsed && "justify-center px-0",
                active
                  ? "bg-primary text-primary-foreground font-medium shadow-sm"
                  : soon
                  ? "pointer-events-none text-muted-foreground/25"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {/* Icon box */}
              <span className={cn(
                "relative flex size-7 shrink-0 items-center justify-center rounded-lg transition-all",
                active ? "bg-white/20" : "bg-muted group-hover:bg-background",
              )}>
                <Icon className="size-3.5" />
                {/* Badge dot (collapsed mode) */}
                {collapsed && !!badge && (
                  <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                    {badge}
                  </span>
                )}
              </span>

              {/* Label + badge (expanded) */}
              {!collapsed && (
                <>
                  <span className="flex-1">{label}</span>
                  {soon && (
                    <span className="rounded-md bg-muted px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground/40">soon</span>
                  )}
                  {!!badge && !soon && (
                    <span className={cn(
                      "flex size-5 items-center justify-center rounded-full text-[10px] font-bold",
                      active ? "bg-white/25 text-white" : "bg-rose-100 text-rose-600",
                    )}>
                      {badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={cn("border-t border-border px-2 py-3", collapsed && "px-2")}>

        {/* Support card */}
        {!collapsed && (
          <div className="mb-2 overflow-hidden rounded-xl bg-primary/8 px-4 py-3.5">
            <div className="flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo/iconbrowser.svg" alt="EVENTRA" className="size-7 shrink-0 rounded-lg" />
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-foreground">EVENTRA Support</p>
                <p className="text-[10px] text-muted-foreground">พร้อมช่วยเหลือตลอด 24/7</p>
              </div>
            </div>
            <SupportDialog>
              <button
                type="button"
                className="mt-3 flex w-full items-center justify-center rounded-lg bg-primary px-3 py-1.5 text-[11px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                ติดต่อทีมงาน
              </button>
            </SupportDialog>
          </div>
        )}

        {/* Collapsed support icon */}
        {collapsed && (
          <SupportDialog>
            <button
              type="button"
              title="ติดต่อ EVENTRA Support"
              className="mb-1 flex w-full items-center justify-center rounded-xl py-2.5"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo/iconbrowser.svg" alt="EVENTRA" className="size-7 rounded-lg" />
            </button>
          </SupportDialog>
        )}

        <Link
          href="/"
          title={collapsed ? "กลับสู่หน้าหลัก" : undefined}
          className={cn(
            "group flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm text-muted-foreground transition-all hover:bg-muted hover:text-foreground",
            collapsed && "justify-center px-0",
          )}
        >
          <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted transition-all group-hover:bg-background">
            <ExternalLink className="size-3.5" />
          </span>
          {!collapsed && "กลับสู่หน้าหลัก"}
        </Link>

        {/* Profile */}
        <div className={cn(
          "mt-1 flex items-center gap-3 rounded-xl px-2.5 py-2.5",
          collapsed && "justify-center px-0",
        )}>
          <div className="relative flex size-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-[11px] font-bold text-white">
            O
            {collapsed && totalBadge > 0 && (
              <span className="absolute -top-1 -right-1 flex size-3.5 items-center justify-center rounded-full bg-rose-500 text-[8px] font-bold text-white">
                {totalBadge}
              </span>
            )}
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-foreground">Organizer</p>
              <p className="truncate text-[10px] text-muted-foreground/60">จัดการงานของฉัน</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

/* ─── Header ──────────────────────────────────────────────────── */

const TITLES: Record<string, string> = {
  "/organizer/dashboard":          "ภาพรวม",
  "/organizer/dashboard/events":   "งานของฉัน",
  "/organizer/dashboard/package":  "แพ็กเกจ",
  "/organizer/dashboard/stats":    "สถิติ",
  "/organizer/dashboard/finance":  "การเงิน",
  "/organizer/dashboard/settings": "ตั้งค่า",
};

function useBreadcrumbs(pathname: string) {
  if (pathname.startsWith("/organizer/dashboard/events/")) {
    const suffix = pathname.endsWith("/form")          ? "ฟอร์มลงทะเบียน"
                 : pathname.endsWith("/registrations") ? "ผู้ลงทะเบียน"
                 : "รายชื่อผู้ซื้อ";
    return [
      { href: "/organizer/dashboard/events", label: "งานของฉัน" },
      { href: null, label: suffix },
    ];
  }
  const title = TITLES[pathname];
  if (!title || pathname === "/organizer/dashboard") return [];
  return [{ href: null, label: title }];
}

function Header() {
  const pathname    = usePathname();
  const router      = useRouter();
  const breadcrumbs = useBreadcrumbs(pathname);

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-6">
      <div className="flex items-center gap-1.5 text-sm">
        <Link href="/organizer/dashboard" className="text-muted-foreground transition-colors hover:text-foreground">
          Organizer
        </Link>
        {breadcrumbs.map(({ href, label }) => (
          <span key={label} className="flex items-center gap-1.5">
            <ChevronRight className="size-3.5 text-muted-foreground/40" />
            {href
              ? <Link href={href} className="text-muted-foreground transition-colors hover:text-foreground">{label}</Link>
              : <span className="font-medium text-foreground">{label}</span>
            }
          </span>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          title="โหลดใหม่"
          onClick={() => router.refresh()}
          className="flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <RefreshCw className="size-3.5" />
        </button>
        <Link
          href="/organizer/events/create"
          className="flex items-center gap-1.5 rounded-md bg-foreground px-3.5 py-1.5 text-xs font-semibold text-background transition-opacity hover:opacity-80"
        >
          <Plus className="size-3.5" />สร้างงาน
        </Link>
      </div>
    </header>
  );
}

/* ─── Shell ───────────────────────────────────────────────────── */

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
