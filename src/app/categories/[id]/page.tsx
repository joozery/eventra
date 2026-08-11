import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, SearchX } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { EventCard } from "@/components/event/event-card";
import { allEvents, categories, getCategoryById } from "@/lib/mock-data";

export function generateStaticParams() {
  return categories.map((category) => ({ id: category.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const category = getCategoryById(id);
  if (!category) return {};
  return {
    title: `${category.name} — EVENTRA`,
    description: `รวม Event หมวด${category.name}ที่กำลังเปิดขายบัตรอยู่ตอนนี้บน EVENTRA`,
  };
}

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = getCategoryById(id);
  if (!category) notFound();

  const events = allEvents.filter((event) => event.category === category.name);

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            กลับไปหน้าแรก
          </Link>

          <div className="mt-5">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {category.name}
            </h1>
            <p className="mt-2 text-muted-foreground">
              พบ {events.length} Event ในหมวด{category.name}
            </p>
          </div>

          {events.length > 0 ? (
            <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-20 text-center">
              <SearchX className="size-8 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">
                  ยังไม่มี Event ในหมวดนี้
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  ลองดูหมวดหมู่อื่น หรือกลับมาเช็คใหม่ภายหลังนะครับ
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
