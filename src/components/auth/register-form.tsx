"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, FileText, Lock, Mail, MailWarning, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { SocialLoginButtons } from "@/components/auth/social-login-buttons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

function SectionItem({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 items-start">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/40">
        {number}
      </span>
      <div className="flex flex-col gap-1 pt-0.5">
        <h3 className="text-sm font-semibold font-sans text-foreground">{title}</h3>
        <div className="text-sm font-sans text-muted-foreground leading-relaxed space-y-2">{children}</div>
      </div>
    </div>
  );
}

const termsContent = (
  <div className="flex flex-col gap-5 font-sans">
    <SectionItem number={1} title="คุณสมบัติผู้ใช้งานและการลงทะเบียน">
      <p>
        ผู้สมัครสมาชิกต้องมีอายุอย่างน้อย 15 ปีบริบูรณ์ในการใช้งานแพลตฟอร์ม EVENTRA ผู้ใช้งานตกลงที่จะให้ข้อมูลที่เป็นจริง ถูกต้อง ครบถ้วน และเป็นปัจจุบันในการลงทะเบียน และต้องรับผิดชอบในการเก็บรักษารหัสผ่านและข้อมูลบัญชีของตนเองไว้เป็นความลับ
      </p>
    </SectionItem>

    <SectionItem number={2} title="ข้อห้ามและข้อกำหนดในการใช้งาน">
      <p>ผู้ใช้งานตกลงที่จะไม่กระทำการใดๆ ดังต่อไปนี้บนแพลตฟอร์ม EVENTRA:</p>
      <ul className="space-y-1.5 pl-1">
        {[
          "ห้ามใช้แพลตฟอร์มเพื่อการฉ้อโกง หลอกลวง หรือกระทำการใดๆ ที่ขัดต่อกฎหมายและศีลธรรมอันดี",
          "ห้ามซื้อบัตรอีเวนต์เพื่อนำไปขายต่อในราคาสูงเกินจริง (Scalping / Reselling) โดยไม่ได้รับอนุญาตจากผู้จัดงาน",
          "ห้ามปลอมแปลง ทำซ้ำ ดัดแปลง หรือแก้ไข Digital Ticket, QR Code หรือเอกสารยืนยันสิทธิ์เข้างาน",
          "ห้ามใช้บอท (Bots), สคริปต์อัตโนมัติ หรือเครื่องมือใดๆ ในการเข้าถึงระบบเพื่อกว้านซื้อบัตร",
          "ห้ามคัดลอก ละเมิดลิขสิทธิ์ หรือนำเครื่องหมายการค้า และเนื้อหาของ EVENTRA ไปใช้โดยไม่ได้รับอนุญาต",
        ].map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-indigo-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </SectionItem>

    <SectionItem number={3} title="การจองบัตร การชำระเงิน และการรับ Digital Ticket">
      <p>
        การสั่งซื้อบัตรจะสมบูรณ์และได้รับการยืนยันเมื่อระบบได้รับการชำระเงินเรียบร้อยแล้วเท่านั้น เมื่อคำสั่งซื้อมีสถานะ &quot;ชำระเงินสำเร็จ&quot; ระบบจะออก Digital Ticket พร้อม QR Code ส่งไปยังบัญชีผู้ใช้งานและอีเมลที่ลงทะเบียนไว้โดยอัตโนมัติ
      </p>
      <p>
        ผู้ใช้งานต้องแสดง Digital Ticket หรือ QR Code เพื่อเช็คอิน ณ หน้างานตามเงื่อนไขที่ผู้จัดงานกำหนด
      </p>
    </SectionItem>

    <SectionItem number={4} title="นโยบายการคืนเงินและการเลื่อน/ยกเลิกงาน">
      <p>
        EVENTRA ทำหน้าที่เป็นตัวกลางในการจำหน่ายบัตรและให้บริการระบบเช็คอินเท่านั้น นโยบายการคืนเงิน การเปลี่ยนบัตร หรือการชดเชยกรณีอีเวนต์ถูกเลื่อนหรือยกเลิก จะขึ้นอยู่กับนโยบายของผู้จัดงาน (Organizer) แต่ละอีเวนต์โดยตรง
      </p>
      <p>
        ในกรณีที่มีการคืนเงิน ผู้ใช้งานจะได้รับการติดต่อและดำเนินการตามขั้นตอนที่กำหนดโดยผู้จัดงานและ EVENTRA
      </p>
    </SectionItem>

    <SectionItem number={5} title="ข้อจำกัดความรับผิดและกฎหมายที่ใช้บังคับ">
      <p>
        EVENTRA ไม่ต้องรับผิดชอบต่อความเสียหาย เหตุสุดวิสัย หรือปัญหาใดๆ ที่เกิดจากการจัดงานของผู้จัดงานภายนอก
      </p>
      <p>
        ข้อตกลงและเงื่อนไขฉบับนี้อยู่ภายใต้บังคับและการตีความตามกฎหมายแห่งราชอาณาจักรไทย และข้อพิพาทใดๆ ที่เกิดขึ้นให้อยู่ในเขตอำนาจของศาลไทย
      </p>
    </SectionItem>
  </div>
);

const privacyContent = (
  <div className="flex flex-col gap-5 font-sans">
    <SectionItem number={1} title="ข้อมูลส่วนบุคคลที่เราเก็บรวบรวม">
      <p>เพื่อให้บริการจำหน่ายบัตรและออก Digital Ticket อย่างมีประสิทธิภาพ เราจำเป็นต้องเก็บรวบรวมข้อมูลดังต่อไปนี้:</p>
      <ul className="space-y-1.5 pl-1">
        {[
          "ข้อมูลตัวตน: ชื่อ-นามสกุล, วันเกิด, เพศ (ตามที่ผู้ใช้งานยินยอมระบุ)",
          "ข้อมูลการติดต่อ: อีเมล, หมายเลขโทรศัพท์",
          "ข้อมูลบัญชี: รหัสผ่าน (ซึ่งถูกเข้ารหัสความปลอดภัยด้วยอัลกอริทึมมาตรฐานที่ไม่สามารถถอดรหัสได้)",
          "ข้อมูลธุรกรรม: ประวัติการสั่งซื้อบัตร, ยอดชำระเงิน (ไม่เก็บข้อมูลบัตรเครดิตเต็มจำนวน)",
          "ข้อมูลการใช้งาน: IP Address, เบราว์เซอร์, คุกกี้ (Cookies) เพื่อพัฒนาประสบการณ์ใช้งาน",
        ].map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-purple-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </SectionItem>

    <SectionItem number={2} title="วัตถุประสงค์ในการใช้และประมวลผลข้อมูล">
      <ul className="space-y-1.5 pl-1">
        {[
          "ดำเนินการสั่งซื้อ ออกบัตร Digital Ticket และส่งการยืนยันการจอง",
          "ยืนยันตัวตนในการเข้างานและป้องกันการฉ้อโกงบัตร",
          "ให้บริการสนับสนุนลูกค้า (Customer Support) และแจ้งเตือนข้อมูลอีเวนต์ที่คุณจองไว้",
          "วิเคราะห์และปรับปรุงประสิทธิภาพการทำงานของแพลตฟอร์ม EVENTRA",
        ].map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-purple-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </SectionItem>

    <SectionItem number={3} title="การเปิดเผยและการดูแลรักษาข้อมูล">
      <p>
        เราไม่มีนโยบายขายหรือให้เช่าข้อมูลส่วนบุคคลของคุณแก่บุคคลภายนอกอย่างเด็ดขาด แต่อาจเปิดเผยข้อมูลเฉพาะที่จำเป็นให้แก่ผู้จัดงานอีเวนต์ที่คุณซื้อบัตร หรือผู้ให้บริการระบบชำระเงินที่ได้มาตรฐานความปลอดภัย PCI-DSS เท่านั้น
      </p>
    </SectionItem>

    <SectionItem number={4} title="สิทธิ์ของเจ้าของข้อมูลส่วนบุคคล (PDPA)">
      <p>
        ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล (PDPA) คุณมีสิทธิ์ขอเข้าถึง ขอสำเนา แก้ไข คัดค้าน หรือขอให้ลบข้อมูลส่วนบุคคลของคุณได้ทุกเมื่อ โดยสามารถติดต่อเจ้าหน้าที่คุ้มครองข้อมูลได้ที่ privacy@eventra.app
      </p>
    </SectionItem>
  </div>
);

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromLogin = searchParams.get("email") ?? "";
  const [email, setEmail] = useState(emailFromLogin);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [dialog, setDialog] = useState<"terms" | "privacy" | null>(null);

  function handleCheckboxClick() {
    if (!accepted) {
      setDialog("terms");
    } else {
      setAccepted(false);
    }
  }

  function handleAccept() {
    setAccepted(true);
    setDialog(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accepted) {
      setDialog("terms");
      return;
    }
    setSubmitting(true);
    setError("");
    const form = event.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "เกิดข้อผิดพลาด");
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      {/* Terms Dialog Modal - Reduced rounded corners (rounded-lg) and unified font-sans */}
      <Dialog open={dialog === "terms"} onOpenChange={(o: boolean) => !o && setDialog(null)}>
        <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-2xl md:max-w-3xl gap-0 p-0 overflow-hidden rounded-lg border border-border bg-popover shadow-lg" showCloseButton={false}>
          <DialogHeader className="flex-row items-center gap-3 border-b bg-muted/40 px-5 py-3.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-indigo-600 text-white">
              <FileText className="size-4" />
            </span>
            <div className="flex flex-col">
              <DialogTitle className="font-sans text-base font-semibold text-foreground">
                ข้อตกลงการใช้งาน
              </DialogTitle>
              <p className="font-sans text-xs text-muted-foreground">ข้อตกลงและเงื่อนไขสำหรับการใช้งาน EVENTRA</p>
            </div>
          </DialogHeader>

          <div className="relative">
            <div className="max-h-[60vh] sm:max-h-[460px] overflow-y-auto px-5 sm:px-7 py-5">
              {termsContent}
            </div>
            <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-6 bg-gradient-to-t from-popover to-transparent" />
          </div>

          <div className="flex items-center justify-end gap-2.5 border-t bg-muted/30 px-5 py-3">
            <DialogClose render={<Button variant="outline" className="h-9 rounded-md px-4 text-xs font-medium font-sans" />}>
              ปฏิเสธ
            </DialogClose>
            <Button
              onClick={handleAccept}
              className="h-9 rounded-md bg-indigo-600 hover:bg-indigo-700 px-5 text-xs font-medium font-sans text-white shadow-sm"
            >
              ยอมรับข้อตกลง
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Privacy Dialog Modal - Reduced rounded corners (rounded-lg) and unified font-sans */}
      <Dialog open={dialog === "privacy"} onOpenChange={(o: boolean) => !o && setDialog(null)}>
        <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-2xl md:max-w-3xl gap-0 p-0 overflow-hidden rounded-lg border border-border bg-popover shadow-lg" showCloseButton={false}>
          <DialogHeader className="flex-row items-center gap-3 border-b bg-muted/40 px-5 py-3.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-purple-600 text-white">
              <Shield className="size-4" />
            </span>
            <div className="flex flex-col">
              <DialogTitle className="font-sans text-base font-semibold text-foreground">
                นโยบายความเป็นส่วนตัว
              </DialogTitle>
              <p className="font-sans text-xs text-muted-foreground">รายละเอียดการดูแลรักษาและคุ้มครองข้อมูลส่วนบุคคล (PDPA)</p>
            </div>
          </DialogHeader>

          <div className="relative">
            <div className="max-h-[60vh] sm:max-h-[460px] overflow-y-auto px-5 sm:px-7 py-5">
              {privacyContent}
            </div>
            <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-6 bg-gradient-to-t from-popover to-transparent" />
          </div>

          <div className="flex items-center justify-end gap-2.5 border-t bg-muted/30 px-5 py-3">
            <DialogClose render={<Button variant="outline" className="h-9 rounded-md px-4 text-xs font-medium font-sans" />}>
              ปฏิเสธ
            </DialogClose>
            <Button
              onClick={handleAccept}
              className="h-9 rounded-md bg-purple-600 hover:bg-purple-700 px-5 text-xs font-medium font-sans text-white shadow-sm"
            >
              ยอมรับนโยบาย
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {emailFromLogin ? (
        <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
          <MailWarning className="mt-0.5 size-4 shrink-0" />
          <p>เราไม่พบอีเมลนี้ในระบบ กรุณาสมัครสมาชิกเพื่อเริ่มต้นใช้งาน</p>
        </div>
      ) : (
        <>
          <SocialLoginButtons label="สมัครด้วย" />
          <div className="my-6 flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">หรือ</span>
            <Separator className="flex-1" />
          </div>
        </>
      )}

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">ชื่อ-นามสกุล</Label>
          <div className="relative">
            <User className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              autoFocus={Boolean(emailFromLogin)}
              placeholder="ชื่อของคุณ"
              className="h-11 rounded-xl pl-9"
            />
          </div>
        </div>

        {emailFromLogin ? (
          <div className="flex flex-col gap-2">
            <Label>อีเมล</Label>
            <div className="flex items-center justify-between rounded-xl border border-border bg-muted/50 px-3.5 py-2.5">
              <div className="flex items-center gap-2 overflow-hidden">
                <Mail className="size-4 shrink-0 text-muted-foreground" />
                <span className="truncate text-sm font-medium text-foreground">{email}</span>
              </div>
              <Link
                href={`/auth/login?email=${encodeURIComponent(email)}`}
                className="shrink-0 text-xs font-medium text-primary hover:underline"
              >
                เปลี่ยน
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">อีเมล</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-xl pl-9"
              />
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Label htmlFor="password">รหัสผ่าน</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              autoComplete="new-password"
              autoFocus={Boolean(emailFromLogin) === false}
              placeholder="อย่างน้อย 8 ตัวอักษร"
              className="h-11 rounded-xl pr-10 pl-9"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        <label className="flex items-start gap-2.5 text-sm text-muted-foreground select-none">
          <input
            type="checkbox"
            checked={accepted}
            onChange={handleCheckboxClick}
            className="mt-0.5 size-4 shrink-0 cursor-pointer rounded border-border text-primary focus-visible:ring-2 focus-visible:ring-ring/50"
          />
          <span>
            ฉันยอมรับ{" "}
            <button
              type="button"
              onClick={() => setDialog("terms")}
              className="font-medium text-primary hover:underline"
            >
              ข้อตกลงการใช้งาน
            </button>{" "}
            และ{" "}
            <button
              type="button"
              onClick={() => setDialog("privacy")}
              className="font-medium text-primary hover:underline"
            >
              นโยบายความเป็นส่วนตัว
            </button>
          </span>
        </label>

        <Button
          type="submit"
          size="lg"
          disabled={submitting}
          className="h-11 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm shadow-indigo-600/20 hover:from-indigo-700 hover:to-purple-700 hover:bg-none"
        >
          {submitting ? "กำลังสร้างบัญชี..." : "สร้างบัญชี"}
        </Button>
        {error && <p className="text-center text-sm text-red-500">{error}</p>}
      </form>
    </div>
  );
}
