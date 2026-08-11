import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { OrganizerSolutions } from "@/components/organizers/organizer-solutions";

export const metadata: Metadata = {
  title: "สำหรับผู้จัดงาน — EVENTRA",
  description:
    "แพลตฟอร์มการจัดการอีเวนต์แบบครบวงจรสำหรับผู้จัดงาน ตั้งแต่ก่อนงานจนถึงหลังงานจบ",
};

export default function OrganizersPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Navbar />
      <main className="flex-1">
        <OrganizerSolutions />
      </main>
      <Footer />
    </div>
  );
}
