export type MockMerchandise = {
  id: string;
  name: string;
  price: number;
  icon: string;
  gradient: string;
  image?: string;
  bestSeller?: boolean;
};

export type MockEvent = {
  id: string;
  slug: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  price: number;
  gradient: string;
  attendees: number;
  organizer: string;
  image?: string;
  gallery?: string[];
  merchandise?: MockMerchandise[];
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
    excerpt:
      "ตั้งแต่การเลือกทำเลไปจนถึงระบบแสงเสียง เช็กลิสต์ที่ผู้จัดงานมืออาชีพใช้จริงก่อนปิดดีลสถานที่",
    tag: "Venue",
    date: "2 ส.ค. 2026",
    readTime: "5 นาที",
    gradient: "from-indigo-500 to-purple-500",
    image: "/images/article_venue.png",
  },
  {
    id: "2",
    slug: "ticket-pricing-strategy",
    title: "กลยุทธ์ตั้งราคาบัตรยังไงให้ขายหมดไว",
    excerpt:
      "เจาะลึกโมเดล Early Bird, Tiered Pricing และการตั้งราคาตามดีมานด์แบบที่แพลตฟอร์มระดับโลกใช้",
    tag: "Ticketing",
    date: "28 ก.ค. 2026",
    readTime: "4 นาที",
    gradient: "from-blue-500 to-indigo-500",
    image: "/images/categories/real_cat_business_1786461507526.png",
  },
  {
    id: "3",
    slug: "event-marketing-checklist",
    title: "เช็กลิสต์การตลาดก่อนเปิดขายบัตรอีเวนต์",
    excerpt:
      "รวม 10 ขั้นตอนวางแผนการตลาดอีเวนต์ ตั้งแต่ pre-launch ถึงวันงาน ไม่ให้พลาดยอดขาย",
    tag: "Marketing",
    date: "15 ก.ค. 2026",
    readTime: "6 นาที",
    gradient: "from-fuchsia-500 to-pink-500",
    image: "/images/categories/real_cat_arts_1786461785062.png",
  },
  {
    id: "4",
    slug: "event-day-checklist",
    title: "วันงานสำเร็จต้องเตรียมอะไรบ้าง?",
    excerpt:
      "Checklist ฉบับครบครัน จากทีมงานมืออาชีพ ที่จะช่วยให้วันงานของคุณดำเนินไปอย่างราบรื่น",
    tag: "Operations",
    date: "10 ก.ค. 2026",
    readTime: "7 นาที",
    gradient: "from-emerald-500 to-teal-500",
    image: "/images/categories/real_cat_sports_1786461770620.png",
  },
  {
    id: "5",
    slug: "food-event-tips",
    title: "จัดงานฟู้ดอีเวนต์ครั้งแรกให้ปัง ทำได้จริง",
    excerpt:
      "เคล็ดลับจากผู้จัด Food Festival ระดับประเทศ ตั้งแต่การคัดเลือกร้านค้าไปจนถึงการจัดการคิว",
    tag: "Food",
    date: "5 ก.ค. 2026",
    readTime: "5 นาที",
    gradient: "from-amber-500 to-orange-500",
    image: "/images/categories/real_cat_food_1786461973051.png",
  },
  {
    id: "6",
    slug: "tech-event-streaming",
    title: "Hybrid Event: จัดงาน Online + Offline ให้ได้คุณภาพ",
    excerpt:
      "แนวทางการออกแบบ Hybrid Event ที่ทำให้ผู้เข้าร่วมทั้ง Online และ Onsite ได้ประสบการณ์ที่ดีเท่าเทียมกัน",
    tag: "Tech",
    date: "1 ก.ค. 2026",
    readTime: "8 นาที",
    gradient: "from-sky-500 to-blue-600",
    image: "/images/categories/real_cat_tech_1786462148227.png",
  },
  {
    id: "7",
    slug: "event-sponsorship-guide",
    title: "เทคนิคหาสปอนเซอร์ให้อีเวนต์ของคุณ",
    excerpt:
      "วิธีเขียนโปรโพซัลสปอนเซอร์ให้น่าสนใจ และแพ็กเกจผลตอบแทนที่แบรนด์อยากร่วมด้วยจริงๆ",
    tag: "Sponsorship",
    date: "25 มิ.ย. 2026",
    readTime: "6 นาที",
    gradient: "from-teal-500 to-cyan-600",
    image: "/images/categories/real_cat_business_1786461507526.png",
  },
  {
    id: "8",
    slug: "crowd-safety-management",
    title: "จัดการฝูงชนและความปลอดภัยในงานอีเวนต์ใหญ่",
    excerpt:
      "แนวทางวางแผนทางเข้า-ออก จุดปฐมพยาบาล และทีมรักษาความปลอดภัย สำหรับงานที่มีผู้เข้าร่วมหลักพันคนขึ้นไป",
    tag: "Safety",
    date: "18 มิ.ย. 2026",
    readTime: "7 นาที",
    gradient: "from-rose-500 to-red-600",
    image: "/images/categories/real_cat_sports_1786461770620.png",
  },
  {
    id: "9",
    slug: "post-event-analytics",
    title: "วัดผลอีเวนต์หลังจบงานด้วยข้อมูลที่ใช่",
    excerpt:
      "ตัวชี้วัดสำคัญที่ผู้จัดงานมืออาชีพติดตามหลังจบงาน ตั้งแต่ยอดขายบัตรไปจนถึงความพึงพอใจผู้เข้าร่วม",
    tag: "Analytics",
    date: "10 มิ.ย. 2026",
    readTime: "5 นาที",
    gradient: "from-violet-500 to-indigo-600",
    image: "/images/categories/real_cat_tech_1786462148227.png",
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
