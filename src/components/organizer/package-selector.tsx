"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CreditCard,
  Crown,
  Lock,
  PartyPopper,
  Shield,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { updateUserEvent } from "@/lib/user-events";

/* ─── Data ────────────────────────────────────────────── */

type PackageTier = "starter" | "growth" | "pro";

const PACKAGES = [
  {
    id: "starter" as PackageTier,
    name: "Starter",
    price: 0,
    label: "ฟรี",
    period: "",
    desc: "สำหรับงานทดลองหรืองานขนาดเล็ก",
    features: [
      "สูงสุด 100 ที่นั่ง",
      "หน้าอีเวนต์สาธารณะ",
      "ระบบออกบัตรอัตโนมัติ",
      "สถิติพื้นฐาน",
    ],
    missing: ["Promo Code", "แบบฟอร์ม Custom", "สถิติ Real-time"],
  },
  {
    id: "growth" as PackageTier,
    name: "Growth",
    price: 990,
    label: "฿990",
    period: "/เดือน",
    desc: "สำหรับงานที่ต้องการฟีเจอร์ครบและขยายได้",
    recommended: true,
    features: [
      "สูงสุด 500 ที่นั่ง",
      "ทุกอย่างใน Starter",
      "ระบบ Promo Code",
      "แบบฟอร์ม Custom",
      "สถิติแบบ Real-time",
      "อีเมลยืนยันอัตโนมัติ",
      "ไม่มีโลโก้ EVENTRA บนบัตร",
    ],
    missing: [],
    trial: "ทดลองใช้ฟรี 14 วัน",
  },
  {
    id: "pro" as PackageTier,
    name: "Pro",
    price: 2490,
    label: "฿2,490",
    period: "/เดือน",
    desc: "สำหรับองค์กรและงานระดับใหญ่",
    features: [
      "ที่นั่งไม่จำกัด",
      "ทุกอย่างใน Growth",
      "ผู้จัดงานไม่จำกัด",
      "QR Check-in",
      "Custom Domain",
      "รายงาน PDF",
      "API Access",
      "Priority Support 24/7",
    ],
    missing: [],
    trial: "ทดลองใช้ฟรี 14 วัน",
  },
] as const;

/* ─── Success popup ───────────────────────────────────── */

const PKG_ACCENT: Record<PackageTier, { bg: string; text: string; icon: string }> = {
  starter: { bg: "bg-slate-100",  text: "text-slate-700",  icon: "bg-slate-500"  },
  growth:  { bg: "bg-indigo-50",  text: "text-indigo-700", icon: "bg-indigo-600" },
  pro:     { bg: "bg-amber-50",   text: "text-amber-700",  icon: "bg-amber-500"  },
};

function SuccessPopup({
  tier,
  slug,
  onDashboard,
}: {
  tier: PackageTier;
  slug: string;
  onDashboard: () => void;
}) {
  const pkg    = PACKAGES.find((p) => p.id === tier)!;
  const accent = PKG_ACCENT[tier];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      {/* Card */}
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-background shadow-2xl shadow-black/10">

        {/* Top accent strip */}
        <div className={cn("h-1 w-full", tier === "growth" ? "bg-indigo-500" : tier === "pro" ? "bg-amber-500" : "bg-slate-400")} />

        <div className="flex flex-col items-center px-8 pt-8 pb-7 text-center">

          {/* Icon */}
          <div className="relative mb-5">
            <div className="flex size-16 items-center justify-center rounded-full bg-emerald-50">
              <Check className="size-8 text-emerald-500" strokeWidth={2.5} />
            </div>
            {/* Sparkle badge */}
            <span className="absolute -top-1 -right-1 flex size-6 items-center justify-center rounded-full bg-background shadow-sm border border-border">
              <PartyPopper className="size-3.5 text-amber-500" />
            </span>
          </div>

          {/* Title */}
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            ดำเนินการสำเร็จ
          </p>
          <h2 className="mt-1.5 text-xl font-bold text-foreground">
            อีเวนต์พร้อมเผยแพร่แล้ว!
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            งานของคุณถูกเผยแพร่บนแพลตฟอร์มและพร้อมรับผู้เข้าร่วมแล้ว
          </p>

          {/* Package badge */}
          <div className={cn("mt-5 flex items-center gap-2 rounded-full px-4 py-2", accent.bg)}>
            {tier === "pro"
              ? <Crown className={cn("size-4", accent.text)} />
              : tier === "growth"
              ? <Sparkles className={cn("size-4", accent.text)} />
              : <Zap className={cn("size-4", accent.text)} />}
            <span className={cn("text-sm font-semibold", accent.text)}>
              {pkg.name} — {pkg.label}{pkg.period}
            </span>
          </div>

          {/* Checklist */}
          <div className="mt-5 w-full rounded-xl border border-border bg-muted/30 p-4">
            {[
              { icon: CalendarDays, text: "หน้างานพร้อมแสดงบนหน้า Events" },
              { icon: Zap,          text: "ระบบขายบัตรพร้อมใช้งาน" },
              { icon: Shield,       text: "แดชบอร์ดผู้จัดพร้อมเปิด" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 py-1.5">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                  <Check className="size-3 text-emerald-600" />
                </span>
                <span className="text-left text-xs text-muted-foreground">{text}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <button
            type="button"
            onClick={onDashboard}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-foreground py-2.5 text-sm font-semibold text-background hover:opacity-80 transition-opacity"
          >
            ไปที่หน้าจัดการงาน <ArrowRight className="size-4" />
          </button>

          <a
            href={`/events/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2.5 text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
          >
            ดูหน้างานสาธารณะ →
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─── Payment modal ───────────────────────────────────── */

function PaymentModal({
  pkg,
  slug,
  onClose,
  onSuccess,
}: {
  pkg: (typeof PACKAGES)[number];
  slug: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [card, setCard]   = useState("");
  const [exp, setExp]     = useState("");
  const [cvv, setCvv]     = useState("");
  const [name, setName]   = useState("");
  const [paying, setPaying] = useState(false);
  const [err, setErr]     = useState<Record<string, string>>({});

  const fmtCard = (v: string) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const fmtExp  = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  function clear(k: string) {
    setErr((p) => { const n = { ...p }; delete n[k]; return n; });
  }

  function validate() {
    const e: Record<string, string> = {};
    if (card.replace(/\s/g, "").length < 16) e.card = "หมายเลขบัตรไม่ครบ 16 หลัก";
    if (!exp.match(/^\d{2}\/\d{2}$/))        e.exp  = "รูปแบบ MM/YY";
    if (cvv.length < 3)                       e.cvv  = "CVV ไม่ถูกต้อง";
    if (!name.trim())                         e.name = "กรุณากรอกชื่อผู้ถือบัตร";
    setErr(e);
    return !Object.keys(e).length;
  }

  async function handlePay() {
    if (!validate()) return;
    setPaying(true);
    await new Promise((r) => setTimeout(r, 2000));
    await updateUserEvent(slug, {
      packageTier: pkg.id,
      packagePaidAt: new Date().toISOString(),
      status: "active",
    });
    onSuccess();
  }

  const inputCls = (k: string) => cn(
    "h-10 w-full rounded-md border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground",
    "focus:outline-none focus:ring-2 focus:ring-ring/40 transition-shadow",
    err[k] ? "border-red-400" : "border-input"
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md overflow-hidden rounded-t-2xl border border-border bg-background shadow-2xl sm:rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-foreground">
              ชำระเงิน — {pkg.name}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {pkg.label}{pkg.period}
              {"trial" in pkg && pkg.trial ? ` · ${pkg.trial}` : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4 p-5">
          {/* Card number */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">หมายเลขบัตร</label>
            <div className="relative">
              <CreditCard className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={card}
                onChange={(e) => { setCard(fmtCard(e.target.value)); clear("card"); }}
                placeholder="0000 0000 0000 0000"
                className={cn(inputCls("card"), "pl-9 font-mono tracking-wider")}
              />
            </div>
            {err.card && <p className="text-xs text-red-500">{err.card}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">วันหมดอายุ</label>
              <input
                value={exp}
                onChange={(e) => { setExp(fmtExp(e.target.value)); clear("exp"); }}
                placeholder="MM/YY"
                className={cn(inputCls("exp"), "font-mono")}
              />
              {err.exp && <p className="text-xs text-red-500">{err.exp}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">CVV</label>
              <input
                value={cvv}
                onChange={(e) => { setCvv(e.target.value.replace(/\D/g, "").slice(0, 4)); clear("cvv"); }}
                placeholder="•••"
                type="password"
                className={cn(inputCls("cvv"), "font-mono")}
              />
              {err.cvv && <p className="text-xs text-red-500">{err.cvv}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">ชื่อผู้ถือบัตร</label>
            <input
              value={name}
              onChange={(e) => { setName(e.target.value); clear("name"); }}
              placeholder="ชื่อตามบัตร"
              className={inputCls("name")}
            />
            {err.name && <p className="text-xs text-red-500">{err.name}</p>}
          </div>

          {/* Summary */}
          <div className="rounded-md border border-border bg-muted/30 px-4 py-3 text-sm">
            <div className="flex justify-between text-foreground">
              <span>แพ็กเกจ {pkg.name}</span>
              <span className="font-semibold">{pkg.label}{pkg.period}</span>
            </div>
            {"trial" in pkg && pkg.trial && (
              <p className="mt-1 text-xs text-muted-foreground">
                ✓ {pkg.trial} — เริ่มเรียกเก็บวันที่ 15 ต.ค. 2026
              </p>
            )}
          </div>

          {/* Pay button */}
          <button
            type="button"
            onClick={handlePay}
            disabled={paying}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-foreground text-sm font-semibold text-background hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {paying ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-background/30 border-t-background" />
                กำลังประมวลผล…
              </>
            ) : (
              <>
                <Lock className="size-3.5" />
                ยืนยันการชำระเงิน
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
            <Shield className="size-3" />
            ปลอดภัยด้วย SSL 256-bit · ยกเลิกได้ทุกเมื่อ
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Package card ────────────────────────────────────── */

function PkgCard({
  pkg,
  selected,
  onSelect,
}: {
  pkg: (typeof PACKAGES)[number];
  selected: boolean;
  onSelect: () => void;
}) {
  const free = pkg.price === 0;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "relative flex flex-col rounded-xl border-2 bg-background p-6 text-left transition-all",
        selected
          ? "border-foreground shadow-sm"
          : "border-border hover:border-foreground/30"
      )}
    >
      {/* Recommended badge */}
      {"recommended" in pkg && pkg.recommended && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-0.5 text-[11px] font-semibold text-indigo-700">
          แนะนำ
        </span>
      )}

      {/* Selected indicator */}
      <div className={cn(
        "absolute top-4 right-4 flex size-5 items-center justify-center rounded-full border-2 transition-colors",
        selected ? "border-foreground bg-foreground" : "border-border bg-background"
      )}>
        {selected && <Check className="size-3 text-background" />}
      </div>

      {/* Tier name */}
      <div className="flex items-center gap-2">
        <span className={cn(
          "flex size-7 items-center justify-center rounded-md text-white",
          free ? "bg-slate-400" : "recommended" in pkg && pkg.recommended ? "bg-indigo-600" : "bg-amber-500"
        )}>
          <Zap className="size-3.5" />
        </span>
        <span className="text-sm font-semibold text-foreground">{pkg.name}</span>
      </div>

      {/* Price */}
      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-3xl font-bold tracking-tight text-foreground">{pkg.label}</span>
        {pkg.period && <span className="text-sm text-muted-foreground">{pkg.period}</span>}
      </div>
      {"trial" in pkg && pkg.trial && (
        <p className="mt-1 text-[11px] text-indigo-600">{pkg.trial}</p>
      )}

      <p className="mt-2 text-xs text-muted-foreground">{pkg.desc}</p>

      {/* Divider */}
      <div className="my-4 border-t border-border" />

      {/* Features */}
      <ul className="flex flex-col gap-2">
        {pkg.features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm text-foreground">
            <Check className="size-3.5 shrink-0 text-emerald-500" />
            {f}
          </li>
        ))}
        {pkg.missing.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground/50 line-through">
            <X className="size-3.5 shrink-0" />
            {f}
          </li>
        ))}
      </ul>
    </button>
  );
}

/* ─── Main ────────────────────────────────────────────── */

export function PackageSelector() {
  const params   = useSearchParams();
  const slug     = params.get("slug") ?? "";
  const router   = useRouter();

  const [selected, setSelected]       = useState<PackageTier | null>(null);
  const [showPayment, setShowPayment]  = useState(false);
  const [confirming, setConfirming]    = useState(false);
  const [successTier, setSuccessTier]  = useState<PackageTier | null>(null);

  const selectedPkg = PACKAGES.find((p) => p.id === selected);

  async function handleConfirm() {
    if (!selected) return;
    if (selected === "starter") {
      setConfirming(true);
      await updateUserEvent(slug, {
        packageTier: "starter",
        packagePaidAt: new Date().toISOString(),
        status: "active",
      });
      setConfirming(false);
      setSuccessTier("starter");
    } else {
      setShowPayment(true);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">

      {/* Top bar */}
      <header className="flex h-14 items-center justify-between border-b border-border px-6">
        <Link
          href="/organizer/events/create"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          แก้ไขข้อมูลงาน
        </Link>

        {/* Step indicator */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="flex size-5 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background">
              <Check className="size-3" />
            </span>
            <span className="hidden text-xs text-muted-foreground sm:inline">กรอกข้อมูล</span>
          </div>
          <div className="h-px w-6 bg-border" />
          <div className="flex items-center gap-1.5">
            <span className="flex size-5 items-center justify-center rounded-full border-2 border-foreground bg-background text-[10px] font-bold text-foreground">
              2
            </span>
            <span className="hidden text-xs font-medium text-foreground sm:inline">เลือกแพ็กเกจ</span>
          </div>
        </div>

        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm font-semibold text-foreground"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo/logo.svg" alt="EVENTRA" className="h-5 w-auto" />
        </Link>
      </header>

      {/* Content */}
      <main className="flex flex-1 flex-col items-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-4xl">

          {/* Heading */}
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              ขั้นตอนที่ 2 จาก 2
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              เลือกแพ็กเกจ
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              เผยแพร่งานและเริ่มขายบัตรได้ทันที — Growth/Pro ทดลองฟรี 14 วัน ไม่มีสัญญาผูกมัด
            </p>
          </div>

          {/* Cards */}
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {PACKAGES.map((pkg) => (
              <PkgCard
                key={pkg.id}
                pkg={pkg}
                selected={selected === pkg.id}
                onSelect={() => setSelected(pkg.id)}
              />
            ))}
          </div>

          {/* CTA */}
          <div className="mt-8 flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!selected || confirming}
              className={cn(
                "flex h-11 min-w-56 items-center justify-center gap-2 rounded-md text-sm font-semibold transition-all",
                selected
                  ? "bg-foreground text-background hover:opacity-80"
                  : "cursor-default bg-muted text-muted-foreground"
              )}
            >
              {confirming ? (
                <>
                  <span className="size-4 animate-spin rounded-full border-2 border-background/30 border-t-background" />
                  กำลังดำเนินการ…
                </>
              ) : selected === "starter" ? (
                "เริ่มใช้งานฟรี"
              ) : selected ? (
                `เลือก ${selectedPkg?.name} — ${selectedPkg?.label}${selectedPkg?.period ?? ""}`
              ) : (
                "เลือกแพ็กเกจเพื่อดำเนินการต่อ"
              )}
            </button>

            <p className="text-xs text-muted-foreground">
              ยกเลิกได้ทุกเมื่อ · ไม่มีค่าธรรมเนียมซ่อน · รองรับ Visa, Mastercard
            </p>
          </div>

          {/* Trust bar */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 border-t border-border pt-8 text-xs text-muted-foreground">
            {[
              { icon: Shield, text: "SSL 256-bit" },
              { icon: Lock,   text: "ข้อมูลปลอดภัย" },
              { icon: Check,  text: "ยกเลิกได้ทุกเมื่อ" },
              { icon: Zap,    text: "เปิดใช้งานทันที" },
            ].map(({ icon: Icon, text }) => (
              <span key={text} className="flex items-center gap-1.5">
                <Icon className="size-3.5" />
                {text}
              </span>
            ))}
          </div>
        </div>
      </main>

      {/* Payment modal */}
      {showPayment && selectedPkg && selectedPkg.price > 0 && (
        <PaymentModal
          pkg={selectedPkg}
          slug={slug}
          onClose={() => setShowPayment(false)}
          onSuccess={() => {
            setShowPayment(false);
            setSuccessTier(selectedPkg.id);
          }}
        />
      )}

      {/* Success popup */}
      {successTier && (
        <SuccessPopup
          tier={successTier}
          slug={slug}
          onDashboard={() => router.push(`/organizer/events/${slug}`)}
        />
      )}
    </div>
  );
}
