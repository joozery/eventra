"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const slides = [
  { src: "/coverhero/banner.jpg", alt: "Music Fest 2024" },
  { src: "/coverhero/banner2.jpg", alt: "Weekend Fest Street Stage" },
];

export function Banner() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((v) => (v + 1) % slides.length);
    }, 4000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="relative h-28 w-full overflow-hidden rounded-lg sm:h-40 lg:h-56">
        <Link
          href="/events"
          aria-label="ดูอีเวนต์ทั้งหมด"
          className="absolute inset-0 z-10"
        />

        {slides.map((slide, index) => (
          <Image
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            fill
            className={cn(
              "object-cover transition-opacity duration-1000 ease-in-out",
              index === active ? "opacity-100" : "opacity-0"
            )}
          />
        ))}

        <div className="absolute inset-x-0 bottom-2 z-20 flex items-center justify-center gap-1.5">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`สไลด์ที่ ${index + 1}`}
              className={cn(
                "h-1.5 rounded-full transition-all",
                index === active
                  ? "w-5 bg-white"
                  : "w-1.5 bg-white/50 hover:bg-white/75"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
