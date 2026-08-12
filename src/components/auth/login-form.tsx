"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { SocialLoginButtons } from "@/components/auth/social-login-buttons";

type Step = "email" | "password";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleContinue(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.exists) {
        setStep("password");
      } else {
        router.push(`/auth/register?email=${encodeURIComponent(email)}`);
      }
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const form = event.currentTarget;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
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

  if (step === "email") {
    return (
      <div className="animate-in fade-in-0 slide-in-from-left-2 duration-200">
        <SocialLoginButtons />

        <div className="my-6 flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">หรือ</span>
          <Separator className="flex-1" />
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleContinue}>
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
                autoFocus
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-xl pl-9"
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={submitting}
            className="h-11 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm shadow-indigo-600/20 hover:from-indigo-700 hover:to-purple-700 hover:bg-none"
          >
            {submitting ? "กำลังตรวจสอบ..." : "ถัดไป"}
          </Button>
          {error && <p className="text-center text-sm text-red-500">{error}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in-0 slide-in-from-right-2 duration-200">
      <button
        type="button"
        onClick={() => setStep("email")}
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        กลับ
      </button>

      <div className="mb-5 flex items-center justify-between rounded-xl border border-border bg-muted/50 px-3.5 py-2.5">
        <div className="flex items-center gap-2 overflow-hidden">
          <Mail className="size-4 shrink-0 text-muted-foreground" />
          <span className="truncate text-sm font-medium text-foreground">
            {email}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setStep("email")}
          className="shrink-0 text-xs font-medium text-primary hover:underline"
        >
          เปลี่ยน
        </button>
      </div>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">รหัสผ่าน</Label>
            <Link
              href="/auth/forgot-password"
              className="text-xs font-medium text-primary hover:underline"
            >
              ลืมรหัสผ่าน?
            </Link>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              autoFocus
              placeholder="••••••••"
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

        <label className="flex items-center gap-2 text-sm text-muted-foreground select-none">
          <input
            type="checkbox"
            name="remember"
            className="size-4 rounded border-border text-primary focus-visible:ring-2 focus-visible:ring-ring/50"
          />
          จดจำฉันไว้ในระบบ
        </label>

        <Button
          type="submit"
          size="lg"
          disabled={submitting}
          className="h-11 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm shadow-indigo-600/20 hover:from-indigo-700 hover:to-purple-700 hover:bg-none"
        >
          {submitting ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </Button>
        {error && <p className="text-center text-sm text-red-500">{error}</p>}
      </form>
    </div>
  );
}
