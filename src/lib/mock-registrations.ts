export type RegStatus = "confirmed" | "pending" | "waitlist" | "cancelled";

export type Registration = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  registeredAt: string;
  status: RegStatus;
  answers?: Record<string, string>;
};

const BASE: Omit<Registration, "id" | "registeredAt" | "status">[] = [
  { name: "สมชาย ใจดี",        email: "somchai.j@companya.co.th",   phone: "081-234-5678", company: "บริษัท เอ จำกัด",          position: "ผู้จัดการฝ่ายขาย"     },
  { name: "วรรณิษา พรมดี",     email: "wannisa@techco.io",          phone: "089-876-5432", company: "Tech Co.",                  position: "Software Engineer"     },
  { name: "ธนกร มั่นคง",       email: "thanakorn.m@startup.th",     phone: "085-111-2233", company: "StartupXYZ",                position: "CEO"                   },
  { name: "ปรียา สุขสวัสดิ์",  email: "priya.s@university.ac.th",  phone: "062-445-6677", company: "มหาวิทยาลัยกรุงเทพ",      position: "อาจารย์"               },
  { name: "กิตติพัทธ์ ทองใบ",  email: "kittipat@media.co.th",      phone: "091-333-4455", company: "Media Group",               position: "Creative Director"     },
  { name: "นภัสสร ดีมาก",      email: "naphatson.d@gmail.com",      phone: "086-778-9900", company: "อิสระ",                     position: "Freelance Designer"    },
  { name: "วิชัย แสงทอง",      email: "wichai.s@corp.co.th",        phone: "083-654-3210", company: "บริษัท คอร์ป จำกัด",       position: "ผู้อำนวยการ"          },
  { name: "มณีรัตน์ โชคดี",    email: "manirat.c@finance.co.th",   phone: "098-222-3344", company: "Finance Plus",              position: "CFO"                   },
  { name: "อานนท์ วงค์ศรี",    email: "arnon.w@gov.go.th",          phone: "081-555-6677", company: "หน่วยงานราชการ",           position: "นักวิเคราะห์นโยบาย"  },
  { name: "สุภาวดี ทรัพย์มาก", email: "supawadee@edu.th",           phone: "089-444-5566", company: "โรงเรียนนานาชาติ",         position: "ครูใหญ่"              },
  { name: "ชัยวัฒน์ เพชรรัตน์",email: "chaiwat.p@logistic.co.th",  phone: "063-789-0011", company: "Logistic TH",              position: "Operations Manager"   },
  { name: "ธิดารัตน์ สมใจ",    email: "thidarat.s@health.co.th",   phone: "092-123-4567", company: "Health Care Group",         position: "พยาบาลวิชาชีพ"       },
  { name: "ปัณณธร อินทร์ดำ",   email: "pannathon@ngo.org",          phone: "087-654-3219", company: "NGO Thailand",             position: "Program Coordinator"  },
  { name: "พัชริดา สว่างใจ",    email: "patchrida@retail.co.th",    phone: "085-321-6543", company: "Retail Chain Co.",         position: "Store Manager"        },
  { name: "ประเสริฐ ทองคำ",    email: "prasert.t@manufacturing.th",phone: "091-876-5432", company: "Manufacturing TH",         position: "วิศวกรการผลิต"        },
];

const STATUSES: RegStatus[] = ["confirmed", "confirmed", "confirmed", "confirmed", "pending", "pending", "waitlist", "cancelled"];

const PRESET: Record<string, Registration[]> = {};

function buildFor(slug: string): Registration[] {
  return BASE.map((b, i) => ({
    ...b,
    id: `REG-${slug.slice(0, 3).toUpperCase()}-${String(i + 1).padStart(3, "0")}`,
    registeredAt: `2026-0${(i % 6) + 1}-${String((i % 24) + 1).padStart(2, "0")}T${String(8 + (i % 10)).padStart(2, "0")}:${String(i * 4 % 60).padStart(2, "0")}:00`,
    status: STATUSES[i % STATUSES.length],
  }));
}

export function getRegistrationsForEvent(slug: string): Registration[] {
  if (!PRESET[slug]) PRESET[slug] = buildFor(slug);
  return PRESET[slug];
}
