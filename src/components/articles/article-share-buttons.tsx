"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";
import { SocialIcon } from "@/components/ui/social-icon";
import { cn } from "@/lib/utils";

interface ArticleShareButtonsProps {
  title: string;
  slug: string;
}

export function ArticleShareButtons({ title, slug }: ArticleShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const pageUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/articles/${slug}`
      : `https://eventra.app/articles/${slug}`;

  function shareOn(platform: "facebook" | "x" | "line") {
    const encoded = encodeURIComponent(pageUrl);
    const encodedTitle = encodeURIComponent(title);
    const urls: Record<typeof platform, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
      x: `https://x.com/intent/tweet?url=${encoded}&text=${encodedTitle}`,
      line: `https://social-plugins.line.me/lineit/share?url=${encoded}`,
    };
    window.open(urls[platform], "_blank", "noopener,noreferrer,width=600,height=500");
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard denied */
    }
  }

  const socialButtons = [
    {
      key: "facebook" as const,
      label: "Facebook",
      action: () => shareOn("facebook"),
    },
    {
      key: "x" as const,
      label: "X / Twitter",
      action: () => shareOn("x"),
    },
    {
      key: "line" as const,
      label: "LINE",
      action: () => shareOn("line"),
    },
  ];

  return (
    <div className="flex flex-col gap-1">
      {socialButtons.map(({ key, label, action }) => (
        <button
          key={key}
          type="button"
          onClick={action}
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          <SocialIcon platform={key} size={18} />
          {label}
        </button>
      ))}
      <button
        type="button"
        onClick={copyLink}
        className={cn(
          "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          copied
            ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"
            : "text-foreground hover:bg-muted"
        )}
      >
        {copied ? (
          <Check className="size-[18px] shrink-0 text-green-600 dark:text-green-400" />
        ) : (
          <Link2 className="size-[18px] shrink-0 text-muted-foreground" />
        )}
        {copied ? "คัดลอกแล้ว!" : "คัดลอกลิงก์"}
      </button>
    </div>
  );
}
