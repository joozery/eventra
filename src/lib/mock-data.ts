export type MockMerchandise = {
  id: string;
  name: string;
  price: number;
  icon: string;
  gradient: string;
  image?: string;
  bestSeller?: boolean;
};

export type ScheduleItem = {
  time: string;
  title: string;
  description?: string;
  type?: "main" | "break" | "side";
};

export type DaySchedule = {
  day: string;
  date: string;
  items: ScheduleItem[];
};

export type MockEvent = {
  id: string;
  slug: string;
  title: string;
  category: string;
  date: string;
  endDate?: string;
  time: string;
  location: string;
  price: number;
  gradient: string;
  attendees: number;
  organizer: string;
  image?: string;
  gallery?: string[];
  merchandise?: MockMerchandise[];
  schedule?: DaySchedule[];
};

const eventexImages = [
  "/eventex/ctc2026.jpg",
  "/eventex/kunawong.jpeg",
  "/eventex/performanceconfirence.webp",
  "/eventex/space@time.jpeg",
  "/eventex/worklifeevo.webp",
];

export type MockCategory = {
  id: string;
  name: string;
  icon: string;
  count: number;
  gradient: string;
  image?: string;
};

export type ArticleBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "image"; src: string; caption?: string }
  | { type: "list"; items: string[] };

export type MockArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  tag: string;
  date: string;
  readTime: string;
  gradient: string;
  image?: string;
  content?: ArticleBlock[];
};

export type MockAnnouncement = {
  id: string;
  organizer: string;
  message: string;
  date: string;
  image?: string;
  tag?: string;
};

export const categories: MockCategory[] = [
  {
    id: "music",
    name: "ดนตรี",
    icon: "Music",
    count: 128,
    gradient: "from-indigo-500 to-purple-500",
    image: "/images/categories/real_cat_music_1786461488007.png",
  },
  {
    id: "business",
    name: "ธุรกิจ",
    icon: "Briefcase",
    count: 64,
    gradient: "from-blue-500 to-indigo-500",
    image: "/images/categories/real_cat_business_1786461507526.png",
  },
  {
    id: "sports",
    name: "กีฬา",
    icon: "Dumbbell",
    count: 52,
    gradient: "from-fuchsia-500 to-pink-500",
    image: "/images/categories/real_cat_sports_1786461770620.png",
  },
  {
    id: "arts",
    name: "ศิลปะ",
    icon: "Palette",
    count: 41,
    gradient: "from-violet-500 to-indigo-500",
    image: "/images/categories/real_cat_arts_1786461785062.png",
  },
  {
    id: "food",
    name: "อาหาร",
    icon: "UtensilsCrossed",
    count: 37,
    gradient: "from-amber-500 to-orange-500",
    image: "/images/categories/real_cat_food_1786461973051.png",
  },
  {
    id: "tech",
    name: "เทคโนโลยี",
    icon: "Cpu",
    count: 29,
    gradient: "from-sky-500 to-blue-600",
    image: "/images/categories/real_cat_tech_1786462148227.png",
  },
];

export function getCategoryById(id: string) {
  return categories.find((category) => category.id === id);
}

const rawPopularEvents: MockEvent[] = [
  {
    id: "1",
    slug: "bangkok-music-festival",
    title: "Bangkok Music Festival 2026",
    category: "ดนตรี",
    date: "12 ก.ย. 2026",
    endDate: "14 ก.ย. 2026",
    time: "17:00",
    location: "Impact Arena, เมืองทองธานี",
    price: 1500,
    gradient: "from-indigo-500 to-purple-500",
    attendees: 4200,
    organizer: "Live Nation Thailand",
    merchandise: [
      {
        id: "m1",
        name: "เสื้อยืดที่ระลึก",
        price: 590,
        icon: "Shirt",
        gradient: "from-indigo-500 to-purple-500",
        image: "/product/artoy.webp",
        bestSeller: true,
      },
      {
        id: "m2",
        name: "โปสเตอร์ลายศิลปิน",
        price: 250,
        icon: "Image",
        gradient: "from-purple-500 to-fuchsia-500",
        image: "/product/coctail.jpeg",
      },
      {
        id: "m3",
        name: "หมวกแก๊ปที่ระลึก",
        price: 390,
        icon: "Crown",
        gradient: "from-blue-500 to-indigo-500",
        image: "/product/artoy.webp",
      },
    ],
    schedule: [
      {
        day: "วันที่ 1",
        date: "12 ก.ย. 2026",
        items: [
          { time: "16:00", title: "เปิดประตูสนาม", type: "side" },
          { time: "17:00", title: "Opening Act — The Sunset Collective", description: "วงดนตรีอินดี้สุดฮอตเปิดเวทีด้วยเพลงจากอัลบั้มใหม่", type: "side" },
          { time: "18:30", title: "พักรับประทานอาหาร & Food Market", type: "break" },
          { time: "19:30", title: "Atom ชนกันต์ — Live in Concert", description: "โชว์พิเศษกับวงดนตรีสดครบวง 20+ ชิ้น", type: "main" },
          { time: "21:00", title: "Headliner — FOLK9", description: "คอนเสิร์ตเต็มรูปแบบพร้อม light show สุดอลังการ", type: "main" },
          { time: "23:00", title: "จบการแสดงวันที่ 1", type: "side" },
        ],
      },
      {
        day: "วันที่ 2",
        date: "13 ก.ย. 2026",
        items: [
          { time: "15:00", title: "เปิดประตูสนาม", type: "side" },
          { time: "16:00", title: "Workshop: ดนตรีบำบัด", description: "เวิร์กช็อปสำหรับผู้สนใจ จำนวนจำกัด 50 ที่นั่ง", type: "side" },
          { time: "17:30", title: "Baitoey RSiam — Acoustic Set", description: "เซ็ทอะคูสติกพิเศษที่ไม่เคยแสดงมาก่อน", type: "main" },
          { time: "19:00", title: "พักรับประทานอาหาร", type: "break" },
          { time: "20:00", title: "Palaphon — Full Band Show", type: "main" },
          { time: "21:30", title: "Headliner — Bodyslam", description: "แสดงเพลง hits ตลอด 20 ปีพร้อมแสงสีเต็มรูปแบบ", type: "main" },
          { time: "23:30", title: "จบการแสดงวันที่ 2", type: "side" },
        ],
      },
      {
        day: "วันที่ 3",
        date: "14 ก.ย. 2026",
        items: [
          { time: "15:00", title: "เปิดประตูสนาม & After Party Zone", type: "side" },
          { time: "16:30", title: "DJ Set — MILLI", description: "เปิดเวทีด้วยเซ็ท DJ สุดมันส์", type: "side" },
          { time: "18:00", title: "Special Collab — Artists Unite", description: "ศิลปินทุกคนร่วมแสดงในเวทีเดียวกัน", type: "main" },
          { time: "19:30", title: "พักรับประทานอาหาร", type: "break" },
          { time: "20:30", title: "Grand Finale — International Guest Artist", description: "ปิดงานด้วยศิลปินระดับโลกที่จะประกาศในวันงาน", type: "main" },
          { time: "22:30", title: "Fireworks & Closing Ceremony", type: "main" },
          { time: "23:00", title: "สิ้นสุดงาน Bangkok Music Festival 2026", type: "side" },
        ],
      },
    ],
  },
  {
    id: "2",
    slug: "startup-summit-2026",
    title: "Startup Summit Asia 2026",
    category: "ธุรกิจ",
    date: "20 ก.ย. 2026",
    time: "09:00",
    location: "QSNCC, กรุงเทพฯ",
    price: 890,
    gradient: "from-blue-500 to-indigo-500",
    attendees: 1800,
    organizer: "Nexus Conferences",
  },
  {
    id: "3",
    slug: "thailand-marathon",
    title: "Thailand Night Marathon",
    category: "กีฬา",
    date: "3 ต.ค. 2026",
    time: "18:30",
    location: "สวนลุมพินี, กรุงเทพฯ",
    price: 600,
    gradient: "from-fuchsia-500 to-pink-500",
    attendees: 3100,
    organizer: "Thailand Marathon Club",
    merchandise: [
      {
        id: "m1",
        name: "เสื้อวิ่งทีมงาน",
        price: 450,
        icon: "Shirt",
        gradient: "from-fuchsia-500 to-pink-500",
        image: "/product/coctail.jpeg",
      },
      {
        id: "m2",
        name: "เหรียญที่ระลึก Finisher",
        price: 0,
        icon: "Medal",
        gradient: "from-amber-500 to-orange-500",
        image: "/product/artoy.webp",
      },
    ],
  },
  {
    id: "4",
    slug: "modern-art-expo",
    title: "Modern Art Expo Bangkok",
    category: "ศิลปะ",
    date: "15 ต.ค. 2026",
    time: "10:00",
    location: "BACC, กรุงเทพฯ",
    price: 350,
    gradient: "from-violet-500 to-indigo-500",
    attendees: 950,
    organizer: "BACC Gallery",
    merchandise: [
      {
        id: "m1",
        name: "ภาพพิมพ์ลายศิลปิน",
        price: 690,
        icon: "Image",
        gradient: "from-violet-500 to-indigo-500",
        image: "/product/coctail.jpeg",
      },
      {
        id: "m2",
        name: "กระเป๋าผ้าลายนิทรรศการ",
        price: 320,
        icon: "ShoppingBag",
        gradient: "from-indigo-500 to-purple-500",
        image: "/product/artoy.webp",
      },
      {
        id: "m3",
        name: "อาร์ตทอยที่ระลึก",
        price: 1200,
        icon: "ShoppingBag",
        gradient: "from-sky-500 to-blue-600",
        image: "/product/artoy.webp",
        bestSeller: true,
      },
    ],
  },
  {
    id: "9",
    slug: "riverside-jazz-festival",
    title: "Riverside Jazz Festival",
    category: "ดนตรี",
    date: "8 พ.ย. 2026",
    time: "18:00",
    location: "เอเชียทีค, กรุงเทพฯ",
    price: 990,
    gradient: "from-rose-500 to-orange-500",
    attendees: 2600,
    organizer: "Live Nation Thailand",
  },
  {
    id: "10",
    slug: "ecommerce-growth-summit",
    title: "E-commerce Growth Summit",
    category: "ธุรกิจ",
    date: "14 พ.ย. 2026",
    time: "09:00",
    location: "True Digital Park, กรุงเทพฯ",
    price: 1100,
    gradient: "from-cyan-500 to-blue-600",
    attendees: 1400,
    organizer: "Nexus Conferences",
  },
  {
    id: "11",
    slug: "bangkok-triathlon",
    title: "Bangkok Triathlon Championship",
    category: "กีฬา",
    date: "22 พ.ย. 2026",
    time: "05:30",
    location: "บางแสน, ชลบุรี",
    price: 1800,
    gradient: "from-teal-500 to-emerald-600",
    attendees: 1250,
    organizer: "Thailand Marathon Club",
  },
  {
    id: "12",
    slug: "street-art-night-market",
    title: "Street Art Night Market",
    category: "ศิลปะ",
    date: "29 พ.ย. 2026",
    time: "17:30",
    location: "ตลาดรถไฟ, กรุงเทพฯ",
    price: 0,
    gradient: "from-purple-500 to-pink-500",
    attendees: 1750,
    organizer: "Creative Hub Studio",
    merchandise: [
      {
        id: "m1",
        name: "แจ็คเก็ตที่ระลึก Limited Edition",
        price: 2990,
        icon: "Shirt",
        gradient: "from-purple-500 to-pink-500",
        image: "/product/coctail.jpeg",
        bestSeller: true,
      },
    ],
  },
  {
    id: "13",
    slug: "thai-street-food-carnival",
    title: "Thai Street Food Carnival",
    category: "อาหาร",
    date: "6 ธ.ค. 2026",
    time: "16:00",
    location: "สวนเบญจกิติ, กรุงเทพฯ",
    price: 250,
    gradient: "from-amber-500 to-red-500",
    attendees: 3400,
    organizer: "Central World Events",
  },
];

const rawUpcomingEvents: MockEvent[] = [
  {
    id: "5",
    slug: "food-wine-festival",
    title: "Food & Wine Festival",
    category: "อาหาร",
    date: "22 ก.ย. 2026",
    time: "16:00",
    location: "Central World, กรุงเทพฯ",
    price: 450,
    gradient: "from-amber-500 to-orange-500",
    attendees: 2200,
    organizer: "Central World Events",
    merchandise: [
      {
        id: "m1",
        name: "หนังสือสูตรอาหารที่ระลึก",
        price: 450,
        icon: "Image",
        gradient: "from-amber-500 to-orange-500",
        image: "/product/artoy.webp",
      },
      {
        id: "m2",
        name: "แก้วไวน์ที่ระลึก",
        price: 290,
        icon: "ShoppingBag",
        gradient: "from-rose-500 to-orange-500",
        image: "/product/coctail.jpeg",
      },
    ],
  },
  {
    id: "6",
    slug: "tech-conference-2026",
    title: "Tech Conference Thailand",
    category: "เทคโนโลยี",
    date: "5 ต.ค. 2026",
    time: "09:30",
    location: "True Digital Park, กรุงเทพฯ",
    price: 1200,
    gradient: "from-sky-500 to-blue-600",
    attendees: 1600,
    organizer: "True Digital Park Events",
    merchandise: [
      {
        id: "m1",
        name: "เสื้อฮู้ดที่ระลึก",
        price: 890,
        icon: "Shirt",
        gradient: "from-sky-500 to-blue-600",
        image: "/product/artoy.webp",
        bestSeller: true,
      },
      {
        id: "m2",
        name: "ชุดสติกเกอร์ลาย Tech",
        price: 120,
        icon: "Image",
        gradient: "from-blue-500 to-indigo-500",
        image: "/product/coctail.jpeg",
      },
    ],
  },
  {
    id: "7",
    slug: "jazz-night-live",
    title: "Jazz Night Live",
    category: "ดนตรี",
    date: "18 ต.ค. 2026",
    time: "19:00",
    location: "Live House, กรุงเทพฯ",
    price: 700,
    gradient: "from-purple-500 to-fuchsia-500",
    attendees: 640,
    organizer: "Live House Bangkok",
  },
  {
    id: "8",
    slug: "yoga-wellness-retreat",
    title: "Yoga & Wellness Retreat",
    category: "กีฬา",
    date: "1 พ.ย. 2026",
    time: "07:00",
    location: "เขาใหญ่, นครราชสีมา",
    price: 2500,
    gradient: "from-emerald-500 to-teal-500",
    attendees: 320,
    organizer: "Thailand Marathon Club",
  },
  {
    id: "14",
    slug: "startup-pitch-night",
    title: "Startup Pitch Night",
    category: "ธุรกิจ",
    date: "10 พ.ย. 2026",
    time: "18:30",
    location: "The Great Room, กรุงเทพฯ",
    price: 300,
    gradient: "from-indigo-500 to-blue-600",
    attendees: 480,
    organizer: "Nexus Conferences",
  },
  {
    id: "15",
    slug: "contemporary-dance-showcase",
    title: "Contemporary Dance Showcase",
    category: "ศิลปะ",
    date: "23 พ.ย. 2026",
    time: "19:30",
    location: "Thailand Cultural Centre, กรุงเทพฯ",
    price: 550,
    gradient: "from-fuchsia-500 to-violet-600",
    attendees: 720,
    organizer: "BACC Gallery",
  },
];

function buildGallery(offset: number) {
  return [0, 1, 2].map(
    (i) => eventexImages[(offset + i) % eventexImages.length]
  );
}

export const popularEvents: MockEvent[] = rawPopularEvents.map((event, index) => ({
  ...event,
  image: eventexImages[index % eventexImages.length],
  gallery: buildGallery(index + 1),
}));

export const upcomingEvents: MockEvent[] = rawUpcomingEvents.map((event, index) => ({
  ...event,
  image: eventexImages[(rawPopularEvents.length + index) % eventexImages.length],
  gallery: buildGallery(rawPopularEvents.length + index + 1),
}));

export const allEvents: MockEvent[] = [...popularEvents, ...upcomingEvents];

export function getEventBySlug(slug: string) {
  return allEvents.find((event) => event.slug === slug);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type MockOrganizer = {
  slug: string;
  name: string;
  events: MockEvent[];
  categories: string[];
};

export function getOrganizers(): MockOrganizer[] {
  const bySlug = new Map<string, MockOrganizer>();

  for (const event of allEvents) {
    const slug = slugify(event.organizer);
    const existing = bySlug.get(slug);
    if (existing) {
      existing.events.push(event);
      if (!existing.categories.includes(event.category)) {
        existing.categories.push(event.category);
      }
    } else {
      bySlug.set(slug, {
        slug,
        name: event.organizer,
        events: [event],
        categories: [event.category],
      });
    }
  }

  return Array.from(bySlug.values()).sort(
    (a, b) => b.events.length - a.events.length
  );
}

export function getOrganizerBySlug(slug: string) {
  return getOrganizers().find((organizer) => organizer.slug === slug);
}

export type MerchandiseListing = MockMerchandise & {
  eventTitle: string;
  eventSlug: string;
};

export function getAllMerchandise(): MerchandiseListing[] {
  return allEvents.flatMap(
    (event) =>
      event.merchandise?.map((item) => ({
        ...item,
        eventTitle: event.title,
        eventSlug: event.slug,
      })) ?? []
  );
}

export function getBestSellerMerchandise(): MerchandiseListing[] {
  return getAllMerchandise().filter((item) => item.bestSeller);
}

export const articles: MockArticle[] = [
  {
    id: "1",
    slug: "how-to-choose-event-venue",
    title: "5 เทคนิคเลือกสถานที่จัดงานอีเวนต์ให้ปัง",
    excerpt: "ตั้งแต่การเลือกทำเลไปจนถึงระบบแสงเสียง เช็กลิสต์ที่ผู้จัดงานมืออาชีพใช้จริงก่อนปิดดีลสถานที่",
    tag: "Venue",
    date: "2 ส.ค. 2026",
    readTime: "5 นาที",
    gradient: "from-indigo-500 to-purple-500",
    image: "/images/article_venue.png",
    content: [
      { type: "heading", text: "1. ทำเลที่ตั้งและการเดินทาง" },
      { type: "paragraph", text: "สถานที่จัดงานที่ดีต้องเข้าถึงได้ง่ายสำหรับกลุ่มเป้าหมาย ไม่ว่าจะเป็นระบบขนส่งสาธารณะ ที่จอดรถ หรือการเดินทางด้วยรถส่วนตัว ควรสำรวจเส้นทางจริงในช่วงเวลาที่งานจะจัดก่อนตัดสินใจ เพราะการจราจรในชั่วโมงเร่งด่วนอาจเปลี่ยนประสบการณ์ผู้เข้าร่วมได้อย่างมีนัยสำคัญ" },
      { type: "image", src: "/images/article_venue.png", caption: "บรรยากาศสถานที่จัดงานในร่มระดับพรีเมียม" },
      { type: "heading", text: "2. ระบบแสงเสียงและเทคนิค" },
      { type: "paragraph", text: "ก่อนเซ็นสัญญา ต้องตรวจสอบว่าสถานที่มีระบบ AV พร้อมใช้หรือต้องจ้างภายนอก บางแห่งมีข้อจำกัดด้านเสียงตามกฎหมายท้องถิ่น หรือมีชั่วโมงการใช้งานที่เข้มงวด ซึ่งอาจกระทบแผนงานของคุณ" },
      { type: "list", items: ["ตรวจสอบขนาดเวที และจุดแขวนอุปกรณ์ไฟ", "ทดสอบสัญญาณอินเทอร์เน็ตและ Wi-Fi", "สอบถามกำลังไฟฟ้าสำรอง", "เช็กระยะเวลา Load-in / Load-out"] },
      { type: "heading", text: "3. ความจุและ Layout" },
      { type: "paragraph", text: "จำนวนผู้เข้าร่วมสูงสุดตามใบอนุญาตของสถานที่มักต่ำกว่าที่เจ้าของสถานที่บอก เพราะยังไม่รวมพื้นที่สำหรับเวที บูท และทางหนีไฟ ควรคำนวณจาก Net Area จริงและเผื่อพื้นที่ต่อคนอย่างน้อย 1.5 ตร.ม. เพื่อความสบายในการเดิน" },
      { type: "image", src: "/coverhero/coverevent.jpg", caption: "ตัวอย่าง Layout งานที่มีการวางแผนพื้นที่อย่างดี" },
      { type: "paragraph", text: "สุดท้าย อย่าลืมตรวจสอบนโยบายการยกเลิกและความยืดหยุ่นในการปรับเปลี่ยนวันงาน เพราะเหตุการณ์ไม่คาดฝันอาจเกิดขึ้นได้เสมอ การมีแผน B สำหรับสถานที่จะช่วยลดความเสี่ยงได้มาก" },
    ],
  },
  {
    id: "2",
    slug: "ticket-pricing-strategy",
    title: "กลยุทธ์ตั้งราคาบัตรยังไงให้ขายหมดไว",
    excerpt: "เจาะลึกโมเดล Early Bird, Tiered Pricing และการตั้งราคาตามดีมานด์แบบที่แพลตฟอร์มระดับโลกใช้",
    tag: "Ticketing",
    date: "28 ก.ค. 2026",
    readTime: "4 นาที",
    gradient: "from-blue-500 to-indigo-500",
    image: "/images/categories/real_cat_business_1786461507526.png",
    content: [
      { type: "heading", text: "Early Bird: สร้าง Momentum ตั้งแต่วันแรก" },
      { type: "paragraph", text: "โมเดล Early Bird ไม่ใช่แค่การลดราคา แต่คือการสร้างแรงกดดันจาก Scarcity และ Social Proof ในช่วงแรก ราคาที่ต่ำกว่าทำให้ผู้คนตัดสินใจเร็วขึ้น และยอดขายช่วงแรกยังช่วยสร้าง Buzz บน Social Media ได้อีกด้วย" },
      { type: "image", src: "/images/categories/real_cat_business_1786461507526.png", caption: "การวิเคราะห์ข้อมูลยอดขายบัตรในแต่ละ Tier" },
      { type: "heading", text: "Tiered Pricing: ให้ทุกคนมีที่ทาง" },
      { type: "paragraph", text: "การแบ่งบัตรเป็นหลาย Tier เช่น General, Regular, VIP ช่วยให้คุณเข้าถึงผู้ชมหลายกลุ่มพร้อมกัน กลุ่มที่งบน้อยก็มีตัวเลือก ขณะที่กลุ่มพรีเมียมพร้อมจ่ายมากขึ้นเพื่อสิทธิพิเศษ รายได้รวมต่องานจะสูงกว่าการตั้งราคาเดียว" },
      { type: "list", items: ["Early Bird: 20-30% ต่ำกว่าราคาปกติ จำนวนจำกัด", "Regular: ราคาอ้างอิงหลัก", "VIP: 1.5-2x ราคา Regular พร้อม Perks", "Group Rate: ส่วนลดสำหรับซื้อ 5+ ใบ"] },
      { type: "paragraph", text: "สิ่งสำคัญคือการสื่อสาร Value ของแต่ละ Tier ให้ชัดเจน ผู้ซื้อต้องรู้ว่าจ่ายเพิ่มแล้วได้อะไรพิเศษ ไม่ใช่แค่ที่นั่งที่ดีกว่า แต่ต้องมีประสบการณ์ที่แตกต่างจริงๆ" },
    ],
  },
  {
    id: "3",
    slug: "event-marketing-checklist",
    title: "เช็กลิสต์การตลาดก่อนเปิดขายบัตรอีเวนต์",
    excerpt: "รวม 10 ขั้นตอนวางแผนการตลาดอีเวนต์ ตั้งแต่ pre-launch ถึงวันงาน ไม่ให้พลาดยอดขาย",
    tag: "Marketing",
    date: "15 ก.ค. 2026",
    readTime: "6 นาที",
    gradient: "from-fuchsia-500 to-pink-500",
    image: "/images/categories/real_cat_arts_1786461785062.png",
    content: [
      { type: "heading", text: "Phase 1: Pre-Launch (4-6 สัปดาห์ก่อนเปิดขาย)" },
      { type: "paragraph", text: "ช่วง Pre-Launch คือการปูพื้นฐานความสนใจก่อนที่บัตรจะออกจำหน่าย เริ่มจากการสร้าง Landing Page ที่รับ Email สมัครรับข่าว ทำ Teaser Content บน Social Media และเข้าหา Media Partner เพื่อวาง Coverage plan ไว้ล่วงหน้า" },
      { type: "image", src: "/images/categories/real_cat_arts_1786461785062.png", caption: "การสร้าง Content ที่ดึงดูดสำหรับงานศิลปะและความบันเทิง" },
      { type: "list", items: ["สร้าง Event Page บน EVENTRA และ Social Media", "วาง Content Calendar ตลอด Campaign", "ติดต่อ Influencer และ Media ล่วงหน้า", "ตั้ง Email Waitlist เพื่อ Priority Access"] },
      { type: "heading", text: "Phase 2: Launch Week" },
      { type: "paragraph", text: "สัปดาห์เปิดขายคือจังหวะที่สำคัญที่สุด ควรมีการโพสต์ทุกวัน ทำ Countdown บน Story และเตรียม FAQ ไว้ตอบคำถามที่พบบ่อย ถ้ามี Early Bird ให้สื่อสารความจำกัดของจำนวนบัตรอย่างชัดเจน" },
      { type: "image", src: "/coverhero/banner2.jpg", caption: "บรรยากาศงานที่ประสบความสำเร็จจากการวางแผนการตลาดที่ดี" },
      { type: "paragraph", text: "อย่าลืม Track ทุก Channel ด้วย UTM Parameters เพื่อรู้ว่ายอดขายมาจากที่ไหนมากที่สุด ข้อมูลนี้จะมีค่ามากสำหรับการวางแผนงานครั้งต่อไป" },
    ],
  },
  {
    id: "4",
    slug: "event-day-checklist",
    title: "วันงานสำเร็จต้องเตรียมอะไรบ้าง?",
    excerpt: "Checklist ฉบับครบครัน จากทีมงานมืออาชีพ ที่จะช่วยให้วันงานของคุณดำเนินไปอย่างราบรื่น",
    tag: "Operations",
    date: "10 ก.ค. 2026",
    readTime: "7 นาที",
    gradient: "from-emerald-500 to-teal-500",
    image: "/images/categories/real_cat_sports_1786461770620.png",
    content: [
      { type: "heading", text: "ก่อนงาน: D-1 ถึง D-Day เช้า" },
      { type: "paragraph", text: "การจัดงานอีเวนต์ให้ประสบความสำเร็จต้องอาศัยการวางแผนที่รอบคอบตั้งแต่ขั้นตอนแรก ทีมงาน EVENTRA รวบรวมประสบการณ์จากผู้จัดงานมืออาชีพหลายร้อยงานมาสรุปเป็นแนวทางที่นำไปปรับใช้ได้จริง" },
      { type: "list", items: ["ยืนยัน Rundown กับทุกฝ่ายที่เกี่ยวข้อง", "ทดสอบระบบลงทะเบียนและสแกน QR", "เช็กสัญญาณอินเทอร์เน็ตและอุปกรณ์สำรอง", "ประชุม Briefing ทีมงานทุกคน", "ตรวจสอบจุด First Aid และทางหนีไฟ"] },
      { type: "image", src: "/images/categories/real_cat_sports_1786461770620.png", caption: "ทีมงานเตรียมพื้นที่ก่อนเปิดงาน" },
      { type: "heading", text: "ระหว่างงาน: คุมเกมให้อยู่" },
      { type: "paragraph", text: "เมื่องานเริ่ม สิ่งสำคัญคือการสื่อสารภายในทีมอย่างต่อเนื่อง ควรมี War Room หรือ Command Center ที่ทุกฝ่ายสามารถรายงานสถานการณ์ได้แบบเรียลไทม์ และมีผู้มีอำนาจตัดสินใจอยู่ในพื้นที่ตลอดเวลา" },
      { type: "paragraph", text: "สิ่งสำคัญที่สุดคือการเริ่มต้นวางแผนล่วงหน้าให้เพียงพอ เผื่อเวลาสำหรับการปรับเปลี่ยนและแก้ไขปัญหาที่อาจเกิดขึ้นระหว่างทาง พร้อมทั้งสื่อสารกับทีมงานและผู้เข้าร่วมงานอย่างชัดเจนในทุกขั้นตอน เพื่อให้วันงานออกมาสมบูรณ์แบบที่สุด" },
      { type: "image", src: "/eventex/performanceconfirence.webp", caption: "บรรยากาศงานที่ดำเนินไปอย่างราบรื่นด้วยทีมงานมืออาชีพ" },
      { type: "heading", text: "หลังงาน: อย่าเพิ่งผ่อนคลาย" },
      { type: "paragraph", text: "หลังงานจบ ให้รวบรวมทีมทำ Hot Debrief ทันที เพื่อบันทึกสิ่งที่เกิดขึ้นขณะที่ยังจำได้ชัด ทั้งสิ่งที่ดีและสิ่งที่ต้องปรับปรุง จากนั้นเก็บข้อมูล Feedback จากผู้เข้าร่วมและเริ่มวิเคราะห์ตัวเลขให้เสร็จภายใน 48 ชั่วโมง" },
    ],
  },
  {
    id: "5",
    slug: "food-event-tips",
    title: "จัดงานฟู้ดอีเวนต์ครั้งแรกให้ปัง ทำได้จริง",
    excerpt: "เคล็ดลับจากผู้จัด Food Festival ระดับประเทศ ตั้งแต่การคัดเลือกร้านค้าไปจนถึงการจัดการคิว",
    tag: "Food",
    date: "5 ก.ค. 2026",
    readTime: "5 นาที",
    gradient: "from-amber-500 to-orange-500",
    image: "/images/categories/real_cat_food_1786461973051.png",
    content: [
      { type: "heading", text: "คัดร้านอย่างไรให้ได้ Lineup ที่แข็งแกร่ง" },
      { type: "paragraph", text: "ความสำเร็จของ Food Festival อยู่ที่ Lineup ร้านค้าเป็นหลัก ควรมีความหลากหลายของ Price Point และประเภทอาหาร ไม่ควรให้ร้านประเภทเดียวกันอยู่ติดกัน และต้องมีตัวเลือกสำหรับ Vegan, Gluten-Free และผู้แพ้อาหารไว้ด้วยเสมอ" },
      { type: "image", src: "/images/categories/real_cat_food_1786461973051.png", caption: "บรรยากาศงาน Food Festival ที่มีความหลากหลายของร้านค้า" },
      { type: "list", items: ["อัตราส่วนอาหารคาว : หวาน : เครื่องดื่ม = 6:2:2", "มีร้าน Anchor ที่มีชื่อเสียงอย่างน้อย 2-3 ร้าน", "กำหนด Revenue Share หรือค่าเช่าบูทล่วงหน้า", "กำหนดมาตรฐานความสะอาดและการจัดการขยะ"] },
      { type: "heading", text: "บริหารคิวให้ไหล ไม่ให้รอนาน" },
      { type: "paragraph", text: "ปัญหาที่ผู้จัดงานฟู้ดเฟสมักเจอคือคิวที่ยาวเกินไปจนทำให้ประสบการณ์แย่ลง ทางออกคือการใช้ระบบ Token หรือ QR Order ล่วงหน้า และการกระจายจุดขายของร้านยอดนิยมออกเป็นหลายจุดถ้าทำได้" },
      { type: "image", src: "/coverhero/banner.jpg", caption: "ระบบจัดการคิวที่ดีทำให้ผู้เข้าร่วมงานมีประสบการณ์ที่ดีขึ้น" },
      { type: "paragraph", text: "อย่าลืมวางแผนด้านการจัดการขยะตั้งแต่ต้น กำหนดจุดทิ้งขยะแยกประเภทให้ชัดเจน และมีทีมทำความสะอาดประจำจุดตลอดงาน สิ่งเหล่านี้สะท้อนภาพลักษณ์ของงานและผู้จัดอย่างมาก" },
    ],
  },
  {
    id: "6",
    slug: "tech-event-streaming",
    title: "Hybrid Event: จัดงาน Online + Offline ให้ได้คุณภาพ",
    excerpt: "แนวทางการออกแบบ Hybrid Event ที่ทำให้ผู้เข้าร่วมทั้ง Online และ Onsite ได้ประสบการณ์ที่ดีเท่าเทียมกัน",
    tag: "Tech",
    date: "1 ก.ค. 2026",
    readTime: "8 นาที",
    gradient: "from-sky-500 to-blue-600",
    image: "/images/categories/real_cat_tech_1786462148227.png",
    content: [
      { type: "heading", text: "ออกแบบ Experience สำหรับ 2 กลุ่มพร้อมกัน" },
      { type: "paragraph", text: "ความผิดพลาดที่พบบ่อยใน Hybrid Event คือการมองผู้ชม Online เป็นแค่ผู้ดูถ่ายทอด ทั้งที่จริงแล้วต้องออกแบบ Journey แยกกันสำหรับสองกลุ่ม โดยที่ยังรู้สึกว่าอยู่ในประสบการณ์เดียวกัน" },
      { type: "image", src: "/images/categories/real_cat_tech_1786462148227.png", caption: "Setup สำหรับการ Stream งาน Hybrid ระดับ Professional" },
      { type: "list", items: ["ใช้กล้อง PTZ อย่างน้อย 3 ตัวสำหรับมุมมองที่หลากหลาย", "มี Moderator แยกสำหรับจัดการ Online Chat", "ทำ Q&A Session ที่รวมคำถามทั้ง Online และ Onsite", "ทดสอบ Stream ก่อนงานจริงอย่างน้อย 2 ครั้ง"] },
      { type: "heading", text: "เทคโนโลยีที่ขาดไม่ได้" },
      { type: "paragraph", text: "Bandwidth เป็นปัจจัยหลักที่ทำให้ Hybrid Event ล้มเหลว ควรใช้การเชื่อมต่อแบบ Dedicated Line สำหรับ Stream และมี Backup Connection ไว้เสมอ อย่าใช้ Wi-Fi สาธารณะของสถานที่เป็นตัวหลัก" },
      { type: "image", src: "/eventex/worklifeevo.webp", caption: "ตัวอย่างงาน Hybrid Conference ที่ประสบความสำเร็จ" },
      { type: "paragraph", text: "Platform ที่เลือกใช้ก็สำคัญ ควรเลือก Platform ที่รองรับ Interactive Features เช่น Polls, Breakout Rooms และ Networking ไม่ใช่แค่ Streaming อย่างเดียว เพราะ Engagement คือหัวใจของ Hybrid Event" },
    ],
  },
  {
    id: "7",
    slug: "event-sponsorship-guide",
    title: "เทคนิคหาสปอนเซอร์ให้อีเวนต์ของคุณ",
    excerpt: "วิธีเขียนโปรโพซัลสปอนเซอร์ให้น่าสนใจ และแพ็กเกจผลตอบแทนที่แบรนด์อยากร่วมด้วยจริงๆ",
    tag: "Sponsorship",
    date: "25 มิ.ย. 2026",
    readTime: "6 นาที",
    gradient: "from-teal-500 to-cyan-600",
    image: "/images/categories/real_cat_business_1786461507526.png",
    content: [
      { type: "heading", text: "รู้จักแบรนด์ก่อนยื่นโปรโพซัล" },
      { type: "paragraph", text: "สปอนเซอร์ที่ดีต้องมี Brand Alignment กับอีเวนต์ของคุณ ศึกษาแคมเปญล่าสุดของแบรนด์ กลุ่มเป้าหมาย และ KPI ที่พวกเขาโฟกัสอยู่ แล้วออกแบบโปรโพซัลที่ตอบโจทย์เหล่านั้นโดยตรง ไม่ใช่แค่ส่ง Template เดิมให้ทุกแบรนด์" },
      { type: "image", src: "/images/categories/real_cat_business_1786461507526.png", caption: "การนำเสนอโปรโพซัลสปอนเซอร์อย่างมืออาชีพ" },
      { type: "heading", text: "สร้างแพ็กเกจที่ยืดหยุ่น" },
      { type: "list", items: ["Title Sponsor: Exclusive branding + พื้นที่ Activation", "Gold Sponsor: Logo บนสื่อหลัก + บูทพรีเมียม", "Silver Sponsor: Digital Mentions + ส่วนลดบัตร", "In-Kind: แลกสินค้า/บริการแทนเงินสด"] },
      { type: "paragraph", text: "นอกจากแพ็กเกจมาตรฐาน ควรมีตัวเลือก Custom ให้แบรนด์ได้เลือกส่วนที่ต้องการจริงๆ บางแบรนด์อาจต้องการแค่ Digital Presence ไม่ต้องการบูทเลย การยืดหยุ่นช่วยปิดดีลได้เร็วกว่า" },
      { type: "image", src: "/eventex/ctc2026.jpg", caption: "การจัดวาง Sponsor Branding ที่ดูดีและไม่รบกวนประสบการณ์ผู้เข้าร่วม" },
      { type: "paragraph", text: "หลังงานจบ ส่ง Post-Event Report ให้สปอนเซอร์ทุกรายภายใน 2 สัปดาห์ พร้อมตัวเลข Reach, Impression และรูปภาพหลักฐาน นี่คือสิ่งที่จะทำให้พวกเขาต่อสัญญาในปีต่อไป" },
    ],
  },
  {
    id: "8",
    slug: "crowd-safety-management",
    title: "จัดการฝูงชนและความปลอดภัยในงานอีเวนต์ใหญ่",
    excerpt: "แนวทางวางแผนทางเข้า-ออก จุดปฐมพยาบาล และทีมรักษาความปลอดภัย สำหรับงานที่มีผู้เข้าร่วมหลักพันคนขึ้นไป",
    tag: "Safety",
    date: "18 มิ.ย. 2026",
    readTime: "7 นาที",
    gradient: "from-rose-500 to-red-600",
    image: "/images/categories/real_cat_sports_1786461770620.png",
    content: [
      { type: "heading", text: "วางแผน Flow การเคลื่อนไหวของฝูงชน" },
      { type: "paragraph", text: "Crowd Flow Management เริ่มต้นตั้งแต่การออกแบบ Layout ของงาน ทางเข้า-ออกต้องมีจำนวนเพียงพอและกระจายออกให้ผู้คนไม่กระจุกตัวในจุดเดียว ให้คำนวณอัตราการ Throughput ของแต่ละ Gate ว่ารองรับได้กี่คนต่อนาที" },
      { type: "image", src: "/images/categories/real_cat_sports_1786461770620.png", caption: "การวางแผนเส้นทางการเดินภายในงานกีฬาขนาดใหญ่" },
      { type: "list", items: ["กำหนด Capacity สูงสุดและไม่เกินเกณฑ์", "มี Entrance และ Exit แยกกัน", "วาง Wayfinding Signage ให้ชัดเจน", "กำหนดพื้นที่ Buffer Zone รอบเวที", "ซักซ้อม Emergency Evacuation กับทีมงาน"] },
      { type: "heading", text: "ทีมความปลอดภัยและการสื่อสาร" },
      { type: "paragraph", text: "อัตราส่วนทีมความปลอดภัยต่อผู้เข้าร่วมควรอยู่ที่ 1:100-200 คน โดยต้องมีจุด First Aid ที่เข้าถึงได้ง่ายทุก 500 เมตร และมีการสื่อสารด้วย Radio Channel แยกสำหรับแต่ละโซน เพื่อให้รับมือเหตุการณ์ได้ทันท่วงที" },
      { type: "image", src: "/coverhero/coverevent.jpg", caption: "ทีมงานและระบบความปลอดภัยที่พร้อมรับมือทุกสถานการณ์" },
      { type: "paragraph", text: "อย่าลืมเตรียมแผนรับมือสภาพอากาศแปรปรวน โดยเฉพาะงาน Outdoor ควรกำหนด Decision Tree ว่าถ้าฝนตกหนัก/พายุ จะดำเนินการอย่างไร และสื่อสารให้ผู้เข้าร่วมทราบผ่าน App หรือ PA System ทันที" },
    ],
  },
  {
    id: "9",
    slug: "post-event-analytics",
    title: "วัดผลอีเวนต์หลังจบงานด้วยข้อมูลที่ใช่",
    excerpt: "ตัวชี้วัดสำคัญที่ผู้จัดงานมืออาชีพติดตามหลังจบงาน ตั้งแต่ยอดขายบัตรไปจนถึงความพึงพอใจผู้เข้าร่วม",
    tag: "Analytics",
    date: "10 มิ.ย. 2026",
    readTime: "5 นาที",
    gradient: "from-violet-500 to-indigo-600",
    image: "/images/categories/real_cat_tech_1786462148227.png",
    content: [
      { type: "heading", text: "KPI หลักที่ต้องวัดทุกงาน" },
      { type: "paragraph", text: "ข้อมูลที่มีคุณค่าที่สุดหลังงานจบไม่ใช่แค่ยอดขายบัตร แต่คือ Conversion Rate ของแต่ละ Channel Marketing, Net Promoter Score จากผู้เข้าร่วม และ Cost per Attendee เพื่อเปรียบเทียบ ROI กับงานครั้งก่อน" },
      { type: "image", src: "/images/categories/real_cat_tech_1786462148227.png", caption: "Dashboard วิเคราะห์ข้อมูลหลังงาน Event" },
      { type: "list", items: ["Ticket Sales: จำนวน, รายได้, และ Tier Breakdown", "Check-in Rate: % ของผู้ซื้อบัตรที่มาจริง", "Net Promoter Score (NPS): ความน่าจะแนะนำต่อ", "Social Reach: Impressions, Mentions, Hashtag", "Revenue per Attendee: รายได้รวมหารจำนวนผู้เข้าร่วม"] },
      { type: "heading", text: "เก็บข้อมูลให้ถูกที่และถูกเวลา" },
      { type: "paragraph", text: "ส่ง Post-Event Survey ภายใน 24 ชั่วโมงหลังงาน เพราะความทรงจำและความรู้สึกยังสดใหม่ ใช้แบบสอบถามที่สั้นไม่เกิน 5 คำถาม โดยต้องมี NPS Score ไว้เสมอ และเพิ่ม Open-ended Question 1 ข้อสำหรับ Insight เชิงคุณภาพ" },
      { type: "image", src: "/eventex/performanceconfirence.webp", caption: "การวิเคราะห์ข้อมูลหลังงานเพื่อพัฒนาครั้งต่อไป" },
      { type: "paragraph", text: "นำข้อมูลทั้งหมดมาทำ Event Report ที่ประกอบด้วย Executive Summary, KPI Dashboard และ Actionable Insights สำหรับงานครั้งหน้า เอกสารนี้มีค่ามากทั้งสำหรับทีมงานภายในและการนำเสนอให้สปอนเซอร์เห็นผลลัพธ์" },
    ],
  },
];

export function getArticleBySlug(slug: string) {
  return articles.find((article) => article.slug === slug);
}

export const announcements: MockAnnouncement[] = [
  {
    id: "1",
    organizer: "Live Nation Thailand",
    message: "เปิดขายบัตร Bangkok Music Festival 2026 รอบ Early Bird แล้ววันนี้! อย่าพลาดโอกาสรับบัตรในราคาพิเศษ จำนวนจำกัด",
    date: "5 ส.ค. 2026",
    tag: "Early Bird",
    image: "/images/categories/real_cat_music_1786461488007.png",
  },
  {
    id: "2",
    organizer: "Bangkok Events Co.",
    message: "Startup Summit Asia 2026 เลื่อนเวลาลงทะเบียนหน้างานเป็น 08:00 น. โปรดมาถึงก่อนเวลา",
    date: "1 ส.ค. 2026",
    tag: "อัปเดต",
    image: "/images/categories/real_cat_business_1786461507526.png",
  },
  {
    id: "3",
    organizer: "Nexus Conferences",
    message: "เพิ่มรอบที่นั่ง Tech Conference Thailand เนื่องจากรอบแรกเต็มเร็วกว่ากำหนด สมัครด่วน!",
    date: "27 ก.ค. 2026",
    tag: "เพิ่มรอบ",
    image: "/images/categories/real_cat_tech_1786462148227.png",
  },
  {
    id: "4",
    organizer: "Thailand Marathon Club",
    message: "Thailand Night Marathon 2026 เปิดรับสมัครนักวิ่ง ประเภท 10K / 21K / 42K โควต้าสุดท้าย",
    date: "20 ก.ค. 2026",
    tag: "รับสมัคร",
    image: "/images/categories/real_cat_sports_1786461770620.png",
  },
  {
    id: "5",
    organizer: "BACC Gallery",
    message: "Modern Art Expo Bangkok ขยายเวลาจัดแสดงเพิ่มอีก 2 สัปดาห์ เนื่องจากกระแสตอบรับดีเกินคาด",
    date: "15 ก.ค. 2026",
    tag: "ขยายเวลา",
    image: "/images/categories/real_cat_arts_1786461785062.png",
  },
  {
    id: "6",
    organizer: "Central World Events",
    message: "Food & Wine Festival 2026 เพิ่มโซน Street Food พิเศษ กว่า 50 ร้านค้าจาก 10 ประเทศ",
    date: "10 ก.ค. 2026",
    tag: "อัปเดต",
    image: "/images/categories/real_cat_food_1786461973051.png",
  },
];

export type MockPartner = {
  id: string;
  name: string;
  logo: string;
};

export const partners: MockPartner[] = [
  {
    id: "1",
    name: "GoGraphy",
    logo: "/partnerlogo/346879202_146879158280564_4100899643643053591_n.jpg",
  },
  {
    id: "2",
    name: "Woo You Creative",
    logo: "/partnerlogo/429484485_370127425805822_6893906864041347128_n.jpg",
  },
  {
    id: "3",
    name: "Woo You Events",
    logo: "/partnerlogo/734644841_1518869043588694_1515982877927974451_n.jpg",
  },
  {
    id: "4",
    name: "paydee.me",
    logo: "/partnerlogo/paydee.jpg",
  },
];
