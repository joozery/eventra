import { FormBuilderPage } from "@/components/organizer/dashboard/form-builder-page";

export default async function FormPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <FormBuilderPage slug={slug} />;
}
