import Image from "next/image";
import { Calendar, Megaphone } from "lucide-react";
import type { MockAnnouncement } from "@/lib/mock-data";

export function AnnouncementCard({
  announcement,
}: {
  announcement: MockAnnouncement;
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-card">
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-amber-500 to-orange-500 p-4">
        {announcement.image ? (
          <Image
            src={announcement.image}
            alt={announcement.organizer}
            fill
            className="object-cover"
          />
        ) : (
          <>
            <Megaphone className="pointer-events-none absolute -right-6 -bottom-6 size-28 text-white/10" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.12)_1px,transparent_0)] bg-[length:16px_16px]" />
          </>
        )}
        {announcement.tag && (
          <span className="relative rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-orange-700 backdrop-blur-sm">
            {announcement.tag}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-semibold text-primary">
          {announcement.organizer}
        </p>
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {announcement.message}
        </p>
        <div className="mt-auto flex items-center gap-1.5 border-t border-border pt-3 text-xs text-muted-foreground">
          <Calendar className="size-3.5" />
          {announcement.date}
        </div>
      </div>
    </div>
  );
}
