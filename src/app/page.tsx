import {
  ArrowRight,
  BarChart3,
  Database,
  FileCode2,
  FlaskConical,
  Lock,
  Mail,
  Paintbrush,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { PublicFooter } from "@/components/public-footer";
import { PublicHeader } from "@/components/public-header";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { getSession } from "@/lib/auth";

const features = [
  {
    name: "Next.js 16",
    description: "App Router, React 19, React Compiler, Turbopack",
    icon: Zap,
  },
  {
    name: "tRPC v11",
    description: "End-to-end typesafe APIs with React Query",
    icon: Sparkles,
  },
  {
    name: "better-auth",
    description: "Email, OAuth, magic links, verification flows",
    icon: Lock,
  },
  {
    name: "Drizzle ORM",
    description: "TypeScript-first ORM with PostgreSQL",
    icon: Database,
  },
  {
    name: "Tailwind v4",
    description: "CSS-first config with shadcn/ui components",
    icon: Paintbrush,
  },
  {
    name: "PostHog",
    description: "Product analytics with ad-blocker bypass proxy",
    icon: BarChart3,
  },
  {
    name: "Resend",
    description: "Transactional emails with React Email templates",
    icon: Mail,
  },
  {
    name: "Testing",
    description: "Vitest, Playwright E2E, Storybook, MSW mocks",
    icon: FlaskConical,
  },
  {
    name: "TypeScript",
    description: "Full type safety across the entire stack",
    icon: FileCode2,
  },
];

export default async function HomePage() {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      <main className="flex flex-col items-center overflow-hidden">
        {/* Hero Section */}
        <section className="relative container py-24 md:py-32 text-center">
          {/* Gradient glow behind logo */}
          <div className="absolute inset-0 flex items-start justify-center pointer-events-none">
            <div className="w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2" />
          </div>

          <div className="relative">
            <div className="mx-auto flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full scale-150" />
                <Logo size={96} className="relative h-24 w-24" />
              </div>
            </div>

            <h1 className="mt-8 text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
              {siteConfig.name}
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-muted-foreground">
              {siteConfig.description}
            </p>

            <div className="mt-10 flex justify-center gap-4">
              {session ? (
                <Button asChild size="lg" className="group">
                  <Link href="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg" className="group">
                    <Link href="/signup">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/login">Sign In</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container py-16 md:py-24">
          <h2 className="mb-4 text-center text-3xl font-bold tracking-tight">
            Everything you need
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
            Built with the latest technologies to give you a head start on your
            next project
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="group relative rounded-xl border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg">{feature.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
