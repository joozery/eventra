import Link from "next/link";
import Image from "next/image";
import { Flame, ShoppingBag } from "lucide-react";
import type { MerchandiseListing } from "@/lib/mock-data";
import { merchIcons } from "@/lib/merch-icons";

export function ProductCard({ item }: { item: MerchandiseListing }) {
  const Icon = merchIcons[item.icon] ?? ShoppingBag;

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/10">
      {/* Product Image Area */}
      <div className="relative aspect-square overflow-hidden">
        {item.image ? (
          <>
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* subtle dark overlay at bottom for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </>
        ) : (
          <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${item.gradient}`}>
            <Icon className="size-16 text-white/90 transition-transform duration-300 group-hover:scale-110" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.12)_1px,transparent_0)] bg-[length:16px_16px]" />
          </div>
        )}

        {/* Event label badge */}
        <Link
          href={`/events/${item.eventSlug}`}
          className="absolute top-2.5 left-2.5 max-w-[calc(100%-20px)] truncate rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-indigo-700 shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
        >
          {item.eventTitle}
        </Link>

        {item.bestSeller && (
          <span className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full bg-orange-500 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
            <Flame className="size-3" />
            ขายดี
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <p className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
          {item.name}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-3">
          <span className="text-sm font-bold text-foreground">
            {item.price === 0 ? "ฟรี" : `฿${item.price.toLocaleString("th-TH")}`}
          </span>
          <Link
            href={`/checkout/${item.eventSlug}`}
            className="inline-flex h-8 items-center justify-center rounded-lg bg-black px-3 text-xs font-medium text-white transition-opacity hover:opacity-80"
          >
            ซื้อสินค้า
          </Link>
        </div>
      </div>
    </div>
  );
}
