"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, CheckCircle2, Download, MapPin, Printer, QrCode, Share2, Ticket } from "lucide-react";
import type { MockEvent } from "@/lib/mock-data";
import type { OrderData } from "./checkout-shell";
import { FadeUp, StaggerIn, StaggerItem } from "@/components/ui/motion";
import { openPrintDocument } from "./print-document";

interface Props {
  event: MockEvent;
  order: OrderData;
  bookingRef: string;
}

export function StepSuccess({ event, order, bookingRef }: Props) {
  function share() {
    navigator.share?.({ title: `บัตร ${event.title}`, text: `รหัสการจอง: ${bookingRef}` }).catch(() => {});
  }

  return (
    <div className="flex flex-col items-center gap-8 pb-10">
      {/* Success icon */}
      <div className="flex flex-col items-center gap-3 pt-4 text-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 320, damping: 20, delay: 0.1 }}
          className="flex size-20 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/30"
        >
          <CheckCircle2 className="size-10 text-emerald-500" strokeWidth={1.5} />
        </motion.div>
        <FadeUp delay={0.2}>
          <h2 className="text-2xl font-bold text-foreground">การจองสำเร็จ!</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            ตั๋วของคุณถูกส่งไปที่ <span className="font-medium text-foreground">{order.buyerEmail}</span>
          </p>
        </FadeUp>
      </div>

      {/* Ticket card */}
      <FadeUp delay={0.3} className="w-full max-w-md">
        {/* Perforated top edge */}
        <div className="flex items-center">
          <div className="h-px flex-1 border-t-2 border-dashed border-border" />
        </div>

        <div className="relative overflow-hidden rounded-xl border border-border bg-card">
          {/* Header band */}
          <div className={`flex items-center gap-3 bg-gradient-to-r p-5 ${event.gradient}`}>
            <div className="flex-1 min-w-0">
              <p className="truncate text-base font-bold text-white">{event.title}</p>
              <p className="mt-0.5 text-xs text-white/70">{event.category}</p>
            </div>
            <Ticket className="size-8 shrink-0 text-white/30" />
          </div>

          {/* Body */}
          <div className="p-5">
            {/* Booking ref */}
            <div className="mb-4 flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">รหัสการจอง</p>
                <p className="mt-0.5 font-mono text-xl font-bold tracking-widest text-foreground">{bookingRef}</p>
              </div>
              <div className="rounded-lg border border-border bg-card p-2">
                <QrCode className="size-10 text-foreground/60" strokeWidth={1.2} />
              </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border p-3">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">วันที่</p>
                <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <Calendar className="size-3.5 shrink-0 text-muted-foreground" />
                  {event.endDate ? `${event.date} – ${event.endDate}` : event.date}
                </p>
              </div>
              <div className="rounded-xl border border-border p-3">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">สถานที่</p>
                <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <MapPin className="size-3.5 shrink-0 text-muted-foreground" />
                  <span className="line-clamp-1">{event.location}</span>
                </p>
              </div>
              <div className="rounded-xl border border-border p-3">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">ผู้ซื้อ</p>
                <p className="mt-1 truncate text-xs font-semibold text-foreground">{order.buyerName}</p>
              </div>
              <div className="rounded-xl border border-border p-3">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">จำนวน</p>
                <p className="mt-1 text-xs font-semibold text-foreground">
                  {order.items.reduce((a, b) => a + b.qty, 0)} ใบ
                </p>
              </div>
            </div>

            {/* Tickets list */}
            <div className="mt-3 space-y-1.5 rounded-xl border border-border p-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.name} × {item.qty}</span>
                  <span className="font-medium">฿{(item.price * item.qty).toLocaleString("th-TH")}</span>
                </div>
              ))}
              {order.discount > 0 && (
                <div className="flex justify-between border-t border-border pt-1.5 text-sm">
                  <span className="text-muted-foreground">ส่วนลด</span>
                  <span>−฿{order.discount.toLocaleString("th-TH")}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-border pt-1.5">
                <span className="text-sm font-semibold text-foreground">ยอดรวม</span>
                <span className="text-sm font-bold text-foreground">
                  {order.total === 0 ? "ฟรี" : `฿${order.total.toLocaleString("th-TH")}`}
                </span>
              </div>
            </div>
          </div>

          {/* Perforated divider */}
          <div className="relative flex items-center px-4">
            <div className="absolute -left-3 size-6 rounded-full bg-background border border-border" />
            <div className="h-px flex-1 border-t-2 border-dashed border-border" />
            <div className="absolute -right-3 size-6 rounded-full bg-background border border-border" />
          </div>

          {/* Bottom stub */}
          <div className="flex items-center justify-center gap-2 p-4 text-xs text-muted-foreground">
            <Ticket className="size-3.5" />
            กรุณาแสดงตั๋วนี้ที่ประตูทางเข้า
          </div>
        </div>

        {/* Perforated bottom edge */}
        <div className="flex items-center">
          <div className="h-px flex-1 border-t-2 border-dashed border-border" />
        </div>
      </FadeUp>

      {/* Actions */}
      <FadeUp delay={0.45} className="flex w-full max-w-md flex-col gap-3">
        <div className="flex gap-3">
          <button type="button" onClick={share}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card text-sm font-semibold text-foreground hover:bg-muted transition-colors">
            <Share2 className="size-4" />แชร์ตั๋ว
          </button>
          <button type="button"
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-foreground text-sm font-semibold text-background hover:opacity-90 transition-opacity">
            <Download className="size-4" />ดาวน์โหลดตั๋ว
          </button>
        </div>
        <button type="button"
          onClick={() => openPrintDocument("invoice", event, order, order.receiptInfo ?? null, bookingRef)}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border bg-card text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <Printer className="size-4" />
          พิมพ์ใบแจ้งหนี้ / ใบเสร็จรับเงิน
        </button>
      </FadeUp>

      <Link href="/events" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
        ← ดูอีเวนต์อื่นๆ
      </Link>
    </div>
  );
}
