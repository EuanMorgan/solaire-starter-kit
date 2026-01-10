import { PublicHeader } from "@/components/public-header";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <PublicHeader />
      <main className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center p-4">
        {children}
      </main>
    </div>
  );
}
