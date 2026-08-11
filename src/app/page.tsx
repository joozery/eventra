import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/home/hero";
import { PromotedEvents } from "@/components/home/promoted-events";
import { Categories } from "@/components/home/categories";
import { PopularEvents } from "@/components/home/popular-events";
import { UpcomingEvents } from "@/components/home/upcoming-events";
import { Banner } from "@/components/home/banner";
import { ContentHub } from "@/components/home/content-hub";
import { WhyEventra } from "@/components/home/why-eventra";
import { Partners } from "@/components/home/partners";

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <PromotedEvents />
        <Categories />
        <PopularEvents />
        <UpcomingEvents />
        <Banner />
        <ContentHub />
        <WhyEventra />
        <Partners />
      </main>
      <Footer />
    </div>
  );
}
