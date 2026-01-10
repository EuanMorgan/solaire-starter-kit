import { PublicHeader } from "@/components/public-header";

export default function MagicLinkPage() {
  return (
    <div className="min-h-screen">
      <PublicHeader />
      <main className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Magic Link</h1>
          <p className="text-muted-foreground">Magic link page placeholder</p>
        </div>
      </main>
    </div>
  );
}
