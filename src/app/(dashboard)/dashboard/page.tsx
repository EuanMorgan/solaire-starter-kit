import { redirect } from "next/navigation";
import { Suspense } from "react";
import { QueryErrorBoundary } from "@/components/query-error-boundary";
import { Skeleton } from "@/components/ui/skeleton";
import { getSession } from "@/lib/auth";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { DashboardContent } from "./_components/dashboard-content";

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  // Prefetch stats query - data will be available immediately in client
  prefetch(trpc.user.stats.queryOptions());

  return (
    <HydrateClient>
      <QueryErrorBoundary>
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardContent user={session.user} />
        </Suspense>
      </QueryErrorBoundary>
    </HydrateClient>
  );
}
