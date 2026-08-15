export type BuyerStatus = "confirmed" | "pending" | "cancelled";

export type Buyer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  ticketType: string;
  qty: number;
  total: number;
  purchasedAt: string;
  status: BuyerStatus;
};

const PRESET: Record<string, Buyer[]> = {
  "maroon-5-asia-2027-in-bangkok": [
    { id: "B001", name: "สมชาย ใจดี",        email: "somchai.j@gmail.com",    phone: "081-234-5678", ticketType: "VIP Standing", qty: 2, total: 9000,  purchasedAt: "2026-07-15", status: "confirmed" },
    { id: "B002", name: "วรรณิษา พรมดี",     email: "wannisa.p@gmail.com",    phone: "089-876-5432", ticketType: "บัตรทั่วไป",   qty: 3, total: 7500,  purchasedAt: "2026-07-18", status: "confirmed" },
    { id: "B003", name: "ธนกร มั่นคง",       email: "thanakorn.m@email.com",  phone: "085-111-2233", ticketType: "VIP Standing", qty: 1, total: 4500,  purchasedAt: "2026-07-20", status: "confirmed" },
    { id: "B004", name: "ปรียา สุขสวัสดิ์",  email: "priya.s@yahoo.com",      phone: "062-445-6677", ticketType: "บัตรทั่วไป",   qty: 2, total: 5000,  purchasedAt: "2026-07-22", status: "pending"   },
    { id: "B005", name: "กิตติพัทธ์ ทองใบ",  email: "kittipat.t@outlook.com", phone: "091-333-4455", ticketType: "VIP Standing", qty: 4, total: 18000, purchasedAt: "2026-08-01", status: "confirmed" },
    { id: "B006", name: "นภัสสร ดีมาก",      email: "naphatson.d@gmail.com",  phone: "086-778-9900", ticketType: "บัตรทั่วไป",   qty: 1, total: 2500,  purchasedAt: "2026-08-03", status: "cancelled" },
    { id: "B007", name: "วิชัย แสงทอง",      email: "wichai.s@gmail.com",     phone: "083-654-3210", ticketType: "บัตรทั่วไป",   qty: 2, total: 5000,  purchasedAt: "2026-08-05", status: "confirmed" },
    { id: "B008", name: "มณีรัตน์ โชคดี",    email: "manirat.c@email.com",    phone: "098-222-3344", ticketType: "VIP Standing", qty: 1, total: 4500,  purchasedAt: "2026-08-07", status: "confirmed" },
  ],
  "bangkok-music-festival": [
    { id: "B101", name: "อานนท์ วงค์ศรี",    email: "arnon.w@gmail.com",     phone: "081-555-6677", ticketType: "บัตรทั่วไป", qty: 2, total: 3000, purchasedAt: "2026-06-10", status: "confirmed" },
    { id: "B102", name: "สุภาวดี ทรัพย์มาก", email: "supawadee.s@gmail.com", phone: "089-444-5566", ticketType: "VVIP",        qty: 1, total: 4500, purchasedAt: "2026-06-12", status: "confirmed" },
    { id: "B103", name: "ชัยวัฒน์ เพชรรัตน์",email: "chaiwat.p@email.com",   phone: "063-789-0011", ticketType: "บัตรทั่วไป", qty: 4, total: 6000, purchasedAt: "2026-06-14", status: "confirmed" },
    { id: "B104", name: "ธิดารัตน์ สมใจ",    email: "thidarat.s@yahoo.com",  phone: "092-123-4567", ticketType: "VVIP",        qty: 2, total: 9000, purchasedAt: "2026-06-18", status: "pending"   },
    { id: "B105", name: "ปัณณธร อินทร์ดำ",   email: "pannathon.i@gmail.com", phone: "087-654-3219", ticketType: "บัตรทั่วไป", qty: 1, total: 1500, purchasedAt: "2026-06-20", status: "confirmed" },
  ],
};

const THAI_NAMES = [
  ["สมศักดิ์","รักดี"],["ณัฐพล","สมบูรณ์"],["พิมพ์ชนก","ศรีสุข"],
  ["อรุณี","แก้วมณี"],["ภาคภูมิ","โกมล"],["ศิริพร","เจริญสุข"],
  ["ธีรวัฒน์","ประทุม"],["กนกวรรณ","บุญมี"],["ประเสริฐ","ทองคำ"],
  ["พัชริดา","สว่างใจ"],
];

function generate(slug: string, count: number): Buyer[] {
  return Array.from({ length: count }, (_, i) => {
    const [first, last] = THAI_NAMES[i % THAI_NAMES.length];
    return {
      id: `${slug.slice(0, 3).toUpperCase()}-${String(i + 1).padStart(3, "0")}`,
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}${i + 1}@gmail.com`,
      phone: `08${i % 9}-${String(100 + i * 3).padStart(3, "0")}-${String(4000 + i).padStart(4, "0")}`,
      ticketType: i % 3 === 0 ? "VIP" : "บัตรทั่วไป",
      qty: (i % 3) + 1,
      total: ((i % 3) + 1) * 1500,
      purchasedAt: `2026-0${(i % 6) + 1}-${String((i % 25) + 1).padStart(2, "0")}`,
      status: (i % 7 === 0 ? "cancelled" : i % 5 === 0 ? "pending" : "confirmed") as BuyerStatus,
    };
  });
}

export function getBuyersForEvent(slug: string): Buyer[] {
  return PRESET[slug] ?? generate(slug, 5);
}
