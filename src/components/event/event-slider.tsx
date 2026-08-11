"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EventCard } from "@/components/event/event-card";
import type { MockEvent } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function EventSlider({ events }: { events: MockEvent[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  function updateEdges() {
    const el = scrollerRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }

  useEffect(() => {
    updateEdges();
  }, [events]);

  function scrollByAmount(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-slide]");
    const amount = (card?.offsetWidth ?? 280) + 20;
    el.scrollBy({ left: direction * amount, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        onScroll={updateEdges}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {events.map((event) => (
          <div
            key={event.id}
            data-slide
            className="w-[75%] shrink-0 snap-start sm:w-[45%] lg:w-[calc(20%-16px)]"
          >
            <EventCard event={event} />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => scrollByAmount(-1)}
        aria-label="ก่อนหน้า"
        className={cn(
          "absolute top-[38%] -left-3 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white text-black shadow-md transition-opacity duration-200 hover:bg-neutral-100 sm:flex lg:-left-5",
          atStart ? "pointer-events-none opacity-0" : "opacity-100"
        )}
      >
        <ChevronLeft className="size-4.5" />
      </button>
      <button
        type="button"
        onClick={() => scrollByAmount(1)}
        aria-label="ถัดไป"
        className={cn(
          "absolute top-[38%] -right-3 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white text-black shadow-md transition-opacity duration-200 hover:bg-neutral-100 sm:flex lg:-right-5",
          atEnd ? "pointer-events-none opacity-0" : "opacity-100"
        )}
      >
        <ChevronRight className="size-4.5" />
      </button>
    </div>
  );
}
