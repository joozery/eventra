"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "eventra-cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from localStorage after hydration, does not loop
      setVisible(true);
    }
  }, []);

  function handleChoice(choice: "accepted" | "rejected") {
    window.localStorage.setItem(STORAGE_KEY, choice);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-[60] sm:inset-x-auto sm:right-4 sm:max-w-sm">
      <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 shadow-lg shadow-black/10">
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
            <Cookie className="size-4.5" />
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-foreground">
              เราใช้คุกกี้
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              EVENTRA ใช้คุกกี้เพื่อพัฒนาประสบการณ์การใช้งานและวิเคราะห์การเข้าชมเว็บไซต์
              อ่านเพิ่มเติมได้ที่{" "}
              <Link href="/privacy" className="font-medium text-primary hover:underline">
                นโยบายความเป็นส่วนตัว
              </Link>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg"
            onClick={() => handleChoice("rejected")}
          >
            ปฏิเสธ
          </Button>
          <Button
            size="sm"
            className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:bg-none"
            onClick={() => handleChoice("accepted")}
          >
            ยอมรับทั้งหมด
          </Button>
        </div>
      </div>
    </div>
  );
}
