import {
  FacebookIcon,
  GoogleIcon,
  LineIcon,
  LinkedInIcon,
  MicrosoftIcon,
} from "@/components/icons/brand-icons";

const providers = [
  { id: "google", name: "Google", Icon: GoogleIcon },
  { id: "facebook", name: "Facebook", Icon: FacebookIcon },
  { id: "line", name: "LINE", Icon: LineIcon },
  { id: "microsoft", name: "Microsoft", Icon: MicrosoftIcon },
  { id: "linkedin", name: "LinkedIn", Icon: LinkedInIcon },
] as const;

export function SocialLoginButtons({
  label = "เข้าสู่ระบบด้วย",
}: {
  label?: string;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      {providers.map(({ id, name, Icon }) => (
        <button
          key={id}
          type="button"
          className="inline-flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          <Icon className="size-5 shrink-0" />
          {label} {name}
        </button>
      ))}
    </div>
  );
}
