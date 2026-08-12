import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AccountClient } from "@/components/account/account-client";

export const metadata: Metadata = {
  title: "บัญชีของฉัน — EVENTRA",
};

export default function AccountPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Navbar />
      <main className="flex-1">
        <AccountClient />
      </main>
      <Footer />
    </div>
  );
}
