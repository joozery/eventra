import Image from "next/image";
import Link from "next/link";
import { Globe, MessageCircle, Send } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "ค้นหา Event", href: "/events" },
    { label: "สินค้า", href: "/shop" },
    { label: "ผู้จัดงาน", href: "/organizers" },
  ],
  Organizer: [
    { label: "สร้าง Event", href: "/organizer/events/create" },
    { label: "Dashboard", href: "/organizer" },
    { label: "Pricing", href: "/organizer/pricing" },
  ],
  Company: [
    { label: "ติดต่อเรา", href: "/contact" },
    { label: "ความเป็นส่วนตัว", href: "/privacy" },
    { label: "ข้อตกลงการใช้งาน", href: "/terms" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <Image
              src="/logo/logo.svg"
              alt="EVENTRA"
              width={176}
              height={36}
              className="h-8 w-auto object-contain"
            />
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Discover. Create. Experience. แพลตฟอร์ม Event Technology
              สำหรับค้นหา สร้าง และเข้าร่วมงานอีเวนต์ในระบบเดียว
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="#"
                aria-label="Website"
                className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground"
              >
                <Globe className="size-4" />
              </a>
              <a
                href="#"
                aria-label="Line"
                className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground"
              >
                <MessageCircle className="size-4" />
              </a>
              <a
                href="#"
                aria-label="Telegram"
                className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground"
              >
                <Send className="size-4" />
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-foreground">
                {title}
              </h3>
              <ul className="mt-4 flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>© 2026 EVENTRA. All rights reserved.</p>
          <p>Made for event creators &amp; attendees in Thailand</p>
        </div>
      </div>
    </footer>
  );
}
