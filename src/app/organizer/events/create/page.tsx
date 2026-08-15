import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CreateEventWizard } from "@/components/organizer/create-event-wizard";

export const metadata: Metadata = {
  title: "สร้างอีเวนต์ใหม่ — EVENTRA",
};

export default function CreateEventPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Navbar />
      <main className="flex-1">
        <CreateEventWizard />
      </main>
      <Footer />
    </div>
  );
}
