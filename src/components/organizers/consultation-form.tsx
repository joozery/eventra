"use client";

import { useState } from "react";
import { CheckCircle2, Clock, Sparkles, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const eventTypes = [
  "สัมมนา / เวิร์กช็อป",
  "คอนเสิร์ต / เทศกาล",
  "งานแสดงสินค้า / บูธ",
  "ประชุมองค์กร",
  "อื่นๆ",
];

const benefits = [
  { icon: UserCheck, text: "ทีมงานผู้เชี่ยวชาญให้คำแนะนำฟรี ไม่มีค่าใช้จ่าย" },
  { icon: Sparkles, text: "ออกแบบโซลูชันให้เหมาะกับอีเวนต์ของคุณโดยเฉพาะ" },
  { icon: Clock, text: "ทีมงานตอบกลับภายใน 24 ชั่วโมง" },
];

export function ConsultationForm() {
  const [eventType, setEventType] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 800);
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
            ติดต่อเรา
          </span>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            ขอคำปรึกษาฟรีจากทีมงาน
          </h2>
          <p className="mt-2 text-muted-foreground">
            ไม่แน่ใจว่าจะเริ่มต้นยังไงดี ให้ทีมงาน EVENTRA ช่วยวางแผนอีเวนต์ของคุณ
          </p>

          <ul className="mt-8 flex flex-col gap-4">
            {benefits.map((benefit) => (
              <li key={benefit.text} className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
                  <benefit.icon className="size-4" />
                </span>
                <span className="pt-1.5 text-sm text-muted-foreground">
                  {benefit.text}
                </span>
              </li>
            ))}
          </ul>

          <video
            src="/product/motion/window.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="mt-8 w-full"
          />
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          {submitted ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <span className="flex size-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                <CheckCircle2 className="size-7" />
              </span>
              <h3 className="text-lg font-semibold text-foreground">
                ส่งคำขอเรียบร้อยแล้ว
              </h3>
              <p className="max-w-xs text-sm text-muted-foreground">
                ขอบคุณที่สนใจ EVENTRA ทีมงานจะติดต่อกลับภายใน 24 ชั่วโมง
              </p>
            </div>
          ) : (
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="consult-name">ชื่อ-นามสกุล</Label>
                  <Input
                    id="consult-name"
                    name="name"
                    required
                    placeholder="ชื่อของคุณ"
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="consult-phone">เบอร์โทรศัพท์</Label>
                  <Input
                    id="consult-phone"
                    name="phone"
                    type="tel"
                    placeholder="08X-XXX-XXXX"
                    className="h-11 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="consult-email">อีเมล</Label>
                <Input
                  id="consult-email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="consult-org">ชื่อองค์กร / บริษัท</Label>
                <Input
                  id="consult-org"
                  name="organization"
                  placeholder="ชื่อองค์กรของคุณ"
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>ประเภทงานที่สนใจ</Label>
                <Select
                  value={eventType}
                  onValueChange={(value) => setEventType(value as string)}
                >
                  <SelectTrigger className="h-11 w-full rounded-xl">
                    <SelectValue placeholder="เลือกประเภทงาน" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="consult-message">รายละเอียดเพิ่มเติม</Label>
                <Textarea
                  id="consult-message"
                  name="message"
                  rows={4}
                  placeholder="เล่าเกี่ยวกับอีเวนต์ที่คุณอยากจัดคร่าวๆ"
                  className="rounded-xl"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={submitting}
                className="h-11 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm shadow-indigo-600/20 hover:from-indigo-700 hover:to-purple-700 hover:bg-none"
              >
                {submitting ? "กำลังส่งคำขอ..." : "ขอรับคำปรึกษา"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
