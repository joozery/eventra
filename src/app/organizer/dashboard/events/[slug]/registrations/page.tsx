import { RegistrationsPage } from "@/components/organizer/dashboard/registrations-page";

export default async function RegistrationsRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <RegistrationsPage slug={slug} />;
}
