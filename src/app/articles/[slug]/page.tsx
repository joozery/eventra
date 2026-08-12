import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, CheckCircle2, Newspaper } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ArticleCard } from "@/components/articles/article-card";
import { ArticleShareButtons } from "@/components/articles/article-share-buttons";
import { articles, getArticleBySlug } from "@/lib/mock-data";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: `${article.title} — EVENTRA`,
    description: article.excerpt,
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const relatedArticles = articles
    .filter((a) => a.id !== article.id)
    .slice(0, 3);

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Navbar />
      <main className="flex-1">

        {/* ── Full-width hero ── */}
        <div className={`relative bg-gradient-to-br ${article.gradient}`}>
          {article.image && (
            <Image
              src={article.image}
              alt={article.title}
              fill
              priority
              className="object-cover"
            />
          )}
          {/* overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/20" />
          {!article.image && (
            <>
              <Newspaper className="pointer-events-none absolute -right-8 -bottom-8 size-72 text-white/5" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] bg-[length:24px_24px]" />
            </>
          )}

          <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-6 lg:px-8">
            <Link
              href="/articles"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="size-4" />
              กลับไปหน้าบทความ
            </Link>

            <div className="mt-8 max-w-3xl">
              <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                {article.tag}
              </span>
              <h1 className="mt-3 text-2xl font-bold leading-snug tracking-tight text-white sm:text-3xl lg:text-4xl">
                {article.title}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/60">
                <span className="flex items-center gap-1.5">
                  <Calendar className="size-3.5" />
                  {article.date}
                </span>
                <span className="size-1 rounded-full bg-white/30" />
                <span className="flex items-center gap-1.5">
                  <Clock className="size-3.5" />
                  อ่าน {article.readTime}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Body: article + sidebar ── */}
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_280px]">

            {/* Article content */}
            <article>
              {/* Lead */}
              <p className="text-lg font-medium leading-relaxed text-foreground">
                {article.excerpt}
              </p>

              {/* Content blocks */}
              {article.content && article.content.length > 0 ? (
                <div className="mt-8 space-y-6">
                  {article.content.map((block, i) => {
                    if (block.type === "heading") {
                      return (
                        <h2 key={i} className="pt-2 text-xl font-bold tracking-tight text-foreground">
                          {block.text}
                        </h2>
                      );
                    }
                    if (block.type === "paragraph") {
                      return (
                        <p key={i} className="text-[15px] leading-[1.9] text-muted-foreground">
                          {block.text}
                        </p>
                      );
                    }
                    if (block.type === "image") {
                      return (
                        <figure key={i} className="my-2 overflow-hidden rounded-xl">
                          <div className="relative aspect-[16/9] w-full">
                            <Image
                              src={block.src}
                              alt={block.caption ?? ""}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 700px"
                            />
                          </div>
                          {block.caption && (
                            <figcaption className="mt-2 text-center text-xs text-muted-foreground">
                              {block.caption}
                            </figcaption>
                          )}
                        </figure>
                      );
                    }
                    if (block.type === "list") {
                      return (
                        <ul key={i} className="space-y-2.5">
                          {block.items.map((item, j) => (
                            <li key={j} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-muted-foreground">
                              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-indigo-500" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      );
                    }
                    return null;
                  })}
                </div>
              ) : (
                <div className="mt-6 space-y-5 border-t border-border pt-6 text-[15px] leading-[1.9] text-muted-foreground">
                  <p>การจัดงานอีเวนต์ให้ประสบความสำเร็จต้องอาศัยการวางแผนที่รอบคอบตั้งแต่ขั้นตอนแรก</p>
                </div>
              )}

              {/* Tag */}
              <div className="mt-8 flex items-center gap-2 border-t border-border pt-6">
                <span className="text-xs text-muted-foreground">หมวดหมู่:</span>
                <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground">
                  {article.tag}
                </span>
              </div>
            </article>

            {/* Sticky sidebar */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="space-y-4">

                {/* Share */}
                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    แชร์บทความ
                  </p>
                  <ArticleShareButtons title={article.title} slug={article.slug} />
                </div>

                {/* Meta */}
                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    รายละเอียด
                  </p>
                  <dl className="space-y-2.5 text-sm">
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">เผยแพร่</dt>
                      <dd className="font-medium text-foreground">{article.date}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">เวลาอ่าน</dt>
                      <dd className="font-medium text-foreground">{article.readTime}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">หมวดหมู่</dt>
                      <dd className="font-medium text-foreground">{article.tag}</dd>
                    </div>
                  </dl>
                </div>

              </div>
            </aside>
          </div>

          {/* Related articles */}
          {relatedArticles.length > 0 && (
            <div className="mt-14 border-t border-border pt-10">
              <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                บทความที่เกี่ยวข้อง
              </h2>
              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {relatedArticles.map((related) => (
                  <ArticleCard key={related.id} article={related} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
