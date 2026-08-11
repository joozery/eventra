import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { CalendarCheck, QrCode, Ticket } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "เข้าสู่ระบบ — EVENTRA",
  description: "เข้าสู่ระบบ EVENTRA เพื่อค้นหา สร้าง และจัดการอีเวนต์ของคุณ",
};

const highlights = [
  { icon: Ticket, text: "จองบัตรและรับ Digital Ticket ได้ทันที" },
  { icon: QrCode, text: "เช็คอินเข้างานด้วย QR Code" },
  { icon: CalendarCheck, text: "จัดการอีเวนต์ของคุณเองแบบมืออาชีพ" },
];

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-600 p-10 text-white lg:flex">
        <div className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 size-80 rounded-full bg-white/10 blur-3xl" />

        <Link href="/" className="relative z-10 flex items-center">
          <Image
            src="/logo/logo.svg"
            alt="EVENTRA"
            width={176}
            height={36}
            priority
            className="h-9 w-auto object-contain brightness-0 invert"
          />
        </Link>

        <div className="relative z-10 max-w-md">
          <h2 className="text-3xl font-bold tracking-tight text-balance">
            Discover. Create. Experience.
          </h2>
          <p className="mt-3 text-indigo-100">
            แพลตฟอร์มอีเวนต์ครบวงจร ตั้งแต่ค้นหางาน จองบัตร
            ไปจนถึงจัดการอีเวนต์ของคุณเอง
          </p>
          <ul className="mt-8 flex flex-col gap-4">
            {highlights.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <Icon className="size-4.5" />
                </span>
                <span className="text-sm text-indigo-50">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-xs text-indigo-100/80">
          © {new Date().getFullYear()} EVENTRA. All rights reserved.
        </p>
      </div>

      <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" className="mb-8 flex items-center lg:hidden">
            <Image
              src="/logo/logo.svg"
              alt="EVENTRA"
              width={160}
              height={33}
              priority
              className="h-8 w-auto object-contain"
            />
          </Link>

          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            ยินดีต้อนรับกลับมา
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            เข้าสู่ระบบเพื่อค้นหาและจัดการอีเวนต์ของคุณ
          </p>

          <div className="mt-8">
            <Suspense fallback={null}>
              <LoginForm />
            </Suspense>
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            ยังไม่มีบัญชี?{" "}
            <Link
              href="/auth/register"
              className="font-medium text-primary hover:underline"
            >
              สมัครสมาชิก
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
