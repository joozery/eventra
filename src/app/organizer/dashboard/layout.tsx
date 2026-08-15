import { DashboardShell } from "@/components/organizer/dashboard/shell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
