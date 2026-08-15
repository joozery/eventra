"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Send, ChevronRight } from "lucide-react";
import { useToast } from "@/components/ui/toast-provider";

/* ─── Brand SVGs ───────────────────────────────────────────────── */

function LineSvg() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="size-6 shrink-0">
      <rect width="48" height="48" rx="12" fill="#00B900" />
      <path d="M39 22.6C39 15.6 32.1 10 24 10S9 15.6 9 22.6c0 6.3 5.6 11.5 13.1 12.5.5.1 1.2.4 1.4.8.2.4.1.9.1.9l-.2 1.4c-.1.4-.3 1.5 1.3.8 1.6-.7 8.6-5 11.7-8.7C38.1 27.5 39 25.2 39 22.6z" fill="white" />
    </svg>
  );
}

function EmailSvg() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="size-6 shrink-0">
      <rect width="48" height="48" rx="12" fill="#EA4335" />
      <path d="M10 16l14 9 14-9" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="10" y="15" width="28" height="18" rx="2" stroke="white" strokeWidth="2.5" fill="none" />
    </svg>
  );
}

function PhoneSvg() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="size-6 shrink-0">
      <rect width="48" height="48" rx="12" fill="#34A853" />
      <path d="M30.5 28.9l-2.7-.3c-.6-.1-1.2.1-1.7.5l-1.9 1.9c-2.9-1.5-5.3-3.9-6.8-6.8l1.9-1.9c.4-.5.6-1.1.5-1.7l-.3-2.7c-.2-1-.9-1.7-1.9-1.7h-2.4c-1.1 0-2 .9-1.9 2 .4 5.5 2.8 10.7 6.9 14.8 4.1 4.1 9.3 6.5 14.8 6.9 1.1.1 2-.8 2-1.9v-2.4c0-1-.7-1.8-1.5-1.7z" fill="white" />
    </svg>
  );
}

function FacebookSvg() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="size-6 shrink-0">
      <rect width="48" height="48" rx="12" fill="#1877F2" />
      <path d="M26.5 38V25.5H30l.6-4H26.5v-2.5c0-1.1.5-2 2.2-2H31V13s-2-.3-3.9-.3c-4 0-6.6 2.4-6.6 6.8V21.5h-3.5v4H20.5V38h6z" fill="white" />
    </svg>
  );
}

/* ─── Channels ─────────────────────────────────────────────────── */

const CHANNELS = [
  { icon: LineSvg,     label: "LINE OA",   href: "https://line.me/R/ti/p/@eventra", desc: "ตอบเร็วที่สุด" },
  { icon: EmailSvg,    label: "Email",     href: "mailto:support@eventra.th",       desc: "ภายใน 24 ชม."  },
  { icon: PhoneSvg,    label: "โทรศัพท์", href: "tel:02xxxxxxxx",                  desc: "จ-ศ 9:00–18:00"},
  { icon: FacebookSvg, label: "Facebook",  href: "https://fb.com/eventra",          desc: "Facebook Page" },
];

/* ─── Form ─────────────────────────────────────────────────────── */

function ContactForm({ onSuccess }: { onSuccess: () => void }) {
  const { success } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm]       = useState({ subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subject.trim() || !form.message.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      success("ส่งข้อความสำเร็จแล้ว", "ทีมงานจะติดต่อกลับภายใน 24 ชั่วโมง");
      onSuccess();
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-foreground">หัวข้อ <span className="text-rose-500">*</span></label>
        <input
          required
          value={form.subject}
          onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
          placeholder="เช่น ปัญหาการสร้างงาน, สอบถามแพ็กเกจ..."
          className="w-full rounded-lg border border-border bg-muted/20 px-3.5 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/60 transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-foreground">รายละเอียด <span className="text-rose-500">*</span></label>
        <textarea
          required
          rows={4}
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          placeholder="อธิบายปัญหาหรือคำถามของคุณโดยละเอียด เพื่อให้ทีมงานช่วยเหลือได้รวดเร็วขึ้น..."
          className="w-full resize-none rounded-lg border border-border bg-muted/20 px-3.5 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/60 transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {loading
          ? <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          : <Send className="size-4" />
        }
        {loading ? "กำลังส่ง..." : "ส่งข้อความ"}
      </button>
    </form>
  );
}

/* ─── Dialog content ───────────────────────────────────────────── */

function SupportDialogContent({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex min-h-[420px]">

      {/* Left — brand + channels */}
      <div className="relative flex w-56 shrink-0 flex-col overflow-hidden rounded-l-xl bg-gradient-to-b from-primary to-violet-600 p-5">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-10 -left-10 size-40 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-8 -right-8 size-32 rounded-full bg-white/10 blur-2xl" />

        {/* Logo + title */}
        <div className="relative flex flex-col gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo/iconbrowser.svg" alt="EVENTRA" className="size-11 rounded-xl shadow-lg" />
          <div>
            <p className="text-sm font-bold text-white">EVENTRA Support</p>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              <p className="text-[10px] text-white/70">ออนไลน์ 24/7</p>
            </div>
          </div>
        </div>

        {/* Channels */}
        <div className="relative mt-6 flex flex-col gap-2">
          <p className="mb-1 text-[9px] font-semibold uppercase tracking-widest text-white/40">ช่องทางติดต่อ</p>
          {CHANNELS.map(({ icon: Icon, label, href, desc }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition-all hover:bg-white/10"
            >
              <Icon />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white">{label}</p>
                <p className="text-[10px] text-white/50">{desc}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Bottom note */}
        <p className="relative mt-auto pt-6 text-[10px] leading-relaxed text-white/30">
          ไม่มีค่าใช้จ่าย · ตอบกลับภายใน 24 ชม.
        </p>
      </div>

      {/* Right — form */}
      <div className="flex flex-1 flex-col gap-5 p-6">
        <div>
          <p className="text-sm font-bold text-foreground">ส่งข้อความหาเรา</p>
          <p className="mt-0.5 text-xs text-muted-foreground">กรอกรายละเอียด ทีมงานจะติดต่อกลับโดยเร็ว</p>
        </div>
        <ContactForm onSuccess={onClose} />
      </div>

    </div>
  );
}

/* ─── Export ───────────────────────────────────────────────────── */

export function SupportDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<span className="contents" />} nativeButton={false}>
        {children}
      </DialogTrigger>
      <DialogContent className="w-full max-w-[calc(100%-2rem)] sm:max-w-2xl p-0 gap-0 overflow-hidden" showCloseButton>
        <SupportDialogContent onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
