import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { uploadToR2, deleteFromR2 } from "@/lib/r2";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

function keyFromUrl(url: string): string | null {
  try {
    return new URL(url).pathname.slice(1); // strip leading /
  } catch {
    return null;
  }
}

export async function PATCH(req: NextRequest) {
  const token = req.cookies.get("session")?.value;
  if (!token) return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });

  try {
    const { payload } = await jwtVerify(token, secret);
    const { avatarBase64 } = await req.json();

    if (!avatarBase64 || typeof avatarBase64 !== "string") {
      return NextResponse.json({ error: "ไม่มีข้อมูลรูปภาพ" }, { status: 400 });
    }

    // Parse data URL: "data:image/jpeg;base64,<data>"
    const match = avatarBase64.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!match) {
      return NextResponse.json({ error: "รูปแบบไฟล์ไม่ถูกต้อง" }, { status: 400 });
    }
    const [, contentType, b64] = match;
    const buffer = Buffer.from(b64, "base64");

    if (buffer.byteLength > 500 * 1024) {
      return NextResponse.json({ error: "ไฟล์ใหญ่เกินไป (สูงสุด 500KB)" }, { status: 400 });
    }

    const ext = contentType === "image/png" ? "png" : "jpg";
    const key = `avatars/${payload.sub as string}.${ext}`;

    const db = await getDb();

    // Delete old avatar from R2 if it was stored there (skip base64 values)
    const existing = await db.collection("users").findOne(
      { _id: new ObjectId(payload.sub as string) },
      { projection: { avatarUrl: 1 } }
    );
    if (existing?.avatarUrl && existing.avatarUrl.startsWith("http")) {
      const oldKey = keyFromUrl(existing.avatarUrl as string);
      if (oldKey && oldKey !== key) {
        await deleteFromR2(oldKey).catch(() => null);
      }
    }

    const avatarUrl = await uploadToR2(key, buffer, contentType);

    await db.collection("users").updateOne(
      { _id: new ObjectId(payload.sub as string) },
      { $set: { avatarUrl, updatedAt: new Date() } }
    );

    // Bust cache by appending timestamp query param
    return NextResponse.json({ ok: true, avatarUrl: `${avatarUrl}?v=${Date.now()}` });
  } catch (err) {
    console.error("upload-avatar error:", err);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด กรุณาลองใหม่" }, { status: 500 });
  }
}
