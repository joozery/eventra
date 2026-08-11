import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Banner } from "@/components/home/banner";
import { ShopExplorer } from "@/components/merchandise/shop-explorer";
import { getAllMerchandise } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "สินค้า — EVENTRA",
  description: "ของที่ระลึกและสินค้าจากอีเวนต์ต่างๆ บน EVENTRA",
};

export default function ShopPage() {
  const products = getAllMerchandise();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Navbar />
      <main className="flex-1">
        <Banner />
        <ShopExplorer products={products} />
      </main>
      <Footer />
    </div>
  );
}
