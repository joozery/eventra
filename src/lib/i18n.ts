export const locales = ["th", "en", "zh", "ja", "ko"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "th";

export const localeLabels: Record<Locale, { label: string; flag: string }> = {
  th: { label: "ไทย", flag: "🇹🇭" },
  en: { label: "English", flag: "🇬🇧" },
  zh: { label: "中文", flag: "🇨🇳" },
  ja: { label: "日本語", flag: "🇯🇵" },
  ko: { label: "한국어", flag: "🇰🇷" },
};

const dictionaries = {
  th: {
    nav: {
      events: "อีเวนต์",
      categories: "สินค้า",
      articles: "บทความ",
      organizers: "ผู้จัดงาน",
      search: "ค้นหา",
      login: "เข้าสู่ระบบ",
      createEvent: "สร้าง Event",
      openMenu: "เปิดเมนู",
    },
  },
  en: {
    nav: {
      events: "Events",
      categories: "Shop",
      articles: "Articles",
      organizers: "Organizers",
      search: "Search",
      login: "Log in",
      createEvent: "Create Event",
      openMenu: "Open menu",
    },
  },
  zh: {
    nav: {
      events: "活动",
      categories: "商店",
      articles: "文章",
      organizers: "主办方",
      search: "搜索",
      login: "登录",
      createEvent: "创建活动",
      openMenu: "打开菜单",
    },
  },
  ja: {
    nav: {
      events: "イベント",
      categories: "ショップ",
      articles: "記事",
      organizers: "主催者",
      search: "検索",
      login: "ログイン",
      createEvent: "イベントを作成",
      openMenu: "メニューを開く",
    },
  },
  ko: {
    nav: {
      events: "이벤트",
      categories: "상점",
      articles: "기사",
      organizers: "주최자",
      search: "검색",
      login: "로그인",
      createEvent: "이벤트 만들기",
      openMenu: "메뉴 열기",
    },
  },
} as const satisfies Record<Locale, unknown>;

export type Dictionary = (typeof dictionaries)[Locale];

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
