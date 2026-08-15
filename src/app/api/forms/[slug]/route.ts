import { NextResponse } from "next/server";
import { getForm, saveForm, type FormConfig } from "@/lib/forms-store";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const form = getForm(slug);
  if (!form) return NextResponse.json({ form: null }, { status: 200 });
  return NextResponse.json({ form });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const body = (await req.json()) as Omit<FormConfig, "eventSlug" | "updatedAt">;
  const config: FormConfig = { ...body, eventSlug: slug, updatedAt: new Date().toISOString() };
  saveForm(config);
  return NextResponse.json({ form: config }, { status: 200 });
}
