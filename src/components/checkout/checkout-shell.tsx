"use client";

import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import type { MockEvent } from "@/lib/mock-data";
import { CheckoutStepper } from "./checkout-stepper";
import { StepOrder } from "./step-order";
import { StepPayment } from "./step-payment";
import { StepSuccess } from "./step-success";
import { StepSlide } from "@/components/ui/motion";

export type TierItem = { id: string; name: string; price: number; qty: number };

export type ReceiptInfo = {
  type: "personal" | "company";
  name: string;
  taxId: string;
  address: string;
  branch?: string;
  email?: string;
};

export type OrderData = {
  selectedDay: number | null;
  items: TierItem[];
  promo: { code: string; type: "percent" | "fixed"; value: number; label: string } | null;
  subtotal: number;
  discount: number;
  total: number;       // after discount, excl. VAT
  vat: number;         // 7%
  grandTotal: number;  // total + vat
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  receiptInfo: ReceiptInfo | null;
};

export type InitialSelection = {
  selectedDay: number | null;
  quantities: Record<string, number>;
  promoCode: string | null;
};

function parseSelection(params: URLSearchParams): InitialSelection {
  const dayRaw = params.get("day");
  const selectedDay = dayRaw !== null ? Number(dayRaw) : null;

  const qtyRaw = params.get("qty");
  const quantities: Record<string, number> = {};
  if (qtyRaw) {
    qtyRaw.split(",").forEach((pair) => {
      const [id, count] = pair.split(":");
      if (id && count) quantities[id] = Number(count);
    });
  }

  return { selectedDay, quantities, promoCode: params.get("promo") };
}

function makeRef() {
  return "EVT-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

/* inner shell — reads search params */
function Shell({ event }: { event: MockEvent }) {
  const params = useSearchParams();
  const initial = parseSelection(params);

  /* internal step: 1=สั่งซื้อ 2=ชำระเงิน 3=เสร็จสิ้น — maps to display step 2/3/4 */
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [bookingRef] = useState(makeRef);
  const direction = useRef(1);

  const displayStep = (step + 1) as 2 | 3 | 4;   // step 1→display 2, 2→3, 3→4

  function handleOrderNext(data: OrderData) {
    direction.current = 1;
    setOrder(data);
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handlePaymentNext() {
    direction.current = 1;
    setStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleBack() {
    direction.current = -1;
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Stepper — step 1 (เลือก Event) always done */}
      <div className="mb-8 rounded-xl border border-border bg-card p-5">
        <CheckoutStepper current={displayStep} />
      </div>

      <div className="overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          {step === 1 && (
            <StepSlide key={1} stepKey={1} direction={direction.current}>
              <StepOrder event={event} initial={initial} onNext={handleOrderNext} />
            </StepSlide>
          )}
          {step === 2 && order && (
            <StepSlide key={2} stepKey={2} direction={direction.current}>
              <StepPayment order={order} onNext={handlePaymentNext} onBack={handleBack} />
            </StepSlide>
          )}
          {step === 3 && order && (
            <StepSlide key={3} stepKey={3} direction={direction.current}>
              <StepSuccess event={event} order={order} bookingRef={bookingRef} />
            </StepSlide>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* exported wrapper — needs Suspense boundary (useSearchParams) */
export function CheckoutShell({ event }: { event: MockEvent }) {
  return (
    <Shell event={event} />
  );
}
