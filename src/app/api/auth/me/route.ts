import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function GET(req: NextRequest) {
  const token = req.cookies.get("session")?.value;
  if (!token) return NextResponse.json({ user: null });

  try {
    const { payload } = await jwtVerify(token, secret);
    const db = await getDb();
    const user = await db.collection("users").findOne(
      { _id: new ObjectId(payload.sub as string) },
      { projection: { password: 0 } }
    );
    if (!user) return NextResponse.json({ user: null });

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        phone: user.phone ?? "",
        phoneCode: user.phoneCode ?? "+66",
        bio: user.bio ?? "",
        birthday: user.birthday ?? "",
        gender: user.gender ?? "",
        province: user.province ?? "",
        lineId: user.lineId ?? "",
        facebook: user.facebook ?? "",
        createdAt: user.createdAt ?? null,
        avatarUrl: user.avatarUrl ?? null,
      },
    });
  } catch {
    return NextResponse.json({ user: null });
  }
}
