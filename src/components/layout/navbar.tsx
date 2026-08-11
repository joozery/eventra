"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { useLocale } from "@/components/providers/locale-provider";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { t } = useLocale();

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
          <Button
            variant="ghost"
            size="lg"
            className="ml-1 rounded-full"
            nativeButton={false}
            render={<Link href="/auth/login" />}
          >
            {t.nav.login}
          </Button>
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
            <Button
              variant="outline"
              size="lg"
              className="rounded-full"
              nativeButton={false}
              render={<Link href="/auth/login" />}
            >
              {t.nav.login}
            </Button>
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
