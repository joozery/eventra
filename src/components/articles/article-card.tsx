import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, Newspaper } from "lucide-react";
import type { MockArticle } from "@/lib/mock-data";

export function ArticleCard({ article }: { article: MockArticle }) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-lg hover:shadow-indigo-950/5"
    >
      <div
        className={`relative aspect-[16/10] overflow-hidden bg-gradient-to-br p-4 ${article.gradient}`}
      >
        {article.image ? (
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <>
            <Newspaper className="pointer-events-none absolute -right-6 -bottom-6 size-28 text-white/10" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.12)_1px,transparent_0)] bg-[length:16px_16px]" />
          </>
        )}
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
  );
}
