"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, MailWarning, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { SocialLoginButtons } from "@/components/auth/social-login-buttons";

export function RegisterForm() {
  const searchParams = useSearchParams();
  const emailFromLogin = searchParams.get("email") ?? "";
  const [email, setEmail] = useState(emailFromLogin);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    window.setTimeout(() => setSubmitting(false), 800);
  }

  return (
    <div>
      {emailFromLogin ? (
        <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
          <MailWarning className="mt-0.5 size-4 shrink-0" />
          <p>
            เราไม่พบอีเมลนี้ในระบบ กรุณาสมัครสมาชิกเพื่อเริ่มต้นใช้งาน
          </p>
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
                <span className="truncate text-sm font-medium text-foreground">
                  {email}
                </span>
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
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </div>

        <label className="flex items-start gap-2.5 text-sm text-muted-foreground select-none">
          <input
            type="checkbox"
            name="terms"
            required
            className="mt-0.5 size-4 shrink-0 rounded border-border text-primary focus-visible:ring-2 focus-visible:ring-ring/50"
          />
          <span>
            ฉันยอมรับ{" "}
            <Link href="/terms" className="font-medium text-primary hover:underline">
              ข้อตกลงการใช้งาน
            </Link>{" "}
            และ{" "}
            <Link href="/privacy" className="font-medium text-primary hover:underline">
              นโยบายความเป็นส่วนตัว
            </Link>
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
      </form>
    </div>
  );
}
