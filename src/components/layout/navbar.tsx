"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Award, CalendarPlus, LayoutDashboard, LogOut, Menu, Receipt, Search, Ticket, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { useLocale } from "@/components/providers/locale-provider";
import { cn } from "@/lib/utils";

type SessionUser = { id: string; email: string; name: string; avatarUrl?: string | null } | null;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<SessionUser>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLocale();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user ?? null))
      .catch(() => setUser(null));
  }, [pathname]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setUserMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  const navLinks = [
    { href: "/events", label: t.nav.events },
    { href: "/shop", label: t.nav.categories },
    { href: "/articles", label: t.nav.articles },
    { href: "/organizers", label: t.nav.organizers },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md transition-shadow",
        scrolled
          ? "border-border shadow-sm shadow-black/[0.03]"
          : "border-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/logo/logo.svg"
            alt="EVENTRA"
            width={176}
            height={36}
            priority
            className="h-8 w-auto object-contain sm:h-9"
          />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-indigo-50 text-primary dark:bg-indigo-950/40"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden shrink-0 items-center gap-1 md:flex">
          <Link
            href="/search"
            aria-label={t.nav.search}
            className="inline-flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Search className="size-[18px]" />
          </Link>
          <LanguageSwitcher />
          {user ? (
            <div className="relative ml-1">
              <button
                type="button"
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 transition-colors hover:bg-muted"
              >
                <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-sm font-semibold text-white">
                  {user.avatarUrl
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={user.avatarUrl} alt={user.name} className="size-full object-cover" />
                    : user.name.charAt(0).toUpperCase()}
                </span>
                <span className="max-w-28 truncate text-sm font-medium text-foreground">
                  {user.name}
                </span>
              </button>
              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-xl border border-border bg-card shadow-lg shadow-black/5">
                    <div className="border-b border-border px-4 py-3">
                      <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="p-1">
                      <Link
                        href="/account"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted"
                      >
                        <User className="size-4 text-muted-foreground" />
                        บัญชีของฉัน
                      </Link>
                      <Link
                        href="/account/tickets"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted"
                      >
                        <Ticket className="size-4 text-muted-foreground" />
                        ตั๋วของฉัน
                      </Link>
                      <Link
                        href="/account/orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted"
                      >
                        <Receipt className="size-4 text-muted-foreground" />
                        คำสั่งซื้อของฉัน
                      </Link>
                      <Link
                        href="/account/certificates"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted"
                      >
                        <Award className="size-4 text-muted-foreground" />
                        ใบประกาศนียบัตรของฉัน
                      </Link>
                      <div className="my-1 border-t border-border" />
                      <Link
                        href="/organizer/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted"
                      >
                        <LayoutDashboard className="size-4 text-muted-foreground" />
                        แดชบอร์ดผู้จัด
                      </Link>
                      <Link
                        href="/organizer/events/create"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-indigo-700 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/30"
                      >
                        <CalendarPlus className="size-4" />
                        สร้างงานของฉัน
                      </Link>
                      <div className="my-1 border-t border-border" />
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                      >
                        <LogOut className="size-4" />
                        ออกจากระบบ
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Button
              variant="ghost"
              size="lg"
              className="ml-1 rounded-full"
              nativeButton={false}
              render={<Link href="/auth/login" />}
            >
              {t.nav.login}
            </Button>
          )}
          <Button
            size="lg"
            className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm shadow-indigo-600/20 transition-colors hover:from-indigo-700 hover:to-purple-700 hover:bg-none"
            nativeButton={false}
            render={<Link href="/organizer/events/create" />}
          >
            {t.nav.createEvent}
          </Button>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-full p-2 text-foreground hover:bg-muted"
            aria-label={t.nav.openMenu}
            aria-expanded={open}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-lg px-3 py-2.5 text-sm font-medium",
                    active
                      ? "bg-indigo-50 text-primary dark:bg-indigo-950/40"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/search"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Search className="size-4" />
              {t.nav.search}
            </Link>
          </nav>
          <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
            {user ? (
              <>
                <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2.5">
                  <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-sm font-semibold text-white">
                    {user.avatarUrl
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={user.avatarUrl} alt={user.name} className="size-full object-cover" />
                      : user.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <Link
                  href="/account"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                >
                  <User className="size-4 text-muted-foreground" />
                  บัญชีของฉัน
                </Link>
                <Link
                  href="/account/tickets"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                >
                  <Ticket className="size-4 text-muted-foreground" />
                  ตั๋วของฉัน
                </Link>
                <Link
                  href="/account/orders"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                >
                  <Receipt className="size-4 text-muted-foreground" />
                  คำสั่งซื้อของฉัน
                </Link>
                <Link
                  href="/account/certificates"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                >
                  <Award className="size-4 text-muted-foreground" />
                  ใบประกาศนียบัตรของฉัน
                </Link>
                <Link
                  href="/organizer/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                >
                  <LayoutDashboard className="size-4 text-muted-foreground" />
                  แดชบอร์ดผู้จัด
                </Link>
                <Link
                  href="/organizer/events/create"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-indigo-700 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/30"
                >
                  <CalendarPlus className="size-4" />
                  สร้างงานของฉัน
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  <LogOut className="size-4" />
                  ออกจากระบบ
                </button>
              </>
            ) : (
              <Button
                variant="outline"
                size="lg"
                className="rounded-full"
                nativeButton={false}
                render={<Link href="/auth/login" />}
              >
                {t.nav.login}
              </Button>
            )}
            <Button
              size="lg"
              className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:bg-none"
              nativeButton={false}
              render={<Link href="/organizer/events/create" />}
            >
              {t.nav.createEvent}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
