"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, HelpCircle, Minus, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Data ────────────────────────────────────────────── */

const TIERS = [
  {
    id: "starter",
    name: "Starter",
    monthly: 0,
    yearly: 0,
    label: { monthly: "ฟรี", yearly: "ฟรี" },
    desc: "สำหรับงานทดลองหรือครั้งแรก",
    cta: "เริ่มใช้งานฟรี",
  },
  {
    id: "growth",
    name: "Growth",
    monthly: 990,
    yearly: 790,
    label: { monthly: "฿990", yearly: "฿790" },
    desc: "สำหรับผู้จัดที่ต้องการขยายงาน",
    recommended: true,
    cta: "เริ่มทดลองฟรี 14 วัน",
    trial: "ทดลองฟรี 14 วัน",
  },
  {
    id: "pro",
    name: "Pro",
    monthly: 2490,
    yearly: 1990,
    label: { monthly: "฿2,490", yearly: "฿1,990" },
    desc: "สำหรับองค์กรและงานระดับใหญ่",
    cta: "เริ่มทดลองฟรี 14 วัน",
    trial: "ทดลองฟรี 14 วัน",
  },
] as const;

type TierId = "starter" | "growth" | "pro";

/* feature comparison table */
const FEATURES: {
  group: string;
  rows: { label: string; hint?: string; starter: boolean | string; growth: boolean | string; pro: boolean | string }[];
}[] = [
  {
    group: "งานและบัตร",
    rows: [
      { label: "จำนวนงานที่สร้างได้",      starter: "1 งาน",        growth: "5 งาน",          pro: "ไม่จำกัด" },
      { label: "จำนวนบัตรที่นั่ง",          starter: "สูงสุด 100",   growth: "สูงสุด 500",     pro: "ไม่จำกัด" },
      { label: "หน้าอีเวนต์สาธารณะ",        starter: true,           growth: true,             pro: true },
      { label: "ระบบออกบัตรอัตโนมัติ",      starter: true,           growth: true,             pro: true },
      { label: "โลโก้ EVENTRA บนบัตร",      starter: true,           growth: false,            pro: false },
    ],
  },
  {
    group: "การตลาดและขาย",
    rows: [
      { label: "ระบบ Promo Code",           starter: false,          growth: true,             pro: true },
      { label: "แบบฟอร์ม Custom",           starter: false,          growth: true,             pro: true },
      { label: "อีเมลยืนยันอัตโนมัติ",     starter: false,          growth: true,             pro: true },
      { label: "โปรโมตบนหน้าหลัก",         starter: false,          growth: false,            pro: true },
    ],
  },
  {
    group: "Analytics และรายงาน",
    rows: [
      { label: "สถิติพื้นฐาน",              starter: true,           growth: true,             pro: true },
      { label: "สถิติ Real-time",            starter: false,          growth: true,             pro: true },
      { label: "รายงาน PDF",                starter: false,          growth: false,            pro: true },
      { label: "API Access",                 starter: false,          growth: false,            pro: true },
    ],
  },
  {
    group: "ทีมและ Support",
    rows: [
      { label: "จำนวนผู้จัด",               starter: "1 คน",         growth: "3 คน",           pro: "ไม่จำกัด" },
      { label: "QR Check-in",               starter: false,          growth: true,             pro: true },
      { label: "Custom Domain",             starter: false,          growth: false,            pro: true },
      { label: "Priority Support",          starter: false,          growth: false,            pro: true },
    ],
  },
];

/* ─── Cell value ──────────────────────────────────────── */

function Cell({ value, highlight }: { value: boolean | string; highlight?: boolean }) {
  if (typeof value === "string") {
    return (
      <span className={cn("text-sm font-medium", highlight ? "text-indigo-700" : "text-foreground")}>
        {value}
      </span>
    );
  }
  if (value) {
    return (
      <span className={cn(
        "mx-auto flex size-5 items-center justify-center rounded-full",
        highlight ? "bg-indigo-100" : "bg-muted"
      )}>
        <Check className={cn("size-3", highlight ? "text-indigo-600" : "text-foreground")} strokeWidth={2.5} />
      </span>
    );
  }
  return <Minus className="mx-auto size-4 text-muted-foreground/30" strokeWidth={1.5} />;
}

/* ─── Main ────────────────────────────────────────────── */

export function PackageTab() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <div className="flex flex-col gap-8">

      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-semibold text-foreground">แพ็กเกจและราคา</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            อัปเกรดเพื่อปลดล็อกฟีเจอร์เพิ่มเติมและขยายงานของคุณ
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex items-center rounded-md border border-border bg-muted/40 p-0.5">
          {(["monthly", "yearly"] as const).map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setBilling(b)}
              className={cn(
                "flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition-colors",
                billing === b
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {b === "monthly" ? "รายเดือน" : (
                <>รายปี <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">-20%</span></>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Pricing cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {TIERS.map((tier) => {
          const isGrowth = tier.id === "growth";
          return (
            <div
              key={tier.id}
              className={cn(
                "relative flex flex-col rounded-xl border bg-background p-5",
                isGrowth
                  ? "border-indigo-200 shadow-sm shadow-indigo-100 ring-1 ring-indigo-200"
                  : "border-border"
              )}
            >
              {isGrowth && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full border border-indigo-200 bg-indigo-600 px-3 py-0.5 text-[11px] font-semibold text-white">
                  แนะนำ
                </span>
              )}

              {/* Tier name + icon */}
              <div className="flex items-center gap-2.5">
                <span className={cn(
                  "flex size-7 items-center justify-center rounded-md",
                  tier.id === "starter" ? "bg-slate-100" : isGrowth ? "bg-indigo-600" : "bg-foreground"
                )}>
                  <Zap className={cn("size-3.5", tier.id === "starter" ? "text-slate-500" : "text-white")} />
                </span>
                <span className="text-sm font-semibold text-foreground">{tier.name}</span>
              </div>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-bold tracking-tight text-foreground">
                  {tier.label[billing]}
                </span>
                {tier.monthly > 0 && (
                  <span className="text-sm text-muted-foreground">/เดือน</span>
                )}
              </div>
              {"trial" in tier && tier.trial && (
                <p className="mt-0.5 text-[11px] text-indigo-600">{tier.trial}</p>
              )}
              <p className="mt-2 text-xs text-muted-foreground">{tier.desc}</p>

              {/* CTA */}
              <Link
                href={`/organizer/package`}
                className={cn(
                  "mt-5 flex items-center justify-center rounded-md py-2 text-sm font-medium transition-colors",
                  isGrowth
                    ? "bg-indigo-600 text-white hover:bg-indigo-500"
                    : "border border-border text-foreground hover:bg-muted"
                )}
              >
                {tier.cta}
              </Link>

              {billing === "yearly" && tier.monthly > 0 && (
                <p className="mt-2 text-center text-[10px] text-muted-foreground">
                  ประหยัด ฿{((tier.monthly - tier.yearly) * 12).toLocaleString("th-TH")}/ปี
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Feature comparison table */}
      <div className="overflow-hidden rounded-xl border border-border bg-background">
        {/* Table header */}
        <div className="grid grid-cols-[1fr_80px_80px_80px] border-b border-border bg-muted/30 px-5 py-3">
          <span className="text-xs font-semibold text-muted-foreground">ฟีเจอร์</span>
          {TIERS.map((t) => (
            <span key={t.id} className={cn(
              "text-center text-xs font-semibold",
              t.id === "growth" ? "text-indigo-700" : "text-foreground"
            )}>
              {t.name}
            </span>
          ))}
        </div>

        {FEATURES.map((group, gi) => (
          <div key={group.group}>
            {/* Group header */}
            <div className="border-b border-border bg-muted/10 px-5 py-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                {group.group}
              </p>
            </div>

            {group.rows.map((row, ri) => (
              <div
                key={row.label}
                className={cn(
                  "grid grid-cols-[1fr_80px_80px_80px] items-center px-5 py-3",
                  ri < group.rows.length - 1 ? "border-b border-border/50" : "",
                  gi < FEATURES.length - 1 || ri < group.rows.length - 1 ? "" : ""
                )}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-sm text-foreground">{row.label}</span>
                  {row.hint && (
                    <HelpCircle className="size-3.5 text-muted-foreground/40" />
                  )}
                </div>
                <div className="flex justify-center">
                  <Cell value={row.starter} />
                </div>
                <div className="flex justify-center">
                  <Cell value={row.growth} highlight />
                </div>
                <div className="flex justify-center">
                  <Cell value={row.pro} />
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* Bottom CTA row */}
        <div className="grid grid-cols-[1fr_80px_80px_80px] items-center border-t border-border bg-muted/20 px-5 py-4">
          <span className="text-xs text-muted-foreground">ไม่มีสัญญาผูกมัด · ยกเลิกได้ทุกเมื่อ</span>
          {TIERS.map((t) => (
            <div key={t.id} className="flex justify-center">
              <Link
                href="/organizer/package"
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  t.id === "growth"
                    ? "bg-indigo-600 text-white hover:bg-indigo-500"
                    : "border border-border text-foreground hover:bg-muted"
                )}
              >
                เลือก
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[
          { q: "ยกเลิกได้ไหม?", a: "ยกเลิกได้ตลอดเวลา ไม่มีค่าปรับ ข้อมูลงานยังคงอยู่" },
          { q: "ทดลองใช้ฟรีได้อย่างไร?", a: "Growth/Pro ทดลองได้ 14 วันโดยไม่ต้องใส่บัตรเครดิต" },
          { q: "เปลี่ยน plan ได้ไหม?", a: "อัปเกรดหรือดาวน์เกรดได้ทุกเมื่อ ปรับตามรอบบิล" },
          { q: "รองรับการชำระแบบไหน?", a: "Visa, Mastercard, QR Promptpay, และโอนผ่านธนาคาร" },
        ].map(({ q, a }) => (
          <div key={q} className="rounded-lg border border-border bg-background p-4">
            <p className="text-sm font-medium text-foreground">{q}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{a}</p>
          </div>
        ))}
      </div>

    </div>
  );
}
