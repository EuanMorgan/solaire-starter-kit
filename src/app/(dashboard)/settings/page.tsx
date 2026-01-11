import { headers } from "next/headers";
import { Suspense } from "react";
import { QueryErrorBoundary } from "@/components/query-error-boundary";
import { auth } from "@/lib/auth";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { SettingsContent } from "./_components/settings-content";
import { SettingsSkeleton } from "./_components/settings-skeleton";

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) {
    prefetch(trpc.user.me.queryOptions());
  }

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
