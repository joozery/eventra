"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Calendar, Megaphone, Newspaper, ArrowUpRight } from "lucide-react";
import { announcements, articles } from "@/lib/mock-data";

type Tab = "articles" | "announcements";

export function ContentHub() {
  const [activeTab, setActiveTab] = useState<Tab>("articles");

  return (
    <section className="bg-muted/40 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header + Tabs */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              บทความ &amp; ประกาศ
            </h2>
            <p className="mt-1 text-muted-foreground">
              ข้อมูลอัปเดตล่าสุดสำหรับผู้ร่วมงานและผู้จัดงาน
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-1 rounded-xl border border-border bg-background p-1 shadow-sm self-start sm:self-auto">
            <button
              id="tab-articles"
              onClick={() => setActiveTab("articles")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                activeTab === "articles"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Newspaper className="size-4" />
              บทความ
            </button>
            <button
              id="tab-announcements"
              onClick={() => setActiveTab("announcements")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                activeTab === "announcements"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Megaphone className="size-4" />
              ประกาศ
            </button>
          </div>
        </div>

        {/* Articles Bento Grid */}
        {activeTab === "articles" && (
          <div className="grid auto-rows-[200px] grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            {articles[0] && (
              <ArticleCard article={articles[0]} className="col-span-2 row-span-2 sm:col-span-3" isLarge />
            )}
            {articles[1] && (
              <ArticleCard article={articles[1]} className="col-span-1 row-span-2 sm:col-span-2" isTall />
            )}
            {articles[2] && (
              <ArticleCard article={articles[2]} className="col-span-1 row-span-1 sm:col-span-1" />
            )}
            {articles[3] && (
              <ArticleCard article={articles[3]} className="col-span-1 row-span-1 sm:col-span-1" />
            )}
            {articles[4] && (
              <ArticleCard article={articles[4]} className="col-span-2 row-span-1 sm:col-span-2" isWide />
            )}
            {articles[5] && (
              <ArticleCard article={articles[5]} className="col-span-2 row-span-1 sm:col-span-2" isWide />
            )}
          </div>
        )}

        {/* Announcements Bento Grid */}
        {activeTab === "announcements" && (
          <div className="grid auto-rows-[200px] grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            {announcements[0] && (
              <AnnouncementCard announcement={announcements[0]} className="col-span-2 row-span-2 sm:col-span-2" isTall />
            )}
            {announcements[1] && (
              <AnnouncementCard announcement={announcements[1]} className="col-span-2 row-span-1 sm:col-span-2" isWide />
            )}
            {announcements[2] && (
              <AnnouncementCard announcement={announcements[2]} className="col-span-2 row-span-1 sm:col-span-2" isWide />
            )}
            {announcements[3] && (
              <AnnouncementCard announcement={announcements[3]} className="col-span-2 row-span-2 sm:col-span-3" isLarge />
            )}
            {announcements[4] && (
              <AnnouncementCard announcement={announcements[4]} className="col-span-2 row-span-1 sm:col-span-1" />
            )}
            {announcements[5] && (
              <AnnouncementCard announcement={announcements[5]} className="col-span-2 row-span-1 sm:col-span-2" isWide />
            )}
          </div>
        )}

        {/* View All Link */}
        <div className="mt-6 flex justify-end">
          <Link
            href={activeTab === "articles" ? "/articles" : "/announcements"}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-all hover:bg-muted hover:shadow-md"
          >
            ดูทั้งหมด
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ArticleCard({
  article,
  className,
  isLarge,
  isTall,
  isWide,
}: {
  article: (typeof articles)[0];
  className?: string;
  isLarge?: boolean;
  isTall?: boolean;
  isWide?: boolean;
}) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className={`group relative flex flex-col justify-end overflow-hidden rounded-2xl text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/15 ${className}`}
    >
      {article.image ? (
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${article.gradient}`} />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <ArrowUpRight className="absolute top-3 right-3 size-5 text-white/0 transition-all duration-200 group-hover:text-white z-10" />
      <div className="relative z-10 p-4">
        <span className="mb-2 inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold backdrop-blur-sm border border-white/20">
          {article.tag}
        </span>
        <h3 className={`font-bold leading-snug tracking-tight drop-shadow-md ${isLarge ? "text-xl sm:text-2xl" : isTall ? "text-lg" : "text-sm"} ${!isLarge && !isTall && !isWide ? "line-clamp-2" : "line-clamp-3"}`}>
          {article.title}
        </h3>
        {(isLarge || isTall) && (
          <p className="mt-1.5 line-clamp-2 text-xs text-white/75">{article.excerpt}</p>
        )}
        <div className="mt-2 flex items-center gap-3 text-xs text-white/60">
          <span className="flex items-center gap-1"><Calendar className="size-3" />{article.date}</span>
          <span className="flex items-center gap-1"><Clock className="size-3" />{article.readTime}</span>
        </div>
      </div>
    </Link>
  );
}

function AnnouncementCard({
  announcement,
  className,
  isLarge,
  isTall,
  isWide,
}: {
  announcement: (typeof announcements)[0];
  className?: string;
  isLarge?: boolean;
  isTall?: boolean;
  isWide?: boolean;
}) {
  return (
    <div className={`group relative flex flex-col justify-end overflow-hidden rounded-2xl text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/15 ${className}`}>
      {announcement.image ? (
        <Image
          src={announcement.image}
          alt={announcement.organizer}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-500" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
      <div className="relative z-10 p-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-amber-500/90 backdrop-blur-sm">
            <Megaphone className="size-3.5 text-white" />
          </span>
          {announcement.tag && (
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold backdrop-blur-sm border border-white/20">
              {announcement.tag}
            </span>
          )}
        </div>
        <p className="text-xs font-semibold text-white/70 uppercase tracking-wide mb-1">{announcement.organizer}</p>
        <p className={`font-bold leading-snug drop-shadow-md ${isLarge ? "text-lg sm:text-xl" : isTall ? "text-base" : "text-sm"} ${!isLarge && !isTall ? "line-clamp-2" : "line-clamp-3"}`}>
          {announcement.message}
        </p>
        <p className="mt-2 flex items-center gap-1 text-xs text-white/60">
          <Calendar className="size-3" />{announcement.date}
        </p>
      </div>
    </div>
  );
}
