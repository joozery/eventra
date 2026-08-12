import Link from "next/link";
import { ArrowRight, Calendar, Clock, Megaphone, Newspaper } from "lucide-react";
import { announcements, articles } from "@/lib/mock-data";

export function NewsAndAnnouncements() {
  return (
    <section className="bg-muted/40 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            บทความ
          </h2>
          <Link
            href="/articles"
            className="hidden shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex"
          >
            ดูทั้งหมด
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className="group flex flex-col overflow-hidden rounded-sm border border-border bg-card transition-shadow hover:shadow-lg hover:shadow-indigo-950/5"
            >
              <div
                className={`relative aspect-[16/10] overflow-hidden bg-gradient-to-br p-4 ${article.gradient}`}
              >
                <Newspaper className="pointer-events-none absolute -right-6 -bottom-6 size-28 text-white/10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.12)_1px,transparent_0)] bg-[length:16px_16px]" />
                <span className="relative rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-indigo-700 backdrop-blur-sm">
                  {article.tag}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-2 p-4">
                <h3 className="line-clamp-2 text-sm font-semibold text-foreground group-hover:text-primary">
                  {article.title}
                </h3>
                <p className="line-clamp-2 text-xs text-muted-foreground">
                  {article.excerpt}
                </p>
                <div className="mt-auto flex items-center gap-3 border-t border-border pt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3.5" />
                    {article.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3.5" />
                    อ่าน {article.readTime}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-14 mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            ประกาศจากผู้จัดงาน
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="flex flex-col gap-3 rounded-sm border border-border bg-card p-4"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-sm bg-gradient-to-br from-amber-500 to-orange-500 text-white">
                <Megaphone className="size-5" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  {announcement.organizer}
                </h3>
                <p className="mt-1.5 line-clamp-3 text-sm text-muted-foreground">
                  {announcement.message}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {announcement.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
