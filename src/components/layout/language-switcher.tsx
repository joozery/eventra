"use client";

import { Check, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocale } from "@/components/providers/locale-provider";
import { locales, localeLabels } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex h-10 items-center gap-1.5 rounded-full px-2.5 text-sm font-medium text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground data-popup-open:bg-muted data-popup-open:text-foreground"
        aria-label="เปลี่ยนภาษา"
      >
        <Globe className="size-[18px]" />
        <span className="hidden lg:inline">{localeLabels[locale].label}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={10} className="min-w-40 p-1.5">
        {locales.map((code) => (
          <DropdownMenuItem
            key={code}
            onClick={() => setLocale(code)}
            className={cn(
              "gap-2 rounded-lg px-2.5 py-2 text-sm",
              code === locale ? "text-foreground" : "text-muted-foreground"
            )}
          >
            <span aria-hidden className="text-base leading-none">
              {localeLabels[code].flag}
            </span>
            <span className="flex-1 font-medium">{localeLabels[code].label}</span>
            {code === locale && <Check className="size-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
