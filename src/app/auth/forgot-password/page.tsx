import { PublicHeader } from "@/components/public-header";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen">
      <PublicHeader />
      <main className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Forgot Password</h1>
          <p className="text-muted-foreground">
            Forgot password page placeholder
          </p>
        </div>
      </main>
    </div>
  );
}
