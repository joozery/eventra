import { EventBuyersPage } from "@/components/organizer/dashboard/event-buyers-page";

export default async function BuyersPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <EventBuyersPage slug={slug} />;
}
