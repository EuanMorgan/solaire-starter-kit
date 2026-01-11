import { headers } from "next/headers";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { PublicHeader } from "@/components/public-header";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { auth } from "@/lib/auth";

const features = [
  {
    name: "Next.js 16",
    description: "App Router, React Server Components, Turbopack",
  },
  {
    name: "tRPC v11",
    description: "End-to-end typesafe APIs with React Query",
  },
  {
    name: "better-auth",
    description: "Modern authentication with email, OAuth, magic links",
  },
  {
    name: "Drizzle ORM",
    description: "TypeScript-first ORM with PostgreSQL",
  },
  {
    name: "Tailwind v4",
    description: "CSS-first configuration, lightning fast",
  },
  {
    name: "TypeScript",
    description: "Full type safety across the entire stack",
  },
];

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      <main>
        <section className="container py-24 text-center">
          <div className="mx-auto flex justify-center">
            <Logo size={96} className="h-24 w-24" />
          </div>
          <h1 className="mt-8 text-4xl font-bold tracking-tight sm:text-5xl">
            {siteConfig.name}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-xl text-muted-foreground">
            {siteConfig.description}
          </p>
          <div className="mt-8 flex justify-center gap-4">
            {session ? (
              <Button asChild size="lg">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg">
                  <Link href="/signup">Get Started</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/login">Sign In</Link>
                </Button>
              </>
            )}
          </div>
        </section>

        <section className="container py-16">
          <h2 className="mb-8 text-center text-2xl font-semibold">
            Everything you need to build modern apps
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="rounded-lg border bg-card p-6 shadow-sm"
              >
                <h3 className="font-semibold">{feature.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container text-center text-sm text-muted-foreground">
          Built with {siteConfig.name}
        </div>
      </footer>
    </div>
  );
}
