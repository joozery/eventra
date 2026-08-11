import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { EventsHero } from "@/components/events/events-hero";
import { EventsExplorer } from "@/components/events/events-explorer";

export const metadata: Metadata = {
  title: "ค้นหา Event — EVENTRA",
  description: "ค้นหาและจองบัตรงานอีเวนต์ทุกหมวดหมู่บน EVENTRA",
};

export default function EventsPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Navbar />
      <main className="flex-1">
        <EventsHero />
        <EventsExplorer />
      </main>
      <Footer />
    </div>
  );
}
