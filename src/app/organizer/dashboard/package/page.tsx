import type { Metadata } from "next";
import { PackageTab } from "@/components/organizer/dashboard/package-tab";

export const metadata: Metadata = { title: "แพ็กเกจ — EVENTRA Organizer" };

export default function DashboardPackagePage() {
  return <PackageTab />;
}
