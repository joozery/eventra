import type { Metadata } from "next";
import { OverviewPage } from "@/components/organizer/dashboard/overview-page";

export const metadata: Metadata = { title: "ภาพรวม — EVENTRA Organizer" };

export default function DashboardPage() {
  return <OverviewPage />;
}
