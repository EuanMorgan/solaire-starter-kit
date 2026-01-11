import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { QueryErrorBoundary } from "@/components/query-error-boundary";
import { auth } from "@/lib/auth";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { DashboardContent } from "./_components/dashboard-content";
import { DashboardSkeleton } from "./_components/dashboard-skeleton";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  prefetch(trpc.user.me.queryOptions());

  return (
    <HydrateClient>
      <QueryErrorBoundary>
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardContent />
        </Suspense>
      </QueryErrorBoundary>
    </HydrateClient>
  );
}
