import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { label: "เลือก Event",  sub: "เลือกงานที่ต้องการ" },
  { label: "สั่งซื้อ",    sub: "เลือกบัตร & ข้อมูล" },
  { label: "ชำระเงิน",   sub: "เลือกวิธีชำระ" },
  { label: "เสร็จสิ้น",  sub: "ยืนยันการจอง" },
];

/* current: 1=เลือกEvent(done), 2=สั่งซื้อ, 3=ชำระเงิน, 4=เสร็จสิ้น */
export function CheckoutStepper({ current }: { current: 1 | 2 | 3 | 4 }) {
  return (
    <div className="mx-auto flex max-w-xl items-center">
      {STEPS.map((step, i) => {
        const num = i + 1;
        const done   = num < current;
        const active = num === current;
        return (
          <div key={num} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div className={cn(
                "flex size-9 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors",
                done   ? "border-foreground bg-foreground text-background"
                       : active ? "border-foreground bg-background text-foreground"
                       : "border-border bg-background text-muted-foreground"
              )}>
                {done ? <Check className="size-4" strokeWidth={2.5} /> : num}
              </div>
              <div className="hidden text-center sm:block">
                <p className={cn("text-xs font-semibold", active ? "text-foreground" : "text-muted-foreground")}>
                  {step.label}
                </p>
                <p className="text-[10px] text-muted-foreground">{step.sub}</p>
              </div>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn("mx-2 h-px flex-1 transition-colors sm:mx-4", done ? "bg-foreground" : "bg-border")} />
            )}
          </div>
        );
      })}
    </div>
  );
}
