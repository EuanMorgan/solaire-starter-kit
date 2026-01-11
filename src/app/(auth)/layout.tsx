import Link from "next/link";
import { Logo } from "@/components/logo";
import { PublicFooter } from "@/components/public-footer";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <main className="flex flex-1 flex-col items-center justify-center p-4">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <Logo size={40} />
        </Link>
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
