"use client";

import { useEffect, useState } from "react";
import {
  Calendar, Check, ChevronDown,
  Minus, Plus, Tag, Ticket, X, ShieldCheck, Clock,
} from "lucide-react";
import type { DaySchedule } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type Tier = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  badge?: string;
  stock: number;
  recommended?: boolean;
};

type PromoResult = { type: "percent" | "fixed"; value: number; label: string };

const PROMO_CODES: Record<string, PromoResult> = {
  EVENTRA10: { type: "percent", value: 10, label: "ส่วนลด 10%" },
  WELCOME20: { type: "percent", value: 20, label: "ส่วนลด 20%" },
  SAVE100:   { type: "fixed",   value: 100, label: "ลด ฿100" },
  MUSIC50:   { type: "fixed",   value: 50,  label: "ลด ฿50" },
};

const INITIAL_COUNTDOWN = 2 * 86400 + 14 * 3600 + 47 * 60 + 33;

function parseCountdown(s: number) {
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  };
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="flex h-10 w-11 items-center justify-center rounded-lg bg-foreground font-mono text-lg font-bold tabular-nums text-background">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
  );
}

export function TicketSelector({
  slug, basePrice, schedule,
}: {
  slug: string;
  basePrice: number;
  schedule?: DaySchedule[];
}) {
  const isMultiDay = schedule && schedule.length > 1;

  const [selectedDay, setSelectedDay] = useState<number | null>(isMultiDay ? null : 0);
  const [dayDropOpen, setDayDropOpen] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(INITIAL_COUNTDOWN);
  const [promoOpen, setPromoOpen] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<(PromoResult & { code: string }) | null>(null);
  const [promoError, setPromoError] = useState("");

  useEffect(() => {
    if (timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, [timeLeft]);

  const mul = schedule?.length ?? 1;

  const tiers: Tier[] =
    basePrice === 0
      ? [{ id: "free", name: "บัตรฟรี", price: 0, description: "ลงทะเบียนเข้าร่วมงานฟรี", stock: 999 }]
      : [
          {
            id: "early-bird",
            name: "Early Bird",
            price: selectedDay === -1
              ? Math.round((basePrice * 0.75 * mul) / 10) * 10
              : Math.round((basePrice * 0.8) / 10) * 10,
            originalPrice: selectedDay === -1 ? basePrice * mul : basePrice,
            description: selectedDay === -1 ? `ราคาพิเศษรวม ${mul} วัน` : "ราคาพิเศษก่อนใคร",
            badge: "จำนวนจำกัด",
            stock: 23,
          },
          {
            id: "regular",
            name: "Regular",
            price: selectedDay === -1
              ? Math.round((basePrice * mul * 0.9) / 10) * 10
              : basePrice,
            description: selectedDay === -1 ? `บัตรปกติ รวม ${mul} วัน` : "บัตรราคาปกติ",
            stock: 120,
            recommended: true,
          },
          {
            id: "vip",
            name: "VIP",
            price: selectedDay === -1 ? basePrice * 2 * mul : basePrice * 2,
            description: selectedDay === -1 ? "ที่นั่งพิเศษ + ของที่ระลึก ทุกวัน" : "ที่นั่งพิเศษ + ของที่ระลึก",
            badge: "พรีเมียม",
            stock: 48,
          },
        ];

  function updateQty(id: string, delta: number) {
    setQuantities((p) => ({ ...p, [id]: Math.max(0, (p[id] ?? 0) + delta) }));
  }

  function pickDay(day: number | -1) {
    setSelectedDay(day);
    setQuantities({});
    setAppliedPromo(null);
    setPromoInput("");
    setPromoError("");
  }

  function applyPromo() {
    const code = promoInput.trim().toUpperCase();
    if (PROMO_CODES[code]) {
      setAppliedPromo({ ...PROMO_CODES[code], code });
      setPromoError("");
      setPromoOpen(false);
    } else {
      setPromoError("รหัสไม่ถูกต้องหรือหมดอายุแล้ว");
    }
  }

  const totalQty = Object.values(quantities).reduce((a, b) => a + b, 0);
  const subtotal = tiers.reduce((s, t) => s + t.price * (quantities[t.id] ?? 0), 0);
  const discount = appliedPromo
    ? appliedPromo.type === "percent"
      ? Math.round((subtotal * appliedPromo.value) / 100)
      : Math.min(appliedPromo.value, subtotal)
    : 0;
  const total = subtotal - discount;

  const { d, h, m, s } = parseCountdown(timeLeft);

  return (
    <div className="rounded-2xl border border-border bg-card">

      {/* Countdown — clean minimal */}
      {basePrice > 0 && timeLeft > 0 && (
        <div className="overflow-hidden rounded-t-2xl border-b border-border px-5 py-4">
          <div className="mb-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Clock className="size-3.5" />
            <span>ราคา Early Bird หมดอายุภายใน</span>
          </div>
          <div className="flex items-start justify-center gap-2">
            <Unit value={d} label="วัน" />
            <span className="mt-2.5 text-sm font-light text-muted-foreground">:</span>
            <Unit value={h} label="ชั่วโมง" />
            <span className="mt-2.5 text-sm font-light text-muted-foreground">:</span>
            <Unit value={m} label="นาที" />
            <span className="mt-2.5 text-sm font-light text-muted-foreground">:</span>
            <Unit value={s} label="วินาที" />
          </div>
        </div>
      )}

      <div className="p-5">

        {/* Day picker */}
        {isMultiDay && (
          <div className="relative mb-5">
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">วันที่เข้าชม</p>
            <button
              type="button"
              onClick={() => setDayDropOpen((v) => !v)}
              className="flex w-full items-center justify-between rounded-xl border border-border bg-transparent px-4 py-3 text-left text-sm transition-colors hover:bg-muted/50"
            >
              {selectedDay === null
                ? <span className="text-muted-foreground">เลือกวันที่</span>
                : selectedDay === -1
                ? <span className="flex flex-col leading-snug">
                    <span className="flex items-center gap-2 font-medium text-foreground">
                      บัตรทุกวัน ({schedule.length} วัน)
                      <span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground">ประหยัดสุด</span>
                    </span>
                    <span className="text-xs text-muted-foreground">{schedule[0].date} — {schedule[schedule.length - 1].date}</span>
                  </span>
                : <span className="flex flex-col leading-snug">
                    <span className="font-medium text-foreground">{schedule[selectedDay].day}</span>
                    <span className="text-xs text-muted-foreground">{schedule[selectedDay].date}</span>
                  </span>
              }
              <ChevronDown className={cn("size-4 shrink-0 text-muted-foreground transition-transform duration-200", dayDropOpen && "rotate-180")} />
            </button>

            {dayDropOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setDayDropOpen(false)} />
                <div className="absolute left-0 right-0 top-full z-40 mt-1 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
                  {schedule.map((d, i) => (
                    <button key={i} type="button"
                      onClick={() => { pickDay(i); setDayDropOpen(false); }}
                      className={cn(
                        "flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-muted",
                        selectedDay === i && "bg-muted"
                      )}
                    >
                      <span className={cn(
                        "flex size-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold",
                        selectedDay === i ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground"
                      )}>{i + 1}</span>
                      <span className="flex flex-col leading-snug">
                        <span className="font-medium text-foreground">{d.day}</span>
                        <span className="text-xs text-muted-foreground">{d.date}</span>
                      </span>
                      {selectedDay === i && <Check className="ml-auto size-4 text-foreground" />}
                    </button>
                  ))}
                  <div className="border-t border-border" />
                  <button type="button"
                    onClick={() => { pickDay(-1); setDayDropOpen(false); }}
                    className={cn(
                      "flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-muted",
                      selectedDay === -1 && "bg-muted"
                    )}
                  >
                    <span className={cn(
                      "flex size-5 shrink-0 items-center justify-center rounded-full border text-[10px]",
                      selectedDay === -1 ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground"
                    )}>✦</span>
                    <span className="flex flex-col leading-snug">
                      <span className="flex items-center gap-2 font-medium text-foreground">
                        บัตรทุกวัน ({schedule.length} วัน)
                        <span className="rounded-full border border-border px-1.5 py-0.5 text-[9px] text-muted-foreground">ประหยัดสุด</span>
                      </span>
                      <span className="text-xs text-muted-foreground">{schedule[0].date} — {schedule[schedule.length - 1].date}</span>
                    </span>
                    {selectedDay === -1 && <Check className="ml-auto size-4 text-foreground" />}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Tiers */}
        {selectedDay !== null ? (
          <>
            <div className="flex flex-col divide-y divide-border overflow-hidden rounded-xl border border-border">
              {tiers.map((tier) => {
                const qty = quantities[tier.id] ?? 0;
                return (
                  <div key={tier.id} className={cn("flex items-center gap-4 px-4 py-3.5", tier.recommended && "bg-muted/40")}>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">{tier.name}</span>
                        {tier.recommended && (
                          <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground">แนะนำ</span>
                        )}
                        {tier.badge && !tier.recommended && (
                          <span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground">{tier.badge}</span>
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
                        <span className="text-[11px] text-muted-foreground">· เหลือ {tier.stock} ที่</span>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <button type="button" onClick={() => updateQty(tier.id, -1)} disabled={qty === 0}
                        className="flex size-7 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-muted disabled:opacity-30 disabled:pointer-events-none">
                        <Minus className="size-3" />
                      </button>
                      <span className="w-5 text-center text-sm font-semibold tabular-nums">{qty}</span>
                      <button type="button" onClick={() => updateQty(tier.id, 1)}
                        className="flex size-7 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-muted">
                        <Plus className="size-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Promo */}
            {basePrice > 0 && (
              <div className="mt-4">
                {appliedPromo ? (
                  <div className="flex items-center justify-between rounded-xl border border-border px-3.5 py-2.5">
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
                  <div className="rounded-xl border border-border p-3.5">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => { setPromoInput(e.target.value.toUpperCase()); setPromoError(""); }}
                        onKeyDown={(e) => e.key === "Enter" && applyPromo()}
                        placeholder="รหัสโปรโมชั่น"
                        autoFocus
                        className="h-9 flex-1 rounded-lg border border-input bg-transparent px-3 font-mono text-sm uppercase tracking-widest placeholder:normal-case placeholder:tracking-normal placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                      />
                      <button type="button" onClick={applyPromo}
                        className="h-9 rounded-lg bg-foreground px-4 text-sm font-semibold text-background hover:opacity-80 transition-opacity">
                        ใช้
                      </button>
                    </div>
                    {promoError
                      ? <p className="mt-2 text-xs text-red-500">{promoError}</p>
                      : <p className="mt-2 text-[11px] text-muted-foreground">ลอง: EVENTRA10, WELCOME20, SAVE100</p>
                    }
                    <button type="button" onClick={() => { setPromoOpen(false); setPromoError(""); }}
                      className="mt-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                      ยกเลิก
                    </button>
                  </div>
                ) : (
                  <button type="button" onClick={() => setPromoOpen(true)}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground">
                    <Tag className="size-3" />
                    มีรหัสโปรโมชั่น?
                  </button>
                )}
              </div>
            )}

            {/* Summary */}
            <div className="mt-5 space-y-2 border-t border-border pt-4">
              {discount > 0 && (
                <>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>ราคารวม</span>
                    <span>฿{subtotal.toLocaleString("th-TH")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">ส่วนลด ({appliedPromo?.code})</span>
                    <span className="font-medium text-foreground">−฿{discount.toLocaleString("th-TH")}</span>
                  </div>
                  <div className="h-px bg-border" />
                </>
              )}
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">ยอดสุทธิ</span>
                <span className="text-2xl font-bold tracking-tight text-foreground">
                  {total === 0 ? "ฟรี" : `฿${total.toLocaleString("th-TH")}`}
                </span>
              </div>
            </div>

            <button
              type="button"
              disabled={totalQty === 0}
              onClick={() => { if (totalQty > 0) window.location.href = `/checkout/${slug}`; }}
              className={cn(
                "mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all",
                totalQty > 0
                  ? "bg-foreground text-background hover:opacity-90"
                  : "cursor-not-allowed bg-muted text-muted-foreground"
              )}
            >
              <Ticket className="size-4" />
              {totalQty > 0 ? `ดำเนินการซื้อ · ${totalQty} ใบ` : "เลือกจำนวนบัตร"}
            </button>

            <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
              <ShieldCheck className="size-3" />
              ปลอดภัย · ยืนยันทันที · คืนเงินได้ภายใน 7 วัน
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-10 text-center">
            <Calendar className="size-7 text-muted-foreground/40" />
            <p className="text-sm font-medium text-foreground">เลือกวันที่ก่อน</p>
            <p className="text-xs text-muted-foreground">กรุณาเลือกวันที่ต้องการเข้าชมด้านบน</p>
          </div>
        )}
      </div>
    </div>
  );
}
