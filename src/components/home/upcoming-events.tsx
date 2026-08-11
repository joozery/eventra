import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EventSlider } from "@/components/event/event-slider";
import { upcomingEvents } from "@/lib/mock-data";

export function UpcomingEvents() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Event ที่กำลังจะมาถึง
          </h2>
          <p className="mt-1 text-muted-foreground">อย่าพลาดงานที่กำลังจะเปิดขายบัตร</p>
        </div>
        <Link
          href="/events"
          className="hidden shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex"
        >
          ดูทั้งหมด
          <ArrowRight className="size-4" />
        </Link>
      </div>

      <EventSlider events={upcomingEvents} />
    </section>
  );
}
