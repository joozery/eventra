"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown, Flame, RotateCcw, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/merchandise/product-card";
import { ProductSlider } from "@/components/merchandise/product-slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pagination } from "@/components/ui/pagination";
import type { MerchandiseListing } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type SortKey = "featured" | "price-asc" | "price-desc";

const sortLabels: Record<SortKey, string> = {
  featured: "แนะนำ",
  "price-asc": "ราคา: ต่ำ-สูง",
  "price-desc": "ราคา: สูง-ต่ำ",
};

const PAGE_SIZE = 9;

function toggleValue(list: string[], value: string) {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}

export function ShopExplorer({ products }: { products: MerchandiseListing[] }) {
  const [sort, setSort] = useState<SortKey>("featured");
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);

  const bestSellers = useMemo(
    () => products.filter((p) => p.bestSeller),
    [products]
  );

  const events = useMemo(
    () => Array.from(new Set(products.map((p) => p.eventTitle))),
    [products]
  );

  const visibleProducts = useMemo(() => {
    const filtered = products.filter(
      (p) => selectedEvents.length === 0 || selectedEvents.includes(p.eventTitle)
    );
    const sorted = [...filtered];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    return sorted;
  }, [products, selectedEvents, sort]);

  const totalPages = Math.max(1, Math.ceil(visibleProducts.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedProducts = visibleProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          สินค้า
        </h1>
        <p className="mt-2 text-muted-foreground">
          ของที่ระลึกและสินค้าจากอีเวนต์ต่างๆ ในเครือ EVENTRA
        </p>
      </div>

      {bestSellers.length > 0 && (
        <div className="mb-10">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
            <Flame className="size-5 text-orange-500" />
            สินค้าขายดี
          </h2>
          <ProductSlider products={bestSellers} />
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setFiltersOpen((v) => !v)}
          className={cn(
            "inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl border border-border px-3.5 text-sm font-medium outline-none transition-colors lg:hidden",
            filtersOpen
              ? "bg-muted text-foreground"
              : "text-foreground hover:bg-muted"
          )}
        >
          <SlidersHorizontal className="size-4 text-muted-foreground" />
          ตัวกรอง
          {selectedEvents.length > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              {selectedEvents.length}
            </span>
          )}
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl border border-border px-3.5 text-sm font-medium text-foreground outline-none hover:bg-muted data-popup-open:bg-muted">
            <ArrowUpDown className="size-4 text-muted-foreground" />
            {sortLabels[sort]}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" sideOffset={8} className="min-w-40 p-1.5">
            {(Object.keys(sortLabels) as SortKey[]).map((key) => (
              <DropdownMenuItem
                key={key}
                onClick={() => {
                  setSort(key);
                  setPage(1);
                }}
                className={cn(
                  "rounded-lg px-2.5 py-2 text-sm",
                  key === sort ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {sortLabels[key]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <span className="ml-auto text-sm text-muted-foreground">
          พบ {visibleProducts.length} รายการ
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
        <aside
          className={cn(
            "flex-col gap-4 lg:flex",
            filtersOpen ? "flex" : "hidden"
          )}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              จากอีเวนต์
            </h2>
            {selectedEvents.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setSelectedEvents([]);
                  setPage(1);
                }}
                className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                <RotateCcw className="size-3" />
                ล้าง
              </button>
            )}
          </div>

          <div className="flex flex-col gap-2.5">
            {events.map((event) => (
              <label
                key={event}
                className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground"
              >
                <input
                  type="checkbox"
                  checked={selectedEvents.includes(event)}
                  onChange={() => {
                    setSelectedEvents((v) => toggleValue(v, event));
                    setPage(1);
                  }}
                  className="size-4 shrink-0 rounded border-border text-primary focus-visible:ring-2 focus-visible:ring-ring/50"
                />
                <span
                  className={
                    selectedEvents.includes(event) ? "text-foreground" : ""
                  }
                >
                  {event}
                </span>
              </label>
            ))}
          </div>
        </aside>

        <div>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
            {paginatedProducts.map((item) => (
              <ProductCard key={`${item.eventSlug}-${item.id}`} item={item} />
            ))}
          </div>
          <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>
    </div>
  );
}
