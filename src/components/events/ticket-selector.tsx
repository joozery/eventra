"use client";

import { useState } from "react";
import { Minus, Plus, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";

type Tier = {
  id: string;
  name: string;
  price: number;
  description: string;
};

export function TicketSelector({
  slug,
  basePrice,
}: {
  slug: string;
  basePrice: number;
}) {
  const tiers: Tier[] =
    basePrice === 0
      ? [{ id: "free", name: "บัตรฟรี", price: 0, description: "ลงทะเบียนเข้าร่วมงานฟรี" }]
      : [
          {
            id: "early-bird",
            name: "Early Bird",
            price: Math.round((basePrice * 0.8) / 10) * 10,
            description: "จำนวนจำกัด ราคาพิเศษก่อนใคร",
          },
          {
            id: "regular",
            name: "Regular",
            price: basePrice,
            description: "บัตรราคาปกติ",
          },
          {
            id: "vip",
            name: "VIP",
            price: basePrice * 2,
            description: "ที่นั่งโซนพิเศษ + ของที่ระลึก",
          },
        ];

  const [quantities, setQuantities] = useState<Record<string, number>>({});

  function updateQuantity(id: string, delta: number) {
    setQuantities((prev) => {
      const next = Math.max(0, (prev[id] ?? 0) + delta);
      return { ...prev, [id]: next };
    });
  }

  const totalQty = Object.values(quantities).reduce((sum, q) => sum + q, 0);
  const totalPrice = tiers.reduce(
    (sum, tier) => sum + tier.price * (quantities[tier.id] ?? 0),
    0
  );

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h2 className="text-base font-semibold text-foreground">เลือกบัตร</h2>

      <div className="mt-4 flex flex-col gap-4">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className="flex items-center justify-between gap-3 border-b border-border pb-4 last:border-0 last:pb-0"
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">{tier.name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {tier.description}
              </p>
              <p className="mt-1 text-sm font-bold text-foreground">
                {tier.price === 0
                  ? "ฟรี"
                  : `฿${tier.price.toLocaleString("th-TH")}`}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => updateQuantity(tier.id, -1)}
                disabled={(quantities[tier.id] ?? 0) === 0}
                aria-label={`ลดจำนวน ${tier.name}`}
                className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
              >
                <Minus className="size-3.5" />
              </button>
              <span className="w-5 text-center text-sm font-medium text-foreground">
                {quantities[tier.id] ?? 0}
              </span>
              <button
                type="button"
                onClick={() => updateQuantity(tier.id, 1)}
                aria-label={`เพิ่มจำนวน ${tier.name}`}
                className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted"
              >
                <Plus className="size-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
        <span className="text-sm text-muted-foreground">ยอดรวม</span>
        <span className="text-lg font-bold text-foreground">
          ฿{totalPrice.toLocaleString("th-TH")}
        </span>
      </div>

      <Button
        size="lg"
        disabled={totalQty === 0}
        className="mt-4 h-11 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm shadow-indigo-600/20 hover:from-indigo-700 hover:to-purple-700 hover:bg-none aria-disabled:pointer-events-none aria-disabled:opacity-50"
        nativeButton={false}
        render={<a href={`/checkout/${slug}`} />}
      >
        <Ticket className="size-4" />
        {totalQty > 0 ? `ซื้อตั๋ว (${totalQty})` : "เลือกจำนวนบัตร"}
      </Button>
    </div>
  );
}
