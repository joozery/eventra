"use client";

import { useMemo, useState } from "react";
import { Mail, Megaphone } from "lucide-react";
import { ArticleCard } from "@/components/articles/article-card";
import { AnnouncementCard } from "@/components/announcements/announcement-card";
import { Pagination } from "@/components/ui/pagination";
import { announcements, articles } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const tags = Array.from(new Set(articles.map((a) => a.tag)));

const PAGE_SIZE = 6;
const ANNOUNCEMENT_PAGE_SIZE = 3;

export function ArticlesExplorer() {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [announcementPage, setAnnouncementPage] = useState(1);

  const filteredArticles = useMemo(
    () => articles.filter((a) => !activeTag || a.tag === activeTag),
    [activeTag]
  );

  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const announcementTotalPages = Math.max(
    1,
    Math.ceil(announcements.length / ANNOUNCEMENT_PAGE_SIZE)
  );
  const currentAnnouncementPage = Math.min(
    announcementPage,
    announcementTotalPages
  );
  const paginatedAnnouncements = announcements.slice(
    (currentAnnouncementPage - 1) * ANNOUNCEMENT_PAGE_SIZE,
    currentAnnouncementPage * ANNOUNCEMENT_PAGE_SIZE
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

      {/* ── Mobile: horizontal scrollable category pills ── */}
      <div className="mb-6 lg:hidden">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            onClick={() => { setActiveTag(null); setPage(1); }}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              activeTag === null
                ? "bg-foreground text-background"
                : "border border-border bg-card text-muted-foreground hover:text-foreground"
            )}
          >
            ทั้งหมด
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => { setActiveTag((c) => (c === tag ? null : tag)); setPage(1); }}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                activeTag === tag
                  ? "bg-foreground text-background"
                  : "border border-border bg-card text-muted-foreground hover:text-foreground"
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        {/* ── Desktop sidebar ── */}
        <aside className="hidden flex-col gap-6 lg:flex">
          <div>
            <h2 className="mb-3 text-sm font-semibold text-foreground">
              หมวดหมู่
            </h2>
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => {
                  setActiveTag(null);
                  setPage(1);
                }}
                className={cn(
                  "rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors",
                  activeTag === null
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                ทั้งหมด
              </button>
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setActiveTag((current) => (current === tag ? null : tag));
                    setPage(1);
                  }}
                  className={cn(
                    "rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors",
                    activeTag === tag
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 p-5 text-white">
            <span className="flex size-9 items-center justify-center rounded-lg bg-white/15">
              <Mail className="size-4.5" />
            </span>
            <h3 className="mt-3 text-sm font-semibold">ลงโฆษณากับเรา</h3>
            <p className="mt-1.5 text-xs text-indigo-100">
              เข้าถึงผู้จัดงานและผู้เข้าร่วมอีเวนต์นับหมื่นคนผ่านพื้นที่โฆษณาบน EVENTRA
            </p>
            <a
              href="mailto:ads@eventra.app"
              className="mt-4 inline-flex h-9 items-center justify-center rounded-lg bg-white px-4 text-xs font-semibold text-indigo-700 transition-opacity hover:opacity-90"
            >
              ติดต่อโฆษณา
            </a>
          </div>
        </aside>

        <div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {paginatedArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>

      <div className="mt-16 border-t border-border pt-10">
        <h2 className="mb-5 flex items-center gap-2 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          <Megaphone className="size-5 text-orange-500" />
          ประกาศจากผู้จัดงาน
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {paginatedAnnouncements.map((announcement) => (
            <AnnouncementCard key={announcement.id} announcement={announcement} />
          ))}
        </div>
        <Pagination
          page={currentAnnouncementPage}
          totalPages={announcementTotalPages}
          onChange={setAnnouncementPage}
        />
      </div>
    </div>
  );
}
