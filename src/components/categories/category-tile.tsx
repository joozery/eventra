import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  Briefcase,
  Cpu,
  Dumbbell,
  Music,
  Palette,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import type { MockCategory } from "@/lib/mock-data";

const icons: Record<string, LucideIcon> = {
  Music,
  Briefcase,
  Dumbbell,
  Palette,
  UtensilsCrossed,
  Cpu,
};

export function CategoryTile({ category }: { category: MockCategory }) {
  const Icon = icons[category.icon];

  return (
    <Link
      href={`/categories/${category.id}`}
      className="group relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-lg p-4 text-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-black/10"
    >
      {category.image && (
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="absolute inset-0 object-cover transition-transform duration-500 group-hover:scale-110"
        />
      )}

      <div
        className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-30 mix-blend-multiply transition-opacity duration-300 group-hover:opacity-20`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />

      <Icon className="pointer-events-none absolute -right-4 -bottom-4 z-10 size-24 text-white/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:16px_16px]" />

      <div className="relative z-20 flex items-start justify-between">
        <span className="flex size-9 items-center justify-center rounded-lg border border-white/20 bg-white/20 shadow-sm backdrop-blur-md">
          <Icon className="size-4.5" />
        </span>
        <ArrowUpRight className="size-4 -translate-x-1 translate-y-1 text-white/0 transition-all duration-200 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-white" />
      </div>

      <div className="relative z-20">
        <span className="block text-base font-bold tracking-tight text-white drop-shadow-md">
          {category.name}
        </span>
        <span className="text-sm font-medium text-white/90 drop-shadow-md">
          {category.count} Events
        </span>
      </div>
    </Link>
  );
}
