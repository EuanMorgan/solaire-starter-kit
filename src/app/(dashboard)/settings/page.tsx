import { redirect } from "next/navigation";
import { Suspense } from "react";
import { QueryErrorBoundary } from "@/components/query-error-boundary";
import { getSession } from "@/lib/auth";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { SettingsContent } from "./_components/settings-content";
import { SettingsSkeleton } from "./_components/settings-skeleton";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  prefetch(trpc.user.me.queryOptions());

  return (
    <HydrateClient>
      <QueryErrorBoundary>
        <Suspense fallback={<SettingsSkeleton />}>
          <SettingsContent />
        </Suspense>
      </QueryErrorBoundary>
    </HydrateClient>
  );
}
