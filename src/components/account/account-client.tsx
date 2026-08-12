"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  CheckCircle2,
  ChevronDown,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Phone,
  FileText,
  User,
  Mail,
  CalendarDays,
  ShieldCheck,
  MapPin,
  MessageCircle,
  Link2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type SessionUser = {
  id: string;
  email: string;
  name: string;
  phone: string;
  phoneCode: string;
  bio: string;
  birthday: string;
  gender: string;
  province: string;
  lineId: string;
  facebook: string;
  createdAt: string | null;
  avatarUrl: string | null;
};

const DIAL_CODES = [
  { code: "+66", flag: "🇹🇭", name: "ไทย" },
  { code: "+95", flag: "🇲🇲", name: "เมียนมา" },
  { code: "+856", flag: "🇱🇦", name: "ลาว" },
  { code: "+855", flag: "🇰🇭", name: "กัมพูชา" },
  { code: "+84", flag: "🇻🇳", name: "เวียดนาม" },
  { code: "+60", flag: "🇲🇾", name: "มาเลเซีย" },
  { code: "+65", flag: "🇸🇬", name: "สิงคโปร์" },
  { code: "+62", flag: "🇮🇩", name: "อินโดนีเซีย" },
  { code: "+63", flag: "🇵🇭", name: "ฟิลิปปินส์" },
  { code: "+86", flag: "🇨🇳", name: "จีน" },
  { code: "+81", flag: "🇯🇵", name: "ญี่ปุ่น" },
  { code: "+82", flag: "🇰🇷", name: "เกาหลีใต้" },
  { code: "+91", flag: "🇮🇳", name: "อินเดีย" },
  { code: "+1",  flag: "🇺🇸", name: "สหรัฐฯ / แคนาดา" },
  { code: "+44", flag: "🇬🇧", name: "อังกฤษ" },
  { code: "+61", flag: "🇦🇺", name: "ออสเตรเลีย" },
  { code: "+64", flag: "🇳🇿", name: "นิวซีแลนด์" },
  { code: "+49", flag: "🇩🇪", name: "เยอรมนี" },
  { code: "+33", flag: "🇫🇷", name: "ฝรั่งเศส" },
  { code: "+39", flag: "🇮🇹", name: "อิตาลี" },
  { code: "+34", flag: "🇪🇸", name: "สเปน" },
  { code: "+7",  flag: "🇷🇺", name: "รัสเซีย" },
  { code: "+971", flag: "🇦🇪", name: "UAE" },
  { code: "+966", flag: "🇸🇦", name: "ซาอุดีอาระเบีย" },
  { code: "+20", flag: "🇪🇬", name: "อียิปต์" },
  { code: "+27", flag: "🇿🇦", name: "แอฟริกาใต้" },
  { code: "+55", flag: "🇧🇷", name: "บราซิล" },
  { code: "+52", flag: "🇲🇽", name: "เม็กซิโก" },
  { code: "+54", flag: "🇦🇷", name: "อาร์เจนตินา" },
];

function PhoneInput({
  code, onCodeChange, number, onNumberChange,
}: {
  code: string; onCodeChange: (v: string) => void;
  number: string; onNumberChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = DIAL_CODES.find((d) => d.code === code) ?? DIAL_CODES[0];

  return (
    <div className="relative flex h-9 rounded-lg border border-input bg-transparent focus-within:ring-2 focus-within:ring-ring/50">
      {/* Country picker trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex shrink-0 items-center gap-1.5 rounded-l-lg border-r border-input bg-muted/50 px-2.5 text-sm text-foreground hover:bg-muted/80 transition-colors"
      >
        <span className="text-base leading-none">{selected.flag}</span>
        <span className="font-mono text-xs text-muted-foreground">{selected.code}</span>
        <ChevronDown className={cn("size-3 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {/* Dropdown */}
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full z-40 mt-1 max-h-56 w-52 overflow-y-auto rounded-xl border border-border bg-card shadow-lg shadow-black/5">
            {DIAL_CODES.map((d) => (
              <button
                key={d.code}
                type="button"
                onClick={() => { onCodeChange(d.code); setOpen(false); }}
                className={cn(
                  "flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-muted",
                  d.code === code ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300" : "text-foreground"
                )}
              >
                <span className="text-base leading-none">{d.flag}</span>
                <span className="w-10 shrink-0 font-mono text-xs text-muted-foreground">{d.code}</span>
                <span className="truncate">{d.name}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Number input */}
      <input
        type="tel"
        value={number}
        onChange={(e) => onNumberChange(e.target.value.replace(/[^\d\s\-()]/g, ""))}
        placeholder="812-345-678"
        className="min-w-0 flex-1 rounded-r-lg bg-transparent px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
      />
    </div>
  );
}

type Tab = "profile" | "security";

const THAI_PROVINCES = [
  "กระบี่","กรุงเทพมหานคร","กาญจนบุรี","กาฬสินธุ์","กำแพงเพชร",
  "ขอนแก่น","จันทบุรี","ฉะเชิงเทรา","ชลบุรี","ชัยนาท","ชัยภูมิ",
  "ชุมพร","เชียงราย","เชียงใหม่","ตรัง","ตราด","ตาก","นครนายก",
  "นครปฐม","นครพนม","นครราชสีมา","นครศรีธรรมราช","นครสวรรค์",
  "นนทบุรี","นราธิวาส","น่าน","บึงกาฬ","บุรีรัมย์","ปทุมธานี",
  "ประจวบคีรีขันธ์","ปราจีนบุรี","ปัตตานี","พระนครศรีอยุธยา",
  "พะเยา","พังงา","พัทลุง","พิจิตร","พิษณุโลก","เพชรบุรี",
  "เพชรบูรณ์","แพร่","ภูเก็ต","มหาสารคาม","มุกดาหาร","แม่ฮ่องสอน",
  "ยโสธร","ยะลา","ร้อยเอ็ด","ระนอง","ระยอง","ราชบุรี","ลพบุรี",
  "ลำปาง","ลำพูน","เลย","ศรีสะเกษ","สกลนคร","สงขลา","สตูล",
  "สมุทรปราการ","สมุทรสงคราม","สมุทรสาคร","สระแก้ว","สระบุรี",
  "สิงห์บุรี","สุโขทัย","สุพรรณบุรี","สุราษฎร์ธานี","สุรินทร์",
  "หนองคาย","หนองบัวลำภู","อ่างทอง","อำนาจเจริญ","อุดรธานี",
  "อุตรดิตถ์","อุทัยธานี","อุบลราชธานี",
];

function SuccessBanner({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
      <CheckCircle2 className="size-4 shrink-0" />
      {message}
    </div>
  );
}

function Field({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Icon className="size-3" />{label}
      </Label>
      {children}
    </div>
  );
}

function resizeToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 300;
      let { width, height } = img;
      if (width > height) { height = Math.round(height * MAX / width); width = MAX; }
      else { width = Math.round(width * MAX / height); height = MAX; }
      const canvas = document.createElement("canvas");
      canvas.width = width; canvas.height = height;
      canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = reject;
    img.src = url;
  });
}

export function AccountClient() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("profile");

  // profile fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneCode, setPhoneCode] = useState("+66");
  const [bio, setBio] = useState("");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("");
  const [province, setProvince] = useState("");
  const [lineId, setLineId] = useState("");
  const [facebook, setFacebook] = useState("");

  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [avatarUploading, setAvatarUploading] = useState(false);

  // password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (!d.user) { router.push("/auth/login"); return; }
        const u: SessionUser = d.user;
        setUser(u);
        setName(u.name);
        setPhone(u.phone ?? "");
        setPhoneCode(u.phoneCode ?? "+66");
        setBio(u.bio ?? "");
        setBirthday(u.birthday ?? "");
        setGender(u.gender ?? "");
        setProvince(u.province ?? "");
        setLineId(u.lineId ?? "");
        setFacebook(u.facebook ?? "");
      })
      .finally(() => setLoading(false));
  }, [router]);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      const base64 = await resizeToBase64(file);
      const res = await fetch("/api/auth/upload-avatar", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarBase64: base64 }),
      });
      const data = await res.json();
      if (res.ok) setUser((u) => u ? { ...u, avatarUrl: data.avatarUrl } : u);
    } finally {
      setAvatarUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function markDirty() { setProfileSuccess(false); setProfileError(""); }

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    setProfileSaving(true);
    setProfileError("");
    setProfileSuccess(false);
    try {
      const res = await fetch("/api/auth/update-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, phoneCode, bio, birthday, gender, province, lineId, facebook }),
      });
      const data = await res.json();
      if (!res.ok) { setProfileError(data.error); return; }
      setUser((u) => u ? { ...u, name: data.name, phone, phoneCode, bio, birthday, gender, province, lineId, facebook } : u);
      setProfileSuccess(true);
      router.refresh();
    } catch {
      setProfileError("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setProfileSaving(false);
    }
  }

  async function handlePasswordSave(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) { setPasswordError("รหัสผ่านใหม่ไม่ตรงกัน"); return; }
    setPasswordSaving(true);
    setPasswordError("");
    setPasswordSuccess(false);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setPasswordError(data.error); return; }
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      setPasswordSuccess(true);
    } catch {
      setPasswordError("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setPasswordSaving(false);
    }
  }

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "profile", label: "ข้อมูลส่วนตัว", icon: User },
    { key: "security", label: "ความปลอดภัย", icon: ShieldCheck },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <div className="h-48 animate-pulse bg-muted" />
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="h-32 w-full animate-pulse rounded-2xl bg-muted lg:w-48" />
            <div className="flex-1 space-y-3">
              {[...Array(4)].map((_, i) => <div key={i} className="h-20 animate-pulse rounded-2xl bg-muted" />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const initials = user.name.split(" ").map((w) => w.charAt(0)).join("").slice(0, 2).toUpperCase();
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" })
    : null;

  const selectCls = "h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 appearance-none";

  return (
    <div className="min-h-screen bg-muted/30">

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600">
        <div className="pointer-events-none absolute -top-20 -right-20 size-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-8 size-48 rounded-full bg-white/10 blur-3xl" />
        <div className="mx-auto max-w-4xl px-4 pb-6 pt-8 sm:px-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-5">
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={avatarUploading}
                className="group relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl ring-4 ring-white/30 transition-opacity hover:opacity-90 sm:size-[88px]"
              >
                {user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatarUrl} alt={user.name} className="size-full object-cover" />
                ) : (
                  <span className="size-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold text-white sm:text-4xl">
                    {initials}
                  </span>
                )}
                <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  {avatarUploading
                    ? <span className="size-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    : <Camera className="size-5 text-white" />}
                </span>
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={handleAvatarChange} />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-xl font-bold text-white sm:text-2xl">{user.name}</h1>
              <p className="mt-0.5 text-sm text-indigo-100">{user.email}</p>
              {memberSince && (
                <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-indigo-200 sm:justify-start">
                  <CalendarDays className="size-3" />สมาชิกตั้งแต่ {memberSince}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:gap-6">

          {/* Sidebar */}
          <aside className="w-full shrink-0 lg:w-48">
            <nav className="flex flex-row gap-1 rounded-2xl border border-border bg-card p-1.5 lg:flex-col">
              {tabs.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTab(key)}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors lg:justify-start",
                    tab === key
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="hidden sm:inline lg:inline">{label}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">

            {tab === "profile" && (
              <form onSubmit={handleProfileSave} className="flex flex-col gap-4">

                {/* ข้อมูลพื้นฐาน */}
                <div className="rounded-2xl border border-border bg-card p-5">
                  <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
                    <User className="size-3.5 text-indigo-600" />ข้อมูลพื้นฐาน
                  </h2>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field icon={User} label="ชื่อ-นามสกุล">
                      <Input value={name} onChange={(e) => { setName(e.target.value); markDirty(); }} required placeholder="ชื่อของคุณ" className="h-9 rounded-lg text-sm" />
                    </Field>
                    <Field icon={Mail} label="อีเมล">
                      <div className="flex h-9 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm text-muted-foreground select-none">
                        {user.email}
                      </div>
                    </Field>
                    <div className="flex flex-col gap-1.5">
                      <Label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                        <Phone className="size-3" />เบอร์โทรศัพท์
                      </Label>
                      <PhoneInput
                        code={phoneCode}
                        onCodeChange={(v) => { setPhoneCode(v); markDirty(); }}
                        number={phone}
                        onNumberChange={(v) => { setPhone(v); markDirty(); }}
                      />
                    </div>
                    <Field icon={CalendarDays} label="วันเกิด">
                      <Input type="date" value={birthday} onChange={(e) => { setBirthday(e.target.value); markDirty(); }} className="h-9 rounded-lg text-sm" />
                    </Field>
                    <Field icon={Users} label="เพศ">
                      <select value={gender} onChange={(e) => { setGender(e.target.value); markDirty(); }} className={selectCls}>
                        <option value="">-- เลือกเพศ --</option>
                        <option value="male">ชาย</option>
                        <option value="female">หญิง</option>
                        <option value="lgbtq">LGBTQ+</option>
                        <option value="other">อื่นๆ</option>
                        <option value="prefer_not">ไม่ระบุ</option>
                      </select>
                    </Field>
                    <Field icon={MapPin} label="จังหวัด">
                      <select value={province} onChange={(e) => { setProvince(e.target.value); markDirty(); }} className={selectCls}>
                        <option value="">-- เลือกจังหวัด --</option>
                        {THAI_PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </Field>
                    <Field icon={FileText} label="แนะนำตัวเอง">
                      <textarea
                        value={bio}
                        onChange={(e) => { setBio(e.target.value); markDirty(); }}
                        rows={2}
                        placeholder="เล่าเกี่ยวกับตัวคุณสั้นๆ..."
                        className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 resize-none sm:col-span-2"
                      />
                    </Field>
                  </div>
                </div>

                {/* Social */}
                <div className="rounded-2xl border border-border bg-card p-5">
                  <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
                    <MessageCircle className="size-3.5 text-green-600" />ช่องทางติดต่อ
                  </h2>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field icon={MessageCircle} label="Line ID">
                      <div className="relative">
                        <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-xs text-muted-foreground">@</span>
                        <Input value={lineId} onChange={(e) => { setLineId(e.target.value); markDirty(); }} placeholder="line_id" className="h-9 rounded-lg pl-7 text-sm" />
                      </div>
                    </Field>
                    <Field icon={Link2} label="Facebook">
                      <div className="relative">
                        <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-xs text-muted-foreground">fb.com/</span>
                        <Input value={facebook} onChange={(e) => { setFacebook(e.target.value); markDirty(); }} placeholder="your.name" className="h-9 rounded-lg pl-14 text-sm" />
                      </div>
                    </Field>
                  </div>
                </div>

                {profileSuccess && <SuccessBanner message="บันทึกข้อมูลเรียบร้อยแล้ว" />}
                {profileError && <p className="text-sm text-red-500">{profileError}</p>}

                <div className="flex justify-end">
                  <Button type="submit" disabled={profileSaving} className="h-9 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 text-sm text-white hover:opacity-90 hover:bg-none">
                    {profileSaving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
                  </Button>
                </div>
              </form>
            )}

            {tab === "security" && (
              <form onSubmit={handlePasswordSave} className="flex flex-col gap-4">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <h2 className="mb-1 flex items-center gap-2 text-sm font-semibold text-foreground">
                    <KeyRound className="size-3.5 text-amber-600" />เปลี่ยนรหัสผ่าน
                  </h2>
                  <p className="mb-4 text-xs text-muted-foreground">ใช้รหัสผ่านที่คาดเดายากและไม่ซ้ำกับแพลตฟอร์มอื่น</p>
                  <div className="flex flex-col gap-3">
                    {[
                      { id: "cur", label: "รหัสผ่านปัจจุบัน", value: currentPassword, set: setCurrentPassword, show: showCurrent, toggle: () => setShowCurrent((v) => !v) },
                      { id: "new", label: "รหัสผ่านใหม่", value: newPassword, set: setNewPassword, show: showNew, toggle: () => setShowNew((v) => !v) },
                      { id: "conf", label: "ยืนยันรหัสผ่านใหม่", value: confirmPassword, set: setConfirmPassword, show: showConfirm, toggle: () => setShowConfirm((v) => !v) },
                    ].map(({ id, label, value, set, show, toggle }) => (
                      <div key={id} className="flex flex-col gap-1.5">
                        <Label htmlFor={id} className="text-xs font-medium text-muted-foreground">{label}</Label>
                        <div className="relative">
                          <Lock className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id={id}
                            type={show ? "text" : "password"}
                            value={value}
                            onChange={(e) => { set(e.target.value); setPasswordSuccess(false); setPasswordError(""); }}
                            required
                            minLength={id === "cur" ? 1 : 8}
                            placeholder="••••••••"
                            className="h-9 rounded-lg pr-9 pl-9 text-sm"
                          />
                          <button type="button" onClick={toggle} className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                            {show ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {passwordSuccess && <SuccessBanner message="เปลี่ยนรหัสผ่านเรียบร้อยแล้ว" />}
                {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={passwordSaving || !currentPassword || !newPassword || !confirmPassword}
                    className="h-9 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 text-sm text-white hover:opacity-90 hover:bg-none"
                  >
                    {passwordSaving ? "กำลังเปลี่ยน..." : "เปลี่ยนรหัสผ่าน"}
                  </Button>
                </div>
              </form>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
