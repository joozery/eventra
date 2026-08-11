import Image from "next/image";
import Link from "next/link";
import { partners } from "@/lib/mock-data";

export function Partners() {
  return (
    <section className="bg-muted/40 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            พันธมิตรของเรา
          </h2>
          <p className="mt-1 text-muted-foreground">
            ดูอีเวนต์ที่น่าสนใจจากพันธมิตรของเรา
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {partners.map((partner) => (
            <Link
              key={partner.id}
              href={`/organizers/${partner.id}`}
              className="group flex h-28 items-center justify-center rounded-lg border border-border bg-card p-5 transition-shadow hover:shadow-lg hover:shadow-indigo-950/5"
            >
              <div className="relative h-full w-full">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  fill
                  className="object-contain"
                  sizes="(min-width: 640px) 20vw, 40vw"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
