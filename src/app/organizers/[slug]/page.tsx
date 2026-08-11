import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2, LayoutGrid } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { EventCard } from "@/components/event/event-card";
import { getOrganizerBySlug, getOrganizers } from "@/lib/mock-data";

export function generateStaticParams() {
  return getOrganizers().map((organizer) => ({ slug: organizer.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const organizer = getOrganizerBySlug(slug);
  if (!organizer) return {};
  return {
    title: `${organizer.name} — EVENTRA`,
    description: `รวม Event ทั้งหมดที่จัดโดย ${organizer.name} บน EVENTRA`,
  };
}

export default async function OrganizerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const organizer = getOrganizerBySlug(slug);
  if (!organizer) notFound();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/organizers"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            กลับไปหน้าผู้จัดงาน
          </Link>

          <div className="mt-5 flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 text-center sm:flex-row sm:text-left">
            <span className="flex size-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-2xl font-bold text-white">
              {organizer.name.charAt(0)}
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {organizer.name}
              </h1>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground sm:justify-start">
                <span className="flex items-center gap-1.5">
                  <Building2 className="size-4" />
                  {organizer.events.length} Events
                </span>
                <span className="flex items-center gap-1.5">
                  <LayoutGrid className="size-4" />
                  {organizer.categories.join(", ")}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="mb-5 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Event ของ {organizer.name}
            </h2>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
              {organizer.events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
