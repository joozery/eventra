"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle, Building2, Calendar, Check, ChevronDown, Clock,
  MapPin, Minus, PartyPopper, Plus, Printer, Tag, Ticket, User, X,
} from "lucide-react";
import type { MockEvent } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { InitialSelection, OrderData, ReceiptInfo, TierItem } from "./checkout-shell";
import { openPrintDocument } from "./print-document";

const VAT_RATE = 0.07;

const PROMO_CODES: Record<string, { type: "percent" | "fixed"; value: number; label: string }> = {
  EVENTRA10: { type: "percent", value: 10, label: "ส่วนลด 10%" },
  WELCOME20: { type: "percent", value: 20, label: "ส่วนลด 20%" },
  SAVE100:   { type: "fixed",   value: 100, label: "ลด ฿100" },
  MUSIC50:   { type: "fixed",   value: 50,  label: "ลด ฿50" },
};

type Tier = {
  id: string; name: string; price: number; originalPrice?: number;
  description: string; badge?: string; stock: number; recommended?: boolean;
};

function buildTiers(basePrice: number, selectedDay: number | null, mul: number): Tier[] {
  if (basePrice === 0) return [{ id: "free", name: "บัตรฟรี", price: 0, description: "ลงทะเบียนเข้าร่วมงานฟรี", stock: 999 }];
  const all = selectedDay === -1;
  return [
    { id: "early-bird", name: "Early Bird", price: Math.round((basePrice * (all ? 0.75 * mul : 0.8)) / 10) * 10, originalPrice: all ? basePrice * mul : basePrice, description: all ? `ราคาพิเศษรวม ${mul} วัน` : "ราคาพิเศษก่อนใคร", badge: "จำนวนจำกัด", stock: 23 },
    { id: "regular", name: "Regular", price: all ? Math.round((basePrice * mul * 0.9) / 10) * 10 : basePrice, description: all ? `บัตรปกติ รวม ${mul} วัน` : "บัตรราคาปกติ", stock: 120, recommended: true },
    { id: "vip", name: "VIP", price: all ? basePrice * 2 * mul : basePrice * 2, description: all ? "ที่นั่งพิเศษ + ของที่ระลึก ทุกวัน" : "ที่นั่งพิเศษ + ของที่ระลึก", badge: "พรีเมียม", stock: 48 },
  ];
}

function SectionLabel({ n, children }: { n: number; children: string }) {
  return (
    <div className="mb-3 flex items-center gap-2.5">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-foreground text-[11px] font-bold text-background">
        {n}
      </span>
      <span className="text-sm font-semibold text-foreground">{children}</span>
    </div>
  );
}

function Checkbox({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode }) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border-2 transition-colors",
          checked ? "border-foreground bg-foreground" : "border-border bg-transparent hover:border-foreground/50"
        )}
      >
        {checked && <Check className="size-3 text-background" strokeWidth={3} />}
      </button>
      <span className="text-sm leading-relaxed text-muted-foreground">{children}</span>
    </label>
  );
}

interface Props {
  event: MockEvent;
  initial: InitialSelection;
  onNext: (data: OrderData) => void;
}

export function StepOrder({ event, initial, onNext }: Props) {
  const router = useRouter();
  const isMultiDay = (event.schedule?.length ?? 0) > 1;
  const mul = event.schedule?.length ?? 1;

  const defaultDay = initial.selectedDay !== null ? initial.selectedDay : isMultiDay ? null : 0;
  const defaultPromo = initial.promoCode && PROMO_CODES[initial.promoCode]
    ? { ...PROMO_CODES[initial.promoCode], code: initial.promoCode }
    : null;

  const [selectedDay, setSelectedDay] = useState<number | null>(defaultDay);
  const [dayDropOpen, setDayDropOpen]   = useState(false);
  const [quantities, setQuantities]     = useState<Record<string, number>>(initial.quantities);
  const [promoInput, setPromoInput]     = useState(defaultPromo?.code ?? "");
  const [promoOpen, setPromoOpen]       = useState(false);
  const [promoError, setPromoError]     = useState("");
  const [appliedPromo, setAppliedPromo] = useState<(typeof PROMO_CODES[string] & { code: string }) | null>(defaultPromo);
  const [buyerName, setBuyerName]       = useState("");
  const [buyerEmail, setBuyerEmail]     = useState("");
  const [buyerPhone, setBuyerPhone]     = useState("");
  const [agreeTerms, setAgreeTerms]       = useState(false);
  const [agreeShare, setAgreeShare]       = useState(false);
  const [agreeNoRefund, setAgreeNoRefund] = useState(false);

  /* Receipt / tax invoice */
  const [wantReceipt, setWantReceipt]   = useState(false);
  const [receiptType, setReceiptType]   = useState<"personal" | "company">("personal");
  const [receiptName, setReceiptName]   = useState("");
  const [receiptTaxId, setReceiptTaxId] = useState("");
  const [receiptAddr, setReceiptAddr]   = useState("");
  const [receiptBranch, setReceiptBranch] = useState("");
  const [receiptEmail, setReceiptEmail] = useState("");

  /* 15-minute session timer */
  const SESSION = 15 * 60;
  const [timeLeft, setTimeLeft] = useState(SESSION);
  useEffect(() => {
    if (timeLeft <= 0) { router.push(`/events/${event.slug}`); return; }
    const id = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, [timeLeft, router, event.slug]);

  const tiers = buildTiers(event.price, selectedDay, mul);
  const totalQty  = Object.values(quantities).reduce((a, b) => a + b, 0);
  const subtotal  = tiers.reduce((s, t) => s + t.price * (quantities[t.id] ?? 0), 0);
  const discount  = appliedPromo
    ? appliedPromo.type === "percent" ? Math.round((subtotal * appliedPromo.value) / 100) : Math.min(appliedPromo.value, subtotal)
    : 0;
  const afterDiscount = subtotal - discount;
  const vat        = Math.round(afterDiscount * VAT_RATE);
  const grandTotal = afterDiscount + vat;

  function updateQty(id: string, delta: number) {
    setQuantities((p) => ({ ...p, [id]: Math.max(0, (p[id] ?? 0) + delta) }));
  }
  function applyPromo() {
    const code = promoInput.trim().toUpperCase();
    if (PROMO_CODES[code]) { setAppliedPromo({ ...PROMO_CODES[code], code }); setPromoError(""); setPromoOpen(false); }
    else setPromoError("รหัสไม่ถูกต้องหรือหมดอายุแล้ว");
  }
  const receiptInfo: ReceiptInfo | null = wantReceipt && receiptName && receiptTaxId && receiptAddr
    ? { type: receiptType, name: receiptName, taxId: receiptTaxId, address: receiptAddr, branch: receiptBranch || undefined, email: receiptEmail || undefined }
    : null;

  function handleNext() {
    const items: TierItem[] = tiers
      .filter((t) => (quantities[t.id] ?? 0) > 0)
      .map((t) => ({ id: t.id, name: t.name, price: t.price, qty: quantities[t.id] ?? 0 }));
    onNext({
      selectedDay, items,
      promo: appliedPromo ? { code: appliedPromo.code, type: appliedPromo.type, value: appliedPromo.value, label: appliedPromo.label } : null,
      subtotal, discount, total: afterDiscount, vat, grandTotal,
      buyerName, buyerEmail, buyerPhone, receiptInfo,
    });
  }

  function handlePrintQuotation() {
    const items: TierItem[] = tiers
      .filter((t) => (quantities[t.id] ?? 0) > 0)
      .map((t) => ({ id: t.id, name: t.name, price: t.price, qty: quantities[t.id] ?? 0 }));
    openPrintDocument("quotation", event, {
      selectedDay, items,
      promo: appliedPromo ? { code: appliedPromo.code, type: appliedPromo.type, value: appliedPromo.value, label: appliedPromo.label } : null,
      subtotal, discount, total: afterDiscount, vat, grandTotal,
      buyerName, buyerEmail, buyerPhone, receiptInfo,
    }, receiptInfo);
  }

  const allConsented = agreeTerms && agreeShare && agreeNoRefund;
  const canProceed   = totalQty > 0 && buyerName.trim() && buyerEmail.includes("@") && buyerPhone.trim() && allConsented;
  const dayLabel     = selectedDay === null ? "เลือกวันที่" : selectedDay === -1 ? `บัตรทุกวัน (${mul} วัน)` : event.schedule?.[selectedDay]?.day ?? "";
  const timerM       = Math.floor(timeLeft / 60);
  const timerS       = timeLeft % 60;
  const timerStr     = `${timerM}:${String(timerS).padStart(2, "0")}`;
  const timerWarn    = timeLeft <= 60;
  const timerCaution = timeLeft <= 5 * 60 && timeLeft > 60;

  return (
    <div className="space-y-5">

      {/* ── Session timer banner ── */}
      <div className={cn(
        "flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors",
        timerWarn
          ? "border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-950/20"
          : timerCaution
          ? "border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-950/20"
          : "border-border bg-card"
      )}>
        <Clock className={cn(
          "size-4 shrink-0",
          timerWarn ? "text-red-500" : timerCaution ? "text-amber-500" : "text-muted-foreground"
        )} />
        <span className={cn(
          "flex-1 text-sm",
          timerWarn ? "text-red-700 dark:text-red-300" : timerCaution ? "text-amber-700 dark:text-amber-300" : "text-muted-foreground"
        )}>
          {timerWarn ? "เวลาจวนจะหมด! กรุณาดำเนินการให้เสร็จโดยเร็ว" : "กรุณาชำระเงินภายในเวลาที่กำหนด — session หมดอายุแล้วระบบจะพาคุณกลับหน้าอีเวนต์"}
        </span>
        <span className={cn(
          "font-mono text-lg font-bold tabular-nums",
          timerWarn ? "text-red-600 dark:text-red-400" : timerCaution ? "text-amber-600 dark:text-amber-400" : "text-foreground"
        )}>
          {timerStr}
        </span>
      </div>

    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">

      {/* ─────────── LEFT ─────────── */}
      <div className="space-y-5">

        {/* Event card — banner style */}
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          {/* Banner strip */}
          <div className={cn("relative h-28 bg-gradient-to-r", event.gradient)}>
            {event.image && (
              <Image src={event.image} alt="" fill className="object-cover" sizes="100vw" />
            )}
            {/* overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />
            {/* content over image */}
            <div className="absolute inset-0 flex items-end justify-between gap-3 px-4 pb-3">
              <div className="min-w-0">
                <span className="inline-block rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold text-white/90 backdrop-blur-sm">
                  {event.category}
                </span>
                <p className="mt-1 text-base font-bold leading-snug text-white drop-shadow-sm">
                  {event.title}
                </p>
              </div>
              {/* thumbnail badge */}
              {event.image ? (
                <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border-2 border-white/25 shadow-lg">
                  <Image src={event.image} alt={event.title} fill className="object-cover" sizes="56px" />
                </div>
              ) : (
                <div className={cn("flex size-14 shrink-0 items-center justify-center rounded-lg border-2 border-white/20 bg-gradient-to-br", event.gradient)}>
                  <PartyPopper className="size-6 text-white/50" />
                </div>
              )}
            </div>
          </div>
          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2.5">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="size-3.5 shrink-0" />
              {event.endDate ? `${event.date} – ${event.endDate}` : `${event.date} · ${event.time}`}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="size-3.5 shrink-0" />
              <span className="truncate">{event.location}</span>
            </span>
          </div>
        </div>

        {/* ── Section 1: วันที่ ── */}
        {isMultiDay && event.schedule && (
          <div className="rounded-xl border border-border bg-card p-5">
            <SectionLabel n={1}>วันที่เข้าชม</SectionLabel>
            <div className="relative">
              <button type="button" onClick={() => setDayDropOpen((v) => !v)}
                className="flex w-full items-center justify-between rounded-xl border border-border bg-transparent px-4 py-3 text-sm transition-colors hover:bg-muted/50">
                <span className={selectedDay === null ? "text-muted-foreground" : "font-medium text-foreground"}>{dayLabel}</span>
                <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", dayDropOpen && "rotate-180")} />
              </button>
              {dayDropOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setDayDropOpen(false)} />
                  <div className="absolute left-0 right-0 top-full z-40 mt-1 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
                    {event.schedule.map((d, i) => (
                      <button key={i} type="button" onClick={() => { setSelectedDay(i); setQuantities({}); setDayDropOpen(false); }}
                        className={cn("flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-muted", selectedDay === i && "bg-muted")}>
                        <span className={cn("flex size-5 shrink-0 items-center justify-center rounded-full border text-[10px]", selectedDay === i ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground")}>{i + 1}</span>
                        <span className="flex flex-col text-left"><span className="font-medium">{d.day}</span><span className="text-xs text-muted-foreground">{d.date}</span></span>
                        {selectedDay === i && <Check className="ml-auto size-4" />}
                      </button>
                    ))}
                    <div className="border-t border-border" />
                    <button type="button" onClick={() => { setSelectedDay(-1); setQuantities({}); setDayDropOpen(false); }}
                      className={cn("flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-muted", selectedDay === -1 && "bg-muted")}>
                      <span className={cn("flex size-5 shrink-0 items-center justify-center rounded-full border text-[10px]", selectedDay === -1 ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground")}>✦</span>
                      <span className="flex flex-col text-left"><span className="font-medium">บัตรทุกวัน ({mul} วัน)</span><span className="text-xs text-muted-foreground">ราคาพิเศษ รวมทุกวัน</span></span>
                      {selectedDay === -1 && <Check className="ml-auto size-4" />}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ── Section 2: ประเภทบัตร ── */}
        {selectedDay !== null && (
          <div className="rounded-xl border border-border bg-card p-5">
            <SectionLabel n={isMultiDay ? 2 : 1}>ประเภทบัตร</SectionLabel>
            <div className="flex flex-col divide-y divide-border overflow-hidden rounded-xl border border-border">
              {tiers.map((tier) => {
                const qty = quantities[tier.id] ?? 0;
                return (
                  <div key={tier.id} className={cn("flex items-center gap-4 px-4 py-4", tier.recommended && "bg-muted/30")}>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-foreground">{tier.name}</span>
                        {(tier.recommended || tier.badge) && (
                          <span className="rounded-full border border-border px-2 py-px text-[10px] text-muted-foreground">
                            {tier.recommended ? "แนะนำ" : tier.badge}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{tier.description}</p>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-sm font-bold text-foreground">
                          {tier.price === 0 ? "ฟรี" : `฿${tier.price.toLocaleString("th-TH")}`}
                        </span>
                        {tier.originalPrice && tier.originalPrice > tier.price && (
                          <span className="text-xs text-muted-foreground line-through">฿{tier.originalPrice.toLocaleString("th-TH")}</span>
                        )}
                        <span className="text-[11px] text-muted-foreground">ยังเหลือ {tier.stock} ที่</span>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <button type="button" onClick={() => updateQty(tier.id, -1)} disabled={qty === 0}
                        className="flex size-8 items-center justify-center rounded-lg border border-border transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-30">
                        <Minus className="size-3.5" />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold tabular-nums">{qty}</span>
                      <button type="button" onClick={() => updateQty(tier.id, 1)}
                        className="flex size-8 items-center justify-center rounded-lg border border-border transition-colors hover:bg-muted">
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Promo */}
            <div className="mt-4">
              {appliedPromo ? (
                <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-4 py-3">
                  <span className="flex items-center gap-2 text-sm">
                    <Tag className="size-3.5 text-muted-foreground" />
                    <code className="font-mono font-semibold text-foreground">{appliedPromo.code}</code>
                    <span className="text-muted-foreground">· {appliedPromo.label}</span>
                  </span>
                  <button type="button" onClick={() => { setAppliedPromo(null); setPromoInput(""); }}
                    className="text-muted-foreground hover:text-foreground transition-colors">
                    <X className="size-4" />
                  </button>
                </div>
              ) : promoOpen ? (
                <div className="rounded-xl border border-border p-4 space-y-2">
                  <div className="flex gap-2">
                    <input value={promoInput}
                      onChange={(e) => { setPromoInput(e.target.value.toUpperCase()); setPromoError(""); }}
                      onKeyDown={(e) => e.key === "Enter" && applyPromo()}
                      placeholder="รหัสโปรโมชั่น" autoFocus
                      className="h-9 flex-1 rounded-lg border border-input bg-transparent px-3 font-mono text-sm uppercase tracking-widest placeholder:normal-case placeholder:tracking-normal placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50" />
                    <button type="button" onClick={applyPromo}
                      className="h-9 rounded-lg bg-foreground px-4 text-sm font-semibold text-background hover:opacity-80 transition-opacity">
                      ใช้
                    </button>
                  </div>
                  {promoError
                    ? <p className="text-xs text-red-500">{promoError}</p>
                    : <p className="text-[11px] text-muted-foreground">ลอง: EVENTRA10, WELCOME20, SAVE100</p>}
                  <button type="button" onClick={() => { setPromoOpen(false); setPromoError(""); }}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors">ยกเลิก</button>
                </div>
              ) : (
                <button type="button" onClick={() => setPromoOpen(true)}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <Tag className="size-3.5" />มีรหัสโปรโมชั่น?
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Section 3: ข้อมูลผู้ซื้อ ── */}
        <div className="rounded-xl border border-border bg-card p-5">
          <SectionLabel n={isMultiDay ? 3 : 2}>ข้อมูลผู้ซื้อ</SectionLabel>
          <div className="space-y-3">
            {([
              { label: "ชื่อ-นามสกุล", value: buyerName, onChange: setBuyerName, placeholder: "กรอกชื่อเต็ม", type: "text" },
              { label: "อีเมล (รับตั๋วที่นี่)", value: buyerEmail, onChange: setBuyerEmail, placeholder: "example@email.com", type: "email" },
              { label: "เบอร์โทรศัพท์", value: buyerPhone, onChange: setBuyerPhone, placeholder: "08X-XXX-XXXX", type: "tel" },
            ] as const).map(({ label, value, onChange, placeholder, type }) => (
              <div key={label}>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
                <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
                  className="h-11 w-full rounded-xl border border-input bg-transparent px-3.5 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 transition-colors" />
              </div>
            ))}
          </div>
        </div>

        {/* ── Section 4: ข้อมูลสำหรับออกใบเสร็จ ── */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <SectionLabel n={isMultiDay ? 4 : 3}>ข้อมูลสำหรับออกใบเสร็จ</SectionLabel>
            <button type="button" onClick={() => setWantReceipt((v) => !v)}
              className={cn(
                "mb-3 flex h-6 w-11 shrink-0 items-center rounded-full border-2 px-0.5 transition-colors",
                wantReceipt ? "border-foreground bg-foreground" : "border-border bg-transparent"
              )}>
              <span className={cn("size-4 rounded-full transition-transform", wantReceipt ? "translate-x-5 bg-background" : "translate-x-0 bg-muted-foreground/40")} />
            </button>
          </div>

          {!wantReceipt ? (
            <p className="text-xs text-muted-foreground">เปิดเพื่อรับใบกำกับภาษี / ใบเสร็จรับเงินในนามบุคคลหรือนิติบุคคล</p>
          ) : (
            <div className="space-y-3">
              {/* Type toggle */}
              <div className="flex gap-2">
                {(["personal", "company"] as const).map((t) => (
                  <button key={t} type="button" onClick={() => setReceiptType(t)}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition-colors",
                      receiptType === t ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:bg-muted/50"
                    )}>
                    {t === "personal" ? <User className="size-3.5" /> : <Building2 className="size-3.5" />}
                    {t === "personal" ? "บุคคลธรรมดา" : "นิติบุคคล"}
                  </button>
                ))}
              </div>

              {/* Fields */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  {receiptType === "personal" ? "ชื่อ-นามสกุล" : "ชื่อบริษัท / ห้างหุ้นส่วน"}
                </label>
                <input value={receiptName} onChange={(e) => setReceiptName(e.target.value)}
                  placeholder={receiptType === "personal" ? "กรอกชื่อเต็ม" : "บริษัท … จำกัด"}
                  className="h-11 w-full rounded-xl border border-input bg-transparent px-3.5 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50" />
              </div>
              <div className={cn("grid gap-3", receiptType === "company" ? "grid-cols-2" : "grid-cols-1")}>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">เลขประจำตัวผู้เสียภาษี (13 หลัก)</label>
                  <input value={receiptTaxId} maxLength={13}
                    onChange={(e) => setReceiptTaxId(e.target.value.replace(/\D/g, "").slice(0, 13))}
                    placeholder="0000000000000"
                    className="h-11 w-full rounded-xl border border-input bg-transparent px-3.5 font-mono text-sm tracking-widest placeholder:text-muted-foreground placeholder:tracking-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50" />
                </div>
                {receiptType === "company" && (
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">สาขา</label>
                    <input value={receiptBranch} onChange={(e) => setReceiptBranch(e.target.value)}
                      placeholder="สำนักงานใหญ่ / 00000"
                      className="h-11 w-full rounded-xl border border-input bg-transparent px-3.5 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50" />
                  </div>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">ที่อยู่</label>
                <textarea value={receiptAddr} onChange={(e) => setReceiptAddr(e.target.value)}
                  placeholder="บ้านเลขที่ ถนน แขวง/ตำบล เขต/อำเภอ จังหวัด รหัสไปรษณีย์" rows={2}
                  className="w-full rounded-xl border border-input bg-transparent px-3.5 py-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 resize-none" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">อีเมลสำหรับส่งใบเสร็จ (ไม่บังคับ)</label>
                <input type="email" value={receiptEmail} onChange={(e) => setReceiptEmail(e.target.value)}
                  placeholder="accounting@company.com"
                  className="h-11 w-full rounded-xl border border-input bg-transparent px-3.5 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50" />
              </div>
            </div>
          )}
        </div>

      </div>

      {/* ─────────── RIGHT: Summary ─────────── */}
      <div className="lg:sticky lg:top-20 lg:self-start">
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <h3 className="font-semibold text-foreground">สรุปคำสั่งซื้อ</h3>
          </div>

          <div className="p-5">
            {totalQty === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <Ticket className="size-8 text-muted-foreground/25" />
                <p className="text-sm text-muted-foreground">ยังไม่ได้เลือกบัตร</p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Ticket lines */}
                <div className="space-y-2">
                  {tiers.filter((t) => (quantities[t.id] ?? 0) > 0).map((t) => (
                    <div key={t.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {t.name}
                        <span className="ml-1 text-muted-foreground/60">× {quantities[t.id]}</span>
                      </span>
                      <span className="font-medium text-foreground">
                        ฿{(t.price * (quantities[t.id] ?? 0)).toLocaleString("th-TH")}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Promo discount */}
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">ส่วนลด ({appliedPromo?.code})</span>
                    <span className="font-medium text-foreground">−฿{discount.toLocaleString("th-TH")}</span>
                  </div>
                )}

                <div className="border-t border-border" />

                {/* Pre-VAT */}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">ราคาไม่รวมภาษีมูลค่าเพิ่ม</span>
                  <span className="text-foreground">฿{afterDiscount.toLocaleString("th-TH")}</span>
                </div>
                {/* VAT */}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">ภาษีมูลค่าเพิ่ม (7%)</span>
                  <span className="text-foreground">฿{vat.toLocaleString("th-TH")}</span>
                </div>

                <div className="border-t border-border" />

                {/* Grand total */}
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-semibold text-foreground">รวมทั้งสิ้น</span>
                  <span className="text-2xl font-bold tracking-tight text-foreground">
                    {grandTotal === 0 ? "ฟรี" : `฿${grandTotal.toLocaleString("th-TH")}`}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Consent checkboxes */}
          <div className="border-t border-border px-5 pb-0 pt-4">
            <p className="mb-3 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">ยอมรับเงื่อนไข</p>
            <div className="space-y-3">
              <Checkbox checked={agreeTerms} onChange={setAgreeTerms}>
                ฉันได้อ่านและยอมรับ{" "}
                <Link href="/terms" className="font-medium text-foreground underline underline-offset-2 hover:no-underline">
                  เงื่อนไขการใช้งาน
                </Link>
                {" "}และข้อกำหนดของผู้จัดงาน
              </Checkbox>
              <Checkbox checked={agreeShare} onChange={setAgreeShare}>
                ฉันยินยอมให้ EVENTRA แชร์ข้อมูลส่วนตัว (ชื่อ, อีเมล, เบอร์โทร) ต่อผู้จัดงาน
              </Checkbox>
              <Checkbox checked={agreeNoRefund} onChange={setAgreeNoRefund}>
                <span className="font-medium text-foreground">ฉันรับทราบ</span>
                {" "}ว่าเมื่อชำระเงินแล้ว ราคาตั๋วและค่าบริการต่างๆ ไม่สามารถขอคืนเงินได้ ยกเว้นกรณีอีเวนต์ถูกยกเลิก
              </Checkbox>
            </div>
            {totalQty > 0 && !allConsented && (
              <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 dark:border-amber-900/40 dark:bg-amber-950/20">
                <AlertCircle className="mt-0.5 size-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                <p className="text-[11px] text-amber-700 dark:text-amber-300">กรุณาติ๊กยืนยันเงื่อนไขทั้งหมดก่อน</p>
              </div>
            )}
          </div>

          <div className="border-t border-border p-5 pt-4">
            <button type="button" disabled={!canProceed} onClick={handleNext}
              className={cn(
                "flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all",
                canProceed
                  ? "bg-foreground text-background hover:opacity-90"
                  : "cursor-not-allowed bg-muted text-muted-foreground"
              )}>
              ดำเนินการชำระเงิน →
            </button>
            {totalQty > 0 && (
              <button type="button" onClick={handlePrintQuotation} disabled={!buyerName.trim()}
                className="mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-border text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40">
                <Printer className="size-3.5" />
                พิมพ์ใบเสนอราคา
              </button>
            )}
            {!canProceed && totalQty > 0 && (
              <p className="mt-2 text-center text-[11px] text-muted-foreground">
                {!buyerName.trim() || !buyerEmail.includes("@") || !buyerPhone.trim()
                  ? "กรอกข้อมูลผู้ซื้อให้ครบก่อน"
                  : "ติ๊กยืนยันเงื่อนไขทั้งหมดก่อน"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
