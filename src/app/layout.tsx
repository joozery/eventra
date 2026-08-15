import type { Metadata } from "next";
import { Inter, Noto_Sans_Thai, Geist_Mono } from "next/font/google";
import { LocaleProvider } from "@/components/providers/locale-provider";
import { CookieConsent } from "@/components/layout/cookie-consent";
import { ToastProvider } from "@/components/ui/toast-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-thai",
  subsets: ["thai"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EVENTRA — Discover. Create. Experience.",
  description:
    "EVENTRA คือแพลตฟอร์ม Event Technology สำหรับค้นหา สร้าง จัดการ และเข้าร่วมงานอีเวนต์ในระบบเดียว",
  icons: {
    icon: "/logo/iconbrowser.svg",
    shortcut: "/logo/iconbrowser.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="th"
      className={`${inter.variable} ${notoSansThai.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <LocaleProvider>
          <ToastProvider>
            {children}
            <CookieConsent />
          </ToastProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
