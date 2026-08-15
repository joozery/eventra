import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { TicketsPage } from "@/components/account/tickets-page";

export const metadata: Metadata = {
  title: "บัตรของฉัน — EVENTRA",
};

export default function AccountTicketsPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Navbar />
      <main className="flex-1">
        <TicketsPage />
      </main>
      <Footer />
    </div>
  );
}
