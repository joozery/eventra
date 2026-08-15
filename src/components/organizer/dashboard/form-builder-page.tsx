"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlignLeft,
  Calendar,
  Check,
  CheckSquare,
  ChevronDown,
  Circle,
  ExternalLink,
  GripVertical,
  ImageIcon,
  Layers,
  Hash,
  Mail,
  Phone,
  Plus,
  Trash2,
  Type,
  User,
  Building2,
  Briefcase,
  Eye,
  Save,
  X,
  ChevronUp,
  Settings2,
  Upload,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { getUserEventBySlug } from "@/lib/user-events";
import { EventSubNav } from "./event-sub-nav";
import { cn } from "@/lib/utils";

/* ─── Types ──────────────────────────────────────────────── */

type FieldType =
  | "text" | "email" | "phone" | "textarea"
  | "select" | "radio" | "checkbox" | "date" | "number" | "file";

type FormStep = { id: string; title: string };

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

type FormConfig = {
  title: string;
  description: string;
  steps?: FormStep[];
  fields: FormField[];
  submitLabel: string;
  coverImage?: string;
};

const DEFAULT_CONFIG: FormConfig = {
  title: "ลงทะเบียนเข้าร่วมงาน",
  description: "",
  fields: [],
  submitLabel: "ลงทะเบียน",
};

/* ─── Field type catalog ─────────────────────────────────── */

type FieldDef = {
  type: FieldType;
  label: string;
  icon: React.ElementType;
  defaultLabel: string;
  defaultPlaceholder: string;
};

const PRESET_FIELDS: FieldDef[] = [
  { type: "text",  label: "ชื่อ-นามสกุล",    icon: User,      defaultLabel: "ชื่อ-นามสกุล",    defaultPlaceholder: "กรุณาระบุชื่อ-นามสกุล"  },
  { type: "email", label: "อีเมล",            icon: Mail,      defaultLabel: "อีเมล",            defaultPlaceholder: "example@email.com"        },
  { type: "phone", label: "เบอร์โทรศัพท์",   icon: Phone,     defaultLabel: "เบอร์โทรศัพท์",   defaultPlaceholder: "08X-XXX-XXXX"             },
  { type: "text",  label: "บริษัท / องค์กร",  icon: Building2, defaultLabel: "บริษัท / องค์กร", defaultPlaceholder: "ชื่อบริษัทหรือองค์กร"    },
  { type: "text",  label: "ตำแหน่ง",          icon: Briefcase, defaultLabel: "ตำแหน่ง",          defaultPlaceholder: "ตำแหน่งงานของคุณ"        },
];

const CUSTOM_FIELDS: FieldDef[] = [
  { type: "text",     label: "ข้อความสั้น",     icon: Type,        defaultLabel: "คำถาม",          defaultPlaceholder: "กรุณาระบุ"            },
  { type: "textarea", label: "ข้อความยาว",      icon: AlignLeft,   defaultLabel: "คำถาม",          defaultPlaceholder: "กรุณาระบุรายละเอียด"  },
  { type: "select",   label: "Dropdown",        icon: ChevronDown, defaultLabel: "เลือกตัวเลือก",  defaultPlaceholder: ""                      },
  { type: "radio",    label: "ตัวเลือกเดียว",   icon: Circle,      defaultLabel: "เลือกหนึ่งข้อ",  defaultPlaceholder: ""                      },
  { type: "checkbox", label: "หลายตัวเลือก",    icon: CheckSquare, defaultLabel: "เลือกหลายข้อ",   defaultPlaceholder: ""                      },
  { type: "date",     label: "วันที่",           icon: Calendar,    defaultLabel: "วันที่",          defaultPlaceholder: ""                      },
  { type: "number",   label: "ตัวเลข",           icon: Hash,        defaultLabel: "จำนวน",          defaultPlaceholder: "0"                     },
  { type: "file",     label: "อัพโหลดไฟล์",     icon: Upload,      defaultLabel: "อัพโหลดผลงาน",  defaultPlaceholder: "ลากไฟล์มาวาง หรือคลิกเพื่อเลือก" },
];

/* ─── Helpers ────────────────────────────────────────────── */

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function makeField(def: FieldDef): FormField {
  return {
    id: uid(),
    type: def.type,
    label: def.defaultLabel,
    placeholder: def.defaultPlaceholder,
    required: false,
    options: def.type === "select" || def.type === "radio" || def.type === "checkbox"
      ? ["ตัวเลือก 1", "ตัวเลือก 2", "ตัวเลือก 3"]
      : [],
    width: "full",
  };
}

/* ─── Field preview (canvas) ─────────────────────────────── */

function FieldPreview({ field }: { field: FormField }) {
  const cls = "h-8 w-full rounded-md border border-border bg-muted/30 px-3 text-xs text-muted-foreground/50 flex items-center";
  if (field.type === "textarea") {
    return <div className="h-16 w-full rounded-md border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground/50">{field.placeholder || "…"}</div>;
  }
  if (field.type === "select") {
    return (
      <div className={cn(cls, "justify-between")}>
        <span>{field.placeholder || "เลือก…"}</span>
        <ChevronDown className="size-3" />
      </div>
    );
  }
  if (field.type === "radio" || field.type === "checkbox") {
    const Icon = field.type === "radio" ? Circle : CheckSquare;
    return (
      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        {(field.options.length ? field.options : ["ตัวเลือก 1"]).slice(0, 4).map((o) => (
          <label key={o} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Icon className="size-3.5 shrink-0 text-border" />
            {o}
          </label>
        ))}
      </div>
    );
  }
  if (field.type === "date") {
    return <div className={cls}><Calendar className="size-3 mr-2" />dd/mm/yyyy</div>;
  }
  if (field.type === "file") {
    return (
      <div className="flex flex-col items-center gap-2 rounded-md border-2 border-dashed border-border bg-muted/20 px-4 py-5 text-center">
        <Upload className="size-5 text-muted-foreground/40" strokeWidth={1.5} />
        <div>
          <p className="text-xs font-medium text-muted-foreground">{field.placeholder || "ลากไฟล์มาวาง หรือคลิกเพื่อเลือก"}</p>
          {field.accept && <p className="mt-0.5 text-[11px] text-muted-foreground/60">{field.accept}</p>}
          {field.maxSizeMb && <p className="text-[11px] text-muted-foreground/60">ขนาดสูงสุด {field.maxSizeMb} MB</p>}
        </div>
      </div>
    );
  }
  return <div className={cls}>{field.placeholder || "…"}</div>;
}

/* ─── Field card ─────────────────────────────────────────── */

function FieldCard({
  field,
  index,
  total,
  expanded,
  onToggle,
  onUpdate,
  onDelete,
  onMove,
  steps,
}: {
  field: FormField;
  index: number;
  total: number;
  expanded: boolean;
  onToggle: () => void;
  onUpdate: (patch: Partial<FormField>) => void;
  onDelete: () => void;
  onMove: (dir: -1 | 1) => void;
  steps: FormStep[];
}) {
  const hasOptions = field.type === "select" || field.type === "radio" || field.type === "checkbox";

  return (
    <div className={cn(
      "rounded-lg border bg-background transition-shadow",
      expanded ? "border-foreground/20 shadow-sm" : "border-border",
    )}>
      {/* Header row */}
      <div
        className="flex cursor-pointer items-center gap-3 px-4 py-3 select-none"
        onClick={onToggle}
      >
        <GripVertical className="size-4 shrink-0 text-muted-foreground/30" />
        <div className="min-w-0 flex-1">
          <span className="text-sm font-medium text-foreground">{field.label}</span>
          {field.required && <span className="ml-1 text-red-500">*</span>}
          <span className="ml-2 text-[10px] text-muted-foreground/50 uppercase tracking-wide">{field.type}</span>
        </div>

        {/* Required toggle */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onUpdate({ required: !field.required }); }}
          className={cn(
            "flex h-5 w-9 items-center rounded-full border transition-colors",
            field.required ? "border-indigo-300 bg-indigo-600" : "border-border bg-muted",
          )}
        >
          <span className={cn(
            "mx-0.5 size-3.5 rounded-full bg-white transition-transform shadow-sm",
            field.required ? "translate-x-4" : "translate-x-0",
          )} />
        </button>
        <span className="w-10 text-right text-[10px] text-muted-foreground/50">
          {field.required ? "จำเป็น" : "ไม่จำเป็น"}
        </span>

        {/* Controls */}
        <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            disabled={index === 0}
            onClick={() => onMove(-1)}
            className="flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-muted disabled:opacity-30"
          ><ChevronUp className="size-3.5" /></button>
          <button
            type="button"
            disabled={index === total - 1}
            onClick={() => onMove(1)}
            className="flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-muted disabled:opacity-30"
          ><ChevronDown className="size-3.5" /></button>
          <button
            type="button"
            onClick={onDelete}
            className="flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-red-50 hover:text-red-600"
          ><Trash2 className="size-3.5" /></button>
        </div>
        <Settings2 className={cn("size-4 shrink-0 text-muted-foreground/30 transition-transform", expanded && "rotate-90")} />
      </div>

      {/* Field preview */}
      <div className="border-t border-border/50 px-4 py-2.5">
        <FieldPreview field={field} />
      </div>

      {/* Expanded settings */}
      {expanded && (
        <div className="border-t border-border/50 bg-muted/20 px-4 py-4 space-y-3">
          {/* Label */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Label</label>
            <input
              value={field.label}
              onChange={(e) => onUpdate({ label: e.target.value })}
              className="h-8 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
            />
          </div>

          {/* Placeholder (not for option-based types) */}
          {!hasOptions && (
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Placeholder</label>
              <input
                value={field.placeholder}
                onChange={(e) => onUpdate({ placeholder: e.target.value })}
                className="h-8 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
              />
            </div>
          )}

          {/* Width */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">ความกว้าง</label>
            <div className="flex gap-2">
              {(["full", "half"] as const).map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => onUpdate({ width: w })}
                  className={cn(
                    "flex-1 rounded-md border py-1.5 text-xs font-medium transition-colors",
                    field.width === w
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-muted-foreground hover:bg-muted",
                  )}
                >
                  {w === "full" ? "เต็มแถว" : "ครึ่งแถว"}
                </button>
              ))}
            </div>
          </div>

          {/* Step assignment (only when multi-step enabled) */}
          {steps.length > 0 && (
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">อยู่ใน Step</label>
              <select
                value={field.stepId ?? steps[0]?.id ?? ""}
                onChange={(e) => onUpdate({ stepId: e.target.value })}
                className="h-8 rounded-md border border-border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-foreground/20"
              >
                {steps.map((s, i) => (
                  <option key={s.id} value={s.id}>Step {i + 1}: {s.title}</option>
                ))}
              </select>
            </div>
          )}

          {/* File field settings */}
          {field.type === "file" && (
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">ประเภทไฟล์ที่รับ</label>
                <select
                  value={field.accept ?? ""}
                  onChange={(e) => onUpdate({ accept: e.target.value || undefined })}
                  className="h-8 rounded-md border border-border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-foreground/20"
                >
                  <option value="">ทุกประเภท</option>
                  <option value="image/*">รูปภาพ (jpg, png, …)</option>
                  <option value=".pdf">PDF เท่านั้น</option>
                  <option value=".pdf,image/*">PDF + รูปภาพ</option>
                  <option value=".doc,.docx,.pdf">เอกสาร (Word, PDF)</option>
                  <option value=".zip,.rar">ไฟล์ zip / rar</option>
                  <option value="*">ไม่จำกัด</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">ขนาดสูงสุด (MB)</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={field.maxSizeMb ?? 10}
                  onChange={(e) => onUpdate({ maxSizeMb: Number(e.target.value) })}
                  className="h-8 rounded-md border border-border bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-foreground/20"
                />
              </div>
            </div>
          )}

          {/* Options editor */}
          {hasOptions && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">ตัวเลือก</label>
              <div className="space-y-1.5">
                {field.options.map((opt, oi) => (
                  <div key={oi} className="flex items-center gap-2">
                    <input
                      value={opt}
                      onChange={(e) => {
                        const next = [...field.options];
                        next[oi] = e.target.value;
                        onUpdate({ options: next });
                      }}
                      className="h-8 flex-1 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
                    />
                    <button
                      type="button"
                      onClick={() => onUpdate({ options: field.options.filter((_, i) => i !== oi) })}
                      className="flex size-7 items-center justify-center rounded text-muted-foreground hover:bg-red-50 hover:text-red-500"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => onUpdate({ options: [...field.options, `ตัวเลือก ${field.options.length + 1}`] })}
                  className="flex items-center gap-1.5 text-xs text-indigo-600 hover:underline"
                >
                  <Plus className="size-3" />เพิ่มตัวเลือก
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Preview modal ──────────────────────────────────────── */

function PreviewModal({ config, onClose }: { config: FormConfig; onClose: () => void }) {
  const steps = config.steps ?? [];
  const isMultiStep = steps.length > 0;
  const [previewStep, setPreviewStep] = useState(0);
  const isLast = previewStep === steps.length - 1;

  const stepFields = isMultiStep
    ? config.fields.filter((f) => (f.stepId ?? steps[0]?.id) === steps[previewStep]?.id)
    : config.fields;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="flex max-h-[88vh] w-full max-w-xl flex-col overflow-hidden rounded-xl border border-border bg-background shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <p className="text-xs text-muted-foreground">ตัวอย่างฟอร์ม</p>
            <h3 className="text-sm font-semibold text-foreground">{config.title}</h3>
          </div>
          <button type="button" onClick={onClose} className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted">
            <X className="size-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {/* Multi-step progress */}
          {isMultiStep && (
            <div className="mb-5 flex flex-col gap-2.5">
              <div className="flex items-center gap-0">
                {steps.map((s, i) => (
                  <div key={s.id} className="flex flex-1 items-center">
                    <div className={cn(
                      "flex size-6 items-center justify-center rounded-full border-2 text-[10px] font-bold transition-all",
                      i < previewStep ? "border-foreground bg-foreground text-background"
                      : i === previewStep ? "border-foreground bg-background text-foreground"
                      : "border-border bg-background text-muted-foreground",
                    )}>
                      {i < previewStep ? <Check className="size-3" strokeWidth={3} /> : i + 1}
                    </div>
                    {i < steps.length - 1 && (
                      <div className={cn("mx-1 h-0.5 flex-1 rounded", i < previewStep ? "bg-foreground" : "bg-border")} />
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs font-medium text-foreground">{steps[previewStep]?.title}</p>
            </div>
          )}

          {config.description && !isMultiStep && (
            <p className="mb-5 text-sm text-muted-foreground">{config.description}</p>
          )}

          <div className="flex flex-wrap gap-4">
            {stepFields.map((field) => (
              <div
                key={field.id}
                className={field.width === "half" ? "w-[calc(50%-8px)]" : "w-full"}
              >
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  {field.label}
                  {field.required && <span className="ml-0.5 text-red-500">*</span>}
                </label>
                <FieldPreview field={field} />
              </div>
            ))}
          </div>
          {stepFields.length === 0 && (
            <p className="text-center text-sm text-muted-foreground">ยังไม่มีฟิลด์ใน Step นี้</p>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border px-5 py-4">
          {isMultiStep ? (
            <div className={cn("flex gap-2", previewStep > 0 ? "justify-between" : "justify-end")}>
              {previewStep > 0 && (
                <button type="button" onClick={() => setPreviewStep((s) => s - 1)}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                  ย้อนกลับ
                </button>
              )}
              <button type="button" onClick={() => !isLast && setPreviewStep((s) => s + 1)}
                className="flex-1 rounded-lg bg-foreground py-2.5 text-sm font-semibold text-background hover:opacity-80 transition-opacity">
                {isLast ? config.submitLabel : "ถัดไป"}
              </button>
            </div>
          ) : (
            <button type="button"
              className="w-full rounded-lg bg-foreground py-2.5 text-sm font-semibold text-background hover:opacity-80 transition-opacity">
              {config.submitLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────── */

export function FormBuilderPage({ slug }: { slug: string }) {
  const [eventTitle, setEventTitle] = useState(slug);
  const [config, setConfig]         = useState<FormConfig>(DEFAULT_CONFIG);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeStepId, setActiveStepId] = useState<string | null>(null);
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [saved, setSaved]           = useState(false);
  const [copied, setCopied]         = useState(false);
  const saveTimerRef                = useRef<ReturnType<typeof setTimeout> | null>(null);

  const steps = config.steps ?? [];

  /* Load event title + saved form from API */
  useEffect(() => {
    getUserEventBySlug(slug).then((ev) => {
      if (ev) setEventTitle(ev.title);
    });
    fetch(`/api/forms/${slug}`)
      .then((r) => r.json())
      .then((data: { form: (FormConfig & { eventSlug?: string; updatedAt?: string }) | null }) => {
        if (data.form) {
          const { eventSlug: _es, updatedAt: _ua, ...rest } = data.form;
          void _es; void _ua;
          setConfig(rest as FormConfig);
          if (rest.steps?.length) setActiveStepId(rest.steps[0].id);
        }
      })
      .catch(() => { /* keep default */ })
      .finally(() => setLoading(false));
  }, [slug]);

  /* Save to API */
  const save = useCallback(async () => {
    if (saving) return;
    setSaving(true);
    try {
      await fetch(`/api/forms/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      setSaved(true);
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => setSaved(false), 2500);
    } catch { /* ignore */ }
    finally { setSaving(false); }
  }, [slug, config, saving]);

  /* Step management */
  const addStep = useCallback(() => {
    const id = uid();
    const newStep: FormStep = { id, title: `Step ${(config.steps?.length ?? 0) + 1}` };
    setConfig((c) => {
      const existingSteps = c.steps ?? [];
      // first time enabling multi-step: assign all existing fields to a default first step
      if (existingSteps.length === 0) {
        const firstId = uid();
        const first: FormStep = { id: firstId, title: "Step 1" };
        const fieldsWithStep = c.fields.map((f) => ({ ...f, stepId: firstId }));
        const newS: FormStep = { id, title: "Step 2" };
        setActiveStepId(firstId);
        return { ...c, steps: [first, newS], fields: fieldsWithStep };
      }
      setActiveStepId(id);
      return { ...c, steps: [...existingSteps, newStep] };
    });
  }, [config.steps]);

  const deleteStep = useCallback((stepId: string) => {
    setConfig((c) => {
      const remaining = (c.steps ?? []).filter((s) => s.id !== stepId);
      // move fields from deleted step to first remaining step
      const fallbackId = remaining[0]?.id;
      const fields = c.fields.map((f) =>
        f.stepId === stepId ? { ...f, stepId: fallbackId } : f,
      );
      if (remaining.length <= 1) {
        // back to single-step: clear all stepIds
        setActiveStepId(null);
        return { ...c, steps: undefined, fields: fields.map((f) => ({ ...f, stepId: undefined })) };
      }
      setActiveStepId((prev) => prev === stepId ? (remaining[0]?.id ?? null) : prev);
      return { ...c, steps: remaining, fields };
    });
  }, []);

  const renameStep = useCallback((stepId: string, title: string) => {
    setConfig((c) => ({
      ...c,
      steps: (c.steps ?? []).map((s) => s.id === stepId ? { ...s, title } : s),
    }));
  }, []);

  /* Add field */
  const addField = useCallback((def: FieldDef) => {
    const field = makeField(def);
    const stepId = activeStepId ?? undefined;
    setConfig((c) => ({ ...c, fields: [...c.fields, { ...field, stepId }] }));
    setExpandedId(field.id);
  }, [activeStepId]);

  /* Update field */
  const updateField = useCallback((id: string, patch: Partial<FormField>) => {
    setConfig((c) => ({
      ...c,
      fields: c.fields.map((f) => f.id === id ? { ...f, ...patch } : f),
    }));
  }, []);

  /* Delete field */
  const deleteField = useCallback((id: string) => {
    setConfig((c) => ({ ...c, fields: c.fields.filter((f) => f.id !== id) }));
    setExpandedId((prev) => prev === id ? null : prev);
  }, []);

  /* Move field */
  const moveField = useCallback((id: string, dir: -1 | 1) => {
    setConfig((c) => {
      const idx  = c.fields.findIndex((f) => f.id === id);
      const next = [...c.fields];
      const swap = idx + dir;
      if (swap < 0 || swap >= next.length) return c;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return { ...c, fields: next };
    });
  }, []);

  return (
    <div className="flex flex-col gap-5">
      {/* Sub-nav */}
      <EventSubNav slug={slug} eventTitle={eventTitle} />

      {/* Page header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground">ฟอร์มลงทะเบียน</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">สร้างและปรับแต่งฟอร์มสำหรับผู้เข้าร่วมงาน</p>
          </div>
          <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPreviewing(true)}
            className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Eye className="size-3.5" />
            ดูตัวอย่าง
          </button>
          <button
            type="button"
            onClick={() => { void save(); }}
            disabled={saving || loading}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-4 py-1.5 text-xs font-semibold transition-all disabled:opacity-60",
              saved
                ? "bg-emerald-600 text-white"
                : "bg-foreground text-background hover:opacity-80",
            )}
          >
            {saving ? <Loader2 className="size-3.5 animate-spin" /> : saved ? <Check className="size-3.5" /> : <Save className="size-3.5" />}
            {saving ? "กำลังบันทึก…" : saved ? "บันทึกแล้ว" : "บันทึก"}
          </button>
          </div>
        </div>

        {/* Register URL bar */}
        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2">
          <ExternalLink className="size-3.5 shrink-0 text-muted-foreground/50" />
          <span className="flex-1 truncate text-xs text-muted-foreground select-all">
            {typeof window !== "undefined" ? window.location.origin : ""}/events/{slug}/register
          </span>
          <button
            type="button"
            onClick={() => {
              void navigator.clipboard.writeText(`${window.location.origin}/events/${slug}/register`);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className={cn(
              "flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium transition-colors",
              copied
                ? "bg-emerald-100 text-emerald-700"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {copied ? <><Check className="size-3" />คัดลอกแล้ว</> : "คัดลอก"}
          </button>
          <Link
            href={`/events/${slug}/register`}
            target="_blank"
            className="flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            เปิด
          </Link>
        </div>
      </div>

      {/* Form meta */}
      <div className="rounded-lg border border-border bg-background p-4">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">ตั้งค่าหน้าลงทะเบียน</p>

        {/* Cover image */}
        <div className="mb-3 flex gap-3">
          {/* Preview thumbnail */}
          <label className="group relative h-20 w-32 shrink-0 cursor-pointer overflow-hidden rounded-md border border-border bg-muted transition-opacity hover:opacity-80">
            {config.coverImage ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={config.coverImage} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-1">
                <ImageIcon className="size-5 text-muted-foreground/30" strokeWidth={1.5} />
                <span className="text-[10px] text-muted-foreground/40">ไม่มีภาพ</span>
              </div>
            )}
            {/* upload overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <Upload className="size-4 text-white" />
              <span className="text-[10px] font-medium text-white">อัพโหลด</span>
            </div>
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const img = new window.Image();
                const url = URL.createObjectURL(file);
                img.onload = () => {
                  const MAX = 1200;
                  const ratio = Math.min(MAX / img.width, MAX / img.height, 1);
                  const canvas = document.createElement("canvas");
                  canvas.width  = Math.round(img.width  * ratio);
                  canvas.height = Math.round(img.height * ratio);
                  canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
                  URL.revokeObjectURL(url);
                  setConfig((c) => ({ ...c, coverImage: canvas.toDataURL("image/jpeg", 0.82) }));
                };
                img.src = url;
              }}
            />
          </label>

          <div className="flex flex-1 flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">ภาพปกหน้าลงทะเบียน</label>
            <div className="flex gap-1.5">
              <input
                value={config.coverImage?.startsWith("data:") ? "" : (config.coverImage ?? "")}
                onChange={(e) => setConfig((c) => ({ ...c, coverImage: e.target.value || undefined }))}
                placeholder="วาง URL ภาพ หรือคลิกรูปซ้ายเพื่ออัพโหลด"
                className="h-9 flex-1 rounded-md border border-border bg-transparent px-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20 placeholder:text-muted-foreground/50"
              />
              {config.coverImage && (
                <button
                  type="button"
                  onClick={() => setConfig((c) => ({ ...c, coverImage: undefined }))}
                  className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-colors"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground/60">
              {config.coverImage ? (config.coverImage.startsWith("data:") ? "ใช้ภาพที่อัพโหลด" : "ใช้ภาพจาก URL") : "ถ้าไม่ตั้งค่า จะใช้ภาพหน้าปกของงานโดยอัตโนมัติ"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">ชื่อฟอร์ม</label>
            <input
              value={config.title}
              onChange={(e) => setConfig((c) => ({ ...c, title: e.target.value }))}
              className="h-9 rounded-md border border-border bg-transparent px-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">ข้อความปุ่ม Submit</label>
            <input
              value={config.submitLabel}
              onChange={(e) => setConfig((c) => ({ ...c, submitLabel: e.target.value }))}
              className="h-9 rounded-md border border-border bg-transparent px-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
            />
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-xs font-medium text-muted-foreground">คำอธิบาย (แสดงบนหน้าลงทะเบียน)</label>
            <textarea
              value={config.description}
              onChange={(e) => setConfig((c) => ({ ...c, description: e.target.value }))}
              rows={2}
              placeholder="คำอธิบายหรือข้อมูลเพิ่มเติมสำหรับผู้ลงทะเบียน..."
              className="rounded-md border border-border bg-transparent px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-foreground/20 placeholder:text-muted-foreground/50"
            />
          </div>
        </div>
      </div>

      {/* Main builder layout */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[220px_1fr]">

        {/* Left: Field picker */}
        <div className="flex flex-col gap-4">
          {/* Preset */}
          <div className="rounded-lg border border-border bg-background p-4">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
              ฟิลด์สำเร็จรูป
            </p>
            <div className="flex flex-col gap-1.5">
              {PRESET_FIELDS.map((def) => (
                <button
                  key={def.label}
                  type="button"
                  onClick={() => addField(def)}
                  className="flex items-center gap-2.5 rounded-md border border-border px-3 py-2 text-left text-xs font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <def.icon className="size-3.5 shrink-0 text-muted-foreground" />
                  {def.label}
                  <Plus className="ml-auto size-3 text-muted-foreground/50" />
                </button>
              ))}
            </div>
          </div>

          {/* Custom */}
          <div className="rounded-lg border border-border bg-background p-4">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
              กำหนดเอง
            </p>
            <div className="flex flex-col gap-1.5">
              {CUSTOM_FIELDS.map((def) => (
                <button
                  key={def.label}
                  type="button"
                  onClick={() => addField(def)}
                  className="flex items-center gap-2.5 rounded-md border border-border px-3 py-2 text-left text-xs font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <def.icon className="size-3.5 shrink-0 text-muted-foreground" />
                  {def.label}
                  <Plus className="ml-auto size-3 text-muted-foreground/50" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Canvas */}
        <div className="relative rounded-lg border border-border bg-background">
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/70 backdrop-blur-sm">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          )}

          {/* Canvas header */}
          <div className="border-b border-border px-5 py-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-foreground">
                ฟอร์มของคุณ
                <span className="ml-2 font-normal text-muted-foreground">({config.fields.length} ฟิลด์)</span>
              </p>
              <button
                type="button"
                onClick={addStep}
                className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Layers className="size-3" />
                {steps.length === 0 ? "เปิดใช้ Multi-step" : "+ เพิ่ม Step"}
              </button>
            </div>

            {/* Step tabs */}
            {steps.length > 0 && (
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                {steps.map((s, i) => (
                  <div
                    key={s.id}
                    className={cn(
                      "group flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
                      activeStepId === s.id
                        ? "border-foreground bg-foreground text-background"
                        : "border-border text-muted-foreground hover:bg-muted",
                    )}
                  >
                    <button type="button" onClick={() => setActiveStepId(s.id)} className="flex items-center gap-1.5">
                      <span className={cn(
                        "flex size-4 items-center justify-center rounded-full text-[10px] font-bold",
                        activeStepId === s.id ? "bg-background/20 text-background" : "bg-muted text-muted-foreground",
                      )}>{i + 1}</span>
                      {editingStepId === s.id ? (
                        <input
                          autoFocus
                          defaultValue={s.title}
                          onBlur={(e) => { renameStep(s.id, e.target.value || s.title); setEditingStepId(null); }}
                          onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); }}
                          onClick={(e) => e.stopPropagation()}
                          className="w-20 bg-transparent text-xs focus:outline-none"
                        />
                      ) : (
                        <span onDoubleClick={() => setEditingStepId(s.id)}>{s.title}</span>
                      )}
                    </button>
                    {steps.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); deleteStep(s.id); }}
                        className={cn("ml-0.5 rounded opacity-0 transition-opacity group-hover:opacity-100",
                          activeStepId === s.id ? "text-background/70 hover:text-background" : "text-muted-foreground hover:text-red-500")}
                      >
                        <X className="size-3" />
                      </button>
                    )}
                  </div>
                ))}
                <p className="ml-1 text-[10px] text-muted-foreground/50">ดับเบิลคลิกชื่อเพื่อแก้ไข</p>
              </div>
            )}
          </div>

          {/* Fields list (filtered by active step) */}
          <div className="p-5">
            {(() => {
              const visibleFields = steps.length === 0
                ? config.fields
                : config.fields.filter((f) => (f.stepId ?? steps[0]?.id) === activeStepId);
              const allIndexed = config.fields;

              if (visibleFields.length === 0) {
                return (
                  <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
                    <Plus className="size-8 text-muted-foreground/30" strokeWidth={1.5} />
                    <div>
                      <p className="text-sm font-medium text-foreground">ยังไม่มีฟิลด์</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {steps.length > 0 ? "คลิกฟิลด์ทางซ้ายเพื่อเพิ่มใน Step นี้" : "คลิกฟิลด์ทางซ้ายเพื่อเพิ่ม"}
                      </p>
                    </div>
                  </div>
                );
              }

              return (
                <div className="space-y-3">
                  {visibleFields.map((field) => {
                    const globalIndex = allIndexed.findIndex((f) => f.id === field.id);
                    return (
                      <FieldCard
                        key={field.id}
                        field={field}
                        index={globalIndex}
                        total={allIndexed.length}
                        expanded={expandedId === field.id}
                        onToggle={() => setExpandedId((prev) => prev === field.id ? null : field.id)}
                        onUpdate={(patch) => updateField(field.id, patch)}
                        onDelete={() => deleteField(field.id)}
                        onMove={(dir) => moveField(field.id, dir)}
                        steps={steps}
                      />
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Preview modal */}
      {previewing && (
        <PreviewModal config={config} onClose={() => setPreviewing(false)} />
      )}
    </div>
  );
}
