"use client";

import { useEffect, useState } from "react";
import { getUserEvents, type UserEvent } from "@/lib/user-events";
import { OverviewTab } from "./overview-tab";

export function OverviewPage() {
  const [events, setEvents] = useState<UserEvent[] | null>(null);

  useEffect(() => {
    getUserEvents().then(setEvents);
  }, []);

  if (events === null) {
    return (
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  return <OverviewTab events={events} />;
}
