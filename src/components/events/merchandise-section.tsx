import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import type { MockMerchandise } from "@/lib/mock-data";
import { merchIcons } from "@/lib/merch-icons";

export function MerchandiseSection({
  items,
  slug,
}: {
  items: MockMerchandise[];
  slug: string;
}) {
  return (
    <div className="mt-8 border-t border-border pt-8">
      <h2 className="text-lg font-semibold text-foreground">สินค้าของงาน</h2>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((item) => {
          const Icon = merchIcons[item.icon] ?? ShoppingBag;
          return (
            <div
              key={item.id}
              className="flex flex-col overflow-hidden rounded-xl border border-border bg-card"
            >
              <div
                className={`relative aspect-square overflow-hidden bg-gradient-to-br ${item.gradient}`}
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <Icon className="absolute inset-0 m-auto size-10 text-white/90" />
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2 p-3">
                <p className="text-sm font-medium text-foreground">
                  {item.name}
                </p>
                <p className="text-sm font-bold text-foreground">
                  {item.price === 0
                    ? "ฟรี"
                    : `฿${item.price.toLocaleString("th-TH")}`}
                </p>
                <Link
                  href={`/checkout/${slug}`}
                  className="mt-auto inline-flex h-8 items-center justify-center rounded-lg border border-border text-xs font-medium text-foreground transition-colors hover:bg-muted"
                >
                  ซื้อสินค้า
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
