import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, SignJWT } from "jose";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function PATCH(req: NextRequest) {
  const token = req.cookies.get("session")?.value;
  if (!token) return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });

  try {
    const { payload } = await jwtVerify(token, secret);
    const { name, phone, phoneCode, bio, birthday, gender, province, lineId, facebook } = await req.json();

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "กรุณากรอกชื่อ" }, { status: 400 });
    }

    const db = await getDb();
    await db.collection("users").updateOne(
      { _id: new ObjectId(payload.sub as string) },
      {
        $set: {
          name: name.trim(),
          phone: phone ?? "",
          phoneCode: phoneCode ?? "+66",
          bio: bio ?? "",
          birthday: birthday ?? "",
          gender: gender ?? "",
          province: province ?? "",
          lineId: lineId ?? "",
          facebook: facebook ?? "",
          updatedAt: new Date(),
        },
      }
    );

    const newToken = await new SignJWT({ sub: payload.sub, email: payload.email, name: name.trim() })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    const res = NextResponse.json({ ok: true, name: name.trim() });
    res.cookies.set("session", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch {
    return NextResponse.json({ error: "เกิดข้อผิดพลาด กรุณาลองใหม่" }, { status: 500 });
  }
}
