import Link from "next/link";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import type { Session } from "@/lib/auth";

interface SiteHeaderProps {
  session?: Session | null;
}

export function SiteHeader({ session }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-4 flex h-14 items-center justify-between mx-auto">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Logo size={32} />
          <span className="text-lg">{siteConfig.name}</span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {session ? (
            <Link href="/dashboard">
              <Button>Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
