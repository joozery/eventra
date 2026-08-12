import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { compare, hash } from "bcryptjs";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function PATCH(req: NextRequest) {
  const token = req.cookies.get("session")?.value;
  if (!token) return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });

  try {
    const { payload } = await jwtVerify(token, secret);
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบ" }, { status: 400 });
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ error: "รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร" }, { status: 400 });
    }

    const db = await getDb();
    const user = await db.collection("users").findOne({ _id: new ObjectId(payload.sub as string) });
    if (!user) return NextResponse.json({ error: "ไม่พบบัญชีผู้ใช้" }, { status: 404 });

    const valid = await compare(currentPassword, user.password as string);
    if (!valid) return NextResponse.json({ error: "รหัสผ่านปัจจุบันไม่ถูกต้อง" }, { status: 400 });

    const hashed = await hash(newPassword, 12);
    await db.collection("users").updateOne(
      { _id: new ObjectId(payload.sub as string) },
      { $set: { password: hashed, updatedAt: new Date() } }
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "เกิดข้อผิดพลาด กรุณาลองใหม่" }, { status: 500 });
  }
}
