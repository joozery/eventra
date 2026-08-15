import type { Metadata } from "next";
import { Suspense } from "react";
import { PackageSelector } from "@/components/organizer/package-selector";

export const metadata: Metadata = {
  title: "เลือกแพ็กเกจ — EVENTRA",
};

export default function PackagePage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <span className="size-5 animate-spin rounded-full border-2 border-border border-t-foreground" />
      </div>
    }>
      <PackageSelector />
    </Suspense>
  );
}
