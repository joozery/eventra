import Link from "next/link";
import { ConsultationForm } from "@/components/organizers/consultation-form";
import {
  Award,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Bell,
  Building2,
  ClipboardList,
  CreditCard,
  Download,
  DollarSign,
  Eye,
  Gift,
  GraduationCap,
  Globe,
  Handshake,
  Languages,
  LayoutDashboard,
  LayoutGrid,
  Layers,
  Leaf,
  LineChart,
  MapPin,
  Megaphone,
  MessageCircleQuestion,
  Palette,
  QrCode,
  Radio,
  ScanLine,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Smile,
  Sparkles,
  Target,
  Ticket,
  UserPlus,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

type Feature = { icon: LucideIcon; label: string };
type ExtraFeature = { icon: LucideIcon; title: string; description: string };

const phases: {
  id: string;
  title: string;
  description: string;
  features: Feature[];
}[] = [
  {
    id: "before",
    title: "ก่อนงานอีเวนต์",
    description: "เตรียมพร้อมทุกขั้นตอนก่อนเปิดงาน",
    features: [
      { icon: Globe, label: "หน้า Landing Page ของงาน" },
      { icon: UserPlus, label: "ระบบลงทะเบียน" },
      { icon: Ticket, label: "ระบบขายตั๋ว" },
      { icon: Megaphone, label: "เครื่องมือโปรโมทอีเวนต์" },
      { icon: LayoutGrid, label: "จองสัมมนา / เวิร์กช็อป" },
      { icon: Building2, label: "จองบูธ" },
      { icon: MapPin, label: "จองสถานที่" },
      { icon: BadgeCheck, label: "ผลิตป้ายและเข็มกลัด" },
      { icon: Users, label: "บริการพนักงานอีเวนต์" },
      { icon: ScanLine, label: "เช่าอุปกรณ์เช็คอิน" },
    ],
  },
  {
    id: "during",
    title: "ระหว่างงานอีเวนต์",
    description: "ดูแลประสบการณ์ผู้เข้าร่วมแบบเรียลไทม์",
    features: [
      { icon: QrCode, label: "ระบบเช็คอินผู้เข้าร่วมงาน" },
      { icon: Video, label: "อีเวนต์ออนไลน์ / เสมือนจริง" },
      { icon: Radio, label: "ถ่ายทอดสดไลฟ์สตรีม" },
      { icon: MessageCircleQuestion, label: "ระบบถาม-ตอบสด" },
      { icon: BarChart3, label: "ระบบโพลและโหวต" },
      { icon: ClipboardList, label: "แบบสอบถามออนไลน์" },
      { icon: Handshake, label: "ระบบจับคู่ธุรกิจ" },
      { icon: Target, label: "ระบบเก็บ Lead" },
      { icon: Gift, label: "Lucky Draw สุ่มรางวัล" },
      { icon: Smartphone, label: "โซลูชันแบบไร้สัมผัส" },
      { icon: CreditCard, label: "ชำระเงินไร้เงินสด / สั่งซื้อผ่านมือถือ" },
      { icon: Bell, label: "แจ้งเตือนแบบ Push Notification" },
    ],
  },
  {
    id: "after",
    title: "หลังงานอีเวนต์",
    description: "วัดผลและต่อยอดข้อมูลหลังจบงาน",
    features: [
      { icon: LineChart, label: "การวิเคราะห์และรายงาน" },
      { icon: DollarSign, label: "รายงานรายได้และผลตอบแทน" },
      { icon: Smile, label: "วิเคราะห์ความคิดเห็นผู้เข้าร่วม" },
      { icon: LayoutDashboard, label: "แดชบอร์ดการจัดงาน" },
      { icon: Download, label: "Export ข้อมูลทั้งหมด" },
      { icon: Award, label: "ออกใบประกาศนียบัตร (Certificate) อัตโนมัติ" },
    ],
  },
];

const extraAccents = [
  "from-indigo-500 to-purple-500",
  "from-blue-500 to-indigo-500",
  "from-fuchsia-500 to-pink-500",
  "from-violet-500 to-indigo-500",
  "from-amber-500 to-orange-500",
  "from-sky-500 to-blue-600",
  "from-emerald-500 to-teal-500",
  "from-rose-500 to-red-600",
  "from-teal-500 to-cyan-600",
];

const extras: ExtraFeature[] = [
  {
    icon: GraduationCap,
    title: "จัดการสัมมนาครบวงจร",
    description:
      "รองรับหลายรอบ หลายวิทยากร ตารางเซสชันแบบ Multi-track ในระบบเดียว",
  },
  {
    icon: Languages,
    title: "รองรับ 5 ภาษา",
    description: "ไทย อังกฤษ จีน ญี่ปุ่น เกาหลี พร้อมใช้งานทันทีทั้งแพลตฟอร์ม",
  },
  {
    icon: ShoppingBag,
    title: "ร้านค้าสินค้าที่ระลึกในตัว",
    description: "ขายเสื้อ ของที่ระลึก และสินค้าคู่บัตรได้จากหน้าเดียวกัน",
  },
  {
    icon: ShieldCheck,
    title: "QR Ticket ป้องกันการปลอมแปลง",
    description: "เข้ารหัสด้วย Signed Token ตรวจสอบความถูกต้องแบบเรียลไทม์",
  },
  {
    icon: Building2,
    title: "หน้าโปรไฟล์ผู้จัดงานสาธารณะ",
    description: "รวมผลงานและอีเวนต์ทั้งหมดของคุณไว้ในหน้าเดียวที่แชร์ได้",
  },
  {
    icon: Sparkles,
    title: "ระบบแนะนำ Event ด้วย AI",
    description: "จับคู่อีเวนต์ที่ใช่กับผู้ชมที่ใช่ เพิ่มยอดขายบัตรอัตโนมัติ",
  },
  {
    icon: Leaf,
    title: "ใบรับรอง Carbon-neutral",
    description: "วัดและชดเชยคาร์บอนฟุตพรินต์ของอีเวนต์คุณได้ในตัว",
  },
  {
    icon: Handshake,
    title: "ศูนย์จัดการสปอนเซอร์",
    description: "แพ็กเกจสปอนเซอร์ ใบแจ้งหนี้ และรายงานผลตอบแทนในที่เดียว",
  },
  {
    icon: Palette,
    title: "White-label Microsite",
    description: "สร้างเว็บอีเวนต์ในโดเมนแบรนด์คุณเอง ไม่มีโลโก้ EVENTRA",
  },
];

export function OrganizerSolutions() {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50 via-background to-background dark:from-indigo-950/20">
        <div className="pointer-events-none absolute -top-40 right-0 size-96 rounded-full bg-gradient-to-br from-indigo-400/30 to-purple-400/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 size-72 rounded-full bg-gradient-to-br from-purple-400/20 to-indigo-400/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 sm:py-24 lg:px-8">
          <span className="inline-flex items-center rounded-full border border-indigo-200 bg-white/70 px-4 py-1.5 text-sm font-medium text-indigo-700 shadow-sm backdrop-blur-sm dark:border-indigo-900 dark:bg-white/5 dark:text-indigo-300">
            สำหรับผู้จัดงาน
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            แพลตฟอร์มการจัดการ
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              อีเวนต์แบบครบวงจร
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-balance text-lg text-muted-foreground">
            โซลูชันหลักที่ปรับแต่งได้หลากหลาย เพื่อตอบโจทย์ความต้องการเฉพาะของอีเวนต์คุณ
            ตั้งแต่ก่อนงานจนถึงหลังงานจบ
          </p>
          <Link
            href="/organizer/events/create"
            className="mt-8 inline-flex h-12 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-7 text-sm font-medium text-white shadow-lg shadow-indigo-600/25 transition-opacity hover:opacity-90"
          >
            เริ่มสร้าง Event
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            ครบทุกขั้นตอนของอีเวนต์
          </h2>
          <p className="mt-1 text-muted-foreground">
            เลือกดูฟีเจอร์ตามช่วงเวลาของงาน
          </p>
        </div>

        <Tabs defaultValue={phases[0].id} className="items-center">
          <TabsList className="h-auto flex-wrap justify-center gap-1 rounded-2xl bg-muted p-1.5">
            {phases.map((phase) => (
              <TabsTrigger
                key={phase.id}
                value={phase.id}
                className="h-10 rounded-full px-5 text-sm data-active:bg-background data-active:shadow-sm"
              >
                {phase.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {phases.map((phase) => (
            <TabsContent key={phase.id} value={phase.id} className="w-full">
              <p className="mt-6 text-center text-sm text-muted-foreground">
                {phase.description}
              </p>
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {phase.features.map((feature) => (
                  <div
                    key={feature.label}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 sm:p-4 transition-shadow hover:shadow-md hover:shadow-indigo-950/5"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
                      <feature.icon className="size-4" />
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {feature.label}
                    </span>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>

      <section className="bg-muted/40 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              และเรามีมากกว่านั้น
            </h2>
            <p className="mt-1 text-muted-foreground">
              ฟีเจอร์เสริมที่ทำให้ EVENTRA ต่างจากแพลตฟอร์มอื่น
            </p>
          </div>

          <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-border bg-card shadow-sm md:grid-cols-2">
            <div className="flex flex-col justify-center gap-3 p-6 sm:p-8 md:order-2">
              <span className="flex w-fit items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
                <Award className="size-3.5" />
                Certificate
              </span>
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                ออกใบ Certificate มืออาชีพ
              </h3>
              <p className="text-sm text-muted-foreground">
                พร้อมลายเซ็นดิจิทัลและรหัส Certificate ID
                ที่ตรวจสอบย้อนกลับได้ ออกให้ผู้เข้าร่วมสัมมนาอัตโนมัติทันทีที่งานจบ
              </p>
              <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href="/certificates/sample-certificate.svg"
                  download
                  className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 text-sm font-medium text-white shadow-sm shadow-indigo-600/20 transition-opacity hover:opacity-90 sm:w-auto"
                >
                  <Download className="size-4" />
                  ดาวน์โหลดใบ Certificate ตัวอย่าง
                </a>
                <a
                  href="/certificates/sample-certificate.svg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-xl border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted sm:w-auto"
                >
                  <Eye className="size-4" />
                  ดูตัวอย่างเต็ม
                </a>
              </div>
            </div>
            <div className="relative flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600 p-8 md:order-1">
              <div className="overflow-hidden rounded-lg shadow-2xl ring-1 ring-white/20">
                {/* eslint-disable-next-line @next/next/no-img-element -- static SVG preview, next/image blocks local SVGs without extra config */}
                <img
                  src="/certificates/sample-certificate.svg"
                  alt="ตัวอย่างใบ Certificate จาก EVENTRA"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {extras.map((extra, index) => (
              <div
                key={extra.title}
                className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-950/5"
              >
                <span
                  className={`flex size-10 items-center justify-center rounded-lg bg-gradient-to-br text-white ${extraAccents[index % extraAccents.length]}`}
                >
                  <extra.icon className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {extra.title}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {extra.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ConsultationForm />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 px-6 py-14 text-center sm:px-12">
          <div className="pointer-events-none absolute -top-16 -right-16 size-64 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 size-56 rounded-full bg-white/10 blur-3xl" />
          <h2 className="relative text-2xl font-bold tracking-tight text-white sm:text-3xl">
            พร้อมเริ่มจัดอีเวนต์ของคุณหรือยัง?
          </h2>
          <p className="relative mx-auto mt-2 max-w-md text-indigo-100">
            สมัครใช้งานฟรี เริ่มสร้างอีเวนต์แรกของคุณได้ภายในไม่กี่นาที
          </p>
          <Link
            href="/organizer/events/create"
            className="relative mt-7 inline-flex h-12 items-center justify-center gap-1.5 rounded-xl bg-white px-7 text-sm font-semibold text-indigo-700 shadow-lg transition-opacity hover:opacity-90"
          >
            เริ่มสร้าง Event
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
