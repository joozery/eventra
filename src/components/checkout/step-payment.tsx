"use client";

import { useEffect, useState } from "react";
import {
  Building2, ChevronRight, CreditCard,
  QrCode, ShieldCheck, Ticket,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { OrderData } from "./checkout-shell";

type PaymentMethod = "promptpay" | "card" | "bank";

interface Props {
  order: OrderData;
  onNext: () => void;
  onBack: () => void;
}

const PAYMENT_METHODS = [
  { id: "promptpay" as const, label: "PromptPay / QR Code", sub: "สแกนจ่ายผ่านแอปธนาคาร", Icon: QrCode },
  { id: "card" as const,      label: "บัตรเครดิต / เดบิต",   sub: "Visa, Mastercard, JCB", Icon: CreditCard },
  { id: "bank" as const,      label: "โอนเงินธนาคาร",        sub: "SCB, KBank, BBL, Krungthai", Icon: Building2 },
];

function PromptPayPanel({ total }: { total: number }) {
  const [timeLeft, setTimeLeft] = useState(5 * 60);
  useEffect(() => {
    if (timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, [timeLeft]);
  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;
  return (
    <div className="flex flex-col items-center gap-5 py-4">
      <p className="text-sm text-muted-foreground">สแกน QR Code ผ่านแอปธนาคารของคุณ</p>
      {/* Fake QR visual */}
      <div className="relative flex items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 p-8">
        <QrCode className="size-36 text-foreground/80" strokeWidth={1} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex size-12 items-center justify-center rounded-xl bg-card shadow-md">
            <Ticket className="size-6 text-foreground" />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <p className="text-2xl font-bold text-foreground">฿{total.toLocaleString("th-TH")}</p>
        <p className="text-xs text-muted-foreground">EVENTRA · บัตรเข้างาน</p>
      </div>
      <div className={cn("flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium", timeLeft > 60 ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400" : "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400")}>
        <span className="size-1.5 rounded-full bg-current animate-pulse" />
        หมดเวลาใน {m}:{String(s).padStart(2, "0")} นาที
      </div>
    </div>
  );
}

function CardPanel() {
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  function formatCard(v: string) { return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim(); }
  function formatExpiry(v: string) { return v.replace(/\D/g, "").slice(0, 4).replace(/^(\d{2})(\d)/, "$1/$2"); }

  return (
    <div className="space-y-3 py-2">
      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">หมายเลขบัตร</label>
        <input value={number} onChange={(e) => setNumber(formatCard(e.target.value))} placeholder="0000 0000 0000 0000" maxLength={19}
          className="h-11 w-full rounded-xl border border-input bg-transparent px-4 font-mono text-sm tracking-widest placeholder:text-muted-foreground placeholder:tracking-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50" />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">ชื่อผู้ถือบัตร</label>
        <input value={name} onChange={(e) => setName(e.target.value.toUpperCase())} placeholder="NAME ON CARD"
          className="h-11 w-full rounded-xl border border-input bg-transparent px-4 text-sm uppercase tracking-widest placeholder:normal-case placeholder:tracking-normal placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">วันหมดอายุ</label>
          <input value={expiry} onChange={(e) => setExpiry(formatExpiry(e.target.value))} placeholder="MM/YY" maxLength={5}
            className="h-11 w-full rounded-xl border border-input bg-transparent px-4 font-mono text-sm tracking-widest placeholder:text-muted-foreground placeholder:tracking-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">CVV</label>
          <input value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))} placeholder="•••" maxLength={3} type="password"
            className="h-11 w-full rounded-xl border border-input bg-transparent px-4 font-mono text-sm tracking-widest placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50" />
        </div>
      </div>
    </div>
  );
}

function BankPanel() {
  const accounts = [
    { bank: "ธนาคารไทยพาณิชย์ (SCB)", account: "123-4-56789-0", name: "EVENTRA CO., LTD.", color: "bg-purple-500" },
    { bank: "ธนาคารกสิกรไทย (KBank)", account: "098-7-65432-1", name: "EVENTRA CO., LTD.", color: "bg-green-600" },
    { bank: "ธนาคารกรุงเทพ (BBL)",    account: "567-8-90123-4", name: "EVENTRA CO., LTD.", color: "bg-blue-700" },
  ];
  const [copied, setCopied] = useState<string | null>(null);
  function copy(acc: string) {
    navigator.clipboard.writeText(acc.replace(/-/g, "")).catch(() => {});
    setCopied(acc); setTimeout(() => setCopied(null), 1800);
  }
  return (
    <div className="space-y-3 py-2">
      <p className="text-xs text-muted-foreground">โอนเงินพร้อมส่งหลักฐานมาที่อีเมล support@eventra.co.th ภายใน 30 นาที</p>
      {accounts.map((a) => (
        <button key={a.account} type="button" onClick={() => copy(a.account)}
          className="flex w-full items-center gap-3 rounded-xl border border-border bg-card p-3.5 text-left transition-colors hover:bg-muted/50">
          <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg text-white text-xs font-bold", a.color)}>{a.bank.split("(")[1]?.replace(")", "") ?? "—"}</div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-xs font-medium text-muted-foreground">{a.bank}</p>
            <p className="font-mono text-sm font-semibold text-foreground">{a.account}</p>
            <p className="text-xs text-muted-foreground">{a.name}</p>
          </div>
          <span className="shrink-0 text-xs font-medium text-muted-foreground">{copied === a.account ? "คัดลอกแล้ว ✓" : "คัดลอก"}</span>
        </button>
      ))}
    </div>
  );
}

export function StepPayment({ order, onNext, onBack }: Props) {
  const [method, setMethod] = useState<PaymentMethod>("promptpay");

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      {/* ─── Left ─── */}
      <div className="space-y-5">
        {/* Method selector */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">วิธีชำระเงิน</h3>
          <div className="space-y-2">
            {PAYMENT_METHODS.map(({ id, label, sub, Icon }) => (
              <button key={id} type="button" onClick={() => setMethod(id)}
                className={cn(
                  "flex w-full items-center gap-3.5 rounded-xl border px-4 py-3.5 text-left transition-colors",
                  method === id ? "border-foreground bg-card" : "border-border bg-card hover:bg-muted/50"
                )}>
                <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg border", method === id ? "border-foreground bg-foreground text-background" : "border-border bg-muted text-muted-foreground")}>
                  <Icon className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm font-semibold", method === id ? "text-foreground" : "text-foreground")}>{label}</p>
                  <p className="text-xs text-muted-foreground">{sub}</p>
                </div>
                <div className={cn("flex size-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors", method === id ? "border-foreground" : "border-border")}>
                  {method === id && <div className="size-2 rounded-full bg-foreground" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Panel */}
        <div className="rounded-xl border border-border bg-card p-5">
          {method === "promptpay" && <PromptPayPanel total={order.grandTotal} />}
          {method === "card"      && <CardPanel />}
          {method === "bank"      && <BankPanel />}
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <ShieldCheck className="size-3.5" />
          การชำระเงินปลอดภัย 100% — เข้ารหัสด้วย SSL / TLS
        </div>
      </div>

      {/* ─── Right: summary ─── */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-3 font-semibold text-foreground">สรุปการสั่งซื้อ</h3>
          <div className="space-y-1.5">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{item.name} × {item.qty}</span>
                <span>฿{(item.price * item.qty).toLocaleString("th-TH")}</span>
              </div>
            ))}
          </div>
          {order.discount > 0 && (
            <div className="mt-2 flex justify-between border-t border-border pt-2 text-sm">
              <span className="text-muted-foreground">ส่วนลด</span>
              <span>−฿{order.discount.toLocaleString("th-TH")}</span>
            </div>
          )}
          <div className="mt-2 space-y-1.5 border-t border-border pt-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">ราคาไม่รวม VAT</span>
              <span>฿{order.total.toLocaleString("th-TH")}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">VAT 7%</span>
              <span>฿{order.vat.toLocaleString("th-TH")}</span>
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between border-t border-border pt-3">
            <span className="text-sm font-semibold text-foreground">รวมทั้งสิ้น</span>
            <span className="text-2xl font-bold">{order.grandTotal === 0 ? "ฟรี" : `฿${order.grandTotal.toLocaleString("th-TH")}`}</span>
          </div>

          <button type="button" onClick={onNext}
            className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-foreground text-sm font-semibold text-background hover:opacity-90 transition-opacity">
            ยืนยันการชำระเงิน
            <ChevronRight className="size-4" />
          </button>
          <button type="button" onClick={onBack} className="mt-2 w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors">
            ← แก้ไขคำสั่งซื้อ
          </button>
        </div>
      </div>
    </div>
  );
}
