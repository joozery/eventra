"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export function EventGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {images.map((src, index) => (
          <button
            key={src + index}
            type="button"
            onClick={() => setOpenIndex(index)}
            className="group relative aspect-square overflow-hidden rounded-lg"
          >
            <Image
              src={src}
              alt={`${title} รูปที่ ${index + 1}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(min-width: 1024px) 20vw, 33vw"
            />
          </button>
        ))}
      </div>

      <Dialog
        open={openIndex !== null}
        onOpenChange={(open: boolean) => {
          if (!open) setOpenIndex(null);
        }}
      >
        <DialogContent className="max-w-3xl border-none bg-transparent p-0 shadow-none ring-0 sm:max-w-3xl">
          <DialogTitle className="sr-only">{title}</DialogTitle>
          {openIndex !== null && (
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
              <Image
                src={images[openIndex]}
                alt={`${title} รูปที่ ${openIndex + 1}`}
                fill
                className="object-contain"
              />
            </div>
          )}

          {images.length > 1 && openIndex !== null && (
            <>
              <button
                type="button"
                onClick={() =>
                  setOpenIndex((i) =>
                    i === null ? null : (i - 1 + images.length) % images.length
                  )
                }
                aria-label="รูปก่อนหน้า"
                className="absolute top-1/2 left-2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setOpenIndex((i) => (i === null ? null : (i + 1) % images.length))
                }
                aria-label="รูปถัดไป"
                className="absolute top-1/2 right-2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
              >
                <ChevronRight className="size-5" />
              </button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
