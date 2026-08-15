"use client";

// This component is kept for backwards-compatibility.
// The actual dashboard UI now lives in:
//   src/app/organizer/dashboard/layout.tsx  (sidebar + header)
//   src/app/organizer/dashboard/page.tsx    → /organizer/dashboard
//   src/app/organizer/dashboard/events/     → /organizer/dashboard/events
//   src/app/organizer/dashboard/package/    → /organizer/dashboard/package

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function OrganizerDashboard() {
  const router = useRouter();
  useEffect(() => { router.replace("/organizer/dashboard"); }, [router]);
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <span className="size-5 animate-spin rounded-full border-2 border-border border-t-foreground" />
    </div>
  );
}
