import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Newspaper } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ArticleCard } from "@/components/articles/article-card";
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
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/articles"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            กลับไปหน้าบทความ
          </Link>

          <div
            className={`relative mt-5 flex aspect-[16/9] items-end overflow-hidden rounded-2xl bg-gradient-to-br p-5 ${article.gradient}`}
          >
            {article.image ? (
              <Image
                src={article.image}
                alt={article.title}
                fill
                priority
                className="object-cover"
              />
            ) : (
              <>
                <Newspaper className="pointer-events-none absolute -right-8 -bottom-8 size-40 text-white/10" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.12)_1px,transparent_0)] bg-[length:20px_20px]" />
              </>
            )}
            <span className="relative rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-indigo-700 backdrop-blur-sm">
              {article.tag}
            </span>
          </div>

          <h1 className="mt-6 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {article.title}
          </h1>

          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="size-4" />
              {article.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-4" />
              อ่าน {article.readTime}
            </span>
          </div>

          <div className="mt-8 flex flex-col gap-4 border-t border-border pt-8 leading-relaxed text-muted-foreground">
            <p className="text-base text-foreground">{article.excerpt}</p>
            <p>
              การจัดงานอีเวนต์ให้ประสบความสำเร็จต้องอาศัยการวางแผนที่รอบคอบตั้งแต่ขั้นตอนแรก
              ทีมงาน EVENTRA รวบรวมประสบการณ์จากผู้จัดงานมืออาชีพหลายร้อยงาน
              มาสรุปเป็นแนวทางที่นำไปปรับใช้ได้จริง ไม่ว่าคุณจะเป็นมือใหม่ที่เพิ่งเริ่มจัดงานแรก
              หรือผู้จัดงานมืออาชีพที่ต้องการยกระดับมาตรฐานให้สูงขึ้นไปอีกขั้น
            </p>
            <p>
              สิ่งสำคัญที่สุดคือการเริ่มต้นวางแผนล่วงหน้าให้เพียงพอ
              เผื่อเวลาสำหรับการปรับเปลี่ยนและแก้ไขปัญหาที่อาจเกิดขึ้นระหว่างทาง
              พร้อมทั้งสื่อสารกับทีมงานและผู้เข้าร่วมงานอย่างชัดเจนในทุกขั้นตอน
              เพื่อให้วันงานออกมาสมบูรณ์แบบที่สุด
            </p>
          </div>
        </div>

        {relatedArticles.length > 0 && (
          <div className="mx-auto max-w-7xl border-t border-border px-4 py-14 sm:px-6 lg:px-8">
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
      </main>
      <Footer />
    </div>
  );
}
