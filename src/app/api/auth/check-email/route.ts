import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "อีเมลไม่ถูกต้อง" }, { status: 400 });
    }

    const db = await getDb();
    const user = await db
      .collection("users")
      .findOne({ email: email.trim().toLowerCase() }, { projection: { _id: 1 } });

    return NextResponse.json({ exists: !!user });
  } catch {
    return NextResponse.json({ error: "เกิดข้อผิดพลาด กรุณาลองใหม่" }, { status: 500 });
  }
}
