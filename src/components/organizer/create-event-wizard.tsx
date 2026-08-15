"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, ArrowRight, Building2, Calendar, Camera,
  Check, Clock, MapPin, Plus, Trash2, Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { saveUserEvent } from "@/lib/user-events";
import type { DaySchedule, ScheduleItem } from "@/lib/mock-data";

/* ─── Data ───────────────────────────────────────────── */

const CATEGORIES = [
  { id: "music",         name: "ดนตรี" },
  { id: "business",      name: "ธุรกิจ" },
  { id: "sports",        name: "กีฬา" },
  { id: "arts",          name: "ศิลปะ" },
  { id: "food",          name: "อาหาร" },
  { id: "tech",          name: "เทคโนโลยี" },
  { id: "education",     name: "การศึกษา" },
  { id: "health",        name: "สุขภาพ" },
  { id: "travel",        name: "ท่องเที่ยว" },
  { id: "entertainment", name: "ความบันเทิง" },
];

const CATEGORY_GRADIENTS: Record<string, string> = {
  music: "from-indigo-500 to-purple-500",
  business: "from-blue-500 to-indigo-500",
  sports: "from-fuchsia-500 to-pink-500",
  arts: "from-violet-500 to-indigo-500",
  food: "from-amber-500 to-orange-500",
  tech: "from-sky-500 to-blue-600",
  education: "from-green-500 to-teal-500",
  health: "from-rose-500 to-pink-500",
  travel: "from-teal-500 to-emerald-500",
  entertainment: "from-orange-500 to-red-500",
};

const STEPS = [
  { label: "ข้อมูลพื้นฐาน" },
  { label: "รูปและรายละเอียด" },
  { label: "บัตรและราคา" },
  { label: "ตารางกิจกรรม" },
];

/* ─── Utilities ──────────────────────────────────────── */

function slugify(t: string) {
  return t.toLowerCase().replace(/[^\w\s-]/g, "").trim()
    .replace(/[\s_]+/g, "-").replace(/-+/g, "-").slice(0, 80);
}

function formatThaiDate(iso: string) {
  if (!iso) return "";
  const M = ["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${M[m - 1]} ${y + 543}`;
}

function resizeToBase64(file: File, maxPx = 1200): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      let { width: w, height: h } = img;
      if (w > maxPx || h > maxPx) {
        if (w > h) { h = Math.round(h * maxPx / w); w = maxPx; }
        else { w = Math.round(w * maxPx / h); h = maxPx; }
      }
      const c = document.createElement("canvas");
      c.width = w; c.height = h;
      c.getContext("2d")!.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = reject;
    img.src = url;
  });
}

/* ─── Types ──────────────────────────────────────────── */

type FormState = {
  title: string; category: string; date: string; endDate: string;
  time: string; location: string; organizer: string; organizerLogo: string | null;
  image: string | null; gallery: (string | null)[];
  description: string; price: string; schedule: DaySchedule[];
};

const EMPTY: FormState = {
  title: "", category: "", date: "", endDate: "", time: "",
  location: "", organizer: "", organizerLogo: null, image: null,
  gallery: [null, null, null], description: "", price: "", schedule: [],
};

/* ─── Left Sidebar ───────────────────────────────────── */

function Sidebar({ step, form }: { step: number; form: FormState }) {
  const thaiDate = form.date ? formatThaiDate(form.date) : null;
  const thaiEnd  = form.endDate ? formatThaiDate(form.endDate) : null;

  return (
    <aside className="hidden w-64 shrink-0 lg:block">
      <div className="sticky top-24 flex flex-col gap-6">

        {/* Mini event card preview — matches homepage card ratio */}
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <div className="relative aspect-[212/265] bg-muted">
            {form.image
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={form.image} alt="" className="size-full object-cover" />
              : (
                <div className="flex size-full flex-col items-center justify-center gap-1">
                  <Camera className="size-6 text-muted-foreground/20" />
                  <p className="text-[10px] text-muted-foreground/30">ยังไม่มีรูป</p>
                </div>
              )
            }
            {form.category && (
              <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-700 backdrop-blur-sm">
                {form.category}
              </span>
            )}
          </div>

          <div className="p-3">
            <p className={cn("line-clamp-1 text-xs font-semibold", form.title ? "text-foreground" : "text-muted-foreground/40")}>
              {form.title || "ชื่องาน"}
            </p>
            <div className="mt-1.5 flex flex-col gap-0.5">
              {(thaiDate || form.time) && (
                <p className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Calendar className="size-2.5 shrink-0" />
                  <span className="truncate">{thaiDate ? (thaiEnd ? `${thaiDate} – ${thaiEnd}` : thaiDate) : form.time}</span>
                </p>
              )}
              {form.location && (
                <p className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <MapPin className="size-2.5 shrink-0" />
                  <span className="line-clamp-1">{form.location}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Step list */}
        <nav className="flex flex-col">
          {STEPS.map((s, i) => {
            const done   = i < step;
            const active = i === step;
            return (
              <div key={i} className="flex items-start gap-3">
                {/* connector line + circle */}
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold transition-colors",
                    done   ? "border-foreground bg-foreground text-background"
                           : active ? "border-foreground bg-background text-foreground"
                           : "border-border bg-background text-muted-foreground"
                  )}>
                    {done ? <Check className="size-3.5" /> : i + 1}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={cn("mt-1 mb-1 w-px flex-1 self-center", done ? "bg-foreground" : "bg-border")}
                      style={{ height: 28 }} />
                  )}
                </div>
                <p className={cn(
                  "pt-0.5 pb-6 text-sm",
                  active ? "font-semibold text-foreground"
                         : done ? "text-foreground" : "text-muted-foreground"
                )}>
                  {s.label}
                </p>
              </div>
            );
          })}
        </nav>

      </div>
    </aside>
  );
}

/* ─── Field ──────────────────────────────────────────── */

function Field({ label, required, hint, error, children }: {
  label: string; required?: boolean; hint?: string; error?: string; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

/* ─── Shared input class ─────────────────────────────── */

const inputCls = (err?: string) => cn(
  "h-10 w-full rounded-md border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground",
  "focus:outline-none focus:ring-2 focus:ring-ring/50 transition-shadow",
  err ? "border-red-400" : "border-input"
);

/* ─── Step 1 ─────────────────────────────────────────── */

function Step1({ form, setForm, onNext }: {
  form: FormState; setForm: React.Dispatch<React.SetStateAction<FormState>>; onNext: () => void;
}) {
  const [err, setErr] = useState<Record<string, string>>({});
  const [mapQuery, setMapQuery] = useState("");
  const [logoUploading, setLogoUploading] = useState(false);
  const logoRef = useRef<HTMLInputElement>(null);

  function set(k: keyof FormState, v: string) {
    setForm((p) => ({ ...p, [k]: v }));
    setErr((e) => { const n = { ...e }; delete n[k]; return n; });
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.title.trim())    e.title    = "กรุณากรอกชื่องาน";
    if (!form.category)        e.category = "กรุณาเลือกหมวดหมู่";
    if (!form.date)            e.date     = "กรุณาระบุวันที่";
    if (!form.time)            e.time     = "กรุณาระบุเวลา";
    if (!form.location.trim()) e.location = "กรุณากรอกสถานที่";
    if (!form.organizer.trim())e.organizer= "กรุณากรอกชื่อผู้จัด";
    setErr(e);
    return Object.keys(e).length === 0;
  }

  async function handleLogoUpload(file: File) {
    setLogoUploading(true);
    try {
      const b64 = await resizeToBase64(file, 200);
      setForm((p) => ({ ...p, organizerLogo: b64 }));
    } finally { setLogoUploading(false); }
  }

  return (
    <div className="flex flex-col gap-6">

      <Field label="ชื่องาน" required error={err.title}>
        <input
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="เช่น Bangkok Music Festival 2026"
          className={cn(inputCls(err.title), "h-11 text-base font-medium")}
        />
      </Field>

      <Field label="หมวดหมู่" required error={err.category}>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => set("category", c.name)}
              className={cn(
                "rounded-md border px-3 py-1.5 text-sm transition-colors",
                form.category === c.name
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-foreground hover:border-foreground/40"
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="วันที่เริ่มต้น" required error={err.date}>
          <div className="relative">
            <Calendar className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input type="date" value={form.date}
              onChange={(e) => set("date", e.target.value)}
              className={cn(inputCls(err.date), "pl-9")} />
          </div>
        </Field>

        <Field label="วันที่สิ้นสุด" hint="เว้นว่างหากเป็นวันเดียว">
          <div className="relative">
            <Calendar className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input type="date" value={form.endDate} min={form.date}
              onChange={(e) => set("endDate", e.target.value)}
              className={cn(inputCls(), "pl-9")} />
          </div>
        </Field>

        <Field label="เวลาเริ่มงาน" required error={err.time}>
          <div className="relative">
            <Clock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input type="time" value={form.time}
              onChange={(e) => set("time", e.target.value)}
              className={cn(inputCls(err.time), "pl-9")} />
          </div>
        </Field>
      </div>

      {/* Location — full width + map preview */}
      <Field label="สถานที่จัดงาน" required error={err.location}>
        <div className="relative">
          <MapPin className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={form.location}
            onChange={(e) => set("location", e.target.value)}
            onBlur={(e) => { if (e.target.value.trim()) setMapQuery(e.target.value.trim()); }}
            placeholder="เช่น Impact Arena, กรุงเทพฯ"
            className={cn(inputCls(err.location), "pl-9")}
          />
        </div>
        {mapQuery && (
          <div className="mt-2 overflow-hidden rounded-md border border-border">
            <iframe
              key={mapQuery}
              src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
              className="h-48 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="แผนที่สถานที่"
            />
          </div>
        )}
      </Field>

      {/* Organizer — logo avatar + name input */}
      <Field label="ชื่อผู้จัดงาน / องค์กร" required error={err.organizer}>
        <div className="flex items-center gap-3">
          {/* Logo upload */}
          <button
            type="button"
            onClick={() => logoRef.current?.click()}
            title="อัปโหลดโลโก้"
            className={cn(
              "relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-md border border-dashed border-border bg-muted/40 transition-colors hover:border-foreground/40 hover:bg-muted/70",
            )}
          >
            {logoUploading ? (
              <span className="size-4 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
            ) : form.organizerLogo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.organizerLogo} alt="logo" className="size-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-0.5">
                <Building2 className="size-4 text-muted-foreground/60" />
                <Upload className="size-2.5 text-muted-foreground/40" />
              </div>
            )}
          </button>
          <input ref={logoRef} type="file" accept="image/*" className="sr-only"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleLogoUpload(f); if (logoRef.current) logoRef.current.value = ""; }}
          />

          {/* Name input */}
          <input
            value={form.organizer}
            onChange={(e) => set("organizer", e.target.value)}
            placeholder="ชื่อบริษัท หรือชื่อของคุณ"
            className={cn(inputCls(err.organizer), "flex-1")}
          />

          {/* Remove logo button */}
          {form.organizerLogo && (
            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, organizerLogo: null }))}
              className="shrink-0 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              ลบรูป
            </button>
          )}
        </div>
      </Field>

      <Footer onNext={() => { if (validate()) onNext(); }} />
    </div>
  );
}

/* ─── Step 2 ─────────────────────────────────────────── */

function Step2({ form, setForm, onNext, onBack }: {
  form: FormState; setForm: React.Dispatch<React.SetStateAction<FormState>>;
  onNext: () => void; onBack: () => void;
}) {
  const coverRef = useRef<HTMLInputElement>(null);
  const gRef = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  const [busy, setBusy] = useState<number | null>(null);
  const [drag, setDrag] = useState(false);

  async function load(file: File, slot: "cover" | number) {
    const i = slot === "cover" ? -1 : (slot as number);
    setBusy(i);
    try {
      const b64 = await resizeToBase64(file, slot === "cover" ? 1200 : 800);
      if (slot === "cover") setForm((p) => ({ ...p, image: b64 }));
      else setForm((p) => { const g = [...p.gallery]; g[slot as number] = b64; return { ...p, gallery: g }; });
    } finally { setBusy(null); }
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Cover */}
      <Field label="รูปภาพหน้าปก" hint="PNG, JPG, WEBP · แนะนำรูปแนวตั้ง 800×1000 px (จะแสดงเป็น card บนหน้าแรก)">
        <div className="flex gap-4">
          {/* Upload zone — portrait ratio matching event card */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files?.[0]; if (f?.type.startsWith("image/")) load(f, "cover"); }}
            onClick={() => !form.image && coverRef.current?.click()}
            className={cn(
              "group relative flex w-48 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 transition-colors",
              "aspect-[212/265]",
              form.image   ? "border-border cursor-default"
              : drag       ? "border-foreground bg-muted/60"
                           : "border-dashed border-border hover:border-foreground/40 hover:bg-muted/30"
            )}
          >
            {form.image ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.image} alt="" className="size-full object-cover" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <button type="button"
                    onClick={(e) => { e.stopPropagation(); coverRef.current?.click(); }}
                    className="rounded-md bg-white px-3 py-1.5 text-xs font-medium text-foreground">
                    เปลี่ยนรูป
                  </button>
                  <button type="button"
                    onClick={(e) => { e.stopPropagation(); setForm((p) => ({ ...p, image: null })); }}
                    className="rounded-md bg-white/20 px-3 py-1.5 text-xs font-medium text-white">
                    ลบ
                  </button>
                </div>
              </>
            ) : busy === -1 ? (
              <span className="size-5 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
            ) : (
              <div className="flex flex-col items-center gap-2 px-3 text-center text-muted-foreground">
                <Camera className="size-6" />
                <p className="text-xs leading-snug">
                  ลากมาวาง หรือ<br />
                  <span className="font-medium text-foreground underline underline-offset-2">คลิกอัปโหลด</span>
                </p>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="flex flex-col justify-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-foreground">1</span>
              <p>รูปจะแสดงเป็น card แนวตั้งบนหน้าแรกและหน้า Events</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-foreground">2</span>
              <p>แนะนำ ratio <strong className="text-foreground">4:5</strong> หรือ <strong className="text-foreground">9:11</strong> — หน้า detail จะ crop อัตโนมัติ</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-foreground">3</span>
              <p>ขนาดไฟล์สูงสุด &lt; 5 MB · PNG, JPG, WEBP</p>
            </div>
          </div>
        </div>
        <input ref={coverRef} type="file" accept="image/*" className="sr-only"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) load(f, "cover"); if (coverRef.current) coverRef.current.value = ""; }} />
      </Field>

      {/* Gallery */}
      <Field label="รูป Gallery" hint="สูงสุด 3 รูป">
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((idx) => (
            <div key={idx} className="flex flex-col gap-1">
              <div
                onClick={() => gRef[idx].current?.click()}
                className={cn(
                  "group relative flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 transition-colors",
                  form.gallery[idx] ? "border-border cursor-default" : "border-dashed border-border hover:border-foreground/40 hover:bg-muted/30"
                )}
              >
                {form.gallery[idx] ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.gallery[idx]!} alt="" className="size-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                      <Camera className="size-4 text-white" />
                    </div>
                  </>
                ) : busy === idx ? (
                  <span className="size-4 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
                ) : (
                  <Plus className="size-4 text-muted-foreground/50" />
                )}
              </div>
              {form.gallery[idx] && (
                <button type="button"
                  onClick={() => setForm((p) => { const g = [...p.gallery]; g[idx] = null; return { ...p, gallery: g }; })}
                  className="text-center text-[11px] text-muted-foreground hover:text-foreground transition-colors">
                  ลบ
                </button>
              )}
              <input ref={gRef[idx]} type="file" accept="image/*" className="sr-only"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) load(f, idx); if (gRef[idx].current) gRef[idx].current!.value = ""; }} />
            </div>
          ))}
        </div>
      </Field>

      {/* Description */}
      <Field label="รายละเอียดงาน" hint="อธิบายสิ่งที่ผู้เข้าร่วมจะได้รับ">
        <textarea
          value={form.description}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          rows={5}
          placeholder="เล่าเกี่ยวกับงานของคุณ..."
          className="w-full resize-none rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-shadow"
        />
      </Field>

      <Footer onNext={onNext} onBack={onBack} />
    </div>
  );
}

/* ─── Step 3 ─────────────────────────────────────────── */

function Step3({ form, setForm, onNext, onBack }: {
  form: FormState; setForm: React.Dispatch<React.SetStateAction<FormState>>;
  onNext: () => void; onBack: () => void;
}) {
  const price = parseFloat(form.price) || 0;
  const tiers = price > 0
    ? [
        { name: "Early Bird", price: Math.round(price * 0.8 / 10) * 10, note: "จำนวนจำกัด" },
        { name: "Regular",    price,                                      note: "บัตรปกติ" },
        { name: "VIP",        price: price * 2,                          note: "พรีเมียม" },
      ]
    : null;

  return (
    <div className="flex flex-col gap-6">

      <Field label="ราคาบัตรพื้นฐาน (บาท)" hint="ตั้ง 0 หากเป็นงานฟรี">
        <div className="relative w-48">
          <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">฿</span>
          <input
            type="number" min="0" step="10"
            value={form.price}
            onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
            placeholder="0"
            className={cn(inputCls(), "pl-7 font-mono")}
          />
        </div>
      </Field>

      {form.price !== "" && (
        <Field label="ประเภทบัตรที่จะสร้างอัตโนมัติ">
          {tiers ? (
            <div className="overflow-hidden rounded-md border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">ประเภท</th>
                    <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">หมายเหตุ</th>
                    <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">ราคา</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {tiers.map((t) => (
                    <tr key={t.name}>
                      <td className="px-4 py-3 font-medium text-foreground">{t.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{t.note}</td>
                      <td className="px-4 py-3 text-right font-mono font-semibold text-foreground">
                        ฿{t.price.toLocaleString("th-TH")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-md border border-border bg-muted/30 px-4 py-3">
              <Check className="size-4 shrink-0 text-foreground" />
              <p className="text-sm text-foreground">งานฟรี — ลงทะเบียนโดยไม่มีค่าใช้จ่าย</p>
            </div>
          )}
        </Field>
      )}

      <Footer onNext={onNext} onBack={onBack} />
    </div>
  );
}

/* ─── Step 4 ─────────────────────────────────────────── */

function Step4({ form, setForm, onNext, onBack, saving }: {
  form: FormState; setForm: React.Dispatch<React.SetStateAction<FormState>>;
  onNext: () => void; onBack: () => void; saving?: boolean;
}) {
  function addDay() {
    const n = form.schedule.length + 1;
    setForm((p) => ({ ...p, schedule: [...p.schedule, { day: `วันที่ ${n}`, date: "", items: [] }] }));
  }

  function removeDay(di: number) {
    setForm((p) => ({ ...p, schedule: p.schedule.filter((_, i) => i !== di) }));
  }

  function updateDay(di: number, patch: Partial<DaySchedule>) {
    setForm((p) => { const s = [...p.schedule]; s[di] = { ...s[di], ...patch }; return { ...p, schedule: s }; });
  }

  function addItem(di: number) {
    setForm((p) => {
      const s = [...p.schedule];
      s[di] = { ...s[di], items: [...s[di].items, { time: "", title: "", type: "main" }] };
      return { ...p, schedule: s };
    });
  }

  function updateItem(di: number, ii: number, item: ScheduleItem) {
    setForm((p) => {
      const s = [...p.schedule];
      const items = [...s[di].items]; items[ii] = item;
      s[di] = { ...s[di], items };
      return { ...p, schedule: s };
    });
  }

  function removeItem(di: number, ii: number) {
    setForm((p) => {
      const s = [...p.schedule];
      s[di] = { ...s[di], items: s[di].items.filter((_, i) => i !== ii) };
      return { ...p, schedule: s };
    });
  }

  const typeBadge: Record<string, string> = {
    main:  "bg-foreground text-background",
    side:  "bg-muted text-foreground",
    break: "bg-muted text-muted-foreground",
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        ตารางกิจกรรมเป็นตัวเลือก — สามารถข้ามและเพิ่มภายหลังได้
      </p>

      {form.schedule.map((day, di) => (
        <div key={di} className="overflow-hidden rounded-lg border border-border">
          {/* Day header */}
          <div className="flex items-center gap-3 border-b border-border bg-muted/30 px-4 py-2.5">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background">
              {di + 1}
            </span>
            <input
              value={day.day}
              onChange={(e) => updateDay(di, { day: e.target.value })}
              className="min-w-0 flex-1 bg-transparent text-sm font-medium text-foreground focus:outline-none"
            />
            <input
              type="date"
              value={day.date}
              onChange={(e) => updateDay(di, { date: e.target.value })}
              className="rounded border border-input bg-background px-2 py-1 text-xs text-foreground focus:outline-none"
            />
            <button type="button" onClick={() => removeDay(di)}
              className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <Trash2 className="size-3.5" />
            </button>
          </div>

          {/* Items */}
          {day.items.map((item, ii) => (
            <div key={ii} className="flex items-center gap-3 border-b border-border px-4 py-2.5 last:border-0">
              <input
                type="time"
                value={item.time}
                onChange={(e) => updateItem(di, ii, { ...item, time: e.target.value })}
                className="w-20 shrink-0 rounded border border-input bg-background px-2 py-1 font-mono text-xs text-foreground focus:outline-none"
              />
              <input
                value={item.title}
                onChange={(e) => updateItem(di, ii, { ...item, title: e.target.value })}
                placeholder="ชื่อกิจกรรม"
                className="min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <select
                value={item.type ?? "main"}
                onChange={(e) => updateItem(di, ii, { ...item, type: e.target.value as ScheduleItem["type"] })}
                className={cn("shrink-0 rounded px-2 py-0.5 text-[11px] font-medium focus:outline-none border-0", typeBadge[item.type ?? "main"])}
              >
                <option value="main">Main</option>
                <option value="side">Side</option>
                <option value="break">Break</option>
              </select>
              <button type="button" onClick={() => removeItem(di, ii)}
                className="flex size-6 items-center justify-center rounded text-muted-foreground/50 hover:text-foreground transition-colors">
                <Trash2 className="size-3" />
              </button>
            </div>
          ))}

          <div className="px-4 py-2">
            <button type="button" onClick={() => addItem(di)}
              className="flex items-center gap-1.5 rounded px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <Plus className="size-3.5" />เพิ่มรายการ
            </button>
          </div>
        </div>
      ))}

      <button type="button" onClick={addDay}
        className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-border py-3.5 text-sm text-muted-foreground hover:border-foreground/30 hover:text-foreground transition-colors">
        <Plus className="size-4" />เพิ่มวัน
      </button>

      <Footer onNext={onNext} onBack={onBack} nextLabel={saving ? "กำลังบันทึก…" : "บันทึกและเลือกแพ็กเกจ"} disabled={saving} />
    </div>
  );
}

/* ─── Footer nav ─────────────────────────────────────── */

function Footer({ onNext, onBack, nextLabel = "ถัดไป", disabled }: {
  onNext: () => void; onBack?: () => void; nextLabel?: string; disabled?: boolean;
}) {
  return (
    <div className={cn("flex items-center border-t border-border pt-6", onBack ? "justify-between" : "justify-end")}>
      {onBack && (
        <button type="button" onClick={onBack} disabled={disabled}
          className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:pointer-events-none disabled:opacity-40">
          <ArrowLeft className="size-4" />ย้อนกลับ
        </button>
      )}
      <button type="button" onClick={onNext} disabled={disabled}
        className="flex items-center gap-2 rounded-md bg-foreground px-5 py-2.5 text-sm font-semibold text-background hover:opacity-80 transition-opacity disabled:opacity-50 disabled:pointer-events-none">
        {nextLabel}<ArrowRight className="size-4" />
      </button>
    </div>
  );
}

/* ─── Mobile progress ────────────────────────────────── */

function MobileProgress({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-1.5 lg:hidden">
      {STEPS.map((_, i) => (
        <div key={i} className={cn(
          "h-1 flex-1 rounded-full transition-colors",
          i < step ? "bg-foreground" : i === step ? "bg-foreground/40" : "bg-border"
        )} />
      ))}
    </div>
  );
}

/* ─── Main export ────────────────────────────────────── */

export function CreateEventWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit() {
    setSaving(true);
    const catId = CATEGORIES.find((c) => c.name === form.category)?.id ?? "";
    const gradient = CATEGORY_GRADIENTS[catId] ?? "from-indigo-500 to-purple-500";
    const slug = slugify(form.title) || `event-${Date.now()}`;

    try {
      await saveUserEvent({
        id: `user-${Date.now()}`,
        slug, title: form.title, category: form.category,
        date: formatThaiDate(form.date),
        endDate: form.endDate ? formatThaiDate(form.endDate) : undefined,
        time: form.time, location: form.location, organizer: form.organizer,
        price: parseFloat(form.price) || 0,
        gradient, attendees: 0,
        image: form.image ?? undefined,
        gallery: (form.gallery.filter(Boolean) as string[]).length > 0
          ? (form.gallery.filter(Boolean) as string[]) : undefined,
        schedule: form.schedule.filter((d) => d.items.length > 0).map((d) => ({
          ...d, date: d.date ? formatThaiDate(d.date) : formatThaiDate(form.date),
        })),
        description: form.description || undefined,
        organizerLogo: form.organizerLogo ?? undefined,
        createdAt: new Date().toISOString(),
        status: "draft",
      });
      setSaved(true);
      setTimeout(() => router.push(`/organizer/package?slug=${slug}`), 800);
    } catch {
      setSaving(false);
      alert("บันทึกไม่สำเร็จ — localStorage อาจเต็ม กรุณาลองใหม่");
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background">

      {/* Save toast */}
      {saved && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 flex items-center gap-2.5 rounded-lg border border-border bg-background px-5 py-3 shadow-lg shadow-black/5">
          <Check className="size-4 shrink-0 text-emerald-600" />
          <p className="text-sm font-medium text-foreground">บันทึกสำเร็จ — กำลังไปเลือกแพ็กเกจ…</p>
        </div>
      )}

      {/* Top bar */}
      <div className="border-b border-border bg-background">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="size-4" />
                <span className="hidden sm:inline">ย้อนกลับ</span>
              </button>
              <span className="text-muted-foreground/30">/</span>
              <span className="text-sm font-medium text-foreground">สร้างอีเวนต์ใหม่</span>
            </div>
            <span className="text-xs text-muted-foreground">
              ขั้นตอน {step + 1} / {STEPS.length}
            </span>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-0.5 bg-border">
          <div
            className="h-full bg-foreground transition-all duration-300"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex gap-10">
            <Sidebar step={step} form={form} />

            {/* Form card */}
            <div className="min-w-0 flex-1">
              {/* Mobile progress */}
              <div className="mb-5">
                <MobileProgress step={step} />
                <h2 className="mt-3 text-lg font-semibold text-foreground lg:hidden">
                  {STEPS[step].label}
                </h2>
              </div>

              <div className="rounded-lg border border-border bg-card p-6 sm:p-8">
                <h2 className="mb-6 hidden text-base font-semibold text-foreground lg:block">
                  {STEPS[step].label}
                </h2>

                {step === 0 && <Step1 form={form} setForm={setForm} onNext={() => setStep(1)} />}
                {step === 1 && <Step2 form={form} setForm={setForm} onNext={() => setStep(2)} onBack={() => setStep(0)} />}
                {step === 2 && <Step3 form={form} setForm={setForm} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
                {step === 3 && <Step4 form={form} setForm={setForm} onNext={handleSubmit} onBack={() => setStep(2)} saving={saving} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
