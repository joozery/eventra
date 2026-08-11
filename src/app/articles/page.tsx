import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ArticlesHero } from "@/components/articles/articles-hero";
import { ArticlesExplorer } from "@/components/articles/articles-explorer";
import { Banner } from "@/components/home/banner";

export const metadata: Metadata = {
  title: "บทความ — EVENTRA",
  description: "บทความและเคล็ดลับสำหรับผู้จัดงานและผู้เข้าร่วมงานอีเวนต์",
};

export default function ArticlesPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Navbar />
      <main className="flex-1">
        <ArticlesHero />
        <ArticlesExplorer />
        <Banner />
      </main>
      <Footer />
    </div>
  );
}
