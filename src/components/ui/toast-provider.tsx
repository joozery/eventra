"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { CheckCircle2, Info, TriangleAlert, X, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Types ────────────────────────────────────────────────────── */

type ToastVariant = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastContextValue {
  toast: (opts: Omit<Toast, "id">) => void;
  success: (title: string, description?: string) => void;
  error:   (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
  info:    (title: string, description?: string) => void;
}

/* ─── Context ──────────────────────────────────────────────────── */

const ToastContext = createContext<ToastContextValue>({
  toast:   () => {},
  success: () => {},
  error:   () => {},
  warning: () => {},
  info:    () => {},
});

export function useToast() { return useContext(ToastContext); }

/* ─── Single toast item ────────────────────────────────────────── */

const VARIANT_CONFIG: Record<ToastVariant, {
  icon: React.ElementType;
  iconCls: string;
  bar: string;
  border: string;
}> = {
  success: { icon: CheckCircle2,  iconCls: "text-emerald-500", bar: "bg-emerald-500", border: "border-emerald-100" },
  error:   { icon: XCircle,       iconCls: "text-rose-500",    bar: "bg-rose-500",    border: "border-rose-100"    },
  warning: { icon: TriangleAlert, iconCls: "text-amber-500",   bar: "bg-amber-500",   border: "border-amber-100"   },
  info:    { icon: Info,          iconCls: "text-blue-500",    bar: "bg-blue-500",    border: "border-blue-100"    },
};

function ToastItem({ id, title, description, variant = "success", duration = 4000, onClose }: Toast & { onClose: () => void }) {
  const [progress, setProgress] = useState(100);
  const [visible, setVisible]   = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cfg = VARIANT_CONFIG[variant];
  const Icon = cfg.icon;

  /* slide in */
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  /* progress countdown */
  useEffect(() => {
    const step = 100 / (duration / 50);
    intervalRef.current = setInterval(() => {
      setProgress((p) => {
        if (p <= 0) { onClose(); return 0; }
        return p - step;
      });
    }, 50);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [duration, onClose]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={cn(
        "relative flex w-80 items-start gap-3 overflow-hidden rounded-xl border bg-background shadow-lg transition-all duration-300",
        cfg.border,
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
      )}
    >
      {/* Progress bar */}
      <div
        className={cn("absolute bottom-0 left-0 h-0.5 transition-all", cfg.bar)}
        style={{ width: `${progress}%`, transitionDuration: "50ms" }}
      />

      <div className="flex flex-1 items-start gap-3 p-4">
        {/* Icon */}
        <span className={cn("mt-0.5 shrink-0", cfg.iconCls)}>
          <Icon className="size-5" />
        </span>

        {/* Text */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          {description && (
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{description}</p>
          )}
        </div>

        {/* Close */}
        <button
          type="button"
          onClick={handleClose}
          className="shrink-0 text-muted-foreground/50 transition-colors hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}

/* ─── Provider ─────────────────────────────────────────────────── */

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const toast = useCallback((opts: Omit<Toast, "id">) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((t) => [...t, { ...opts, id }]);
  }, []);

  const success = useCallback((title: string, description?: string) =>
    toast({ title, description, variant: "success" }), [toast]);
  const error   = useCallback((title: string, description?: string) =>
    toast({ title, description, variant: "error" }), [toast]);
  const warning = useCallback((title: string, description?: string) =>
    toast({ title, description, variant: "warning" }), [toast]);
  const info    = useCallback((title: string, description?: string) =>
    toast({ title, description, variant: "info" }), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info }}>
      {children}

      {/* Toast container — bottom-right */}
      <div className="fixed bottom-5 right-5 z-[200] flex flex-col-reverse gap-2">
        {toasts.map((t) => (
          <ToastItem key={t.id} {...t} onClose={() => remove(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
