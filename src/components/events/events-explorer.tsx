"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpDown,
  RotateCcw,
  Search,
  SearchX,
  SlidersHorizontal,
} from "lucide-react";
import { EventCard } from "@/components/event/event-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pagination } from "@/components/ui/pagination";
import { allEvents, categories } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type SortKey = "popular" | "price-asc" | "price-desc";

const sortLabels: Record<SortKey, string> = {
  popular: "ยอดนิยม",
  "price-asc": "ราคา: ต่ำ-สูง",
  "price-desc": "ราคา: สูง-ต่ำ",
};

type PriceBucket = {
  id: string;
  label: string;
  test: (price: number) => boolean;
};

const priceBuckets: PriceBucket[] = [
  { id: "free", label: "ฟรี", test: (p) => p === 0 },
  { id: "under-500", label: "ต่ำกว่า ฿500", test: (p) => p > 0 && p < 500 },
  { id: "500-1000", label: "฿500 - ฿1,000", test: (p) => p >= 500 && p <= 1000 },
  { id: "1000-2000", label: "฿1,000 - ฿2,000", test: (p) => p > 1000 && p <= 2000 },
  { id: "over-2000", label: "มากกว่า ฿2,000", test: (p) => p > 2000 },
];

function getArea(location: string) {
  return location.split(",").pop()?.trim() ?? location;
}

function getMonth(date: string) {
  return date.split(" ")[1] ?? date;
}

const areaOptions = Array.from(
  new Set(allEvents.map((event) => getArea(event.location)))
);
const monthOptions = Array.from(
  new Set(allEvents.map((event) => getMonth(event.date)))
);

function FilterGroup({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: { id: string; label: string }[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <div className="mt-3 flex flex-col gap-2.5">
        {options.map((option) => (
          <label
            key={option.id}
            className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground"
          >
            <input
              type="checkbox"
              checked={selected.includes(option.id)}
              onChange={() => onToggle(option.id)}
              className="size-4 rounded border-border text-primary focus-visible:ring-2 focus-visible:ring-ring/50"
            />
            <span className={selected.includes(option.id) ? "text-foreground" : ""}>
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

function toggleValue(list: string[], value: string) {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}

const PAGE_SIZE = 8;

export function EventsExplorer() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("popular");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceBuckets, setSelectedPriceBuckets] = useState<string[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const activeFilterCount =
    selectedCategories.length +
    selectedPriceBuckets.length +
    selectedAreas.length +
    selectedMonths.length;

  function clearFilters() {
    setSelectedCategories([]);
    setSelectedPriceBuckets([]);
    setSelectedAreas([]);
    setSelectedMonths([]);
    setPage(1);
  }

  const filteredEvents = useMemo(() => {
    const q = query.trim().toLowerCase();
    const activeBuckets = priceBuckets.filter((b) =>
      selectedPriceBuckets.includes(b.id)
    );

    const filtered = allEvents.filter((event) => {
      const matchesQuery =
        q.length === 0 ||
        event.title.toLowerCase().includes(q) ||
        event.location.toLowerCase().includes(q) ||
        event.category.toLowerCase().includes(q);

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(event.category);

      const matchesPrice =
        activeBuckets.length === 0 ||
        activeBuckets.some((bucket) => bucket.test(event.price));

      const matchesArea =
        selectedAreas.length === 0 ||
        selectedAreas.includes(getArea(event.location));

      const matchesMonth =
        selectedMonths.length === 0 ||
        selectedMonths.includes(getMonth(event.date));

      return (
        matchesQuery &&
        matchesCategory &&
        matchesPrice &&
        matchesArea &&
        matchesMonth
      );
    });

    const sorted = [...filtered];
    if (sort === "price-asc") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      sorted.sort((a, b) => b.price - a.price);
    } else {
      sorted.sort((a, b) => b.attendees - a.attendees);
    }
    return sorted;
  }, [query, sort, selectedCategories, selectedPriceBuckets, selectedAreas, selectedMonths]);

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-2 shadow-sm sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-xl px-3 py-2.5">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="ค้นหา Event, ศิลปิน หรือสถานที่"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="hidden h-6 w-px bg-border sm:block" />
        <button
          type="button"
          onClick={() => setFiltersOpen((v) => !v)}
          className={cn(
            "inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl px-3.5 text-sm font-medium outline-none transition-colors lg:hidden",
            filtersOpen
              ? "bg-muted text-foreground"
              : "text-foreground hover:bg-muted"
          )}
        >
          <SlidersHorizontal className="size-4 text-muted-foreground" />
          ตัวกรอง
          {activeFilterCount > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              {activeFilterCount}
            </span>
          )}
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl px-3.5 text-sm font-medium text-foreground outline-none hover:bg-muted data-popup-open:bg-muted">
            <ArrowUpDown className="size-4 text-muted-foreground" />
            {sortLabels[sort]}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={8} className="min-w-40 p-1.5">
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
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
        <aside
          className={cn(
            "flex-col gap-7 lg:flex",
            filtersOpen ? "flex" : "hidden"
          )}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">ตัวกรอง</h2>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                <RotateCcw className="size-3" />
                ล้างตัวกรอง
              </button>
            )}
          </div>

          <FilterGroup
            title="หมวดหมู่"
            options={categories.map((c) => ({ id: c.name, label: c.name }))}
            selected={selectedCategories}
            onToggle={(id) => {
              setSelectedCategories((v) => toggleValue(v, id));
              setPage(1);
            }}
          />

          <FilterGroup
            title="ช่วงราคา"
            options={priceBuckets.map((b) => ({ id: b.id, label: b.label }))}
            selected={selectedPriceBuckets}
            onToggle={(id) => {
              setSelectedPriceBuckets((v) => toggleValue(v, id));
              setPage(1);
            }}
          />

          <FilterGroup
            title="พื้นที่"
            options={areaOptions.map((a) => ({ id: a, label: a }))}
            selected={selectedAreas}
            onToggle={(id) => {
              setSelectedAreas((v) => toggleValue(v, id));
              setPage(1);
            }}
          />

          <FilterGroup
            title="เดือน"
            options={monthOptions.map((m) => ({ id: m, label: m }))}
            selected={selectedMonths}
            onToggle={(id) => {
              setSelectedMonths((v) => toggleValue(v, id));
              setPage(1);
            }}
          />
        </aside>

        <div>
          <p className="text-sm text-muted-foreground">
            พบ {filteredEvents.length} อีเวนต์
          </p>

          {filteredEvents.length > 0 ? (
            <>
              <div className="mt-4 grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
                {paginatedEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
              <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />
            </>
          ) : (
            <div className="mt-4 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-20 text-center">
              <SearchX className="size-8 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">ไม่พบ Event ที่ค้นหา</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  ลองเปลี่ยนคำค้นหาหรือปรับตัวกรองดูนะครับ
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
