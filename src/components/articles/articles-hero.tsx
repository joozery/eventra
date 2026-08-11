"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, Newspaper } from "lucide-react";
import { articles } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const slides = articles.slice(0, 4);

export function ArticlesHero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = window.setInterval(() => {
      setActive((v) => (v + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, []);

  if (slides.length === 0) return null;

  return (
    <section className="relative isolate h-72 w-full overflow-hidden sm:h-96 lg:h-[28rem]">
      {slides.map((article, index) => (
        <Link
          key={article.id}
          href={`/articles/${article.slug}`}
          aria-label={article.title}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
            index === active
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          )}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${article.gradient}`}
          >
            {article.image ? (
              <Image
                src={article.image}
                alt=""
                fill
                priority={index === 0}
                className="object-cover"
              />
            ) : (
              <>
                <Newspaper className="pointer-events-none absolute -right-10 -bottom-10 size-80 text-white/5" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] bg-[length:24px_24px]" />
              </>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/30" />
          </div>

          <div className="relative mx-auto flex h-full max-w-7xl flex-col items-start justify-end px-4 pb-16 sm:px-6 lg:px-8">
            <span className="w-fit rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-indigo-700 backdrop-blur-sm">
              {article.tag}
            </span>
            <h1 className="mt-4 max-w-2xl text-balance text-2xl font-bold tracking-tight text-white sm:text-4xl">
              {article.title}
            </h1>
            <p className="mt-2 max-w-xl text-balance text-sm text-white/80 sm:text-base">
              {article.excerpt}
            </p>
            <div className="mt-4 flex items-center gap-4 text-xs text-white/70 sm:text-sm">
              <span className="flex items-center gap-1.5">
                <Calendar className="size-3.5" />
                {article.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5" />
                อ่าน {article.readTime}
              </span>
            </div>
          </div>
        </Link>
      ))}

      <div className="absolute inset-x-0 bottom-4 z-10 flex items-center justify-center gap-1.5">
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
    </section>
  );
}
