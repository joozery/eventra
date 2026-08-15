"use client";

import { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  Loader2,
  Upload,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Types ──────────────────────────────────────────────── */

type FieldType =
  | "text" | "email" | "phone" | "textarea"
  | "select" | "radio" | "checkbox" | "date" | "number" | "file";

type FormField = {
  id: string;
  type: FieldType;
  label: string;
  placeholder: string;
  required: boolean;
  options: string[];
  width: "full" | "half";
  accept?: string;
  maxSizeMb?: number;
  stepId?: string;
};

type FormStep = { id: string; title: string };

type FormConfig = {
  title: string;
  description: string;
  steps?: FormStep[];
  fields: FormField[];
  submitLabel: string;
};

/* ─── Input base style ───────────────────────────────────── */

const inputCls =
  "h-11 w-full rounded-lg border border-border bg-muted/30 px-4 text-sm text-foreground transition-colors focus:border-foreground/30 focus:bg-background focus:outline-none focus:ring-2 focus:ring-foreground/10 placeholder:text-muted-foreground/50";

/* ─── Single field renderer ──────────────────────────────── */

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FormField;
  value: string | string[];
  onChange: (v: string | string[]) => void;
}) {
  if (field.type === "textarea") {
    return (
      <textarea
        required={field.required}
        placeholder={field.placeholder}
        value={value as string}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm text-foreground resize-none transition-colors focus:border-foreground/30 focus:bg-background focus:outline-none focus:ring-2 focus:ring-foreground/10 placeholder:text-muted-foreground/50"
      />
    );
  }

  if (field.type === "select") {
    return (
      <div className="relative">
        <select
          required={field.required}
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          className={cn(inputCls, "appearance-none cursor-pointer pr-10")}
        >
          <option value="">เลือกตัวเลือก…</option>
          {field.options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      </div>
    );
  }

  if (field.type === "radio") {
    return (
      <div className="flex flex-col gap-2.5 pt-1">
        {field.options.map((o) => {
          const checked = (value as string) === o;
          return (
            <label key={o} className="flex cursor-pointer items-center gap-3">
              <span
                className={cn(
                  "flex size-4.5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  checked ? "border-foreground bg-foreground" : "border-border bg-background",
                )}
              >
                {checked && <span className="size-1.5 rounded-full bg-background" />}
              </span>
              <input
                type="radio"
                name={field.id}
                value={o}
                checked={checked}
                onChange={() => onChange(o)}
                required={field.required}
                className="sr-only"
              />
              <span className="text-sm text-foreground">{o}</span>
            </label>
          );
        })}
      </div>
    );
  }

  if (field.type === "checkbox") {
    const selected = value as string[];
    return (
      <div className="flex flex-col gap-2.5 pt-1">
        {field.options.map((o) => {
          const checked = selected.includes(o);
          return (
            <label key={o} className="flex cursor-pointer items-center gap-3">
              <span
                className={cn(
                  "flex size-4.5 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
                  checked ? "border-foreground bg-foreground" : "border-border bg-background",
                )}
              >
                {checked && <Check className="size-3 text-background" strokeWidth={3} />}
              </span>
              <input
                type="checkbox"
                value={o}
                checked={checked}
                onChange={(e) => {
                  if (e.target.checked) onChange([...selected, o]);
                  else onChange(selected.filter((v) => v !== o));
                }}
                className="sr-only"
              />
              <span className="text-sm text-foreground">{o}</span>
            </label>
          );
        })}
      </div>
    );
  }

  if (field.type === "date") {
    return (
      <input
        type="date"
        required={field.required}
        value={value as string}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls}
      />
    );
  }

  if (field.type === "file") {
    const fileName = value as string;
    return (
      <label
        className={cn(
          "flex cursor-pointer flex-col items-center gap-3 rounded-lg border-2 border-dashed px-4 py-6 text-center transition-colors",
          fileName
            ? "border-emerald-300 bg-emerald-50"
            : "border-border bg-muted/20 hover:border-foreground/20 hover:bg-muted/40",
        )}
      >
        {fileName ? (
          <>
            <div className="flex size-10 items-center justify-center rounded-full bg-emerald-100">
              <Check className="size-5 text-emerald-600" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-700">{fileName}</p>
              <p className="mt-0.5 text-xs text-emerald-600/70">คลิกเพื่อเปลี่ยนไฟล์</p>
            </div>
          </>
        ) : (
          <>
            <div className="flex size-10 items-center justify-center rounded-full bg-muted">
              <Upload className="size-5 text-muted-foreground/50" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {field.placeholder || "คลิกเพื่อเลือกไฟล์"}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {[field.accept, field.maxSizeMb ? `ขนาดสูงสุด ${field.maxSizeMb} MB` : ""].filter(Boolean).join(" · ")}
              </p>
            </div>
          </>
        )}
        <input
          type="file"
          className="sr-only"
          accept={field.accept}
          required={field.required && !fileName}
          onChange={(e) => onChange(e.target.files?.[0]?.name ?? "")}
        />
      </label>
    );
  }

  return (
    <input
      type={
        field.type === "phone" ? "tel"
        : field.type === "number" ? "number"
        : field.type === "email" ? "email"
        : "text"
      }
      required={field.required}
      placeholder={field.placeholder}
      value={value as string}
      onChange={(e) => onChange(e.target.value)}
      className={inputCls}
    />
  );
}

/* ─── Main ───────────────────────────────────────────────── */

export function EventRegisterForm({ slug, eventTitle }: { slug: string; eventTitle: string }) {
  const [form, setForm]             = useState<FormConfig | null>(null);
  const [loading, setLoading]       = useState(true);
  const [answers, setAnswers]       = useState<Record<string, string | string[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone]             = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/forms/${slug}`)
      .then((r) => r.json())
      .then((data: { form: (FormConfig & { eventSlug?: string; updatedAt?: string; coverImage?: string }) | null }) => {
        if (data.form) {
          const { eventSlug: _es, updatedAt: _ua, coverImage: _ci, ...rest } = data.form;
          void _es; void _ua; void _ci;
          setForm(rest as FormConfig);
          const init: Record<string, string | string[]> = {};
          (rest as FormConfig).fields.forEach((f) => {
            init[f.id] = f.type === "checkbox" ? [] : "";
          });
          setAnswers(init);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  /* derive steps */
  const steps = form?.steps ?? [];
  const isMultiStep = steps.length > 0;
  const totalSteps = isMultiStep ? steps.length : 1;

  /* fields for current step */
  const currentStepFields = (() => {
    if (!form) return [];
    if (!isMultiStep) return form.fields;
    const stepId = steps[currentStep]?.id;
    return form.fields.filter((f) => (f.stepId ?? steps[0]?.id) === stepId);
  })();

  /* validate required fields in current step before advancing */
  const validateStep = (ref: HTMLFormElement | null): boolean => {
    for (const field of currentStepFields) {
      if (!field.required) continue;
      const val = answers[field.id];
      if (field.type === "checkbox") {
        if ((val as string[]).length === 0) {
          ref?.reportValidity();
          return false;
        }
      } else if (!val) {
        ref?.reportValidity();
        return false;
      }
    }
    return true;
  };

  const formRef = useRef<HTMLFormElement>(null);

  const goNext = () => {
    if (!validateStep(formRef.current)) return;
    setCurrentStep((s) => Math.min(s + 1, totalSteps - 1));
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const goBack = () => {
    setCurrentStep((s) => Math.max(s - 1, 0));
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const nameField  = form.fields.find((f) => f.label.includes("ชื่อ") || f.type === "text");
      const emailField = form.fields.find((f) => f.type === "email");
      const phoneField = form.fields.find((f) => f.type === "phone");
      const compField  = form.fields.find((f) => f.label.includes("บริษัท") || f.label.includes("องค์กร"));
      const posField   = form.fields.find((f) => f.label.includes("ตำแหน่ง"));

      const body = {
        answers,
        name:     nameField  ? String(answers[nameField.id]  ?? "") : undefined,
        email:    emailField ? String(answers[emailField.id] ?? "") : undefined,
        phone:    phoneField ? String(answers[phoneField.id] ?? "") : undefined,
        company:  compField  ? String(answers[compField.id]  ?? "") : undefined,
        position: posField   ? String(answers[posField.id]   ?? "") : undefined,
      };

      const res = await fetch(`/api/registrations/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("error");
      setDone(true);
    } catch {
      setError("ไม่สามารถส่งข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  /* ── No form ── */
  if (!form) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="text-sm font-medium text-foreground">ยังไม่มีฟอร์มลงทะเบียน</p>
        <p className="text-xs text-muted-foreground">ผู้จัดงานยังไม่ได้สร้างฟอร์มสำหรับงานนี้</p>
      </div>
    );
  }

  /* ── Success ── */
  if (done) {
    return (
      <div className="flex flex-col items-center gap-6 py-14 text-center">
        <div className="relative">
          <div className="flex size-20 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="size-10 text-emerald-600" />
          </div>
          <div className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow">
            <Check className="size-3.5" strokeWidth={3} />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">ลงทะเบียนสำเร็จ!</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            ขอบคุณที่ลงทะเบียนเข้าร่วม
          </p>
          <p className="mt-0.5 text-sm font-medium text-foreground">{eventTitle}</p>
          <p className="mt-3 text-xs text-muted-foreground/70">
            ทีมงานจะติดต่อกลับเพื่อยืนยันการลงทะเบียนของคุณ
          </p>
        </div>
      </div>
    );
  }

  const isLastStep = currentStep === totalSteps - 1;

  /* ── Form ── */
  return (
    <div ref={topRef} className="flex flex-col gap-6">

      {/* Progress indicator (multi-step only) */}
      {isMultiStep && (
        <div className="flex flex-col gap-3">
          {/* Step dots */}
          <div className="flex items-center gap-0">
            {steps.map((s, i) => (
              <div key={s.id} className="flex flex-1 items-center">
                <div className="flex flex-col items-center gap-1">
                  <div className={cn(
                    "flex size-7 items-center justify-center rounded-full border-2 text-xs font-bold transition-all",
                    i < currentStep
                      ? "border-foreground bg-foreground text-background"
                      : i === currentStep
                        ? "border-foreground bg-background text-foreground"
                        : "border-border bg-background text-muted-foreground",
                  )}>
                    {i < currentStep ? <Check className="size-3.5" strokeWidth={3} /> : i + 1}
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div className={cn(
                    "mx-1 h-0.5 flex-1 rounded transition-colors",
                    i < currentStep ? "bg-foreground" : "bg-border",
                  )} />
                )}
              </div>
            ))}
          </div>
          {/* Step title */}
          <div>
            <p className="text-[11px] text-muted-foreground">
              ขั้นตอนที่ {currentStep + 1} จาก {totalSteps}
            </p>
            <p className="text-sm font-semibold text-foreground">
              {steps[currentStep]?.title}
            </p>
          </div>
        </div>
      )}

      <form ref={formRef} onSubmit={(e) => { void handleSubmit(e); }} className="flex flex-col gap-6">
        <div className="flex flex-wrap gap-4">
          {currentStepFields.map((field) => (
            <div
              key={field.id}
              className={field.width === "half" ? "w-[calc(50%-8px)]" : "w-full"}
            >
              <label className="mb-2 block text-sm font-medium text-foreground">
                {field.label}
                {field.required && <span className="ml-0.5 text-red-500">*</span>}
              </label>
              <FieldInput
                field={field}
                value={answers[field.id] ?? (field.type === "checkbox" ? [] : "")}
                onChange={(v) => setAnswers((prev) => ({ ...prev, [field.id]: v }))}
              />
            </div>
          ))}
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Navigation buttons */}
        <div className={cn("flex gap-3", currentStep > 0 ? "justify-between" : "justify-end")}>
          {currentStep > 0 && (
            <button
              type="button"
              onClick={goBack}
              className="flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              ย้อนกลับ
            </button>
          )}

          {!isLastStep ? (
            <button
              type="button"
              onClick={goNext}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-foreground py-3 text-sm font-semibold text-background transition-opacity hover:opacity-80"
            >
              ถัดไป
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-foreground py-3.5 text-sm font-semibold text-background transition-opacity hover:opacity-80 disabled:opacity-60"
            >
              {submitting && <Loader2 className="size-4 animate-spin" />}
              {submitting ? "กำลังส่งข้อมูล…" : form.submitLabel}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
