import { QrCode, ShieldCheck, TicketCheck, Zap } from "lucide-react";

const features = [
  {
    icon: TicketCheck,
    title: "จองบัตรง่าย รวดเร็ว",
    description: "เลือก Ticket และ Checkout ได้ในไม่กี่คลิก ไม่ยุ่งยาก",
  },
  {
    icon: QrCode,
    title: "Digital Ticket + QR",
    description: "รับตั๋วดิจิทัลพร้อม QR Code ทันทีหลังชำระเงินสำเร็จ",
  },
  {
    icon: ShieldCheck,
    title: "ปลอดภัยทุกการชำระเงิน",
    description: "ระบบยืนยันการชำระเงินผ่าน Payment Gateway ที่เชื่อถือได้",
  },
  {
    icon: Zap,
    title: "Check-in รวดเร็ว",
    description: "สแกน QR หน้างานได้ทันที พร้อมป้องกันตั๋วซ้ำอัตโนมัติ",
  },
];

export function WhyEventra() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          ทำไมต้อง EVENTRA
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
          แพลตฟอร์มเดียวที่ครบทั้งการค้นหา สร้าง และจัดการอีเวนต์
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <span className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
              <feature.icon className="size-5" />
            </span>
            <h3 className="mt-4 font-semibold text-foreground">
              {feature.title}
            </h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
