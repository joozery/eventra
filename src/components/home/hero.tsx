"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CalendarDays, Search } from "lucide-react";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const slides = ["/coverhero/cover.png", "/coverhero/coverevent.jpg"];

export function Hero() {
  const [active, setActive] = useState(0);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((v) => (v + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        {slides.map((src, index) => (
          <Image
            key={src}
            src={src}
            alt=""
            fill
            priority={index === 0}
            className={cn(
              "object-cover transition-opacity duration-1000 ease-in-out",
              index === active ? "opacity-100" : "opacity-0"
            )}
          />
        ))}

      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center sm:px-6 sm:py-32 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
        >
          Discover events{" "}
          <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-fuchsia-300 bg-clip-text text-transparent">
            you&apos;ll love
          </span>
          .
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
          className="mt-5 max-w-xl text-balance text-lg text-white/80"
        >
          ค้นหาและจองงานอีเวนต์สุดพิเศษที่เกิดขึ้นรอบตัวคุณ ครบทั้งดนตรี
          ธุรกิจ กีฬา และศิลปะ
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.24 }}
          className="mt-10 flex w-full max-w-2xl flex-col gap-2 rounded-2xl border border-border bg-card/95 p-2 shadow-lg shadow-black/10 backdrop-blur-sm sm:flex-row sm:items-center"
        >
          <div className="flex flex-1 items-center gap-2 rounded-xl px-3 py-2.5">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <input
              type="text"
              placeholder="ค้นหา Event, ศิลปิน หรือสถานที่"
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="hidden h-6 w-px bg-border sm:block" />
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger className="flex items-center gap-2 rounded-xl px-3 py-2.5 sm:w-44 text-left">
              <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
              <span className={cn("w-full bg-transparent text-sm outline-none", date ? "text-foreground" : "text-muted-foreground")}>
                {date ? format(date, "d MMM yyyy", { locale: th }) : "วันที่"}
              </span>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => { setDate(d); setOpen(false); }}
              />
            </PopoverContent>
          </Popover>
          <Button
            type="submit"
            size="lg"
            className="h-11 shrink-0 gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 text-white hover:opacity-90 hover:bg-none"
          >
            <Search className="size-4" />
            ค้นหา
          </Button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.38 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-white/70"
        >
          <span>ยอดนิยม:</span>
          {["คอนเสิร์ต", "สัมมนาธุรกิจ", "มาราธอน", "เทศกาลอาหาร"].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/20 px-3 py-1 text-xs hover:bg-white/10"
            >
              {tag}
            </span>
          ))}
        </motion.div>

        <div className="mt-10 flex items-center gap-1.5">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`สไลด์ที่ ${index + 1}`}
              className={cn(
                "h-1.5 rounded-full transition-all",
                index === active ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/60"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
