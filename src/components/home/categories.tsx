import { CategoryTile } from "@/components/categories/category-tile";
import { categories } from "@/lib/mock-data";

export function Categories() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          หมวดหมู่ยอดนิยม
        </h2>
        <p className="mt-1 text-muted-foreground">
          เลือกหมวดหมู่ที่คุณสนใจแล้วเริ่มค้นหา
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((category) => (
          <CategoryTile key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
}
