import type { Metadata } from "next";
import { EventsPage } from "@/components/organizer/dashboard/events-page";

export const metadata: Metadata = { title: "งานของฉัน — EVENTRA Organizer" };

export default function DashboardEventsPage() {
  return <EventsPage />;
}
